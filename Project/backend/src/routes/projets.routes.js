import { Router } from "express";
import { listProjets, getProjet, createProjet, updateProjet, archiveProjet } from "../controllers/projets.controller.js";

const router = Router();

router.get("/projets", listProjets);
router.get("/projets/:id", getProjet);
router.post("/projets", createProjet);
router.put("/projets/:id", updateProjet);
router.delete("/projets/:id", archiveProjet);

export default router;
