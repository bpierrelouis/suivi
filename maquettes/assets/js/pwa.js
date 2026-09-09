(function () {
  const root = document.body.dataset.rootPrefix || "";

  // --- Service worker registration (offline app-shell caching) ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(root + "service-worker.js").catch(() => {
        /* dev server without HTTPS/localhost — safe to ignore in the prototype */
      });
    });
  }

  // --- "Installer l'application" banner ---
  let deferredPrompt = null;
  const installBanner = document.getElementById("pwa-install-banner");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner?.classList.add("is-visible");
  });

  document.addEventListener("click", async (e) => {
    if (e.target.closest("[data-pwa-install]")) {
      if (!deferredPrompt) return;
      installBanner?.classList.remove("is-visible");
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
    if (e.target.closest("[data-pwa-dismiss]")) {
      installBanner?.classList.remove("is-visible");
    }
  });

  window.addEventListener("appinstalled", () => {
    installBanner?.classList.remove("is-visible");
  });

  // --- Offline / online banner ---
  const offlineBanner = document.getElementById("pwa-offline-banner");
  function syncOnlineState() {
    if (!offlineBanner) return;
    offlineBanner.classList.toggle("is-visible", !navigator.onLine);
  }
  window.addEventListener("online", syncOnlineState);
  window.addEventListener("offline", syncOnlineState);
  syncOnlineState();
})();
