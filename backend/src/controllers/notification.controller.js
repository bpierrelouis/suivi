import { z } from "zod";
import { notificationRepository } from "../repositories/notification.repository.js";
import { createNotificationService } from "../services/notification.service.js";

const service = createNotificationService(notificationRepository);
const uuid = z.uuid();
export async function listNotifications(req, res) { res.json(await service.list(req.utilisateur)); }
export async function markNotificationRead(req, res) { const id = uuid.safeParse(req.params.id); if (!id.success) return res.status(400).json({ error: "IDENTIFIANT_INVALIDE" }); await service.markRead(req.utilisateur, id.data); res.status(204).send(); }
