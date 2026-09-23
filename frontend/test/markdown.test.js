import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../src/utils/markdown.js";

describe("renderMarkdown", () => {
  it("rend les titres et les listes", () => {
    const html = renderMarkdown("# Titre\n\n- Élément");
    expect(html).toContain("<h1>Titre</h1>");
    expect(html).toContain("<li>Élément</li>");
  });

  it("neutralise le HTML et les liens non sûrs", () => {
    const html = renderMarkdown('<img src=x>\n[ouvrir](javascript:alert(1))');
    expect(html).toContain("&lt;img src=x&gt;");
    expect(html).not.toContain('href="javascript:');
  });
});
