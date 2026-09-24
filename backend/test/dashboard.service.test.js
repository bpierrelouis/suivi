import test from "node:test";
import assert from "node:assert/strict";
import { createDashboardService } from "../src/services/dashboard.service.js";

function repository() {
  return {
    async countActiveMaterials() { return 4; },
    async findRecentMaterials() { return [{ id: "mat-1", nom: "Oscilloscope", numeroInventaire: "INV-1", numeroSerie: null, referenceConstructeur: null, categories: [{ categorie: { nom: "Mesure" } }] }]; },
    async findVisibleProjects(filter) { return [{ id: "project-1", nom: "Projet", visibilite: filter.OR ? "prive" : "public", statut: "actif", responsable: { identifiant: "lea" }, taches: [{ etat: "terminee" }, { etat: "en_cours" }] }]; },
  };
}

test("le gestionnaire reçoit l'inventaire réel mais aucun projet", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "manager", role: "gestionnaire" });
  assert.equal(dashboard.indicateurs.materielsActifs, 4);
  assert.equal(dashboard.indicateurs.projetsActifs, 0);
  assert.deepEqual(dashboard.projets, []);
});

test("un utilisateur applique le filtre de visibilité et reçoit la progression calculée", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "user-1", role: "utilisateur" });
  assert.equal(dashboard.projets[0].progression, 50);
  assert.equal(dashboard.materielsRecents[0].reference, "INV-1");
});

test("l'administrateur reçoit tous les projets actifs", async () => {
  const dashboard = await createDashboardService(repository()).build({ id: "admin", role: "administrateur" });
  assert.equal(dashboard.indicateurs.projetsActifs, 1);
  assert.equal(dashboard.projets[0].visibilite, "public");
});
