import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", requireSession, getDashboard);

export default router;
