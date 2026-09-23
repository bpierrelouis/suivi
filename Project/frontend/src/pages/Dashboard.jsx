import { useLoaderData } from "react-router-dom";

// Cette fonction n'est PAS un composant React — c'est appelée par React Router avant l'affichage
export async function loadDashboardData() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projets`);
  if (!res.ok) throw new Response("Erreur de chargement", { status: res.status });
  return res.json();
}

export default function Dashboard() {
  const projets = useLoaderData(); // récupère ce que loadDashboardData a retourné
  return (
    <div className="main">
      <header className="topbar">
        <button className="iconbtn topbar__menu-btn" data-menu-open aria-label="Ouvrir le menu">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <div className="searchbox hide-mobile">
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="search" aria-label="Rechercher un projet ou une référence" placeholder="Rechercher un projet, une référence…" />
        </div>
        <div className="topbar__spacer"></div>
        <div className="topbar__actions">
          <button className="iconbtn" data-theme-toggle data-theme-icon aria-label="Basculer le thème">
            <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/></svg>
          </button>
        </div>
      </header>

      <main className="content" id="main-content" tabindex="-1">
        <div className="page-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble de l'activité — labo SUIVI</p>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="card card-pad kpi">
            <span className="kpi__label">Projets actifs</span>
            <span className="kpi__value">3</span>
            <span className="kpi__delta up">+1 ce mois-ci</span>
          </div>
          <div className="card card-pad kpi">
            <span className="kpi__label">Réf. en stock bas</span>
            <span className="kpi__value">2</span>
            <span className="kpi__delta down">à réapprovisionner</span>
          </div>
          <div className="card card-pad kpi">
            <span className="kpi__label">Réf. en rupture</span>
            <span className="kpi__value">2</span>
            <span className="kpi__delta down">action requise</span>
          </div>
          <div className="card card-pad kpi">
            <span className="kpi__label">Utilisateurs actifs</span>
            <span className="kpi__value">5</span>
            <span className="kpi__delta up">sur 6 comptes</span>
          </div>
        </div>

        <div className="card card-pad" style={{ marginBottom: 24 }}>
          <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Projets en cours</h2>
            <a href="projets.html" style={{ fontSize: 13, fontWeight: 600 }}>Voir tout →</a>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col">Projet</th><th scope="col">Référence</th><th scope="col">Responsable</th><th scope="col">Échéance</th><th scope="col">Statut</th></tr></thead>
              <tbody id="dashboard-projets"></tbody>
            </table>
          </div>
        </div>

        <div className="card card-pad">
          <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Alertes de stock</h2>
            <a href="inventaire.html" style={{ fontSize: 13, fontWeight: 600 }}>Voir l'inventaire →</a>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col">Référence</th><th scope="col">Désignation</th><th scope="col">Stock</th><th scope="col">Seuil</th><th scope="col">Statut</th></tr></thead>
              <tbody id="dashboard-stock"></tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}