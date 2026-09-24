import { visibleProjetFilter } from "../policies/projet-access.policy.js";

function progression(projet) {
  if (!projet.taches.length) return 0;
  return Math.round((projet.taches.filter(({ etat }) => etat === "terminee").length / projet.taches.length) * 100);
}

export function createDashboardService(repository) {
  return {
    async build(utilisateur) {
      const [materielsActifs, materielsRecents, projets] = await Promise.all([
        repository.countActiveMaterials(),
        repository.findRecentMaterials(),
        utilisateur.role === "gestionnaire" ? [] : repository.findVisibleProjects(visibleProjetFilter(utilisateur)),
      ]);
      return {
        utilisateur,
        indicateurs: { projetsActifs: projets.length, materielsActifs },
        projets: projets.map((projet) => ({ ...projet, progression: progression(projet), taches: undefined })),
        materielsRecents: materielsRecents.map((materiel) => ({
          id: materiel.id,
          nom: materiel.nom,
          reference: materiel.numeroInventaire || materiel.numeroSerie || materiel.referenceConstructeur || "Sans référence",
          categorie: materiel.categories[0]?.categorie.nom || "Sans catégorie",
        })),
        accesDirectInventaire: true,
      };
    },
  };
}
