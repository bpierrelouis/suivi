import { prisma } from "../config/prisma.js";

export function findUtilisateurByIdentifiant(identifiant) {
  return prisma.utilisateur.findUnique({ where: { identifiant } });
}

export function findUtilisateurById(id) {
  return prisma.utilisateur.findUnique({
    where: { id },
    select: { id: true, identifiant: true, role: true },
  });
}

export function createUtilisateur(data) {
  return prisma.utilisateur.upsert({
    where: { identifiant: data.identifiant },
    update: {},
    create: data,
  });
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
    select: { id: true, identifiant: true, role: true, creeLe: true, derniereConnexion: true },
  });
}

export function listUtilisateursAjoutables() {
  return prisma.utilisateur.findMany({
    where: { role: { in: ["utilisateur", "administrateur"] } },
    orderBy: { identifiant: "asc" },
    select: { id: true, identifiant: true, role: true },
  });
}

export function changeGestionnaireRole(id, active) {
  return prisma.$transaction(async (transaction) => {
    const candidat = await transaction.utilisateur.findUnique({
      where: { id },
      select: { id: true, role: true, projetsResponsables: { where: { statut: "actif" }, select: { id: true } } },
    });
    if (!candidat) return null;

    if (active) {
      if (candidat.role === "administrateur") return { error: "ROLE_ADMINISTRATEUR_IMMUABLE" };
      if (candidat.projetsResponsables.length) return { error: "GESTIONNAIRE_RESPONSABLE_PROJET" };

      await transaction.utilisateur.updateMany({
        where: { role: "gestionnaire", id: { not: id } },
        data: { role: "utilisateur" },
      });
      await transaction.participation.deleteMany({ where: { utilisateurId: id } });
      return transaction.utilisateur.update({
        where: { id },
        data: { role: "gestionnaire" },
        select: { id: true, identifiant: true, role: true },
      });
    }

    if (candidat.role !== "gestionnaire") return { error: "UTILISATEUR_NON_GESTIONNAIRE" };
    return transaction.utilisateur.update({
      where: { id },
      data: { role: "utilisateur" },
      select: { id: true, identifiant: true, role: true },
    });
  });
}
