import { prisma } from "../config/prisma.js";

const categorySelect = { id: true, nom: true };
const summarySelect = {
  id: true,
  nom: true,
  modeSuivi: true,
  numeroSerie: true,
  referenceConstructeur: true,
  numeroInventaire: true,
  creeLe: true,
  modifieLe: true,
  categories: { select: { categorie: { select: categorySelect } } },
};

export function findActiveMateriels({ recherche, categorieId, modeSuivi, tri = "nom_asc" } = {}) {
  const where = {
    statut: "actif",
    ...(recherche ? {
      OR: ["nom", "numeroSerie", "referenceConstructeur", "numeroInventaire"].map((field) => ({
        [field]: { contains: recherche, mode: "insensitive" },
      })),
    } : {}),
    ...(categorieId ? { categories: { some: { categorieId } } } : {}),
    ...(modeSuivi ? { modeSuivi } : {}),
  };
  const orderBy = {
    nom_desc: [{ nom: "desc" }],
    recent: [{ modifieLe: "desc" }],
    ancien: [{ modifieLe: "asc" }],
  }[tri] || [{ nom: "asc" }];
  return prisma.materiel.findMany({ where, orderBy, select: summarySelect });
}

export function findActiveMaterielById(id) {
  return prisma.materiel.findFirst({
    where: { id, statut: "actif" },
    select: {
      ...summarySelect,
      auteurCreation: { select: { id: true, identifiant: true } },
      piecesJointes: {
        orderBy: { ajouteLe: "desc" },
        select: {
          id: true, nomFichier: true, typeMime: true, taille: true, ajouteLe: true,
          auteur: { select: { id: true, identifiant: true } },
        },
      },
    },
  });
}

export function createMateriel(data, auteurId) {
  const { categorieIds = [], ...fields } = data;
  return prisma.$transaction(async (transaction) => {
    const materiel = await transaction.materiel.create({
      data: {
        ...fields,
        auteurCreationId: auteurId,
        categories: { create: categorieIds.map((categorieId) => ({ categorieId })) },
      },
      select: { id: true },
    });
    await transaction.historiqueMateriel.create({
      data: { materielId: materiel.id, auteurId, type: "creation", details: { nom: fields.nom } },
    });
    return materiel;
  });
}

export function updateMateriel(id, data, auteurId) {
  const { categorieIds = [], ...fields } = data;
  return prisma.$transaction(async (transaction) => {
    await transaction.materielCategorie.deleteMany({ where: { materielId: id } });
    await transaction.materiel.update({
      where: { id },
      data: {
        ...fields,
        categories: { create: categorieIds.map((categorieId) => ({ categorieId })) },
      },
    });
    return transaction.historiqueMateriel.create({
      data: { materielId: id, auteurId, type: "modification", details: { champs: Object.keys(fields), categories: true } },
    });
  });
}

export function findMaterielHistory(id) {
  return prisma.historiqueMateriel.findMany({
    where: { materielId: id },
    orderBy: { creeLe: "desc" },
    select: {
      id: true, type: true, details: true, creeLe: true,
      auteur: { select: { id: true, identifiant: true } },
    },
  });
}

export function listCategories() {
  return prisma.categorie.findMany({ orderBy: { nom: "asc" }, select: categorySelect });
}
export function createCategorie(nom) {
  return prisma.categorie.create({ data: { nom }, select: categorySelect });
}
export function updateCategorie(id, nom) {
  return prisma.categorie.update({ where: { id }, data: { nom }, select: categorySelect });
}
export function deleteCategorie(id) {
  return prisma.categorie.delete({ where: { id } });
}
export function findCategoriesByIds(ids) {
  return prisma.categorie.count({ where: { id: { in: ids } } });
}

export function createAttachment(materielId, file, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const piece = await transaction.pieceJointeMateriel.create({
      data: { materielId, auteurId, nomFichier: file.nomFichier, typeMime: file.typeMime, taille: file.contenu.length, contenu: file.contenu },
      select: { id: true, nomFichier: true, typeMime: true, taille: true, ajouteLe: true },
    });
    await transaction.historiqueMateriel.create({
      data: { materielId, auteurId, type: "ajout_piece_jointe", details: { nomFichier: file.nomFichier } },
    });
    return piece;
  });
}
export function findAttachment(id, materielId) {
  return prisma.pieceJointeMateriel.findFirst({ where: { id, materielId }, select: { id: true, nomFichier: true, typeMime: true, taille: true, contenu: true } });
}
export function deleteAttachment(id, materielId, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const piece = await transaction.pieceJointeMateriel.delete({ where: { id } });
    await transaction.historiqueMateriel.create({
      data: { materielId, auteurId, type: "retrait_piece_jointe", details: { nomFichier: piece.nomFichier } },
    });
  });
}

export const materielRepository = {
  findActiveMateriels, findActiveMaterielById, createMateriel, updateMateriel, findMaterielHistory,
  listCategories, createCategorie, updateCategorie, deleteCategorie, findCategoriesByIds,
  createAttachment, findAttachment, deleteAttachment,
};
