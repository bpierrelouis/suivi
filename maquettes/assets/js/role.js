/* Sélecteur de rôle de démonstration — permet de montrer les droits admin/gestionnaire/utilisateur
   sans vrai système d'authentification multi-compte dans cette maquette statique. */
(function () {
  const PERSONAS = {
    administrateur: { nom: "Alexandre S.", initiales: "AS", label: "Administrateur" },
    gestionnaire: { nom: "Camille Doré", initiales: "CD", label: "Gestionnaire" },
    utilisateur: { nom: "Léa Fournier", initiales: "LF", label: "Utilisateur" },
  };
  const STORAGE_KEY = "SUIVI-role-demo";

  // Droits réservés à l'administrateur et au gestionnaire (US-06, US-07, US-08, US-12, US-13, US-33) —
  // l'utilisateur simple reste en lecture seule sur l'inventaire.
  const ACTIONS_ADMIN_GESTIONNAIRE = [
    "materiel:creer",
    "materiel:modifier",
    "materiel:historique",
    "materiel:piece-jointe:gerer",
    "materiel:exporter",
    "categorie:gerer",
  ];

  function getRole() {
    return localStorage.getItem(STORAGE_KEY) || "administrateur";
  }

  function applyPersona(role) {
    const p = PERSONAS[role] || PERSONAS.administrateur;
    const avatarEl = document.getElementById("role-avatar");
    const nameEl = document.getElementById("role-name");
    const selectEl = document.getElementById("role-switcher");
    if (avatarEl) avatarEl.textContent = p.initiales;
    if (nameEl) nameEl.textContent = p.nom;
    if (selectEl) selectEl.value = role;
    applyNavVisibility(role);
  }

  // Masquage des liens de navigation selon le rôle (US-03 CA1 : seul l'administrateur gère les
  // utilisateurs ; US-04 CA2 : le gestionnaire n'a accès à aucun projet).
  function applyNavVisibility(role) {
    document.querySelectorAll(".sidebar__nav .navlink[href]").forEach((link) => {
      const href = link.getAttribute("href");
      let masquer = false;
      if (href === "projets.html" && role === "gestionnaire") masquer = true;
      if (href === "utilisateurs.html" && role !== "administrateur") masquer = true;
      link.style.display = masquer ? "none" : "";
    });
  }

  function setRole(role) {
    localStorage.setItem(STORAGE_KEY, role);
    applyPersona(role);
    document.dispatchEvent(new CustomEvent("rolechange", { detail: { role } }));
  }

  window.StockFlowRole = {
    get: getRole,
    set: setRole,
    label: (role) => (PERSONAS[role || getRole()] || PERSONAS.administrateur).label,
    nom: (role) => (PERSONAS[role || getRole()] || PERSONAS.administrateur).nom,
    peut(action) {
      if (ACTIONS_ADMIN_GESTIONNAIRE.includes(action)) {
        const role = getRole();
        return role === "administrateur" || role === "gestionnaire";
      }
      return true;
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyPersona(getRole());
    const selectEl = document.getElementById("role-switcher");
    if (selectEl) selectEl.addEventListener("change", (e) => setRole(e.target.value));
  });
})();
