import { z } from "zod";
import {
  changeRole,
  createUtilisateurManuel,
  listUtilisateurs,
  listUtilisateursAjoutables,
  setActif,
  updateUtilisateur,
} from "../repositories/utilisateur.repository.js";
import { createUtilisateurService } from "../services/utilisateur.service.js";

const idSchema = z.uuid();
const roleEnum = z.enum(["administrateur", "gestionnaire", "utilisateur"]);
const identifiantSchema = z.string().trim().min(3).max(180);
const motDePasseSchema = z.string().min(8).max(200);
const roleSchema = z.object({ role: roleEnum }).strict();
const createSchema = z.object({ identifiant: identifiantSchema, motDePasse: motDePasseSchema, role: roleEnum }).strict();
const updateSchema = z
  .object({ identifiant: identifiantSchema.optional(), motDePasse: motDePasseSchema.optional() })
  .strict();

const utilisateurService = createUtilisateurService({
  listAll: listUtilisateurs,
  listAjoutables: listUtilisateursAjoutables,
  creer: createUtilisateurManuel,
  modifier: updateUtilisateur,
  changeRole,
  setActif,
});

export async function list(req, res) {
  const mode = req.utilisateur.role === "administrateur" && req.query.mode !== "ajoutables"
    ? "tous"
    : "ajoutables";
  const utilisateurs = await utilisateurService.getUtilisateurs(mode);
  res.json({ utilisateurs });
}

export async function create(req, res) {
  const body = createSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  const utilisateur = await utilisateurService.creerUtilisateur(body.data);
  res.status(201).json({ utilisateur });
}

export async function update(req, res) {
  const id = idSchema.safeParse(req.params.id);
  const body = updateSchema.safeParse(req.body);
  if (!id.success || !body.success || (!body.data.identifiant && !body.data.motDePasse)) {
    return res.status(400).json({ error: "DONNEES_INVALIDES" });
  }

  const utilisateur = await utilisateurService.modifierUtilisateur(id.data, body.data);
  res.json({ utilisateur });
}

export async function updateRole(req, res) {
  const id = idSchema.safeParse(req.params.id);
  const body = roleSchema.safeParse(req.body);
  if (!id.success || !body.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  const utilisateur = await utilisateurService.changerRole(id.data, body.data.role);
  res.json({ utilisateur });
}

export async function deactivate(req, res) {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  const utilisateur = await utilisateurService.definirActivation(req.utilisateur.id, id.data, false);
  res.json({ utilisateur });
}

export async function reactivate(req, res) {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  const utilisateur = await utilisateurService.definirActivation(req.utilisateur.id, id.data, true);
  res.json({ utilisateur });
}
