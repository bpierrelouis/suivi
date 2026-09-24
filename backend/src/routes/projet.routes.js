import { Router } from "express";
import {
  addMember,
  createProjet,
  createTask,
  deleteTask,
  exportDocumentation,
  getProjet,
  listProjets,
  removeMember,
  saveDocumentation,
  updateProjet,
  updateTask,
  archiveProjet,
} from "../controllers/projet.controller.js";
import { cancelReservation, createReservation, listReservations, updateReservation } from "../controllers/reservation.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireSession);
router.get("/", listProjets);
router.post("/", createProjet);
router.get("/:id", getProjet);
router.patch("/:id", updateProjet);
router.post("/:id/archivage", archiveProjet);
router.post("/:id/membres", addMember);
router.delete("/:id/membres/:utilisateurId", removeMember);
router.post("/:id/taches", createTask);
router.patch("/:id/taches/:taskId", updateTask);
router.delete("/:id/taches/:taskId", deleteTask);
router.put("/:id/documentation", saveDocumentation);
router.get("/:id/documentation/export", exportDocumentation);
router.get("/:id/reservations", listReservations);
router.post("/:id/reservations", createReservation);
router.patch("/:id/reservations/:reservationId", updateReservation);
router.post("/:id/reservations/:reservationId/annulation", cancelReservation);

export default router;
