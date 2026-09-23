/* Cloche de notifications (US-27, US-28) — injectée dans la barre du haut de chaque page pour
   éviter de dupliquer le même balisage manuellement sur 8 fichiers HTML. Nécessite data.js et
   role.js déjà chargés. */
(function () {
  function utilisateurCourant() {
    return window.StockFlowData.utilisateurs.find((u) => u.nom === window.StockFlowRole.nom());
  }

  function nombreNonLues() {
    if (!window.StockFlowData || !window.StockFlowRole) return 0;
    const u = utilisateurCourant();
    if (!u) return 0;
    return window.StockFlowData.notificationsDe(u.id).filter((n) => !n.lu).length;
  }

  function rafraichir() {
    const badge = document.getElementById("cloche-notifications-badge");
    if (!badge) return;
    const n = nombreNonLues();
    badge.textContent = n > 9 ? "9+" : String(n);
    badge.style.display = n > 0 ? "flex" : "none";
  }
  window.rafraichirClocheNotifications = rafraichir;

  document.addEventListener("DOMContentLoaded", () => {
    const actions = document.querySelector(".topbar__actions");
    if (!actions || document.getElementById("cloche-notifications")) return;

    const bouton = document.createElement("button");
    bouton.className = "iconbtn";
    bouton.id = "cloche-notifications";
    bouton.setAttribute("aria-label", "Notifications");
    bouton.style.position = "relative";
    bouton.innerHTML = `
      <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
      <span id="cloche-notifications-badge" style="display:none; position:absolute; top:2px; right:2px; min-width:15px; height:15px; padding:0 3px; border-radius:999px; background:var(--danger); color:#fff; font-size:10px; font-weight:700; line-height:15px; text-align:center;"></span>
    `;
    // Comportement volontairement identique aux liens de la barre latérale : cliquer sur la cloche
    // depuis la page Notifications recharge simplement la page (comme un lien "actif" classique).
    bouton.addEventListener("click", () => { window.location.href = "notifications.html"; });
    actions.insertBefore(bouton, actions.firstChild);

    rafraichir();
    document.addEventListener("rolechange", rafraichir);
  });
})();
