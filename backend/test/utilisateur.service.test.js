import test from "node:test";
import assert from "node:assert/strict";
import { createUtilisateurService } from "../src/services/utilisateur.service.js";

test("la liste ajoutable n'expose que la vue dédiée", async () => {
  const service = createUtilisateurService({
    listAll: () => ["all"],
    listAjoutables: () => ["selectable"],
  });
  assert.deepEqual(await service.getUtilisateurs("ajoutables"), ["selectable"]);
});

test("un responsable de projet ne peut pas devenir gestionnaire", async () => {
  const service = createUtilisateurService({
    changeGestionnaireRole: async () => ({ error: "GESTIONNAIRE_RESPONSABLE_PROJET" }),
  });
  await assert.rejects(
    () => service.setGestionnaire("user-1", true),
    (error) => error.status === 409 && error.code === "GESTIONNAIRE_RESPONSABLE_PROJET",
  );
});
