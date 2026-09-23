(function () {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-logout]")) {
      const base = document.body.dataset.rootPrefix || "";
      window.location.href = base + "index.html";
    }
  });
})();
