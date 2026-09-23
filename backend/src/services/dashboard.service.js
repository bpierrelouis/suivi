const PROJETS_DEMO = [
  {
    id: "PRJ-001",
    nom: "Modernisation du laboratoire",
    visibilite: "public",
    statut: "actif",
    progression: 64,
    membres: ["lea.fournier@demo.local"],
  },
  {
    id: "PRJ-002",
    nom: "Migration des postes de mesure",
    visibilite: "prive",
    statut: "actif",
    progression: 35,
    membres: ["lea.fournier@demo.local"],
  },
  {
    id: "PRJ-003",
    nom: "Réorganisation du stock",
    visibilite: "prive",
    statut: "actif",
    progression: 82,
    membres: ["marc.vidal@demo.local"],
  },
];

const MATERIELS_RECENTS = [
  { id: "MAT-1042", nom: "Oscilloscope numérique", categorie: "Mesure" },
  { id: "MAT-1041", nom: "Station de soudage", categorie: "Atelier" },
  { id: "MAT-1040", nom: "Ordinateur portable", categorie: "Informatique" },
];

export function projetsVisibles(utilisateur, projets = PROJETS_DEMO) {
  if (utilisateur.role === "gestionnaire") return [];
  if (utilisateur.role === "administrateur") return projets.map(({ membres, ...projet }) => projet);

  return projets
    .filter((projet) => projet.visibilite === "public" || projet.membres.includes(utilisateur.identifiant))
    .map(({ membres, ...projet }) => projet);
}

export function buildDashboard(utilisateur) {
  const projets = projetsVisibles(utilisateur);
  return {
    utilisateur,
    indicateurs: {
      projetsActifs: projets.length,
      materielsActifs: 48,
      alertesInventaire: utilisateur.role === "utilisateur" ? null : 3,
    },
    projets,
    materielsRecents: MATERIELS_RECENTS,
    accesDirectInventaire: utilisateur.role === "administrateur",
  };
}
