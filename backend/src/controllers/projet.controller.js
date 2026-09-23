import { z } from "zod";
import { projetRepository } from "../repositories/projet.repository.js";
import { findUtilisateurById } from "../repositories/utilisateur.repository.js";
import { createProjetService } from "../services/projet.service.js";
import { documentationFilename, exportDocumentationDocx } from "../services/documentation-export.service.js";

const uuid = z.uuid();
const nullableDate = z.union([z.string().date(), z.literal(""), z.null()]).optional()
  .transform((value) => value ? new Date(`${value}T00:00:00.000Z`) : null);
const projetSchema = z.object({
  nom: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(5000),
  visibilite: z.enum(["public", "prive"]),
  dateDebut: nullableDate,
  dateFin: nullableDate,
}).strict().refine(
  ({ dateDebut, dateFin }) => !dateDebut || !dateFin || dateFin >= dateDebut,
  { message: "DATE_FIN_INVALIDE", path: ["dateFin"] },
);
const taskCreateSchema = z.object({
  titre: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(3000),
  responsableId: uuid.nullable().optional(),
}).strict();
const taskUpdateSchema = z.object({
  titre: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().min(1).max(3000).optional(),
  etat: z.enum(["a_faire", "en_cours", "terminee"]).optional(),
  ordre: z.number().int().min(0).optional(),
  responsableId: uuid.nullable().optional(),
}).strict().refine((data) => Object.keys(data).length > 0);
const documentationSchema = z.object({ contenu: z.string().max(100_000) }).strict();
const membreSchema = z.object({ utilisateurId: uuid }).strict();
const projetService = createProjetService(projetRepository, { findById: findUtilisateurById });

function parseIds(req, res, includeTask = false) {
  const projetId = uuid.safeParse(req.params.id);
  const taskId = includeTask ? uuid.safeParse(req.params.taskId) : null;
  if (!projetId.success || (taskId && !taskId.success)) {
    res.status(400).json({ error: "IDENTIFIANT_INVALIDE" });
    return null;
  }
  return { projetId: projetId.data, taskId: taskId?.data };
}

export async function listProjets(req, res) {
  res.json({ projets: await projetService.list(req.utilisateur) });
}

export async function getProjet(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  res.json({ projet: await projetService.getById(req.utilisateur, ids.projetId) });
}

export async function createProjet(req, res) {
  const body = projetSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "PROJET_INVALIDE" });
  res.status(201).json(await projetService.create(req.utilisateur, body.data));
}

export async function updateProjet(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const body = projetSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "PROJET_INVALIDE" });
  await projetService.update(req.utilisateur, ids.projetId, body.data);
  res.status(204).send();
}

export async function addMember(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const body = membreSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "MEMBRE_INVALIDE" });
  const participation = await projetService.addMember(req.utilisateur, ids.projetId, body.data.utilisateurId);
  res.status(201).json({ membre: participation.utilisateur });
}

export async function removeMember(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const utilisateurId = uuid.safeParse(req.params.utilisateurId);
  if (!utilisateurId.success) return res.status(400).json({ error: "MEMBRE_INVALIDE" });
  await projetService.removeMember(req.utilisateur, ids.projetId, utilisateurId.data);
  res.status(204).send();
}

export async function createTask(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const body = taskCreateSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "TACHE_INVALIDE" });
  res.status(201).json(await projetService.createTask(req.utilisateur, ids.projetId, body.data));
}

export async function updateTask(req, res) {
  const ids = parseIds(req, res, true);
  if (!ids) return;
  const body = taskUpdateSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "TACHE_INVALIDE" });
  await projetService.updateTask(req.utilisateur, ids.projetId, ids.taskId, body.data);
  res.status(204).send();
}

export async function deleteTask(req, res) {
  const ids = parseIds(req, res, true);
  if (!ids) return;
  await projetService.deleteTask(req.utilisateur, ids.projetId, ids.taskId);
  res.status(204).send();
}

export async function saveDocumentation(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const body = documentationSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "DOCUMENTATION_INVALIDE" });
  const documentation = await projetService.saveDocumentation(req.utilisateur, ids.projetId, body.data.contenu);
  res.json({ documentation });
}

export async function exportDocumentation(req, res) {
  const ids = parseIds(req, res);
  if (!ids) return;
  const projet = await projetService.getById(req.utilisateur, ids.projetId);
  const buffer = await exportDocumentationDocx(projet);
  res.set({
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename="${documentationFilename(projet.nom)}"`,
    "Content-Length": buffer.length,
  });
  res.send(buffer);
}
