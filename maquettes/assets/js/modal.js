/* Generic modal / side-panel / tabs behaviour, driven by data-attributes.
   Also handles focus trapping and focus restoration for dialogs (WCAG 2.4.3 / 2.1.2). */
(function () {
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let lastFocusedEl = null;
  let activeDialog = null;

  function focusablesIn(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
  }

  function openDialog(container) {
    if (!container) return;
    lastFocusedEl = document.activeElement;
    activeDialog = container;
    container.classList.add("is-open");
    const focusables = focusablesIn(container);
    (focusables[0] || container).focus({ preventScroll: true });
  }

  function closeDialog(container) {
    if (!container) return;
    container.classList.remove("is-open");
    if (activeDialog === container) activeDialog = null;
    if (lastFocusedEl && document.contains(lastFocusedEl)) lastFocusedEl.focus({ preventScroll: true });
    lastFocusedEl = null;
  }

  window.StockFlowDialog = { open: openDialog, close: closeDialog };

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-modal-open]");
    if (opener) {
      const scrim = document.getElementById(opener.getAttribute("data-modal-open"));
      if (scrim) {
        const titleField = scrim.querySelector("[data-modal-title]");
        if (titleField && opener.dataset.modalTitle) titleField.textContent = opener.dataset.modalTitle;
        openDialog(scrim);
      }
    }

    const closer = e.target.closest("[data-modal-close]");
    if (closer) closeDialog(closer.closest(".modal-scrim"));
    if (e.target.classList.contains("modal-scrim")) closeDialog(e.target);

    const panelCloser = e.target.closest("[data-panel-close]");
    if (panelCloser) {
      closeDialog(panelCloser.closest(".panel"));
      document.querySelector(".panel-scrim")?.classList.remove("is-open");
    }
    if (e.target.classList.contains("panel-scrim")) {
      document.querySelectorAll(".panel.is-open").forEach(closeDialog);
      e.target.classList.remove("is-open");
    }

    const tab = e.target.closest("[data-tab]");
    if (tab) {
      const group = tab.closest("[data-tabs]");
      group.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      const targetId = tab.getAttribute("data-tab");
      group.parentElement.querySelectorAll("[data-tab-panel]").forEach((p) => {
        p.classList.toggle("is-active", p.getAttribute("data-tab-panel") === targetId);
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-scrim.is-open").forEach(closeDialog);
      document.querySelectorAll(".panel.is-open").forEach(closeDialog);
      document.querySelector(".panel-scrim")?.classList.remove("is-open");
      return;
    }

    if (e.key === "Tab" && activeDialog) {
      const focusables = focusablesIn(activeDialog);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-mock-form]")) {
      e.preventDefault();
      const scrim = e.target.closest(".modal-scrim");
      if (scrim) closeDialog(scrim);
    }
  });
})();
