import { prisma } from "../config/prisma.js";

export function countActiveMaterials() {
  return prisma.materiel.count({ where: { statut: "actif" } });
}
// Écart assumé avec le dictionnaire de données (Q-09/D-20) : voir materiel.service.js.
export function countMaterielsEnRupture() {
  return prisma.materiel.count({ where: { statut: "actif", modeSuivi: "non_individualise", quantite: 0 } });
}
export function countDemandesReapprovisionnementEnAttente() {
  return prisma.demandeReapprovisionnement.count({ where: { statut: "nouvelle" } });
}
export function countUtilisateurs() {
  return prisma.utilisateur.count();
}
export function countUtilisateursActifs() {
  return prisma.utilisateur.count({ where: { derniereConnexion: { not: null } } });
}
export function findRecentMaterials() {
  return prisma.materiel.findMany({
    where: { statut: "actif" }, orderBy: { modifieLe: "desc" }, take: 3,
    select: { id: true, nom: true, numeroInventaire: true, numeroSerie: true, referenceConstructeur: true, categories: { take: 1, select: { categorie: { select: { nom: true } } } } },
  });
}
export function findVisibleProjects(accessFilter) {
  return prisma.projet.findMany({
    where: { statut: "actif", ...accessFilter }, orderBy: { modifieLe: "desc" }, take: 5,
    select: { id: true, nom: true, visibilite: true, statut: true, dateDebut: true, responsable: { select: { identifiant: true } }, taches: { select: { etat: true } } },
  });
}
export const dashboardRepository = {
  countActiveMaterials, findRecentMaterials, findVisibleProjects,
  countMaterielsEnRupture, countDemandesReapprovisionnementEnAttente, countUtilisateurs, countUtilisateursActifs,
};
