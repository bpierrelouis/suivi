import { z } from "zod";
import {
  changeGestionnaireRole,
  listUtilisateurs,
  listUtilisateursAjoutables,
} from "../repositories/utilisateur.repository.js";
import { createUtilisateurService } from "../services/utilisateur.service.js";

const idSchema = z.uuid();
const roleSchema = z.object({ gestionnaire: z.boolean() }).strict();
const utilisateurService = createUtilisateurService({
  listAll: listUtilisateurs,
  listAjoutables: listUtilisateursAjoutables,
  changeGestionnaireRole,
});

export async function list(req, res) {
  const mode = req.utilisateur.role === "administrateur" && req.query.mode !== "ajoutables"
    ? "tous"
    : "ajoutables";
  const utilisateurs = await utilisateurService.getUtilisateurs(mode);
  res.json({ utilisateurs });
}

export async function updateGestionnaire(req, res) {
  const id = idSchema.safeParse(req.params.id);
  const body = roleSchema.safeParse(req.body);
  if (!id.success || !body.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  const utilisateur = await utilisateurService.setGestionnaire(id.data, body.data.gestionnaire);
  res.json({ utilisateur });
}
