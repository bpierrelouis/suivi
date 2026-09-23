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
} from "../controllers/projet.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireSession);
router.get("/", listProjets);
router.post("/", createProjet);
router.get("/:id", getProjet);
router.patch("/:id", updateProjet);
router.post("/:id/membres", addMember);
router.delete("/:id/membres/:utilisateurId", removeMember);
router.post("/:id/taches", createTask);
router.patch("/:id/taches/:taskId", updateTask);
router.delete("/:id/taches/:taskId", deleteTask);
router.put("/:id/documentation", saveDocumentation);
router.get("/:id/documentation/export", exportDocumentation);

export default router;
