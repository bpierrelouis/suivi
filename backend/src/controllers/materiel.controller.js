import { z } from "zod";
import { materielRepository } from "../repositories/materiel.repository.js";
import { createMaterielService } from "../services/materiel.service.js";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { projetRepository } from "../repositories/projet.repository.js";
import { createReservationService } from "../services/reservation.service.js";
import { createInventoryPdf, createInventoryXlsx, inventoryExportFilename } from "../services/inventory-export.service.js";

const service = createMaterielService(materielRepository);
const reservations = createReservationService(reservationRepository, projetRepository);
const uuid = z.uuid();
const optionalText = z.union([z.string().trim().max(180), z.literal(""), z.null()]).optional().transform((value) => value || null);
const materielSchema = z.object({
  nom: z.string().trim().min(1).max(160),
  modeSuivi: z.enum(["individualise", "non_individualise"]).default("individualise"),
  numeroSerie: optionalText,
  referenceConstructeur: optionalText,
  numeroInventaire: optionalText,
  categorieIds: z.array(uuid).max(50).default([]),
}).strict();
const categorieSchema = z.object({ nom: z.string().trim().min(1).max(100) }).strict();
const filtersSchema = z.object({
  recherche: z.string().trim().max(160).optional(), categorieId: uuid.optional(),
  modeSuivi: z.enum(["individualise", "non_individualise"]).optional(),
  tri: z.enum(["nom_asc", "nom_desc", "recent", "ancien"]).optional(),
});
const exportSchema = filtersSchema.extend({ format: z.enum(["xlsx", "pdf"]), perimetre: z.enum(["all", "filtered"]).default("filtered") });
const calendarSchema = z.object({ debut: z.iso.datetime({ offset: true }), fin: z.iso.datetime({ offset: true }), materielIds: z.string().optional() });

function id(value, res) {
  const parsed = uuid.safeParse(value);
  if (!parsed.success) { res.status(400).json({ error: "IDENTIFIANT_INVALIDE" }); return null; }
  return parsed.data;
}
export async function listMateriels(req, res) {
  const filters = filtersSchema.safeParse(req.query);
  if (!filters.success) return res.status(400).json({ error: "FILTRES_INVALIDES" });
  res.json({ materiels: await service.list(req.utilisateur, filters.data) });
}
export async function exportMateriels(req, res) {
  const query = exportSchema.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "EXPORT_INVALIDE" });
  const { format, perimetre, ...filters } = query.data;
  const data = await service.exportData(req.utilisateur, filters, perimetre);
  const buffer = format === "xlsx" ? await createInventoryXlsx(data.rows, data.filters, perimetre) : await createInventoryPdf(data.rows, data.filters, perimetre);
  res.set({ "Content-Type": format === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf", "Content-Disposition": `attachment; filename="${inventoryExportFilename(format)}"`, "Content-Length": buffer.length });
  res.send(buffer);
}
export async function getCalendar(req, res) {
  const query = calendarSchema.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "PERIODE_CALENDRIER_INVALIDE" });
  const debut = new Date(query.data.debut); const fin = new Date(query.data.fin);
  if (fin <= debut || fin - debut > 93 * 24 * 60 * 60 * 1000) return res.status(400).json({ error: "PERIODE_CALENDRIER_INVALIDE" });
  const materielIds = query.data.materielIds ? [...new Set(query.data.materielIds.split(","))].slice(0, 100) : [];
  if (materielIds.some((value) => !uuid.safeParse(value).success)) return res.status(400).json({ error: "IDENTIFIANT_INVALIDE" });
  res.json({ debut, fin, materiels: await service.calendar(req.utilisateur, debut, fin, materielIds) });
}
export async function listArchivedMateriels(req, res) { const filters = filtersSchema.safeParse(req.query); if (!filters.success) return res.status(400).json({ error: "FILTRES_INVALIDES" }); res.json({ materiels: await service.listArchived(req.utilisateur, filters.data) }); }
export async function getArchivedMateriel(req, res) { const value = id(req.params.id, res); if (value) res.json({ materiel: await service.getArchived(req.utilisateur, value) }); }
export async function getMateriel(req, res) { const value = id(req.params.id, res); if (value) res.json({ materiel: await service.get(req.utilisateur, value) }); }
export async function createMateriel(req, res) { const body = materielSchema.safeParse(req.body); if (!body.success) return res.status(400).json({ error: "MATERIEL_INVALIDE" }); res.status(201).json(await service.create(req.utilisateur, body.data)); }
export async function updateMateriel(req, res) { const value = id(req.params.id, res); const body = materielSchema.safeParse(req.body); if (!value || !body.success) return body.success ? undefined : res.status(400).json({ error: "MATERIEL_INVALIDE" }); await service.update(req.utilisateur, value, body.data); res.status(204).send(); }
export async function getHistory(req, res) { const value = id(req.params.id, res); if (value) res.json({ historique: await service.history(req.utilisateur, value) }); }
export async function getArchivedHistory(req, res) { const value = id(req.params.id, res); if (value) res.json({ historique: await service.archivedHistory(req.utilisateur, value) }); }
export async function archiveMateriel(req, res) { const value = id(req.params.id, res); if (value) res.json(await service.archive(req.utilisateur, value)); }
export async function getMaterialReservations(req, res) { const value = id(req.params.id, res); if (!value) return; const archived = req.query.archive === "true"; res.json({ reservations: await reservations.listForMaterial(req.utilisateur, value, archived) }); }
export async function listCategories(req, res) { res.json({ categories: await service.listCategories() }); }
export async function createCategory(req, res) { const body = categorieSchema.safeParse(req.body); if (!body.success) return res.status(400).json({ error: "CATEGORIE_INVALIDE" }); res.status(201).json({ categorie: await service.createCategory(req.utilisateur, body.data.nom) }); }
export async function updateCategory(req, res) { const value = id(req.params.id, res); const body = categorieSchema.safeParse(req.body); if (!value || !body.success) return body.success ? undefined : res.status(400).json({ error: "CATEGORIE_INVALIDE" }); res.json({ categorie: await service.updateCategory(req.utilisateur, value, body.data.nom) }); }
export async function deleteCategory(req, res) { const value = id(req.params.id, res); if (value) { await service.deleteCategory(req.utilisateur, value); res.status(204).send(); } }
export async function addAttachment(req, res) {
  const value = id(req.params.id, res); if (!value) return;
  let nomFichier; try { nomFichier = decodeURIComponent(req.get("X-Filename") || ""); } catch { return res.status(400).json({ error: "NOM_FICHIER_INVALIDE" }); }
  const piece = await service.addAttachment(req.utilisateur, value, { nomFichier, typeMime: req.get("Content-Type") || "", contenu: req.body });
  res.status(201).json({ pieceJointe: piece });
}
export async function downloadAttachment(req, res) {
  const materielId = id(req.params.id, res); const pieceId = id(req.params.pieceId, res); if (!materielId || !pieceId) return;
  const piece = await service.downloadAttachment(req.utilisateur, materielId, pieceId);
  const ascii = piece.nomFichier.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  res.set({ "Content-Type": piece.typeMime, "Content-Length": piece.taille, "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(piece.nomFichier)}` });
  res.send(piece.contenu);
}
export async function removeAttachment(req, res) { const materielId = id(req.params.id, res); const pieceId = id(req.params.pieceId, res); if (materielId && pieceId) { await service.removeAttachment(req.utilisateur, materielId, pieceId); res.status(204).send(); } }
