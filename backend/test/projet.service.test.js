import test from "node:test";
import assert from "node:assert/strict";
import { createProjetService } from "../src/services/projet.service.js";

const utilisateur = { id: "user-1", identifiant: "user@demo.local", role: "utilisateur" };

function rawProjet(overrides = {}) {
  return {
    id: "project-1",
    nom: "Projet public",
    description: "Description",
    visibilite: "public",
    statut: "actif",
    dateDebut: null,
    dateFin: null,
    responsable: { id: "user-1", identifiant: "user@demo.local" },
    _count: { participations: 1 },
    creeLe: new Date("2026-09-23T08:00:00Z"),
    modifieLe: new Date("2026-09-23T09:00:00Z"),
    participations: [
      {
        rejointLe: new Date("2026-09-23T08:00:00Z"),
        utilisateur: { id: "user-1", identifiant: "user@demo.local" },
      },
    ],
    ...overrides,
  };
}

test("la liste transforme les données sans exposer la structure de persistance", async () => {
  const repository = {
    async findVisibleProjets(filter) {
      assert.deepEqual(filter.OR[1], { participations: { some: { utilisateurId: "user-1" } } });
      return [rawProjet()];
    },
  };
  const service = createProjetService(repository);

  const projets = await service.list(utilisateur);

  assert.equal(projets[0].nombreMembres, 1);
  assert.equal(projets[0].relation, "responsable");
  assert.equal("_count" in projets[0], false);
  assert.equal("participations" in projets[0], false);
});

test("le détail inaccessible répond comme un projet introuvable", async () => {
  const service = createProjetService({
    async findVisibleProjetById() {
      return null;
    },
  });

  await assert.rejects(
    () => service.getById(utilisateur, "project-private"),
    (error) => error.status === 404 && error.code === "PROJET_INTROUVABLE",
  );
});

test("le détail expose une vue métier des membres", async () => {
  const service = createProjetService({
    async findVisibleProjetById() {
      return rawProjet();
    },
  });

  const projet = await service.getById(utilisateur, "project-1");

  assert.deepEqual(projet.membres[0], {
    id: "user-1",
    identifiant: "user@demo.local",
    rejointLe: new Date("2026-09-23T08:00:00Z"),
  });
});

test("un lecteur public non membre ne peut pas modifier le projet", async () => {
  const repository = {
    async findProjetForCommand() {
      return { id: "project-1", statut: "actif", responsableId: "owner", participations: [] };
    },
  };
  const service = createProjetService(repository);
  await assert.rejects(
    () => service.update(utilisateur, "project-1", { nom: "Interdit" }),
    (error) => error.status === 403 && error.code === "MODIFICATION_PROJET_INTERDITE",
  );
});

test("une tâche ne peut être assignée qu'à un membre", async () => {
  const repository = {
    async findProjetForCommand() {
      return {
        id: "project-1",
        statut: "actif",
        responsableId: "user-1",
        participations: [{ utilisateurId: "user-1" }],
      };
    },
  };
  const service = createProjetService(repository);
  await assert.rejects(
    () => service.createTask(utilisateur, "project-1", {
      titre: "Tâche",
      description: "Description",
      responsableId: "outsider",
    }),
    (error) => error.status === 409 && error.code === "RESPONSABLE_TACHE_NON_MEMBRE",
  );
});

test("le passage d'une tâche à terminée délègue la clôture atomique au repository", async () => {
  let update;
  const repository = {
    async findProjetForCommand() {
      return {
        id: "project-1",
        statut: "actif",
        responsableId: "user-1",
        participations: [{ utilisateurId: "user-1" }],
      };
    },
    async findTache() { return { id: "task-1" }; },
    async updateTacheAndCloseIfComplete(taskId, projectId, data) {
      update = { taskId, projectId, data };
    },
  };
  const service = createProjetService(repository);
  await service.updateTask(utilisateur, "project-1", "task-1", { etat: "terminee" });
  assert.deepEqual(update, {
    taskId: "task-1",
    projectId: "project-1",
    data: { etat: "terminee" },
  });
});
