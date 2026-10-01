import { Router } from "express";
import { create, deactivate, list, reactivate, update, updateRole } from "../controllers/utilisateur.controller.js";
import { requireRole, requireSession } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireSession);
router.get("/", requireRole("administrateur", "utilisateur"), list);
router.post("/", requireRole("administrateur"), create);
router.patch("/:id", requireRole("administrateur"), update);
router.patch("/:id/role", requireRole("administrateur"), updateRole);
router.delete("/:id", requireRole("administrateur"), deactivate);
router.post("/:id/reactivation", requireRole("administrateur"), reactivate);

export default router;
