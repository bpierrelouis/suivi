import { AppError } from "../errors/app.error.js";

export function notFound(req, res) {
  res.status(404).json({ error: "RESSOURCE_INTROUVABLE" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ error: "FICHIER_TROP_VOLUMINEUX" });
  }
  if (error instanceof AppError) {
    return res.status(error.status).json({ error: error.code });
  }
  if (error?.code === "P2002") {
    return res.status(409).json({ error: "CONFLIT_UNICITE" });
  }
  console.error(error);
  res.status(500).json({ error: "ERREUR_INTERNE" });
}
