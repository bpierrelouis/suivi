/* Rendu Markdown minimal pour l'aperçu de la documentation projet (US-32).
   Syntaxe volontairement limitée : titres, gras/italique, liens, listes, code —
   le périmètre exact reste une question ouverte (Q-28, docs/decisions-et-questions.md). */
function renderMarkdown(source) {
  const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = escapeHtml(source || "").split("\n");
  const html = [];
  let inList = false;
  let inCode = false;

  const inline = (text) =>
    text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      html.push(inCode ? "<pre><code>" : "</code></pre>");
      continue;
    }
    if (inCode) {
      html.push(rawLine + "\n");
      continue;
    }

    if (/^###\s+/.test(line)) { closeList(); html.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`); continue; }
    if (/^##\s+/.test(line)) { closeList(); html.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`); continue; }
    if (/^#\s+/.test(line)) { closeList(); html.push(`<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`); continue; }

    if (/^[-*]\s+/.test(line)) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    closeList();

    if (line.trim() === "") { html.push(""); continue; }
    html.push(`<p>${inline(line)}</p>`);
  }
  closeList();

  return html.join("\n");
}
