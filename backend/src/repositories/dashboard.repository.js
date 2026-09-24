import { prisma } from "../config/prisma.js";

export function countActiveMaterials() {
  return prisma.materiel.count({ where: { statut: "actif" } });
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
    select: { id: true, nom: true, visibilite: true, statut: true, responsable: { select: { identifiant: true } }, taches: { select: { etat: true } } },
  });
}
export const dashboardRepository = { countActiveMaterials, findRecentMaterials, findVisibleProjects };
