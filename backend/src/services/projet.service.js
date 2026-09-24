import { conflict, forbidden, notFound } from "../errors/app.error.js";
import {
  assertCanCreateProjet,
  assertCanModifyProjet,
  isProjetMember,
  visibleProjetFilter,
} from "../policies/projet-access.policy.js";

function projectRelation(projet, viewer) {
  if (viewer.role === "administrateur") return "administrateur";
  if (projet.responsable.id === viewer.id) return "responsable";
  if (projet.participations.some(({ utilisateurId, utilisateur: membre }) => (utilisateurId || membre?.id) === viewer.id)) return "membre";
  return "lecteur";
}

function toSummary(projet, utilisateur) {
  return {
    id: projet.id,
    nom: projet.nom,
    description: projet.description,
    visibilite: projet.visibilite,
    statut: projet.statut,
    dateDebut: projet.dateDebut,
    dateFin: projet.dateFin,
    responsable: projet.responsable,
    nombreMembres: projet._count.participations,
    relation: projectRelation(projet, utilisateur),
  };
}

function toDetail(projet, utilisateur) {
  const peutModifier = projet.statut === "actif" && (
    utilisateur.role === "administrateur"
    || projet.participations.some(({ utilisateur: membre }) => membre.id === utilisateur.id)
  );
  return {
    ...toSummary(projet, utilisateur),
    creeLe: projet.creeLe,
    modifieLe: projet.modifieLe,
    membres: projet.participations.map(({ utilisateur, rejointLe }) => ({
      ...utilisateur,
      rejointLe,
    })),
    taches: projet.taches || [],
    documentation: projet.documentation || { contenu: "", modifieLe: null, auteur: null },
    historique: projet.historique || [],
    reservations: projet.reservations || [],
    droits: {
      modifier: peutModifier,
      ajouterMembre: peutModifier,
      retirerMembre: projet.statut === "actif" && utilisateur.role === "administrateur",
      archiver: projet.statut === "actif" && (utilisateur.role === "administrateur" || projet.responsable.id === utilisateur.id),
      gererReservations: peutModifier,
      voirReservations: true,
    },
  };
}

async function getCommandProjet(repository, utilisateur, id) {
  const projet = await repository.findProjetForCommand(id);
  if (!projet) throw notFound("PROJET_INTROUVABLE");
  assertCanModifyProjet(utilisateur, projet);
  return projet;
}

export function createProjetService(repository, utilisateurs = null) {
  if (!repository) throw new TypeError("Un repository de projets est requis.");

  return {
    async list(utilisateur, statut) {
      const accessFilter = visibleProjetFilter(utilisateur);
      const projets = await repository.findVisibleProjets(accessFilter, statut);
      return projets.map((projet) => toSummary(projet, utilisateur));
    },

    async getById(utilisateur, id) {
      const accessFilter = visibleProjetFilter(utilisateur);
      const projet = await repository.findVisibleProjetById(id, accessFilter);
      if (!projet) throw notFound("PROJET_INTROUVABLE");
      return toDetail(projet, utilisateur);
    },

    async create(utilisateur, data) {
      assertCanCreateProjet(utilisateur);
      return repository.createProjet(data, utilisateur.id);
    },

    async update(utilisateur, id, data) {
      await getCommandProjet(repository, utilisateur, id);
      return repository.updateProjet(id, data, utilisateur.id);
    },

    async addMember(utilisateur, projetId, utilisateurId) {
      await getCommandProjet(repository, utilisateur, projetId);
      if (!utilisateurs) throw new TypeError("Un repository d'utilisateurs est requis.");
      const membre = await utilisateurs.findById(utilisateurId);
      if (!membre) throw notFound("UTILISATEUR_INTROUVABLE");
      if (membre.role === "gestionnaire") throw conflict("GESTIONNAIRE_INTERDIT_AUX_PROJETS");
      return repository.addProjetMember(projetId, utilisateurId, utilisateur.id);
    },

    async removeMember(utilisateur, projetId, utilisateurId) {
      const projet = await getCommandProjet(repository, utilisateur, projetId);
      if (utilisateur.role !== "administrateur") throw forbidden("RETRAIT_MEMBRE_RESERVE_ADMINISTRATEUR");
      if (projet.responsableId === utilisateurId) throw conflict("RESPONSABLE_NON_RETIRABLE");
      if (!isProjetMember(projet, utilisateurId)) throw notFound("MEMBRE_INTROUVABLE");
      await repository.removeProjetMember(projetId, utilisateurId, utilisateur.id);
    },

    async createTask(utilisateur, projetId, data) {
      const projet = await getCommandProjet(repository, utilisateur, projetId);
      if (data.responsableId && !isProjetMember(projet, data.responsableId)) {
        throw conflict("RESPONSABLE_TACHE_NON_MEMBRE");
      }
      return repository.createTache(projetId, data, utilisateur.id);
    },

    async updateTask(utilisateur, projetId, taskId, data) {
      const projet = await getCommandProjet(repository, utilisateur, projetId);
      if (!await repository.findTache(taskId, projetId)) throw notFound("TACHE_INTROUVABLE");
      if (data.responsableId && !isProjetMember(projet, data.responsableId)) {
        throw conflict("RESPONSABLE_TACHE_NON_MEMBRE");
      }
      await repository.updateTacheAndCloseIfComplete(taskId, projetId, data, utilisateur.id);
    },

    async deleteTask(utilisateur, projetId, taskId) {
      await getCommandProjet(repository, utilisateur, projetId);
      if (!await repository.findTache(taskId, projetId)) throw notFound("TACHE_INTROUVABLE");
      await repository.deleteTache(taskId, projetId, utilisateur.id);
    },

    async saveDocumentation(utilisateur, projetId, contenu) {
      await getCommandProjet(repository, utilisateur, projetId);
      return repository.saveDocumentation(projetId, contenu, utilisateur.id);
    },

    async archive(utilisateur, projetId) {
      const projet = await repository.findProjetForCommand(projetId);
      if (!projet) throw notFound("PROJET_INTROUVABLE");
      if (projet.statut !== "actif") throw conflict("PROJET_DEJA_ARCHIVE");
      if (utilisateur.role !== "administrateur" && projet.responsableId !== utilisateur.id) throw forbidden("ARCHIVAGE_PROJET_INTERDIT");
      await repository.archiveProjet(projetId, utilisateur.id);
    },
  };
}
