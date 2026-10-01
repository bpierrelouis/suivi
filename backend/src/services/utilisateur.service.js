import bcrypt from "bcryptjs";
import { conflict, notFound } from "../errors/app.error.js";

function normalizeIdentifiant(value) {
  return value.trim().toLowerCase();
}

export function createUtilisateurService(repository) {
  return {
    getUtilisateurs(mode) {
      return mode === "ajoutables" ? repository.listAjoutables() : repository.listAll();
    },

    async creerUtilisateur({ identifiant, motDePasse, role }) {
      const result = await repository.creer({
        identifiant: normalizeIdentifiant(identifiant),
        motDePasse: await bcrypt.hash(motDePasse, 12),
        role,
      });
      if (result?.error) throw conflict(result.error);
      return result;
    },

    async modifierUtilisateur(id, { identifiant, motDePasse }) {
      const data = {};
      if (identifiant !== undefined) data.identifiant = normalizeIdentifiant(identifiant);
      if (motDePasse !== undefined) data.motDePasse = await bcrypt.hash(motDePasse, 12);
      const result = await repository.modifier(id, data);
      if (!result) throw notFound("UTILISATEUR_INTROUVABLE");
      if (result.error) throw conflict(result.error);
      return result;
    },

    async changerRole(id, role) {
      const result = await repository.changeRole(id, role);
      if (!result) throw notFound("UTILISATEUR_INTROUVABLE");
      if (result.error) throw conflict(result.error);
      return result;
    },

    async definirActivation(actorId, id, actif) {
      const result = await repository.setActif(id, actif, actorId);
      if (!result) throw notFound("UTILISATEUR_INTROUVABLE");
      if (result.error) throw conflict(result.error);
      return result;
    },
  };
}
