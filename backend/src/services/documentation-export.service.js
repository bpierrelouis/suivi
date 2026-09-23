import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

function inlineRuns(text) {
  const runs = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > position) runs.push(new TextRun(text.slice(position, match.index)));
    const token = match[0];
    if (token.startsWith("**")) runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    else if (token.startsWith("*")) runs.push(new TextRun({ text: token.slice(1, -1), italics: true }));
    else runs.push(new TextRun({ text: token.slice(1, -1), font: "Consolas" }));
    position = match.index + token.length;
  }
  if (position < text.length) runs.push(new TextRun(text.slice(position)));
  return runs.length ? runs : [new TextRun("")];
}

export function markdownToParagraphs(markdown) {
  return markdown.split(/\r?\n/).map((line) => {
    if (line.startsWith("### ")) return new Paragraph({ heading: HeadingLevel.HEADING_3, children: inlineRuns(line.slice(4)) });
    if (line.startsWith("## ")) return new Paragraph({ heading: HeadingLevel.HEADING_2, children: inlineRuns(line.slice(3)) });
    if (line.startsWith("# ")) return new Paragraph({ heading: HeadingLevel.HEADING_1, children: inlineRuns(line.slice(2)) });
    if (/^[-*]\s+/.test(line)) {
      return new Paragraph({ bullet: { level: 0 }, children: inlineRuns(line.replace(/^[-*]\s+/, "")) });
    }
    return new Paragraph({ children: inlineRuns(line), spacing: { after: line ? 140 : 0 } });
  });
}

export async function exportDocumentationDocx(projet) {
  const document = new Document({
    styles: {
      default: { document: { run: { font: "Aptos", size: 22, color: "000000" } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { color: "000000", size: 42 }, paragraph: { spacing: { after: 180 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { color: "000000", size: 32, bold: true }, paragraph: { spacing: { before: 280, after: 140 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { color: "000000", size: 27, bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", run: { color: "000000", size: 24, bold: true }, paragraph: { spacing: { before: 200, after: 100 } } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 } } },
      children: [
        new Paragraph({ text: projet.nom, heading: HeadingLevel.TITLE }),
        new Paragraph({
          children: [new TextRun({ text: "Documentation du projet", italics: true })],
          spacing: { after: 360 },
        }),
        ...markdownToParagraphs(projet.documentation.contenu || ""),
      ],
    }],
  });
  return Packer.toBuffer(document);
}

export function documentationFilename(nom) {
  const safeName = nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "projet";
  return `${safeName}-documentation.docx`;
}
