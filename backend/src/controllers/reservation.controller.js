import { z } from "zod";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { projetRepository } from "../repositories/projet.repository.js";
import { createReservationService } from "../services/reservation.service.js";

const service = createReservationService(reservationRepository, projetRepository);
const uuid = z.uuid();
const bodySchema = z.object({ materielId: uuid.optional(), debut: z.iso.datetime({ offset: true }), fin: z.iso.datetime({ offset: true }) }).strict();
function ids(req, res) {
  const project = uuid.safeParse(req.params.id); const reservation = req.params.reservationId ? uuid.safeParse(req.params.reservationId) : null;
  if (!project.success || (reservation && !reservation.success)) { res.status(400).json({ error: "IDENTIFIANT_INVALIDE" }); return null; }
  return { projetId: project.data, reservationId: reservation?.data };
}
function dates(data) { return { ...data, debut: new Date(data.debut), fin: new Date(data.fin) }; }
export async function listReservations(req, res) { const value = ids(req, res); if (value) res.json({ reservations: await service.listForProject(req.utilisateur, value.projetId) }); }
export async function createReservation(req, res) { const value = ids(req, res); const body = bodySchema.required({ materielId: true }).safeParse(req.body); if (!value || !body.success) return body.success ? undefined : res.status(400).json({ error: "RESERVATION_INVALIDE" }); res.status(201).json({ reservation: await service.create(req.utilisateur, value.projetId, dates(body.data)) }); }
export async function updateReservation(req, res) { const value = ids(req, res); const body = bodySchema.omit({ materielId: true }).safeParse(req.body); if (!value || !body.success) return body.success ? undefined : res.status(400).json({ error: "RESERVATION_INVALIDE" }); res.json({ reservation: await service.update(req.utilisateur, value.projetId, value.reservationId, dates(body.data)) }); }
export async function cancelReservation(req, res) { const value = ids(req, res); if (value) res.json({ reservation: await service.cancel(req.utilisateur, value.projetId, value.reservationId) }); }
