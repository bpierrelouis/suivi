import test from "node:test";
import assert from "node:assert/strict";
import { createDashboardService } from "../src/services/dashboard.service.js";

function repository() {
  return {
    async countActiveMaterials() { return 4; },
    async findRecentMaterials() { return [{ id: "mat-1", nom: "Oscilloscope", numeroInventaire: "INV-1", numeroSerie: null, referenceConstructeur: null, categories: [{ categorie: { nom: "Mesure" } }] }]; },
    async findVisibleProjects(filter) { return [{ id: "project-1", nom: "Projet", visibilite: filter.OR ? "prive" : "public", statut: "actif", responsable: { identifiant: "lea" }, taches: [{ etat: "terminee" }, { etat: "en_cours" }] }]; },
    async countMaterielsEnRupture() { return 1; },
    async countDemandesReapprovisionnementEnAttente() { return 2; },
    async countUtilisateursActifs() { return 5; },
    async countUtilisateurs() { return 6; },
  };
}

test("le gestionnaire reçoit l'inventaire réel mais aucun projet", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "manager", role: "gestionnaire" });
  assert.equal(dashboard.indicateurs.materielsActifs, 4);
  assert.equal(dashboard.indicateurs.projetsActifs, 0);
  assert.deepEqual(dashboard.projets, []);
});

test("les indicateurs de rupture, demandes et utilisateurs sont exposés à tous les profils", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "user-1", role: "utilisateur" });
  assert.equal(dashboard.indicateurs.materielsEnRupture, 1);
  assert.equal(dashboard.indicateurs.demandesEnAttente, 2);
  assert.equal(dashboard.indicateurs.utilisateursActifs, 5);
  assert.equal(dashboard.indicateurs.utilisateursTotal, 6);
});

test("un utilisateur applique le filtre de visibilité et reçoit la progression calculée", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "user-1", role: "utilisateur" });
  assert.equal(dashboard.projets[0].progression, 50);
  assert.equal(dashboard.materielsRecents[0].reference, "INV-1");
});

test("le tableau de bord expose le tag d'état du projet", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "user-1", role: "utilisateur" });
  assert.equal(dashboard.projets[0].etat, "en_attente");
});

test("l'administrateur reçoit tous les projets actifs", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "admin", role: "administrateur" });
  assert.equal(dashboard.indicateurs.projetsActifs, 1);
  assert.equal(dashboard.projets[0].visibilite, "public");
});
