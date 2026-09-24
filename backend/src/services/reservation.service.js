import { conflict, forbidden, notFound } from "../errors/app.error.js";
import { assertCanModifyProjet } from "../policies/projet-access.policy.js";

function assertHalfHour(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf()) || ![0, 30].includes(date.getMinutes()) || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    throw conflict("CRENEAU_DEMI_HEURE_REQUIS");
  }
}

function validateRange(debut, fin) {
  assertHalfHour(debut); assertHalfHour(fin);
  if (fin <= debut) throw conflict("INTERVALLE_RESERVATION_INVALIDE");
}

function maskProject(reservation, user) {
  if (user.role !== "gestionnaire") return reservation;
  return { ...reservation, projet: { id: null, nom: "Réservé", visibilite: null } };
}

export function createReservationService(repository, projets) {
  async function commandProject(user, projetId) {
    const projet = await projets.findProjetForCommand(projetId);
    if (!projet) throw notFound("PROJET_INTROUVABLE");
    assertCanModifyProjet(user, projet);
    return projet;
  }
  async function validateAvailability(materielId, debut, fin, exceptId) {
    validateRange(debut, fin);
    const materiel = await repository.findReservableMaterial(materielId);
    if (!materiel) throw notFound("MATERIEL_INTROUVABLE");
    if (materiel.modeSuivi !== "individualise") throw conflict("MATERIEL_NON_RESERVABLE");
    if (await repository.hasConflict(materielId, debut, fin, exceptId)) throw conflict("CRENEAU_INDISPONIBLE");
  }
  return {
    async listForProject(user, projetId) { await commandProject(user, projetId); return repository.listProjectReservations(projetId); },
    async create(user, projetId, data) { await commandProject(user, projetId); await validateAvailability(data.materielId, data.debut, data.fin); return repository.createReservation(projetId, data, user.id); },
    async update(user, projetId, id, data) {
      await commandProject(user, projetId);
      const current = await repository.findReservation(id, projetId);
      if (!current) throw notFound("RESERVATION_INTROUVABLE");
      if (current.statut !== "active") throw conflict("RESERVATION_INACTIVE");
      await validateAvailability(current.materiel.id, data.debut, data.fin, id);
      return repository.updateReservation(id, data, user.id, current);
    },
    async cancel(user, projetId, id) {
      await commandProject(user, projetId);
      const current = await repository.findReservation(id, projetId);
      if (!current) throw notFound("RESERVATION_INTROUVABLE");
      if (current.statut !== "active") throw conflict("RESERVATION_INACTIVE");
      return repository.cancelReservation(id, user.id);
    },
    async listForMaterial(user, materielId, archived = false) {
      if (!["administrateur", "gestionnaire"].includes(user.role)) throw forbidden();
      if (archived && user.role !== "administrateur") throw forbidden("ARCHIVES_MATERIEL_RESERVEES_ADMINISTRATEUR");
      return (await repository.listMaterialReservations(materielId)).map((item) => maskProject(item, user));
    },
  };
}
