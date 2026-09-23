import test from "node:test";
import assert from "node:assert/strict";
import {
  documentationFilename,
  exportDocumentationDocx,
  markdownToParagraphs,
} from "../src/services/documentation-export.service.js";

test("le nom du fichier DOCX est sûr et lisible", () => {
  assert.equal(documentationFilename("Étude & Mesures 2026"), "etude-mesures-2026-documentation.docx");
});

test("le Markdown produit des paragraphes Word", () => {
  assert.equal(markdownToParagraphs("# Titre\n\n- Élément").length, 3);
});

test("l'export produit un document Office Open XML", async () => {
  const buffer = await exportDocumentationDocx({
    nom: "Projet de test",
    documentation: { contenu: "# Objectif\n\nUn texte **important**.\n\n- Premier point" },
  });
  assert.ok(buffer.length > 1_000);
  assert.equal(buffer.subarray(0, 2).toString(), "PK");
});
