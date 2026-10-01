export function etatTag(projet) {
  if (projet.statut === "archive") return "cloture";
  if (!projet.dateDebut || new Date(projet.dateDebut) > new Date()) return "en_attente";
  return "actif";
}
