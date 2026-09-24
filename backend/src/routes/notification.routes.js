import { Router } from "express";
import { listNotifications, markNotificationRead } from "../controllers/notification.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(requireSession);
router.get("/", listNotifications);
router.patch("/:id/lu", markNotificationRead);
export default router;
