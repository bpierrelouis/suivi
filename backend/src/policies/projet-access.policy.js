import { forbidden } from "../errors/app.error.js";

export function assertCanConsultProjets(utilisateur) {
  if (utilisateur.role === "gestionnaire") {
    throw forbidden("ACCES_PROJETS_INTERDIT");
  }
}

export function visibleProjetFilter(utilisateur) {
  assertCanConsultProjets(utilisateur);

  if (utilisateur.role === "administrateur") return {};

  return {
    OR: [
      { visibilite: "public" },
      { participations: { some: { utilisateurId: utilisateur.id } } },
    ],
  };
}

export function isProjetMember(projet, utilisateurId) {
  return projet.participations.some((participation) => participation.utilisateurId === utilisateurId);
}

export function assertCanCreateProjet(utilisateur) {
  if (!['administrateur', 'utilisateur'].includes(utilisateur.role)) {
    throw forbidden("CREATION_PROJET_INTERDITE");
  }
}

export function assertCanModifyProjet(utilisateur, projet) {
  if (projet.statut !== "actif") throw forbidden("PROJET_ARCHIVE_VERROUILLE");
  if (utilisateur.role === "administrateur") return;
  if (utilisateur.role === "gestionnaire" || !isProjetMember(projet, utilisateur.id)) {
    throw forbidden("MODIFICATION_PROJET_INTERDITE");
  }
}
