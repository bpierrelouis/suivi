import test from "node:test";
import assert from "node:assert/strict";
import { buildDashboard, projetsVisibles } from "../src/services/dashboard.service.js";

test("le gestionnaire ne reçoit aucun projet", () => {
  const dashboard = buildDashboard({ identifiant: "gestionnaire@demo.local", role: "gestionnaire" });
  assert.equal(dashboard.indicateurs.projetsActifs, 0);
  assert.deepEqual(dashboard.projets, []);
});

test("un utilisateur extérieur ne reçoit que les projets publics", () => {
  const projets = projetsVisibles({ identifiant: "exterieur@demo.local", role: "utilisateur" });
  assert.ok(projets.length > 0);
  assert.ok(projets.every((projet) => projet.visibilite === "public"));
});

test("un membre reçoit aussi son projet privé", () => {
  const projets = projetsVisibles({ identifiant: "lea.fournier@demo.local", role: "utilisateur" });
  assert.ok(projets.some((projet) => projet.visibilite === "prive"));
});
