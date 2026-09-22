import { Router } from "express";
import { listTachesParProjet, createTache, updateTache, deleteTache } from "../controllers/taches.controller.js";

const router = Router();

router.get("/projets/:projetId/taches", listTachesParProjet);
router.post("/projets/:projetId/taches", createTache);
router.put("/taches/:id", updateTache);
router.delete("/taches/:id", deleteTache);

export default router;
