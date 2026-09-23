import { prisma } from "../config/prisma.js";

export function findUtilisateurByIdentifiant(identifiant) {
  return prisma.utilisateur.findUnique({ where: { identifiant } });
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
