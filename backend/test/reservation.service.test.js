import test from "node:test";
import assert from "node:assert/strict";
import { createReservationService } from "../src/services/reservation.service.js";

const member = { id: "user-1", role: "utilisateur" };
const project = { id: "project-1", statut: "actif", responsableId: "user-1", participations: [{ utilisateurId: "user-1" }] };
function setup(overrides = {}) {
  const repository = {
    async findReservableMaterial() { return { id: "material-1", modeSuivi: "individualise" }; },
    async hasConflict() { return null; },
    async createReservation(projectId, data, authorId) { return { projectId, ...data, authorId }; },
    async findReservation() { return { id: "booking-1", statut: "active", materiel: { id: "material-1" }, debut: new Date("2026-10-01T08:00:00Z"), fin: new Date("2026-10-01T09:00:00Z") }; },
    async updateReservation(id, data) { return { id, ...data }; }, async cancelReservation(id) { return { id, statut: "annulee" }; },
    ...overrides,
  };
  return createReservationService(repository, { async findProjetForCommand() { return project; } });
}

test("une réservation adjacente est acceptée", async () => {
  const service = setup();
  const result = await service.create(member, project.id, { materielId: "material-1", debut: new Date("2026-10-01T09:00:00Z"), fin: new Date("2026-10-01T10:00:00Z") });
  assert.equal(result.authorId, member.id);
});

test("un chevauchement est refusé", async () => {
  const service = setup({ async hasConflict() { return { id: "other" }; } });
  await assert.rejects(() => service.create(member, project.id, { materielId: "material-1", debut: new Date("2026-10-01T08:30:00Z"), fin: new Date("2026-10-01T09:30:00Z") }), { code: "CRENEAU_INDISPONIBLE" });
});

test("les minutes autres que 00 ou 30 sont refusées", async () => {
  const service = setup();
  await assert.rejects(() => service.create(member, project.id, { materielId: "material-1", debut: new Date("2026-10-01T08:15:00Z"), fin: new Date("2026-10-01T09:00:00Z") }), { code: "CRENEAU_DEMI_HEURE_REQUIS" });
});

test("un matériel non individualisé ne peut pas être réservé", async () => {
  const service = setup({ async findReservableMaterial() { return { id: "material-1", modeSuivi: "non_individualise" }; } });
  await assert.rejects(() => service.create(member, project.id, { materielId: "material-1", debut: new Date("2026-10-01T08:00:00Z"), fin: new Date("2026-10-01T09:00:00Z") }), { code: "MATERIEL_NON_RESERVABLE" });
});

test("le gestionnaire voit le projet masqué dans l'historique matériel", async () => {
  const service = setup({ async listMaterialReservations() { return [{ id: "booking-1", projet: { id: "project-1", nom: "Secret", visibilite: "prive" } }]; } });
  const result = await service.listForMaterial({ id: "manager", role: "gestionnaire" }, "material-1");
  assert.equal(result[0].projet.nom, "Réservé");
  assert.equal(result[0].projet.id, null);
});
