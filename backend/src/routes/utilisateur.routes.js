import { Router } from "express";
import { list, updateGestionnaire } from "../controllers/utilisateur.controller.js";
import { requireRole, requireSession } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireSession);
router.get("/", requireRole("administrateur", "utilisateur"), list);
router.patch("/:id/gestionnaire", requireRole("administrateur"), updateGestionnaire);

export default router;
