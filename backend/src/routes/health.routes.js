import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/live", (req, res) => res.json({ status: "ok" }));
router.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "unreachable" });
  }
});

export default router;
