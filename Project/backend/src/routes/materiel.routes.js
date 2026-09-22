import { Router } from "express";
import { listMateriel, createMateriel, updateMateriel, archiveMateriel } from "../controllers/materiel.controller.js";

const router = Router();

router.get("/materiel", listMateriel);
router.post("/materiel", createMateriel);
router.put("/materiel/:id", updateMateriel);
router.delete("/materiel/:id", archiveMateriel);

export default router;
