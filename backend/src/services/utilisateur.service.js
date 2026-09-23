import { conflict, notFound } from "../errors/app.error.js";
export function createUtilisateurService(repository) {
  return {
    getUtilisateurs(mode) {
      return mode === "ajoutables" ? repository.listAjoutables() : repository.listAll();
    },

    async setGestionnaire(id, active) {
      const result = await repository.changeGestionnaireRole(id, active);
      if (!result) throw notFound("UTILISATEUR_INTROUVABLE");
      if (result.error) throw conflict(result.error);
      return result;
    },
  };
}
