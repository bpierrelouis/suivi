import { Outlet, redirect } from "react-router-dom";
import { isAuthenticated } from "../services/auth.js";

export async function loadAppLayout() {
  if (!isAuthenticated()) {
    throw redirect("/login");
  }
  return null;
}

export default function AppLayout() {
   return (
    <div className="app">
        <aside class="sidebar">
            <div class="sidebar__brand">
                <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>
                SUIVI
                <button class="iconbtn hide-mobile" style="display:none"></button>
                <button class="iconbtn" style="margin-left:auto; border:none; background:transparent; color:#94a3b8;" data-menu-close aria-label="Fermer le menu">
                <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
            </div>
            <nav class="sidebar__nav" aria-label="Navigation principale">
                <a class="navlink" linkTo="/dashboard" aria-current="page">
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="12" width="8" height="9" rx="1.5"/><rect x="3" y="15" width="8" height="6" rx="1.5"/></svg>
                    Tableau de bord
                </a>
                <a class="navlink" linkTo="/projets">
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
                    Projets
                </a>
                <a class="navlink" linkTo="/inventaire">
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></svg>
                    Inventaire
                </a>
                <a class="navlink" linkTo="/utilisateurs">
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="18" cy="9" r="2.3"/><path d="M15.8 14.2c2.7.4 4.7 2.3 4.7 5.3"/></svg>
                    Utilisateurs
                </a>
                <a class="navlink" linkTo="/parametres">
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></svg>
                    Paramètres
                </a>
            </nav>
            <div class="sidebar__footer">
                <button class="userchip" data-menu-close>
                    <span class="userchip__avatar">AS</span>
                    <span class="userchip__meta">
                        <span class="userchip__name">Alexandre S.</span>
                        <span class="userchip__role">Administrateur</span>
                    </span>
                </button>
                <button class="navlink" style={{ marginTop: "4px", width: "100%", background: "none", border: "none", cursor: "pointer" }} data-logout>
                    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Déconnexion
                </button>
            </div>
        </aside>
      <Outlet />
    </div>
  );
}