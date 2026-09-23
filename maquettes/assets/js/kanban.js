(function () {
  const board = document.getElementById("kanban-board");
  if (!board) return;

  const data = window.StockFlowData.kanbanParProjet[window.PROJET_REF];
  if (!data) return;
  // US-19 CA4 : seuls un membre du projet ou l'administrateur peuvent déplacer les cartes.
  // US-20 CA5 : plus aucune modification possible une fois le projet clôturé/archivé.
  function peutModifierKanban() {
    const projet = window.StockFlowData.projets.find((p) => p.id === window.PROJET_REF);
    if (projet && window.StockFlowData.estProjetArchive(projet)) return false;
    const role = window.StockFlowRole.get();
    if (role === "administrateur") return true;
    if (role === "gestionnaire") return false;
    return window.StockFlowData.estMembreProjet(window.PROJET_REF, window.StockFlowRole.nom());
  }

  const panelTitle = document.querySelector("[data-panel-field='title']");
  const panelTag = document.querySelector("[data-panel-field='tag']");
  const panelDue = document.querySelector("[data-panel-field='due']");
  const panelAssignee = document.querySelector("[data-panel-field='assignee']");

  function cardEl(colId, task) {
    const el = document.createElement("div");
    el.className = "kcard";
    el.draggable = peutModifierKanban();
    el.dataset.taskId = task.id;
    el.dataset.colId = colId;
    el.innerHTML = `
      <span class="badge badge-${task.tag.tone}">${task.tag.label}</span>
      <div class="kcard__title">${task.title}</div>
      <div class="kcard__meta">
        <span class="kcard__due">${task.due}</span>
        <span class="kcard__avatar">${task.assignee}</span>
      </div>
    `;

    el.addEventListener("dragstart", () => {
      el.classList.add("is-dragging");
      el.dataset.dragging = "true";
    });
    el.addEventListener("dragend", () => el.classList.remove("is-dragging"));

    el.addEventListener("click", () => {
      panelTitle.value = task.title;
      panelTag.innerHTML = `<span class="badge badge-${task.tag.tone}">${task.tag.label}</span>`;
      panelDue.value = task.due;
      panelAssignee.value = task.assignee;
      document.querySelector(".panel-scrim").classList.add("is-open");
      window.StockFlowDialog.open(document.getElementById("kanban-detail-panel"));
    });

    return el;
  }

  function render() {
    board.innerHTML = "";
    Object.entries(data).forEach(([colId, col]) => {
      const colEl = document.createElement("div");
      colEl.className = "kanban-col";
      colEl.innerHTML = `
        <div class="kanban-col__head">
          <span class="kanban-col__title">${col.title}</span>
          <span class="kanban-col__count">${col.tasks.length}</span>
        </div>
      `;
      const list = document.createElement("div");
      list.className = "kanban-col__list";
      list.dataset.colId = colId;
      col.tasks.forEach((t) => list.appendChild(cardEl(colId, t)));
      colEl.appendChild(list);
      board.appendChild(colEl);

      list.addEventListener("dragover", (e) => {
        e.preventDefault();
        list.classList.add("is-dragover");
      });
      list.addEventListener("dragleave", () => list.classList.remove("is-dragover"));
      list.addEventListener("drop", (e) => {
        e.preventDefault();
        list.classList.remove("is-dragover");
        if (!peutModifierKanban()) return;
        const dragging = board.querySelector(".is-dragging");
        if (!dragging) return;
        const fromCol = dragging.dataset.colId;
        const taskId = dragging.dataset.taskId;
        if (fromCol === colId) return;
        const idx = data[fromCol].tasks.findIndex((t) => t.id === taskId);
        const [task] = data[fromCol].tasks.splice(idx, 1);
        data[colId].tasks.push(task);
        render();
        if (typeof window.onTacheDeplacee === "function") window.onTacheDeplacee(task, fromCol, colId);
      });
    });

    if (typeof window.onKanbanChange === "function") window.onKanbanChange(data);
  }

  render();
  document.addEventListener("rolechange", render);
  // Permet à projet-detail.html de forcer un nouveau rendu (ex. juste après une clôture manuelle,
  // pour verrouiller immédiatement le glisser-déposer sans attendre un changement de rôle).
  window.rafraichirKanbanLecture = render;
})();
