import { prisma } from "../config/prisma.js";

const summarySelect = {
  id: true,
  nom: true,
  description: true,
  visibilite: true,
  statut: true,
  dateDebut: true,
  dateFin: true,
  responsable: { select: { id: true, identifiant: true } },
  participations: { select: { utilisateurId: true } },
  _count: { select: { participations: true } },
};

const detailSelect = {
  ...summarySelect,
  creeLe: true,
  modifieLe: true,
  participations: {
    orderBy: { rejointLe: "asc" },
    select: {
      rejointLe: true,
      utilisateur: { select: { id: true, identifiant: true } },
    },
  },
  taches: {
    orderBy: [{ etat: "asc" }, { ordre: "asc" }, { creeLe: "asc" }],
    select: {
      id: true,
      titre: true,
      description: true,
      etat: true,
      ordre: true,
      responsable: { select: { id: true, identifiant: true } },
    },
  },
  documentation: {
    select: {
      contenu: true,
      modifieLe: true,
      auteur: { select: { id: true, identifiant: true } },
    },
  },
  historique: {
    orderBy: { creeLe: "desc" },
    select: { id: true, type: true, details: true, creeLe: true, auteur: { select: { id: true, identifiant: true } } },
  },
  reservations: {
    orderBy: { debut: "desc" },
    select: {
      id: true, debut: true, fin: true, statut: true, creeLe: true,
      materiel: { select: { id: true, nom: true } },
      reservePar: { select: { id: true, identifiant: true } },
    },
  },
};

export function findVisibleProjets(accessFilter, statut) {
  return prisma.projet.findMany({
    where: { ...(statut ? { statut } : {}), ...accessFilter },
    orderBy: [{ modifieLe: "desc" }, { nom: "asc" }],
    select: summarySelect,
  });
}

export function findVisibleProjetById(id, accessFilter) {
  return prisma.projet.findFirst({
    where: { id, ...accessFilter },
    select: detailSelect,
  });
}

export function findProjetForCommand(id) {
  return prisma.projet.findUnique({
    where: { id },
    select: {
      id: true,
      statut: true,
      responsableId: true,
      participations: { select: { utilisateurId: true } },
    },
  });
}

export function createProjet(data, utilisateurId) {
  return prisma.$transaction(async (transaction) => {
    const projet = await transaction.projet.create({
      data: { ...data, responsableId: utilisateurId, participations: { create: { utilisateurId } }, documentation: { create: { auteurId: utilisateurId, contenu: "" } } }, select: { id: true },
    });
    await transaction.historiqueProjet.create({ data: { projetId: projet.id, auteurId: utilisateurId, type: "creation", details: { nom: data.nom, visibilite: data.visibilite } } });
    return projet;
  });
}

export function updateProjet(id, data, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const before = await transaction.projet.findUnique({ where: { id }, select: { nom: true, description: true, visibilite: true, dateDebut: true, dateFin: true } });
    const result = await transaction.projet.update({ where: { id }, data, select: { id: true } });
    await transaction.historiqueProjet.create({ data: { projetId: id, auteurId, type: "modification", details: { avant: before, apres: data } } });
    return result;
  });
}

export function addProjetMember(projetId, utilisateurId, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const result = await transaction.participation.upsert({ where: { projetId_utilisateurId: { projetId, utilisateurId } }, update: {}, create: { projetId, utilisateurId }, select: { utilisateur: { select: { id: true, identifiant: true, role: true } } } });
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "ajout_membre", details: { utilisateurId, identifiant: result.utilisateur.identifiant } } });
    return result;
  });
}

export function removeProjetMember(projetId, utilisateurId, auteurId) {
  return prisma.$transaction(async (transaction) => {
    await transaction.tache.updateMany({
      where: { projetId, responsableId: utilisateurId },
      data: { responsableId: null },
    });
    const result = await transaction.participation.delete({
      where: { projetId_utilisateurId: { projetId, utilisateurId } },
    });
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "retrait_membre", details: { utilisateurId } } });
    return result;
  });
}

export function createTache(projetId, data, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const tache = await transaction.tache.create({ data: { ...data, projetId }, select: { id: true } });
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "creation_tache", details: { tacheId: tache.id, titre: data.titre } } });
    return tache;
  });
}

export function findTache(id, projetId) {
  return prisma.tache.findFirst({ where: { id, projetId }, select: { id: true } });
}

async function releaseProjectReservations(transaction, projetId, auteurId, motif) {
  const reservations = await transaction.reservation.findMany({ where: { projetId, statut: "active", fin: { gt: new Date() } }, select: { id: true } });
  if (!reservations.length) return;
  const ids = reservations.map(({ id }) => id);
  await transaction.reservation.updateMany({ where: { id: { in: ids } }, data: { statut: "liberee", annuleLe: new Date(), annuleParId: auteurId, motifAnnulation: motif } });
  await transaction.historiqueReservation.createMany({ data: ids.map((reservationId) => ({ reservationId, auteurId, type: "liberation", details: { motif } })) });
}

export function updateTacheAndCloseIfComplete(id, projetId, data, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const before = await transaction.tache.findUnique({ where: { id }, select: { titre: true, description: true, etat: true, ordre: true, responsableId: true } });
    await transaction.tache.update({ where: { id }, data });
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "modification_tache", details: { tacheId: id, avant: before, apres: data } } });
    if (data.etat === "terminee") {
      const [total, nonTerminees] = await Promise.all([
        transaction.tache.count({ where: { projetId } }),
        transaction.tache.count({ where: { projetId, etat: { not: "terminee" } } }),
      ]);
      if (total > 0 && nonTerminees === 0) {
        await transaction.projet.update({ where: { id: projetId }, data: { statut: "archive" } });
        await releaseProjectReservations(transaction, projetId, auteurId, "archivage_automatique_projet");
        await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "archivage", details: { mode: "automatique" } } });
      }
    }
  });
}

export function deleteTache(id, projetId, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const tache = await transaction.tache.delete({ where: { id } });
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "suppression_tache", details: { tacheId: id, titre: tache.titre } } });
    return tache;
  });
}

export function saveDocumentation(projetId, contenu, auteurId) {
  return prisma.documentationProjet.upsert({
    where: { projetId },
    update: { contenu, auteurId },
    create: { projetId, contenu, auteurId },
    select: { contenu: true, modifieLe: true, auteur: { select: { id: true, identifiant: true } } },
  });
}

export function archiveProjet(projetId, auteurId) {
  return prisma.$transaction(async (transaction) => {
    await transaction.projet.update({ where: { id: projetId }, data: { statut: "archive" } });
    await releaseProjectReservations(transaction, projetId, auteurId, "archivage_manuel_projet");
    await transaction.historiqueProjet.create({ data: { projetId, auteurId, type: "archivage", details: { mode: "manuel" } } });
  });
}

export const projetRepository = {
  findVisibleProjets,
  findVisibleProjetById,
  findProjetForCommand,
  createProjet,
  updateProjet,
  addProjetMember,
  removeProjetMember,
  createTache,
  findTache,
  updateTacheAndCloseIfComplete,
  deleteTache,
  saveDocumentation,
  archiveProjet,
};
