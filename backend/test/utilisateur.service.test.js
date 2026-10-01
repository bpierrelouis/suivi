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
    changeRole: async () => ({ error: "GESTIONNAIRE_RESPONSABLE_PROJET" }),
  });
  await assert.rejects(
    () => service.changerRole("user-1", "gestionnaire"),
    (error) => error.status === 409 && error.code === "GESTIONNAIRE_RESPONSABLE_PROJET",
  );
});

test("la création d'un compte échoue si l'identifiant existe déjà", async () => {
  const service = createUtilisateurService({
    creer: async () => ({ error: "IDENTIFIANT_DEJA_UTILISE" }),
  });
  await assert.rejects(
    () => service.creerUtilisateur({ identifiant: "a@b.fr", motDePasse: "motdepasse123", role: "utilisateur" }),
    (error) => error.status === 409 && error.code === "IDENTIFIANT_DEJA_UTILISE",
  );
});

test("la modification d'un compte introuvable échoue", async () => {
  const service = createUtilisateurService({
    modifier: async () => null,
  });
  await assert.rejects(
    () => service.modifierUtilisateur("user-1", { identifiant: "a@b.fr" }),
    (error) => error.status === 404 && error.code === "UTILISATEUR_INTROUVABLE",
  );
});

test("un administrateur ne peut pas se désactiver lui-même", async () => {
  const service = createUtilisateurService({
    setActif: async () => ({ error: "AUTO_DESACTIVATION_INTERDITE" }),
  });
  await assert.rejects(
    () => service.definirActivation("user-1", "user-1", false),
    (error) => error.status === 409 && error.code === "AUTO_DESACTIVATION_INTERDITE",
  );
});

test("le dernier administrateur ne peut pas être désactivé", async () => {
  const service = createUtilisateurService({
    setActif: async () => ({ error: "DERNIER_ADMINISTRATEUR" }),
  });
  await assert.rejects(
    () => service.definirActivation("admin-2", "admin-1", false),
    (error) => error.status === 409 && error.code === "DERNIER_ADMINISTRATEUR",
  );
});
