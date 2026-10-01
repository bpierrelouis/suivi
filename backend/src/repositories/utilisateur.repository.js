import { prisma } from "../config/prisma.js";

const listSelect = { id: true, identifiant: true, role: true, actif: true, creeLe: true, derniereConnexion: true };

export function findUtilisateurByIdentifiant(identifiant) {
  return prisma.utilisateur.findUnique({ where: { identifiant } });
}

export function findUtilisateurById(id) {
  return prisma.utilisateur.findUnique({
    where: { id },
    select: { id: true, identifiant: true, role: true, actif: true },
  });
}

export function findUtilisateurCredentials(id) {
  return prisma.utilisateur.findUnique({ where: { id }, select: { id: true, motDePasse: true } });
}

export function createUtilisateur(data) {
  return prisma.utilisateur.upsert({
    where: { identifiant: data.identifiant },
    update: {},
    create: data,
  });
}

export async function createUtilisateurManuel(data) {
  try {
    return await prisma.utilisateur.create({ data, select: listSelect });
  } catch (error) {
    if (error.code === "P2002") return { error: "IDENTIFIANT_DEJA_UTILISE" };
    throw error;
  }
}

export async function updateUtilisateur(id, data) {
  try {
    return await prisma.utilisateur.update({ where: { id }, data, select: listSelect });
  } catch (error) {
    if (error.code === "P2002") return { error: "IDENTIFIANT_DEJA_UTILISE" };
    if (error.code === "P2025") return null;
    throw error;
  }
}

export function markUtilisateurConnected(id) {
  return prisma.utilisateur.update({
    where: { id },
    data: { derniereConnexion: new Date() },
  });
}

export function listUtilisateurs() {
  return prisma.utilisateur.findMany({
    orderBy: { identifiant: "asc" },
    select: listSelect,
  });
}

export function listUtilisateursAjoutables() {
  return prisma.utilisateur.findMany({
    where: { role: { in: ["utilisateur", "administrateur"] }, actif: true },
    orderBy: { identifiant: "asc" },
    select: { id: true, identifiant: true, role: true },
  });
}

export function changeRole(id, role) {
  return prisma.$transaction(async (transaction) => {
    const candidat = await transaction.utilisateur.findUnique({
      where: { id },
      select: { id: true, role: true, projetsResponsables: { where: { statut: "actif" }, select: { id: true } } },
    });
    if (!candidat) return null;
    if (candidat.role === role) return transaction.utilisateur.findUnique({ where: { id }, select: listSelect });

    if (candidat.role === "administrateur") {
      const administrateurs = await transaction.utilisateur.count({ where: { role: "administrateur" } });
      if (administrateurs <= 1) return { error: "DERNIER_ADMINISTRATEUR" };
    }

    if (role === "gestionnaire") {
      if (candidat.projetsResponsables.length) return { error: "GESTIONNAIRE_RESPONSABLE_PROJET" };
      await transaction.utilisateur.updateMany({
        where: { role: "gestionnaire", id: { not: id } },
        data: { role: "utilisateur" },
      });
      await transaction.participation.deleteMany({ where: { utilisateurId: id } });
    }

    return transaction.utilisateur.update({ where: { id }, data: { role }, select: listSelect });
  });
}

export function setActif(id, actif, actorId) {
  return prisma.$transaction(async (transaction) => {
    const candidat = await transaction.utilisateur.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!candidat) return null;
    if (!actif) {
      if (id === actorId) return { error: "AUTO_DESACTIVATION_INTERDITE" };
      if (candidat.role === "administrateur") {
        const administrateurs = await transaction.utilisateur.count({ where: { role: "administrateur", actif: true } });
        if (administrateurs <= 1) return { error: "DERNIER_ADMINISTRATEUR" };
      }
    }
    return transaction.utilisateur.update({ where: { id }, data: { actif }, select: listSelect });
  });
}
