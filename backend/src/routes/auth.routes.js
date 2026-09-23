import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.get("/me", requireSession, me);
router.post("/logout", requireSession, logout);

export default router;
