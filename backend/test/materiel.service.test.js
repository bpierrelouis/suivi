import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createMaterielService } from "../src/services/materiel.service.js";

const admin = { id: "admin-1", role: "administrateur" };
const manager = { id: "manager-1", role: "gestionnaire" };
const user = { id: "user-1", role: "utilisateur" };
function rawMaterial(overrides = {}) {
  return {
    id: "material-1", nom: "Oscilloscope", modeSuivi: "individualise", numeroSerie: null,
    referenceConstructeur: null, numeroInventaire: null, quantite: null, seuilAlerte: null,
    creeLe: new Date(), modifieLe: new Date(),
    auteurCreation: { id: "admin-1", identifiant: "admin" },
    categories: [{ categorie: { id: "cat-1", nom: "Mesure" } }], piecesJointes: [], ...overrides,
  };
}
function repository(overrides = {}) {
  return {
    async findActiveMateriels() { return [rawMaterial()]; },
    async findActiveMaterielById() { return rawMaterial(); },
    async findCategoriesByIds(ids) { return ids.length; },
    async createMateriel(data, authorId) { return { id: "created", data, authorId }; },
    async updateMateriel() {}, async findMaterielHistory() { return []; }, async listCategories() { return []; },
    async createCategorie(nom) { return { id: "cat", nom }; }, async updateCategorie() {}, async deleteCategorie() {},
    async createAttachmentUpload(id, file, authorId) { return { id: "piece", materielId: id, auteurId: authorId, ...file }; },
    async findPendingAttachment() { return null; }, async confirmAttachment() {}, async discardAttachment() {},
    async findAttachment() { return { id: "piece", nomFichier: "facture.pdf", cleObjet: "materiels/material-1/piece", typeMime: "application/pdf", taille: 8, empreinte: "a".repeat(64) }; },
    async deleteAttachment() {},
    async findDemandesEnAttente() { return []; }, async findDemandeEnAttente() { return null; },
    async createDemandeReapprovisionnement(materielId, demandeParId) { return { id: "demande-1", materielId, demandeParId, statut: "nouvelle" }; },
    async traiterDemandesReapprovisionnement() { return { count: 1 }; },
    ...overrides,
  };
}

test("tous les profils consultent l'inventaire actif", async () => {
  const service = createMaterielService(repository());
  const result = await service.list(user, {});
  assert.equal(result[0].nom, "Oscilloscope");
  assert.deepEqual(result[0].categories, [{ id: "cat-1", nom: "Mesure" }]);
});

test("un utilisateur ne reçoit pas les pièces jointes", async () => {
  const service = createMaterielService(repository());
  const result = await service.get(user, "material-1");
  assert.equal(result.droits.voirPiecesJointes, false);
  assert.equal(result.piecesJointes, undefined);
});

test("admin et gestionnaire créent du matériel avec catégories valides", async () => {
  const service = createMaterielService(repository());
  const result = await service.create(manager, { nom: "Caméra", modeSuivi: "individualise", categorieIds: ["cat-1", "cat-1"] });
  assert.deepEqual(result.data.categorieIds, ["cat-1"]);
  assert.equal(result.authorId, manager.id);
});

test("un utilisateur ne peut pas créer de matériel", async () => {
  const service = createMaterielService(repository());
  await assert.rejects(() => service.create(user, { nom: "Caméra", categorieIds: [] }), { code: "ACCES_INTERDIT" });
});

test("les pièces jointes sont autorisées puis validées depuis le stockage objet", async () => {
  const contenu = Buffer.from("%PDF-1.7");
  const empreinte = createHash("sha256").update(contenu).digest("hex");
  const pending = { id: "piece", nomFichier: "facture.pdf", typeMime: "application/pdf", taille: contenu.length, empreinte, cleObjet: "materiels/material-1/piece" };
  const repo = repository({
    async createAttachmentUpload() { return pending; },
    async findPendingAttachment() { return pending; },
    async confirmAttachment() { return { id: "piece", nomFichier: "facture.pdf" }; },
  });
  const storage = {
    async createUploadUrl() { return "http://stockage/url-signee"; },
    async inspect() { return { ContentLength: contenu.length, ContentType: "application/pdf", Metadata: { sha256: empreinte } }; },
    async read() { return contenu; },
    async delete() {},
  };
  const service = createMaterielService(repo, storage);
  const authorization = await service.authorizeAttachment(admin, "material-1", { nomFichier: "facture.pdf", typeMime: "application/pdf", taille: contenu.length, empreinte });
  const confirmed = await service.confirmAttachment(admin, "material-1", authorization.pieceJointe.id);
  assert.match(authorization.uploadUrl, /url-signee/);
  assert.equal(confirmed.nomFichier, "facture.pdf");
});

test("l'historique est refusé à l'utilisateur", async () => {
  const service = createMaterielService(repository());
  await assert.rejects(() => service.history(user, "material-1"), { code: "ACCES_INTERDIT" });
});

test("le calendrier masque les projets auxquels le profil n'a pas accès", async () => {
  const reservation = {
    id: "reservation-1",
    debut: new Date("2026-09-24T08:00:00Z"),
    fin: new Date("2026-09-24T10:00:00Z"),
    projet: {
      id: "project-1",
      nom: "Projet confidentiel",
      visibilite: "prive",
      participations: [{ utilisateurId: "user-1" }],
    },
  };
  const service = createMaterielService(repository({
    async findCalendarMateriels() { return [{ id: "material-1", nom: "Oscilloscope", reservations: [reservation] }]; },
  }));

  const managerCalendar = await service.calendar(manager, reservation.debut, reservation.fin);
  const memberCalendar = await service.calendar(user, reservation.debut, reservation.fin);

  assert.deepEqual(managerCalendar[0].reservations[0].projet, { id: null, nom: "Réservé" });
  assert.deepEqual(memberCalendar[0].reservations[0].projet, { id: "project-1", nom: "Projet confidentiel" });
});

test("la rupture est visible à tous, l'alerte de seuil réservée à l'administrateur et au gestionnaire", async () => {
  const repo = repository({ async findActiveMateriels() { return [rawMaterial({ modeSuivi: "non_individualise", quantite: 0, seuilAlerte: 5 })]; } });
  const service = createMaterielService(repo);
  const [rupture] = await service.list(user, {});
  assert.equal(rupture.disponibilite, "rupture");

  const repoSeuil = repository({ async findActiveMateriels() { return [rawMaterial({ modeSuivi: "non_individualise", quantite: 3, seuilAlerte: 5 })]; } });
  const serviceSeuil = createMaterielService(repoSeuil);
  const [pourUtilisateur] = await serviceSeuil.list(user, {});
  const [pourGestionnaire] = await serviceSeuil.list(manager, {});
  assert.equal(pourUtilisateur.disponibilite, "disponible");
  assert.equal(pourGestionnaire.disponibilite, "a_commander");
});

test("signaler une rupture est refusé si le matériel n'est pas en rupture", async () => {
  const service = createMaterielService(repository({ async findActiveMaterielById() { return rawMaterial({ modeSuivi: "non_individualise", quantite: 3, seuilAlerte: 5 }); } }));
  await assert.rejects(() => service.signalerRupture(user, "material-1"), { code: "MATERIEL_NON_EN_RUPTURE" });
});

test("un utilisateur ne peut pas signaler deux fois la même rupture", async () => {
  const service = createMaterielService(repository({
    async findActiveMaterielById() { return rawMaterial({ modeSuivi: "non_individualise", quantite: 0, seuilAlerte: 5 }); },
    async findDemandeEnAttente() { return { id: "demande-existante" }; },
  }));
  await assert.rejects(() => service.signalerRupture(user, "material-1"), { code: "DEMANDE_DEJA_ENVOYEE" });
});

test("signaler une rupture crée bien la demande", async () => {
  const service = createMaterielService(repository({ async findActiveMaterielById() { return rawMaterial({ modeSuivi: "non_individualise", quantite: 0, seuilAlerte: 5 }); } }));
  const demande = await service.signalerRupture(user, "material-1");
  assert.equal(demande.demandeParId, user.id);
});

test("seuls l'administrateur et le gestionnaire traitent les demandes de réapprovisionnement", async () => {
  const service = createMaterielService(repository());
  await assert.rejects(() => service.traiterReapprovisionnement(user, "material-1"), { code: "ACCES_INTERDIT" });
  await assert.doesNotReject(() => service.traiterReapprovisionnement(manager, "material-1"));
});
