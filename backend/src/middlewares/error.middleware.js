export function notFound(req, res) {
  res.status(404).json({ error: "RESSOURCE_INTROUVABLE" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error);
  res.status(500).json({ error: "ERREUR_INTERNE" });
}
