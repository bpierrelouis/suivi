(function () {
  const STORAGE_KEY = "stockflow-theme";
  const root = document.documentElement;

  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    document.querySelectorAll("[data-theme-icon]").forEach((btn) => {
      const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      btn.setAttribute("aria-pressed", String(isDark));
    });
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  apply(saved);

  window.StockFlowTheme = {
    toggle() {
      const current = localStorage.getItem(STORAGE_KEY);
      const isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const next = isDark ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
    },
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (btn) window.StockFlowTheme.toggle();
  });
})();
