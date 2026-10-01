import { visibleProjetFilter } from "../policies/projet-access.policy.js";
import { etatTag } from "../utils/projet-etat.js";

function progression(projet) {
  if (!projet.taches.length) return 0;
  return Math.round((projet.taches.filter(({ etat }) => etat === "terminee").length / projet.taches.length) * 100);
}

export function createDashboardService(repository) {
  return {
    async build(utilisateur) {
      const [materielsActifs, materielsRecents, projets, materielsEnRupture, demandesEnAttente, utilisateursActifs, utilisateursTotal] = await Promise.all([
        repository.countActiveMaterials(),
        repository.findRecentMaterials(),
        utilisateur.role === "gestionnaire" ? [] : repository.findVisibleProjects(visibleProjetFilter(utilisateur)),
        repository.countMaterielsEnRupture(),
        repository.countDemandesReapprovisionnementEnAttente(),
        repository.countUtilisateursActifs(),
        repository.countUtilisateurs(),
      ]);
      return {
        utilisateur,
        indicateurs: {
          projetsActifs: projets.length,
          materielsActifs,
          // Écart assumé avec le dictionnaire de données (Q-09/D-20) : voir materiel.service.js.
          materielsEnRupture,
          demandesEnAttente,
          utilisateursActifs,
          utilisateursTotal,
        },
        projets: projets.map((projet) => ({ ...projet, etat: etatTag(projet), progression: progression(projet), taches: undefined, dateDebut: undefined })),
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
