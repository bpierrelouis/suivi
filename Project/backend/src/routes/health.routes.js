import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "error", database: "unreachable", message: err.message });
  }
});

export default router;
