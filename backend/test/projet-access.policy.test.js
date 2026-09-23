import test from "node:test";
import assert from "node:assert/strict";
import {
  assertCanConsultProjets,
  visibleProjetFilter,
} from "../src/policies/projet-access.policy.js";

test("le gestionnaire ne peut consulter aucun projet", () => {
  assert.throws(
    () => assertCanConsultProjets({ id: "manager", role: "gestionnaire" }),
    (error) => error.status === 403 && error.code === "ACCES_PROJETS_INTERDIT",
  );
});

test("l'administrateur n'est soumis à aucun filtre d'appartenance", () => {
  assert.deepEqual(visibleProjetFilter({ id: "admin", role: "administrateur" }), {});
});

test("un utilisateur voit les projets publics ou ceux dont il est membre", () => {
  assert.deepEqual(visibleProjetFilter({ id: "user-1", role: "utilisateur" }), {
    OR: [
      { visibilite: "public" },
      { participations: { some: { utilisateurId: "user-1" } } },
    ],
  });
});
