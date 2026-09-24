import test from "node:test";
import assert from "node:assert/strict";
import { createInventoryPdf, createInventoryXlsx, prepareInventoryRows } from "../src/services/inventory-export.service.js";

const item = {
  nom: "Oscilloscope précision", modeSuivi: "individualise", numeroInventaire: "INV-42", numeroSerie: "SER-42", referenceConstructeur: "MSO-4",
  categories: [{ categorie: { nom: "Mesure" } }],
  reservations: [{ fin: new Date("2030-01-01T12:00:00Z"), projet: { nom: "Projet secret" } }],
};

test("l'export gestionnaire masque le nom du projet", () => {
  const [row] = prepareInventoryRows([item], { role: "gestionnaire" });
  assert.equal(row.projet, "Réservé");
  assert.equal(row.disponibilite, "Réservé");
});

test("le classeur Excel est généré avec une signature XLSX valide", async () => {
  const rows = prepareInventoryRows([item], { role: "administrateur" });
  const buffer = await createInventoryXlsx(rows, {}, "all");
  assert.equal(buffer.subarray(0, 2).toString(), "PK");
  assert.ok(buffer.length > 5_000);
});

test("le PDF est généré avec une signature valide", async () => {
  const rows = prepareInventoryRows([item], { role: "administrateur" });
  const buffer = await createInventoryPdf(rows, {}, "all");
  assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
  assert.ok(buffer.length > 1_000);
});
