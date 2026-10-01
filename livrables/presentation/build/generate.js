const pptxgen = require("pptxgenjs");

// Palette — exactement les variables CSS de l'application (frontend/src/styles/main.css)
const C = {
  navy: "0D2046",
  bg: "F4F7FB",
  white: "FFFFFF",
  text: "152033",
  muted: "66728A",
  line: "DDE2E9",
  blue: "2864E8",
  blueDark: "1F55CC",
  blueLight: "8FB0FF",
  danger: "C42B1C",
  success: "078451",
  warning: "9B5A08",
  purple: "7138D0",
};

const FONT = "Calibri";
const FONT_HEAD = "Cambria";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in, identique aux supports existants
pres.theme = { headFontFace: FONT_HEAD, bodyFontFace: FONT };

const PAGE_W = 13.333;
const PAGE_H = 7.5;
const MARGIN = 0.6;

let pageCounter = 1; // la diapositive 1 (couverture) n'appelle pas footer()

function footer(slide, dark = false) {
  pageCounter += 1;
  slide.addText("SUIVI · Présentation projet", {
    x: MARGIN, y: PAGE_H - 0.42, w: 8, h: 0.3, fontSize: 9, fontFace: FONT,
    color: dark ? "8FA3CC" : C.muted, align: "left", isTextBox: true, margin: 0,
  });
  slide.addText(String(pageCounter).padStart(2, "0"), {
    x: PAGE_W - MARGIN - 1, y: PAGE_H - 0.42, w: 1, h: 0.3, fontSize: 9, fontFace: FONT,
    color: dark ? "8FA3CC" : C.muted, align: "right", isTextBox: true, margin: 0,
  });
}

function eyebrow(slide, text, x = MARGIN, y = 0.55, color = C.blue) {
  slide.addText(text.toUpperCase(), {
    x, y, w: 8, h: 0.35, fontSize: 12, bold: true, color, fontFace: FONT,
    charSpacing: 2, isTextBox: true, margin: 0,
  });
}

function title(slide, text, x = MARGIN, y = 0.9, w = PAGE_W - MARGIN * 2, color = C.navy, size = 30) {
  slide.addText(text, {
    x, y, w, h: 0.9, fontSize: size, bold: true, color, fontFace: FONT_HEAD,
    isTextBox: true, margin: 0, valign: "top",
  });
}

function badge(slide, x, y, diameter, text, fill, textColor = C.white, fontSize = 16) {
  slide.addShape("ellipse", { x, y, w: diameter, h: diameter, fill: { color: fill }, line: { type: "none" } });
  slide.addText(text, {
    x, y, w: diameter, h: diameter, align: "center", valign: "middle",
    fontSize, bold: true, color: textColor, fontFace: FONT, isTextBox: true, margin: 0,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: opts.fill || C.white },
    line: opts.line === false ? { type: "none" } : { color: C.line, width: 1 },
    shadow: opts.shadow === false ? undefined : {
      type: "outer", color: "1B2B4B", opacity: 0.12, blur: 10, offset: 3, angle: 90,
    },
  });
}

function bgFill(slide, color) {
  slide.background = { color };
}

// ---------------------------------------------------------------------------
// Diapositive 1 — Couverture
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.navy);

  slide.addText("PRÉSENTATION PROJET · WD12", {
    x: MARGIN, y: 0.7, w: 8, h: 0.4, fontSize: 13, bold: true, color: C.blueLight,
    charSpacing: 2, fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addText("SUIVI", {
    x: MARGIN, y: 2.5, w: 10, h: 1.6, fontSize: 80, bold: true, color: C.white,
    fontFace: FONT_HEAD, isTextBox: true, margin: 0,
  });

  slide.addText("Suivi des Usages, Inventaires, Vie des projets et IA", {
    x: MARGIN, y: 4.05, w: 10, h: 0.5, fontSize: 18, color: C.blueLight,
    fontFace: FONT, italic: true, isTextBox: true, margin: 0,
  });

  slide.addText("L'application qui réunit l'inventaire, les projets et les réservations d'un laboratoire.", {
    x: MARGIN, y: 4.6, w: 9.5, h: 0.5, fontSize: 14, color: "C7D3EA",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addText("Nom 1  ·  Nom 2  ·  Nom 3  ·  Nom 4", {
    x: MARGIN, y: 5.75, w: 8, h: 0.4, fontSize: 15, bold: true, color: C.white,
    fontFace: FONT, isTextBox: true, margin: 0,
  });
  slide.addText("Lundi 5 octobre 2026", {
    x: MARGIN, y: 6.15, w: 8, h: 0.35, fontSize: 12, color: "8FA3CC",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addText("Version de démonstration : commit c84e8af · 1er octobre 2026", {
    x: MARGIN, y: PAGE_H - 0.5, w: 8, h: 0.3, fontSize: 9, color: "5E7099",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addNotes("[30 s] Bonjour. Nous présentons SUIVI, une application interne destinée à un laboratoire. Son nom signifie Suivi des Usages, Inventaires, Vie des projets et IA. Plan : le besoin, notre solution, nos choix techniques, puis une démonstration avec un scénario concret.");
}

// ---------------------------------------------------------------------------
// Diapositive 2 — Contexte et besoin
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Contexte · Nom 1");
  title(slide, "Trois questions que se pose le laboratoire");

  const items = [
    { n: "1", q: "Où est ce matériel ?", a: "Retrouver vite un appareil, ses références et ses documents : factures, bons de commande.", color: C.blue },
    { n: "2", q: "Est-il libre jeudi ?", a: "Réserver un appareil pour un projet, sans risque de double réservation.", color: C.success },
    { n: "3", q: "Qui a fait quoi ?", a: "Garder la trace des modifications, des réservations et de la vie des projets.", color: C.purple },
  ];
  const cardW = 3.75, gap = 0.35, startX = MARGIN, y = 2.05, h = 2.5;
  items.forEach((it, i) => {
    const x = startX + i * (cardW + gap);
    card(slide, x, y, cardW, h);
    badge(slide, x + 0.3, y + 0.3, 0.55, it.n, it.color);
    slide.addText(it.q, {
      x: x + 0.3, y: y + 1.0, w: cardW - 0.6, h: 0.7, fontSize: 17, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(it.a, {
      x: x + 0.3, y: y + 1.65, w: cardW - 0.6, h: 0.8, fontSize: 11.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  card(slide, MARGIN, 4.95, PAGE_W - MARGIN * 2, 1.4, { fill: C.navy, line: false });
  slide.addText([
    { text: "SUIVI réunit l'inventaire, les projets et les réservations ", options: { bold: true, color: C.white } },
    { text: "dans un seul outil, avec les bons droits pour chacun et une trace de tout.", options: { color: "C7D3EA" } },
  ], {
    x: MARGIN + 0.4, y: 4.95, w: PAGE_W - MARGIN * 2 - 0.8, h: 1.4, fontSize: 16,
    fontFace: FONT, valign: "middle", isTextBox: true, margin: 0,
  });

  footer(slide, false);
  slide.addNotes("[1 min 30] Le besoin ne se limite pas a lister du materiel : relier le materiel aux projets, empecher les doubles reservations, conserver une trace. Chaque profil doit voir les bonnes informations et faire uniquement ce qui lui est autorise.");
}

// ---------------------------------------------------------------------------
// Diapositive 3 — Équipe et responsabilités
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Équipe · Nom 1");
  title(slide, "Quatre personnes, un rôle chacun");

  const members = [
    { name: "Nom 1", demo: "Démo : acte 1, Gestionnaire", color: C.blue },
    { name: "Nom 2", demo: "Démo : acte 2, Responsable", color: C.success },
    { name: "Nom 3", demo: "Démo : acte 3, Membre", color: C.purple },
    { name: "Nom 4", demo: "Démo : acte 4, Administrateur", color: C.warning },
  ];
  const cardW = 2.78, gap = 0.28, startX = MARGIN, y = 2.05, h = 4.0;
  members.forEach((m, i) => {
    const x = startX + i * (cardW + gap);
    card(slide, x, y, cardW, h);
    badge(slide, x + (cardW - 0.75) / 2, y + 0.35, 0.75, m.name.slice(-1), m.color, C.white, 20);
    slide.addText(m.name, {
      x: x + 0.15, y: y + 1.3, w: cardW - 0.3, h: 0.4, fontSize: 16, bold: true, color: C.navy,
      align: "center", fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText("[Rôle dans le projet]", {
      x: x + 0.15, y: y + 1.75, w: cardW - 0.3, h: 0.35, fontSize: 10.5, italic: true, color: C.muted,
      align: "center", fontFace: FONT, isTextBox: true, margin: 0,
    });
    slide.addText("[Une réalisation concrète, visible dans l'application]", {
      x: x + 0.2, y: y + 2.25, w: cardW - 0.4, h: 1.1, fontSize: 10, color: C.text,
      align: "center", fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
    slide.addShape("roundRect", {
      x: x + 0.15, y: y + h - 0.55, w: cardW - 0.3, h: 0.35, rectRadius: 0.06,
      fill: { color: m.color }, line: { type: "none" },
    });
    slide.addText(m.demo, {
      x: x + 0.15, y: y + h - 0.55, w: cardW - 0.3, h: 0.35, fontSize: 9, bold: true, color: C.white,
      align: "center", valign: "middle", fontFace: FONT, isTextBox: true, margin: 0,
    });
  });

  footer(slide, false);
  slide.addNotes("[1 min] A remplacer avant l'oral par quatre contributions reelles et courtes (deux realisations maximum par personne, visibles dans le livrable). Ne pas inventer de roles si le travail a ete partage : decrire alors les responsabilites dominantes.");
}

// ---------------------------------------------------------------------------
// Diapositive 4 — Utilisateurs et réponse fonctionnelle
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Les profils · Nom 1");
  title(slide, "Trois profils, trois façons d'utiliser SUIVI");

  const profiles = [
    {
      name: "Administrateur", sub: "Un seul, compte prédéfini", color: C.blue,
      lines: ["Gère toutes les données et tous les projets", "Voit les archives et les historiques",
        "Crée, modifie et désactive les comptes", "Change le rôle de n'importe quel compte"],
    },
    {
      name: "Gestionnaire", sub: "Zéro ou un", color: C.warning,
      lines: ["Tient l'inventaire et les catégories", "Exporte l'inventaire en Excel ou PDF",
        "Traite les demandes de réapprovisionnement", "Aucun accès aux projets"],
    },
    {
      name: "Utilisateur", sub: "Créé à sa première connexion", color: C.success,
      lines: ["Consulte l'inventaire actif", "Crée des projets, réserve du matériel",
        "Signale une rupture de stock", "Selon le projet : responsable, membre ou simple"],
    },
  ];
  const cardW = 3.75, gap = 0.35, startX = MARGIN, y = 2.0, h = 4.0;
  profiles.forEach((p, i) => {
    const x = startX + i * (cardW + gap);
    card(slide, x, y, cardW, h);
    slide.addShape("roundRect", {
      x, y, w: cardW, h: 0.85, rectRadius: 0.08,
      fill: { color: p.color }, line: { type: "none" },
    });
    slide.addShape("rect", { x, y: y + 0.4, w: cardW, h: 0.45, fill: { color: p.color }, line: { type: "none" } });
    slide.addText(p.name, {
      x: x + 0.3, y: y + 0.12, w: cardW - 0.6, h: 0.4, fontSize: 17, bold: true, color: C.white,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(p.sub, {
      x: x + 0.3, y: y + 0.5, w: cardW - 0.6, h: 0.3, fontSize: 10.5, color: "FFFFFF",
      fontFace: FONT, isTextBox: true, margin: 0,
    });
    const body = p.lines.map((l, idx) => ({
      text: l, options: { bullet: { code: "25AA", indent: 14 }, color: C.text, breakLine: idx < p.lines.length - 1 },
    }));
    slide.addText(body, {
      x: x + 0.3, y: y + 1.1, w: cardW - 0.6, h: h - 1.4, fontSize: 11.5, fontFace: FONT,
      isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 10, lineSpacingMultiple: 1.1,
    });
  });

  slide.addText([
    { text: "Les droits sont vérifiés par l'API à chaque requête", options: { bold: true, color: C.navy } },
    { text: " : cacher un bouton ne suffit pas.", options: { color: C.muted } },
  ], {
    x: MARGIN, y: 6.15, w: PAGE_W - MARGIN * 2, h: 0.4, fontSize: 12.5, fontFace: FONT,
    isTextBox: true, margin: 0,
  });

  footer(slide, false);
  slide.addNotes("[1 min 30] Trois profils aux droits distincts. Transition : Pour realiser cet ensemble, nous avons choisi une architecture qui separe interface, regles metier, donnees et fichiers.");
}

// ---------------------------------------------------------------------------
// Diapositive 5 — Choix techniques
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Technologies · Nom 2");
  title(slide, "Chaque choix répond à un besoin");

  const rows = [
    { label: "INTERFACE", tech: "Vue 3 + Vite", why: "Tableaux, Kanban, pages dédiées : des écrans qui changent selon le profil.", color: C.blue },
    { label: "API", tech: "Express 5 · Node.js 24", why: "Un seul endroit où tous les droits sont vérifiés.", color: C.success },
    { label: "DONNÉES", tech: "PostgreSQL 17", why: "Des données très liées, et une base qui bloque elle-même les doubles réservations.", color: C.purple },
    { label: "ACCÈS AUX DONNÉES", tech: "Prisma 7", why: "Un modèle central, des migrations versionnées, des transactions.", color: C.warning },
    { label: "FICHIERS", tech: "Stockage S3 privé", why: "Les factures restent hors de la base, dans un espace privé.", color: C.danger },
    { label: "DÉPLOIEMENT", tech: "Docker Compose + Nginx", why: "Toute l'application démarre en une commande.", color: C.navy },
  ];
  const colW = (PAGE_W - MARGIN * 2 - 0.3) / 2, rowH = 1.38, gapX = 0.3, gapY = 0.18;
  rows.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MARGIN + col * (colW + gapX);
    const y = 2.0 + row * (rowH + gapY);
    card(slide, x, y, colW, rowH);
    badge(slide, x + 0.22, y + 0.22, 0.52, String(i + 1), r.color, C.white, 14);
    slide.addText(r.label, {
      x: x + 0.92, y: y + 0.16, w: colW - 1.14, h: 0.3, fontSize: 9.5, bold: true, color: r.color,
      charSpacing: 1, fontFace: FONT, isTextBox: true, margin: 0,
    });
    slide.addText(r.tech, {
      x: x + 0.92, y: y + 0.42, w: colW - 1.14, h: 0.35, fontSize: 14.5, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(r.why, {
      x: x + 0.92, y: y + 0.78, w: colW - 1.14, h: 0.55, fontSize: 10, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, false);
  slide.addNotes("[2 min 15] Ne pas enumerer les versions : relier chaque choix a son usage. Vue pour les ecrans qui changent selon le profil ; Express pour centraliser les droits ; PostgreSQL pour les donnees liees et la contrainte anti-chevauchement ; Prisma pour les migrations et transactions ; S3 pour sortir les fichiers de la base ; Docker Compose pour la reproductibilite.");
}

// ---------------------------------------------------------------------------
// Diapositive 6 — Architecture et sécurité
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.navy);
  eyebrow(slide, "Architecture · Nom 2", MARGIN, 0.55, C.blueLight);
  title(slide, "Une porte d'entrée, des droits vérifiés", MARGIN, 0.9, PAGE_W - MARGIN * 2, C.white);

  function flowBox(x, y, w, h, label, sub, color) {
    slide.addShape("roundRect", {
      x, y, w, h, rectRadius: 0.07, fill: { color: "16305E" }, line: { color, width: 1.5 },
    });
    slide.addText(label, {
      x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.35, fontSize: 11.5, bold: true, color: C.white,
      fontFace: FONT, isTextBox: true, margin: 0, align: "center",
    });
    if (sub) slide.addText(sub, {
      x: x + 0.1, y: y + h - 0.4, w: w - 0.2, h: 0.35, fontSize: 8.5, color: "9FB4DC",
      fontFace: FONT, isTextBox: true, margin: 0, align: "center", valign: "top",
    });
  }
  function arrow(x, y, w) {
    slide.addShape("rightArrow", { x, y, w, h: 0.18, fill: { color: C.blueLight }, line: { type: "none" } });
  }

  const rowY1 = 2.05, bw = 1.95, bh = 0.95, gapArrow = 0.3;
  const labels1 = [
    ["Navigateur", "Interface Vue"], ["Nginx", "Point d'entrée unique"],
    ["API Express", "Droits et règles métier"], ["PostgreSQL", "Données et infos fichiers"],
  ];
  let cx = MARGIN;
  labels1.forEach(([l, s], i) => {
    flowBox(cx, rowY1, bw, bh, l, s, C.blue);
    if (i < labels1.length - 1) arrow(cx + bw + 0.05, rowY1 + bh / 2 - 0.09, gapArrow);
    cx += bw + gapArrow + 0.1;
  });
  slide.addText("Une requête →", {
    x: MARGIN, y: rowY1 - 0.4, w: 4, h: 0.3, fontSize: 10.5, italic: true, color: "9FB4DC",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  const rowY2 = 3.55;
  const labels2 = [
    ["API Express", "Vérifie le droit, crée un lien signé"], ["Navigateur", "Envoie le fichier avec ce lien"],
    ["Stockage S3 privé", "Garde le fichier, jamais public"],
  ];
  cx = MARGIN;
  labels2.forEach(([l, s], i) => {
    flowBox(cx, rowY2, bw, bh, l, s, C.success);
    if (i < labels2.length - 1) arrow(cx + bw + 0.05, rowY2 + bh / 2 - 0.09, gapArrow);
    cx += bw + gapArrow + 0.1;
  });
  slide.addText("Un fichier joint →", {
    x: MARGIN, y: rowY2 - 0.4, w: 4, h: 0.3, fontSize: 10.5, italic: true, color: "9FB4DC",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  const points = [
    "Session : jeton court dans un cookie HttpOnly",
    "API et base non exposées sur le réseau hôte",
    "Données entrantes toujours validées (Zod)",
    "Mots de passe chiffrés (bcrypt), jamais stockés en clair",
  ];
  const py = 5.05;
  points.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MARGIN + col * 5.9, y = py + row * 0.55;
    slide.addShape("ellipse", { x, y: y + 0.07, w: 0.1, h: 0.1, fill: { color: C.blueLight }, line: { type: "none" } });
    slide.addText(p, {
      x: x + 0.28, y, w: 5.5, h: 0.4, fontSize: 11.5, color: "DCE6FA", fontFace: FONT,
      isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, true);
  slide.addNotes("[1 min 30] Nginx fournit un point d'entree unique. L'API verifie les droits avant tout acces aux donnees. Les fichiers passent par une URL signee temporaire, jamais par un acces public au stockage. Session : jeton court dans un cookie HttpOnly. Preciser que l'authentification Intradef reste simulee dans le prototype (limite a annoncer en conclusion).");
}

// ---------------------------------------------------------------------------
// Diapositive 7 — Réalisation et préparation de la démo
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Réalisation · Nom 2");
  title(slide, "Cinq sprints, puis des itérations ciblées avec le client");

  const sprints = [
    { n: "S1", t: "Fondations", d: "Connexion, maquettes, tableau de bord" },
    { n: "S2", t: "Projets", d: "Visibilité, membres, Kanban, documentation" },
    { n: "S3", t: "Inventaire", d: "Fiches, catégories, recherche, historiques" },
    { n: "S4", t: "Cohérence métier", d: "Réservations, archives, notifications" },
    { n: "S5", t: "Extensions", d: "Calendrier, exports Excel/PDF" },
  ];
  const w5 = (PAGE_W - MARGIN * 2 - 0.4 * 4) / 5, y5 = 2.1, h5 = 1.9;
  sprints.forEach((s, i) => {
    const x = MARGIN + i * (w5 + 0.4);
    card(slide, x, y5, w5, h5);
    badge(slide, x + (w5 - 0.5) / 2, y5 + 0.25, 0.5, s.n, C.blue, C.white, 12);
    slide.addText(s.t, {
      x: x + 0.1, y: y5 + 0.95, w: w5 - 0.2, h: 0.35, fontSize: 12, bold: true, color: C.navy,
      align: "center", fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(s.d, {
      x: x + 0.15, y: y5 + 1.3, w: w5 - 0.3, h: 0.55, fontSize: 9, color: C.muted,
      align: "center", fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  card(slide, MARGIN, 4.35, PAGE_W - MARGIN * 2, 1.95, { fill: C.navy, line: false });
  slide.addText("Itérations complémentaires demandées par le client", {
    x: MARGIN + 0.4, y: 4.55, w: PAGE_W - MARGIN * 2 - 0.8, h: 0.4, fontSize: 13, bold: true, color: C.white,
    fontFace: FONT, isTextBox: true, margin: 0,
  });
  const iters = [
    "Quantité, seuil d'alerte et signalement de rupture sur le matériel non individualisé",
    "Gestion complète des comptes par l'administrateur (création, rôle, désactivation)",
    "Fiche projet en page dédiée, avec son propre lien",
    "Colonne Kanban « En revue » entre En cours et Fait",
    "Statut de projet affiché : en attente, actif ou clôturé",
    "Thème clair / sombre et page Paramètres personnelle",
  ];
  iters.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MARGIN + 0.4 + col * 5.9, y = 5.0 + row * 0.42;
    slide.addShape("roundRect", { x, y: y + 0.08, w: 0.1, h: 0.1, rectRadius: 0.02, fill: { color: C.blueLight }, line: { type: "none" } });
    slide.addText(t, {
      x: x + 0.24, y, w: 5.36, h: 0.4, fontSize: 10, color: "DCE6FA", fontFace: FONT,
      isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, false);
  slide.addNotes("[45 s] Cinq sprints numerotes, puis des iterations complementaires demandees par le client et demontrees aujourd'hui. Transition : Ces increments forment un parcours continu, que nous allons maintenant montrer.");
}

// ---------------------------------------------------------------------------
// Diapositive 8 — Démonstration fonctionnelle
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Démonstration · Nom 3 · 4 min 30");
  title(slide, "Un appareil, un projet, du début à la fin");

  card(slide, MARGIN, 2.0, PAGE_W - MARGIN * 2, 0.95);
  slide.addText("Le labo reçoit un analyseur de spectre. Une équipe le réserve pour sa campagne de mesures. Le projet se termine, l'appareil redevient libre.", {
    x: MARGIN + 0.35, y: 2.0, w: PAGE_W - MARGIN * 2 - 0.7, h: 0.95, fontSize: 13, italic: true, color: C.text,
    fontFace: FONT, isTextBox: true, margin: 0, valign: "middle",
  });

  const acts = [
    { n: "1", who: "Gestionnaire", name: "Nom 1", color: C.blue,
      d: ["Ajoute l'analyseur et joint sa facture.", "Fixe un seuil d'alerte, exporte l'inventaire."] },
    { n: "2", who: "Responsable", name: "Nom 2", color: C.success,
      d: ["Fait avancer le Kanban jusqu'à En revue.", "Ajoute un membre, exporte la documentation."] },
    { n: "3", who: "Membre", name: "Nom 3", color: C.purple,
      d: ["Réserve, se fait refuser un chevauchement.", "Ouvre le calendrier et la page du projet."] },
    { n: "4", who: "Administrateur", name: "Nom 4", color: C.warning,
      d: ["Archive un matériel ; le projet se clôt seul.", "Consulte la page Paramètres et les comptes."] },
  ];
  const cw = 2.78, gap = 0.28, ay = 3.25, ah = 3.3;
  acts.forEach((a, i) => {
    const x = MARGIN + i * (cw + gap);
    card(slide, x, ay, cw, ah);
    badge(slide, x + 0.25, ay + 0.25, 0.55, a.n, a.color);
    slide.addText(`ACTE ${a.n} · ${a.name}`, {
      x: x + 0.25, y: ay + 0.95, w: cw - 0.5, h: 0.3, fontSize: 9.5, bold: true, color: a.color,
      fontFace: FONT, isTextBox: true, margin: 0,
    });
    slide.addText(a.who, {
      x: x + 0.25, y: ay + 1.25, w: cw - 0.5, h: 0.4, fontSize: 16, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    const body = a.d.map((l, idx) => ({ text: l, options: { breakLine: idx < a.d.length - 1 } }));
    slide.addText(body, {
      x: x + 0.25, y: ay + 1.75, w: cw - 0.5, h: 1.4, fontSize: 10.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 6,
    });
  });

  footer(slide, false);
  slide.addNotes("[4 min 30 + application] Raconter un seul scenario continu, dire l'objectif avant chaque action. Garder la derniere tache du Kanban pour illustrer la cloture automatique UNIQUEMENT si cette etape a ete repetee et fiabilisee. En cas d'echec : passer immediatement aux captures de secours (Annexe D) sans chercher la cause devant le jury.");
}

// ---------------------------------------------------------------------------
// Diapositive 9 — Droits et règles métier
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Règles métier · Nom 4");
  title(slide, "La cohérence des droits, vérifiée à chaque requête");

  const rules = [
    { t: "Projet privé invisible", d: "Un projet privé n'est jamais découvert par un utilisateur extérieur.", color: C.blue },
    { t: "Gestionnaire hors projets", d: "Le gestionnaire ne peut accéder à aucun projet, quelle que soit sa visibilité.", color: C.warning },
    { t: "Un seul gestionnaire actif", d: "Nommer un nouveau gestionnaire rétrograde automatiquement le précédent.", color: C.purple },
    { t: "Réservation sans conflit", d: "Deux créneaux incompatibles sur le même matériel ne peuvent jamais coexister.", color: C.success },
    { t: "Archivage traçable", d: "L'archivage conserve l'historique et libère les réservations concernées.", color: C.danger },
    { t: "Clôture automatique", d: "La dernière tâche active terminée clôture le projet et le matériel réservé.", color: C.blueDark },
  ];
  const cw = (PAGE_W - MARGIN * 2 - 0.3 * 2) / 3, gapX = 0.3, gapY = 0.25, ry = 2.05, rh = 2.15;
  rules.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = MARGIN + col * (cw + gapX), y = ry + row * (rh + gapY);
    card(slide, x, y, cw, rh);
    slide.addShape("roundRect", { x: x + 0.22, y: y + 0.22, w: 0.4, h: 0.4, rectRadius: 0.06, fill: { color: r.color }, line: { type: "none" } });
    slide.addText(r.t, {
      x: x + 0.22, y: y + 0.78, w: cw - 0.44, h: 0.55, fontSize: 12.5, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(r.d, {
      x: x + 0.22, y: y + 1.3, w: cw - 0.44, h: 0.75, fontSize: 9.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, false);
  slide.addNotes("[1 min 30] Ces regles sont controlees cote API, pas seulement dans l'interface : masquer un bouton ne suffit pas, un contournement de l'ecran ne contourne pas le droit.");
}

// ---------------------------------------------------------------------------
// Diapositive 10 — Qualité et limites actuelles
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Bilan · Nom 4");
  title(slide, "Ce qui est vérifié, ce qui reste à faire");

  const stats = [
    { n: "46", l: "tests automatisés côté serveur" },
    { n: "14", l: "tests automatisés côté interface" },
    { n: "23", l: "décisions de cadrage appliquées et tracées" },
  ];
  const sw = (PAGE_W - MARGIN * 2 - 0.3 * 2) / 3;
  stats.forEach((s, i) => {
    const x = MARGIN + i * (sw + 0.3);
    card(slide, x, 2.0, sw, 1.5, { fill: C.navy, line: false });
    slide.addText(s.n, {
      x, y: 2.1, w: sw, h: 0.85, fontSize: 44, bold: true, color: C.white, align: "center",
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(s.l, {
      x: x + 0.2, y: 2.95, w: sw - 0.4, h: 0.45, fontSize: 10.5, color: "C7D3EA", align: "center",
      fontFace: FONT, isTextBox: true, margin: 0,
    });
  });

  card(slide, MARGIN, 3.85, PAGE_W - MARGIN * 2, 2.65);
  slide.addText("Limites assumées", {
    x: MARGIN + 0.35, y: 4.05, w: 6, h: 0.4, fontSize: 14, bold: true, color: C.navy,
    fontFace: FONT_HEAD, isTextBox: true, margin: 0,
  });
  const limits = [
    "Connexion Intradef simulée dans le prototype",
    "Aucune fonction d'IA livrée, malgré le nom",
    "Réservation depuis le projet, pas depuis le calendrier",
    "Suppression de compte = désactivation, jamais physique",
    "Sauvegardes et volumes cibles encore à définir",
  ];
  const lcol = limits.map((l, i) => ({
    text: l, options: { bullet: { code: "25AA", indent: 14 }, breakLine: i < limits.length - 1 },
  }));
  slide.addText(lcol, {
    x: MARGIN + 0.35, y: 4.6, w: PAGE_W - MARGIN * 2 - 0.7, h: 1.8, fontSize: 12, color: C.text,
    fontFace: FONT, isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 10,
  });

  footer(slide, false);
  slide.addNotes("[1 min 15] Chiffres a jour au commit c84e8af. Annoncer les limites clairement, sans les minimiser : connexion Intradef simulee, aucune fonction d'IA livree, reservation uniquement depuis le projet, suppression de compte = desactivation, sauvegardes et volumes encore a definir.");
}

// ---------------------------------------------------------------------------
// Diapositive 11 — Évolutions réalistes
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Évolutions · Nom 4");
  title(slide, "Quatre pistes réalistes pour la suite");

  const evo = [
    { t: "Connexion Intradef réelle", d: "Brancher l'authentification du réseau cible à la place de la connexion simulée. Le reste de l'application ne change pas.", color: C.blue },
    { t: "Antivirus des pièces jointes", d: "Analyser chaque fichier avant de le rendre téléchargeable. Le circuit d'envoi par lien signé s'y prête déjà.", color: C.danger },
    { t: "QR code sur chaque appareil", d: "Scanner l'étiquette pour ouvrir la fiche ou réserver, directement depuis la paillasse.", color: C.success },
    { t: "Une IA hébergée en interne", d: "Chercher dans l'inventaire en langage courant, sans que les données quittent le réseau.", color: C.purple },
  ];
  const cw = (PAGE_W - MARGIN * 2 - 0.3) / 2, ch = 2.2, gapX = 0.3, gapY = 0.25;
  evo.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MARGIN + col * (cw + gapX), y = 2.05 + row * (ch + gapY);
    card(slide, x, y, cw, ch);
    slide.addShape("roundRect", { x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: e.color }, line: { type: "none" } });
    slide.addText(String(i + 1), {
      x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle",
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(e.t, {
      x: x + 1.0, y: y + 0.3, w: cw - 1.3, h: 0.5, fontSize: 14, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0, valign: "middle",
    });
    slide.addText(e.d, {
      x: x + 0.3, y: y + 0.95, w: cw - 0.6, h: 1.1, fontSize: 10.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, false);
  slide.addNotes("[1 min] Presenter ces elements comme des pistes, pas comme des fonctions deja livrees. Rester realiste, ne pas promettre de date.");
}

// ---------------------------------------------------------------------------
// Diapositive 12 — Conclusion
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.navy);

  slide.addText("CONCLUSION · NOM 4", {
    x: MARGIN, y: 1.1, w: 8, h: 0.4, fontSize: 13, bold: true, color: C.blueLight,
    charSpacing: 2, fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addText("Un seul outil pour savoir ce que le labo possède, qui l'utilise et ce qui s'est passé.", {
    x: MARGIN, y: 2.7, w: 11, h: 1.6, fontSize: 30, bold: true, color: C.white,
    fontFace: FONT_HEAD, isTextBox: true, margin: 0,
  });

  slide.addText("Merci. Place à vos questions.", {
    x: MARGIN, y: 4.6, w: 10, h: 0.6, fontSize: 18, color: C.blueLight,
    fontFace: FONT, italic: true, isTextBox: true, margin: 0,
  });

  slide.addText("Nom 1  ·  Nom 2  ·  Nom 3  ·  Nom 4", {
    x: MARGIN, y: 6.4, w: 8, h: 0.4, fontSize: 13, bold: true, color: "8FA3CC",
    fontFace: FONT, isTextBox: true, margin: 0,
  });

  slide.addNotes("[45 s] Phrase de synthese courte, remercier, ouvrir les questions. Rappeler qui repond en priorite : Nom 1 sur le besoin et l'equipe, Nom 2 sur la technique, Nom 3 sur l'experience utilisateur, Nom 4 sur les regles, tests et limites.");
}

// ---------------------------------------------------------------------------
// Annexe A — Matrice des droits
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Annexe A · Matrice des droits");
  title(slide, "Qui peut faire quoi");

  const header = ["Action", "Administrateur", "Gestionnaire", "Utilisateur"];
  const rows = [
    ["Consulter l'inventaire actif", "Oui", "Oui", "Oui"],
    ["Gérer le matériel et les catégories", "Oui", "Oui", "Non"],
    ["Exporter l'inventaire", "Oui", "Oui", "Non"],
    ["Voir l'historique d'un matériel actif", "Oui", "Oui, projets masqués", "Non"],
    ["Voir le matériel archivé", "Oui", "Non", "Non"],
    ["Créer un projet", "Oui", "Non", "Oui"],
    ["Voir un projet privé", "Oui", "Non", "Si membre"],
    ["Modifier un projet, ses tâches, ses réservations", "Oui", "Non", "Si membre"],
    ["Archiver un projet", "Oui", "Non", "Si responsable"],
    ["Créer, modifier, désactiver un compte", "Oui", "Non", "Non"],
    ["Changer le rôle d'un compte", "Oui", "Non", "Non"],
  ];
  const tableRows = [header.map((h) => ({
    text: h, options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 11 },
  }))];
  rows.forEach((r) => {
    tableRows.push(r.map((cell, i) => ({
      text: cell,
      options: {
        color: i === 0 ? C.text : (cell === "Oui" ? C.success : cell === "Non" ? C.muted : C.warning),
        bold: i > 0,
        fontSize: 10.5,
        fill: { color: C.white },
      },
    })));
  });
  slide.addTable(tableRows, {
    x: MARGIN, y: 1.9, w: PAGE_W - MARGIN * 2, colW: [5.2, 2.3, 2.3, 2.3],
    border: { type: "solid", color: C.line, pt: 0.75 },
    autoPage: false, rowH: 0.42, valign: "middle",
  });

  footer(slide, false);
  slide.addNotes("Annexe mobilisable uniquement si une question du jury le justifie ; ne compte pas dans les 18 minutes.");
}

// ---------------------------------------------------------------------------
// Annexe B — Réservations, contrainte base de données
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Annexe B · Réservations");
  title(slide, "Pourquoi une double réservation est impossible");

  const steps = [
    { n: "1", t: "Créneaux de 30 minutes", d: "L'API refuse un horaire qui ne finit pas par 00 ou 30." },
    { n: "2", t: "Intervalles [début, fin[", d: "10 h–11 h puis 11 h–12 h se suivent sans se chevaucher." },
    { n: "3", t: "Contrainte en base", d: "PostgreSQL rejette deux réservations actives qui se recouvrent, même envoyées au même instant." },
  ];
  steps.forEach((s, i) => {
    const y = 2.0 + i * 1.05;
    badge(slide, MARGIN, y, 0.6, s.n, C.blue);
    slide.addText(s.t, {
      x: MARGIN + 0.85, y, w: 3.8, h: 0.6, fontSize: 14, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0, valign: "middle",
    });
    slide.addText(s.d, {
      x: MARGIN + 4.8, y, w: PAGE_W - MARGIN * 2 - 4.8, h: 0.8, fontSize: 11.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "middle",
    });
  });

  card(slide, MARGIN, 5.35, PAGE_W - MARGIN * 2, 1.3, { fill: C.navy, line: false });
  slide.addText("EXCLUDE USING gist (materiel_id WITH =, tstzrange(debut, fin, '[)') WITH &&) WHERE (statut = 'active')", {
    x: MARGIN + 0.35, y: 5.35, w: PAGE_W - MARGIN * 2 - 0.7, h: 1.3, fontSize: 13, color: "8FE0C9",
    fontFace: "Courier New", isTextBox: true, margin: 0, valign: "middle",
  });

  footer(slide, false);
  slide.addNotes("Annexe mobilisable uniquement si une question du jury le justifie ; ne compte pas dans les 18 minutes.");
}

// ---------------------------------------------------------------------------
// Annexe C — Dernières évolutions livrées
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Annexe C · Dernières évolutions livrées");
  title(slide, "Ajouts réalisés après le cinquième sprint");

  const items = [
    { t: "Réapprovisionnement", d: "Quantité et seuil d'alerte sur le matériel non individualisé. Signalement de rupture par un utilisateur, traitement par l'administrateur ou le gestionnaire.", color: C.danger },
    { t: "Gestion des comptes", d: "L'administrateur crée, modifie, change le rôle et désactive un compte. Chaque profil change son propre mot de passe.", color: C.blue },
    { t: "Page projet dédiée", d: "La fiche d'un projet devient une page à part entière, avec sa propre adresse, plutôt qu'une fenêtre.", color: C.success },
    { t: "Kanban « En revue »", d: "Une quatrième colonne fixe, entre En cours et Fait, sans incidence sur la clôture automatique.", color: C.purple },
    { t: "Statut de projet", d: "Un tag en attente, actif ou clôturé, calculé automatiquement à partir des dates et de l'archivage.", color: C.warning },
    { t: "Thème et Paramètres", d: "Thème clair ou sombre mémorisé, page personnelle pour le compte et le mot de passe.", color: C.blueDark },
  ];
  const cw = (PAGE_W - MARGIN * 2 - 0.3 * 2) / 3, ch = 2.15, gapX = 0.3, gapY = 0.25;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = MARGIN + col * (cw + gapX), y = 2.0 + row * (ch + gapY);
    card(slide, x, y, cw, ch);
    slide.addShape("roundRect", { x: x + 0.22, y: y + 0.22, w: 0.4, h: 0.4, rectRadius: 0.07, fill: { color: it.color }, line: { type: "none" } });
    slide.addText(it.t, {
      x: x + 0.22, y: y + 0.75, w: cw - 0.44, h: 0.5, fontSize: 12.5, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
    slide.addText(it.d, {
      x: x + 0.22, y: y + 1.22, w: cw - 0.44, h: 0.85, fontSize: 9.5, color: C.muted,
      fontFace: FONT, isTextBox: true, margin: 0, valign: "top",
    });
  });

  footer(slide, false);
  slide.addNotes("Annexe mobilisable uniquement si une question du jury le justifie ; ne compte pas dans les 18 minutes.");
}

// ---------------------------------------------------------------------------
// Annexe D — Plan de secours
// ---------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  bgFill(slide, C.bg);
  eyebrow(slide, "Annexe D · Plan de secours");
  title(slide, "La démo en captures");

  const acts = [
    { a: "Acte 1 · Gestionnaire", d: "[Capture : fiche de l'analyseur avec sa facture]" },
    { a: "Acte 2 · Responsable", d: "[Capture : projet avec membres et Kanban]" },
    { a: "Acte 3 · Membre", d: "[Capture : refus du chevauchement + calendrier « Réservé »]" },
    { a: "Acte 4 · Administrateur", d: "[Capture : notification + projet clôturé]" },
  ];
  const cw = (PAGE_W - MARGIN * 2 - 0.3) / 2, ch = 2.3, gapX = 0.3, gapY = 0.3;
  acts.forEach((a, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MARGIN + col * (cw + gapX), y = 2.05 + row * (ch + gapY);
    card(slide, x, y, cw, ch, { fill: "EDF1F8" });
    slide.addShape("roundRect", {
      x: x + 0.25, y: y + 0.6, w: cw - 0.5, h: ch - 0.9, rectRadius: 0.05,
      fill: { color: C.white }, line: { color: C.line, width: 1, dashType: "dash" },
    });
    slide.addText("[ capture d'écran ]", {
      x: x + 0.25, y: y + 0.6, w: cw - 0.5, h: ch - 0.9, fontSize: 10.5, italic: true, color: C.muted,
      align: "center", valign: "middle", fontFace: FONT, isTextBox: true, margin: 0,
    });
    slide.addText(a.a, {
      x: x + 0.25, y: y + 0.18, w: cw - 0.5, h: 0.35, fontSize: 12.5, bold: true, color: C.navy,
      fontFace: FONT_HEAD, isTextBox: true, margin: 0,
    });
  });

  footer(slide, false);
  slide.addNotes("Annexe mobilisable uniquement si une question du jury le justifie ; ne compte pas dans les 18 minutes.");
}

pres.writeFile({ fileName: "SUIVI — Présentation finale.pptx" }).then(() => {
  console.log("OK");
});
