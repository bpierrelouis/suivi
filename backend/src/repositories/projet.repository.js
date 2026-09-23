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
};

export function findVisibleProjets(accessFilter) {
  return prisma.projet.findMany({
    where: { statut: "actif", ...accessFilter },
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
  return prisma.projet.create({
    data: {
      ...data,
      responsableId: utilisateurId,
      participations: { create: { utilisateurId } },
      documentation: { create: { auteurId: utilisateurId, contenu: "" } },
    },
    select: { id: true },
  });
}

export function updateProjet(id, data) {
  return prisma.projet.update({ where: { id }, data, select: { id: true } });
}

export function addProjetMember(projetId, utilisateurId) {
  return prisma.participation.upsert({
    where: { projetId_utilisateurId: { projetId, utilisateurId } },
    update: {},
    create: { projetId, utilisateurId },
    select: { utilisateur: { select: { id: true, identifiant: true, role: true } } },
  });
}

export function removeProjetMember(projetId, utilisateurId) {
  return prisma.$transaction(async (transaction) => {
    await transaction.tache.updateMany({
      where: { projetId, responsableId: utilisateurId },
      data: { responsableId: null },
    });
    return transaction.participation.delete({
      where: { projetId_utilisateurId: { projetId, utilisateurId } },
    });
  });
}

export function createTache(projetId, data) {
  return prisma.tache.create({
    data: { ...data, projetId },
    select: { id: true },
  });
}

export function findTache(id, projetId) {
  return prisma.tache.findFirst({ where: { id, projetId }, select: { id: true } });
}

export function updateTacheAndCloseIfComplete(id, projetId, data) {
  return prisma.$transaction(async (transaction) => {
    await transaction.tache.update({ where: { id }, data });
    if (data.etat === "terminee") {
      const [total, nonTerminees] = await Promise.all([
        transaction.tache.count({ where: { projetId } }),
        transaction.tache.count({ where: { projetId, etat: { not: "terminee" } } }),
      ]);
      if (total > 0 && nonTerminees === 0) {
        await transaction.projet.update({ where: { id: projetId }, data: { statut: "archive" } });
      }
    }
  });
}

export function deleteTache(id) {
  return prisma.tache.delete({ where: { id } });
}

export function saveDocumentation(projetId, contenu, auteurId) {
  return prisma.documentationProjet.upsert({
    where: { projetId },
    update: { contenu, auteurId },
    create: { projetId, contenu, auteurId },
    select: { contenu: true, modifieLe: true, auteur: { select: { id: true, identifiant: true } } },
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
};
