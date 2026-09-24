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
  statut: true,
  archiveLe: true,
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

export function findArchivedMateriels(filters = {}) {
  const { recherche, categorieId, modeSuivi, tri = "recent" } = filters;
  return prisma.materiel.findMany({
    where: { statut: "archive", ...(recherche ? { OR: ["nom", "numeroSerie", "referenceConstructeur", "numeroInventaire"].map((field) => ({ [field]: { contains: recherche, mode: "insensitive" } })) } : {}), ...(categorieId ? { categories: { some: { categorieId } } } : {}), ...(modeSuivi ? { modeSuivi } : {}) },
    orderBy: tri === "nom_asc" ? { nom: "asc" } : tri === "nom_desc" ? { nom: "desc" } : { archiveLe: "desc" }, select: summarySelect,
  });
}

export function findArchivedMaterielById(id) {
  return prisma.materiel.findFirst({
    where: { id, statut: "archive" },
    select: { ...summarySelect, auteurCreation: { select: { id: true, identifiant: true } }, archivePar: { select: { id: true, identifiant: true } }, piecesJointes: { orderBy: { ajouteLe: "desc" }, select: { id: true, nomFichier: true, typeMime: true, taille: true, ajouteLe: true, auteur: { select: { id: true, identifiant: true } } } } },
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

export function archiveMateriel(id, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const materiel = await transaction.materiel.update({ where: { id }, data: { statut: "archive", archiveLe: new Date(), archiveParId: auteurId }, select: { id: true, nom: true } });
    const reservations = await transaction.reservation.findMany({ where: { materielId: id, statut: "active", fin: { gt: new Date() } }, select: { id: true, projetId: true, projet: { select: { nom: true, participations: { select: { utilisateurId: true } } } } } });
    if (reservations.length) {
      const reservationIds = reservations.map((item) => item.id);
      await transaction.reservation.updateMany({ where: { id: { in: reservationIds } }, data: { statut: "liberee", annuleLe: new Date(), annuleParId: auteurId, motifAnnulation: "archivage_materiel" } });
      await transaction.historiqueReservation.createMany({ data: reservationIds.map((reservationId) => ({ reservationId, auteurId, type: "liberation", details: { motif: "archivage_materiel" } })) });
      const recipients = new Map();
      for (const reservation of reservations) for (const participation of reservation.projet.participations) {
        const key = `${participation.utilisateurId}:${reservation.projetId}`;
        recipients.set(key, { destinataireId: participation.utilisateurId, type: "materiel_archive", titre: "Matériel archivé", message: `${materiel.nom} a été archivé. La réservation du projet ${reservation.projet.nom} a été libérée.`, details: { materielId: id, projetId: reservation.projetId } });
      }
      if (recipients.size) await transaction.notification.createMany({ data: [...recipients.values()] });
    }
    await transaction.historiqueMateriel.create({ data: { materielId: id, auteurId, type: "archivage", details: { reservationsLiberees: reservations.length } } });
    return { id, reservationsLiberees: reservations.length };
  });
}

export const materielRepository = {
  findActiveMateriels, findActiveMaterielById, findArchivedMateriels, findArchivedMaterielById, createMateriel, updateMateriel, findMaterielHistory,
  listCategories, createCategorie, updateCategorie, deleteCategorie, findCategoriesByIds,
  createAttachment, findAttachment, deleteAttachment,
  archiveMateriel,
};
