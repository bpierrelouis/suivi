function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
}

export function renderMarkdown(source = "") {
  const html = [];
  let listOpen = false;
  const closeList = () => { if (listOpen) { html.push("</ul>"); listOpen = false; } };
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (/^###\s+/.test(line)) { closeList(); html.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (/^##\s+/.test(line)) { closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^#\s+/.test(line)) { closeList(); html.push(`<h1>${inline(line.slice(2))}</h1>`); }
    else if (/^[-*]\s+/.test(line)) {
      if (!listOpen) { html.push("<ul>"); listOpen = true; }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (line) { closeList(); html.push(`<p>${inline(line)}</p>`); }
    else closeList();
  }
  closeList();
  return html.join("\n");
}
