import { Router } from "express";
import { listUtilisateurs, createUtilisateur, updateUtilisateur } from "../controllers/utilisateurs.controller.js";

const router = Router();

router.get("/utilisateurs", listUtilisateurs);
router.post("/utilisateurs", createUtilisateur);
router.put("/utilisateurs/:id", updateUtilisateur);

export default router;
