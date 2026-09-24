import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

function displayMode(value) { return value === "individualise" ? "Individualisé" : "Non individualisé"; }
function filterSummary(filters, scope) {
  if (scope === "all") return "Inventaire actif complet";
  const active = [
    filters.recherche && `recherche « ${filters.recherche} »`,
    filters.categorieNom && `catégorie ${filters.categorieNom}`,
    filters.modeSuivi && `mode ${displayMode(filters.modeSuivi)}`,
  ].filter(Boolean);
  return active.length ? `Résultats filtrés : ${active.join(", ")}` : "Inventaire actif complet";
}

export function prepareInventoryRows(items, user) {
  return items.map((item) => {
    const reservation = item.reservations?.[0];
    return {
      nom: item.nom,
      mode: displayMode(item.modeSuivi),
      numeroInventaire: item.numeroInventaire || "",
      numeroSerie: item.numeroSerie || "",
      referenceConstructeur: item.referenceConstructeur || "",
      categories: item.categories.map(({ categorie }) => categorie.nom).join(", "),
      disponibilite: reservation ? "Réservé" : "Disponible",
      projet: reservation ? (user.role === "administrateur" ? reservation.projet.nom : "Réservé") : "",
      finReservation: reservation?.fin || null,
    };
  });
}

export async function createInventoryXlsx(rows, filters = {}, scope = "filtered") {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SUIVI";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Inventaire", { views: [{ state: "frozen", ySplit: 5 }] });
  sheet.mergeCells("A1:I1");
  sheet.getCell("A1").value = "Inventaire actif du laboratoire";
  sheet.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF17325C" } };
  sheet.getCell("A1").alignment = { vertical: "middle" };
  sheet.getRow(1).height = 30;
  sheet.mergeCells("A2:I2"); sheet.getCell("A2").value = filterSummary(filters, scope);
  sheet.mergeCells("A3:I3"); sheet.getCell("A3").value = `Généré le ${dateFormatter.format(new Date())} · ${rows.length} matériel${rows.length > 1 ? "s" : ""}`;
  sheet.getCell("A2").font = { italic: true, color: { argb: "FF536078" } };
  sheet.getCell("A3").font = { color: { argb: "FF536078" } };
  sheet.getRow(5).values = ["Nom", "Mode de suivi", "N° inventaire", "N° série", "Référence constructeur", "Catégories", "Disponibilité actuelle", "Projet", "Fin de réservation"];
  sheet.getRow(5).eachCell((cell) => { cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2F6FDC" } }; cell.alignment = { wrapText: true, vertical: "middle" }; });
  sheet.getRow(5).height = 28;
  for (const row of rows) sheet.addRow([row.nom, row.mode, row.numeroInventaire, row.numeroSerie, row.referenceConstructeur, row.categories, row.disponibilite, row.projet, row.finReservation]);
  sheet.columns = [{ width: 27 }, { width: 19 }, { width: 17 }, { width: 17 }, { width: 22 }, { width: 26 }, { width: 21 }, { width: 28 }, { width: 20 }];
  for (let index = 6; index <= sheet.rowCount; index += 1) {
    const row = sheet.getRow(index);
    row.alignment = { vertical: "top", wrapText: true };
    row.eachCell((cell) => { cell.border = { bottom: { style: "hair", color: { argb: "FFD9E1EC" } } }; });
    if (row.getCell(9).value) row.getCell(9).numFmt = "dd/mm/yyyy hh:mm";
    row.getCell(7).font = { bold: true, color: { argb: row.getCell(7).value === "Disponible" ? "FF087151" : "FF9B5A08" } };
  }
  if (sheet.rowCount >= 5) sheet.autoFilter = { from: "A5", to: `I${Math.max(5, sheet.rowCount)}` };
  sheet.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9, margins: { left: 0.3, right: 0.3, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export function createInventoryPdf(rows, filters = {}, scope = "filtered") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 32, bufferPages: true, info: { Title: "Inventaire actif du laboratoire", Author: "SUIVI" } });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk)); doc.on("end", () => resolve(Buffer.concat(chunks))); doc.on("error", reject);
    const columns = [150, 90, 80, 80, 105, 125, 80, 100];
    const headers = ["Matériel", "Mode", "N° inventaire", "N° série", "Référence", "Catégories", "État", "Projet / fin"];
    const x0 = 32;
    function title() {
      doc.fillColor("#17325c").font("Helvetica-Bold").fontSize(18).text("Inventaire actif du laboratoire");
      doc.moveDown(0.25).fillColor("#536078").font("Helvetica").fontSize(9).text(filterSummary(filters, scope));
      doc.text(`Généré le ${dateFormatter.format(new Date())} · ${rows.length} matériel${rows.length > 1 ? "s" : ""}`);
      doc.moveDown(0.7);
    }
    function tableHeader() {
      const y = doc.y; let x = x0;
      for (let i = 0; i < headers.length; i += 1) { doc.rect(x, y, columns[i], 25).fillAndStroke("#2f6fdc", "#ffffff"); doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(7.5).text(headers[i], x + 4, y + 7, { width: columns[i] - 8 }); x += columns[i]; }
      doc.y = y + 25;
    }
    function pageBreak() { doc.addPage(); title(); tableHeader(); }
    title(); tableHeader();
    for (const row of rows) {
      const cells = [row.nom, row.mode, row.numeroInventaire || "—", row.numeroSerie || "—", row.referenceConstructeur || "—", row.categories || "—", row.disponibilite, row.projet ? `${row.projet}${row.finReservation ? `\nJusqu’au ${dateFormatter.format(row.finReservation)}` : ""}` : "—"];
      const height = Math.max(27, ...cells.map((value, index) => doc.heightOfString(String(value), { width: columns[index] - 8 }) + 10));
      if (doc.y + height > doc.page.height - 38) pageBreak();
      const y = doc.y; let x = x0;
      for (let i = 0; i < cells.length; i += 1) { doc.rect(x, y, columns[i], height).stroke("#d9e1ec"); doc.fillColor(i === 6 && row.disponibilite === "Disponible" ? "#087151" : "#26354f").font(i === 0 || i === 6 ? "Helvetica-Bold" : "Helvetica").fontSize(7.5).text(String(cells[i]), x + 4, y + 5, { width: columns[i] - 8 }); x += columns[i]; }
      doc.y = y + height;
    }
    const range = doc.bufferedPageRange();
    for (let index = range.start; index < range.start + range.count; index += 1) {
      doc.switchToPage(index);
      doc.font("Helvetica").fontSize(7).fillColor("#657188").text(`Page ${index + 1} / ${range.count}`, 32, doc.page.height - 44, { align: "right", width: doc.page.width - 64, lineBreak: false });
    }
    doc.end();
  });
}

export function inventoryExportFilename(format) {
  const date = new Date().toISOString().slice(0, 10);
  return `inventaire-actif-${date}.${format === "xlsx" ? "xlsx" : "pdf"}`;
}
