import test from "node:test";
import assert from "node:assert/strict";
import { createMaterielService } from "../src/services/materiel.service.js";

const admin = { id: "admin-1", role: "administrateur" };
const manager = { id: "manager-1", role: "gestionnaire" };
const user = { id: "user-1", role: "utilisateur" };
function rawMaterial(overrides = {}) {
  return {
    id: "material-1", nom: "Oscilloscope", modeSuivi: "individualise", numeroSerie: null,
    referenceConstructeur: null, numeroInventaire: null, creeLe: new Date(), modifieLe: new Date(),
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
    async createAttachment(id, file, authorId) { return { id, file, authorId }; },
    async findAttachment() { return { id: "piece", nomFichier: "facture.pdf", contenu: Buffer.from("%PDF-1.7"), typeMime: "application/pdf" }; },
    async deleteAttachment() {}, ...overrides,
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

test("les pièces jointes vérifient le type et la signature", async () => {
  const service = createMaterielService(repository());
  await assert.rejects(() => service.addAttachment(admin, "material-1", { nomFichier: "faux.pdf", typeMime: "application/pdf", contenu: Buffer.from("texte") }), { code: "CONTENU_FICHIER_INVALIDE" });
  const result = await service.addAttachment(admin, "material-1", { nomFichier: "facture.pdf", typeMime: "application/pdf", contenu: Buffer.from("%PDF-1.7") });
  assert.equal(result.file.nomFichier, "facture.pdf");
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
