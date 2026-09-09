(function () {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-menu-open]")) {
      document.querySelector(".sidebar")?.classList.add("is-open");
      document.querySelector(".sidebar-scrim")?.classList.add("is-open");
    }
    if (e.target.closest("[data-menu-close]") || e.target.matches(".sidebar-scrim")) {
      document.querySelector(".sidebar")?.classList.remove("is-open");
      document.querySelector(".sidebar-scrim")?.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelector(".sidebar")?.classList.remove("is-open");
      document.querySelector(".sidebar-scrim")?.classList.remove("is-open");
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-logout]")) {
      const base = document.body.dataset.rootPrefix || "";
      window.location.href = base + "index.html";
    }
  });
})();
