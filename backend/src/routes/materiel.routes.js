import express, { Router } from "express";
import { addAttachment, createCategory, createMateriel, deleteCategory, downloadAttachment, getHistory, getMateriel, listCategories, listMateriels, removeAttachment, updateCategory, updateMateriel } from "../controllers/materiel.controller.js";
import { requireSession } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireSession);
router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/", listMateriels);
router.post("/", createMateriel);
router.get("/:id", getMateriel);
router.patch("/:id", updateMateriel);
router.get("/:id/historique", getHistory);
router.post("/:id/pieces-jointes", express.raw({ type: ["application/pdf", "image/jpeg", "image/png"], limit: "10mb" }), addAttachment);
router.get("/:id/pieces-jointes/:pieceId", downloadAttachment);
router.delete("/:id/pieces-jointes/:pieceId", removeAttachment);
export default router;
