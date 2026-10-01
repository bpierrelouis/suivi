const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  Numbering, LevelFormat, convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");

const NAVY = "0D2046";
const BLUE = "2864E8";
const MUTED = "5C6578";
const LINE = "D8DEEA";
const WHITE = "FFFFFF";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 40, font: "Calibri" })],
  });
}
function h2(text, color = BLUE) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    border: { bottom: { color: LINE, space: 6, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text, bold: true, color, size: 26, font: "Calibri" })],
  });
}
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 140, line: 300 },
    children: [new TextRun({ text, size: 22, font: "Calibri", italics: !!opts.italics, color: opts.color || "1A1A1A" })],
  });
}
function quote(text) {
  return new Paragraph({
    spacing: { after: 160, line: 300 },
    indent: { left: convertInchesToTwip(0.3) },
    border: { left: { color: BLUE, space: 8, style: BorderStyle.SINGLE, size: 18 } },
    children: [new TextRun({ text: "« " + text + " »", italics: true, size: 22, font: "Calibri", color: "202020" })],
  });
}
function cue(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text: "À l'écran : ", bold: true, size: 20, font: "Calibri", color: MUTED }),
      new TextRun({ text, size: 20, font: "Calibri", color: MUTED, italics: true })],
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "puces", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 21, font: "Calibri" })],
  });
}
function timingLine(range, title, duration) {
  return new Paragraph({
    spacing: { before: 60, after: 40 },
    children: [
      new TextRun({ text: `Diapositive ${range} — `, bold: true, size: 23, font: "Calibri", color: NAVY }),
      new TextRun({ text: title, bold: true, size: 23, font: "Calibri", color: NAVY }),
      new TextRun({ text: `   (${duration})`, size: 20, font: "Calibri", color: MUTED }),
    ],
  });
}
function infoTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2600, 7000],
    rows: rows.map(([label, value], i) => new TableRow({
      children: [
        new TableCell({
          width: { size: 2600, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "F4F7FB" },
          margins: { top: 100, bottom: 100, left: 150, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Calibri", color: NAVY })] })],
        }),
        new TableCell({
          width: { size: 7000, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 150, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Calibri" })] })],
        }),
      ],
    })),
  });
}
function tipBox(title, lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9600],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: 9600, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "0D2046" },
        margins: { top: 200, bottom: 200, left: 250, right: 250 },
        children: [
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Calibri", color: WHITE })] }),
          ...lines.map((l) => new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: "• " + l, size: 20, font: "Calibri", color: "DCE6FA" })],
          })),
        ],
      })],
    })],
  });
}

const SPEAKERS = [
  {
    nom: "Nom 1", partie: "Contexte, besoin, équipe et utilisateurs", duree: "4 min 30",
    slides: "1 à 4", questions: "Besoin client, périmètre, organisation de l'équipe",
    suivant: "Nom 2", suivantSujet: "technologies, architecture et méthode",
    sections: [
      { range: "1", title: "Couverture", duree: "0 min 30",
        script: ["Bonjour. Nous allons vous présenter SUIVI, une application interne destinée à un laboratoire. Son nom signifie Suivi des Usages, Inventaires, Vie des projets et IA. Pendant cette présentation, nous allons partir du besoin, expliquer notre solution et nos choix techniques, puis montrer l'application avec un scénario concret."],
        ecran: "Diapositive de couverture, fond sombre, titre SUIVI." },
      { range: "2", title: "Contexte et besoin", duree: "1 min 30",
        script: [
          "Le besoin ne se limite pas à faire une liste de matériel. Il faut relier le matériel aux projets qui l'utilisent, empêcher les doubles réservations et conserver une trace des opérations.",
          "Notre objectif a donc été de construire une application où chaque profil voit les bonnes informations et peut réaliser uniquement les actions qui lui sont autorisées.",
        ],
        ecran: "Les trois questions (où est ce matériel, est-il libre, qui a fait quoi) et la phrase de synthèse." },
      { range: "3", title: "Équipe", duree: "1 min 00",
        script: [
          "[À REMPLACER AVANT L'ORAL] Nous sommes quatre sur le projet. Je me suis principalement occupé de [rôle et réalisations]. Nom 2 a pris en charge [rôle et réalisations]. Nom 3 a travaillé sur [rôle et réalisations]. Nom 4 a assuré [rôle et réalisations]. Nous avons partagé [revues, arbitrages ou tests réellement communs].",
        ],
        ecran: "Quatre cartes, une par personne, avec le rôle et une réalisation visible dans l'application. Ne pas dépasser deux réalisations par personne." },
      { range: "4", title: "Profils et utilisateurs", duree: "1 min 30",
        script: [
          "L'application vise les équipes d'un laboratoire. Elle distingue trois profils, et seulement trois : administrateur, gestionnaire et utilisateur.",
          "L'administrateur supervise toutes les données, les projets, les archives — et gère désormais lui-même les comptes : création, changement de rôle, désactivation.",
          "Le gestionnaire tient l'inventaire et les catégories, mais n'accède jamais aux projets.",
          "L'utilisateur consulte le matériel et collabore sur les projets. Et quand on parle de « responsable » d'un projet, ce n'est pas un rôle à part : c'est simplement l'utilisateur qui a créé ce projet.",
        ],
        ecran: "Les trois cartes de profils avec leurs droits respectifs." },
    ],
    transition: "Pour réaliser cet ensemble, nous avons choisi une architecture qui sépare clairement l'interface, les règles métier, les données et les fichiers. Nom 2 va vous présenter ces choix.",
  },
  {
    nom: "Nom 2", partie: "Technologies, architecture et méthode", duree: "4 min 30",
    slides: "5 à 7", questions: "Choix techniques, sécurité, déploiement",
    suivant: "Nom 3", suivantSujet: "la démonstration fonctionnelle",
    sections: [
      { range: "5", title: "Technologies", duree: "2 min 15",
        script: [
          "Ne pas énumérer toutes les versions. Relier chaque choix à son usage.",
          "Vue 3 structure l'interface en composants réutilisables : tableaux, Kanban, pages dédiées, des écrans qui changent selon le profil. Vite accélère le développement et produit la version de déploiement.",
          "L'API repose sur Express et Node.js. Elle centralise les autorisations et les règles métier : l'interface ne décide jamais seule si une action est permise. Zod contrôle systématiquement les données reçues.",
          "PostgreSQL répond au caractère relationnel du projet : utilisateurs, projets, membres, tâches, matériels et réservations sont liés. Prisma fournit le modèle de données, les migrations et les transactions.",
          "Les pièces jointes ne sont pas dans la base : elles sont stockées dans un bucket S3 privé, accessible par lien signé temporaire. Docker Compose permet de lancer tous les services de façon reproductible, en une commande.",
        ],
        ecran: "Six cartes technologies, une par brique (interface, API, données, accès aux données, fichiers, déploiement)." },
      { range: "6", title: "Architecture et sécurité", duree: "1 min 30",
        script: [
          "Le navigateur passe par Nginx, qui sert l'interface Vue et transmet les appels vers l'API Express. L'API applique les droits et accède à PostgreSQL. Dans la configuration Docker, l'API et la base ne sont pas exposées directement sur le poste.",
          "Pour les fichiers, l'API vérifie d'abord l'autorisation, puis fournit une URL temporaire. Le navigateur communique alors avec le stockage S3 privé, sans jamais recevoir les identifiants permanents du stockage.",
          "La session utilise un jeton de courte durée placé dans un cookie HttpOnly, et les mots de passe sont chiffrés avec bcrypt, jamais stockés en clair. Dans le prototype, la connexion simule encore l'environnement Intradef — une limite que nous présenterons à la fin.",
        ],
        ecran: "Le schéma de flux (requête et fichier joint) et les quatre points de sécurité." },
      { range: "7", title: "Réalisation", duree: "0 min 45",
        script: [
          "Le projet a avancé en cinq incréments : le socle et les profils, les projets et le Kanban, l'inventaire et les pièces jointes, les réservations et les notifications, puis le calendrier et les exports.",
          "Au-delà de ces cinq sprints, nous avons ajouté plusieurs évolutions avec le client — elles sont listées ici et détaillées en annexe, je n'en lirai qu'une en passant : la possibilité pour l'administrateur de gérer entièrement les comptes.",
        ],
        ecran: "Les cinq cartes de sprint et le bloc « itérations complémentaires »." },
    ],
    transition: "Ces incréments forment aujourd'hui un parcours continu. Nom 3 va vous le montrer en se plaçant dans la situation d'un membre du laboratoire.",
  },
  {
    nom: "Nom 3", partie: "Démonstration fonctionnelle", duree: "4 min 30",
    slides: "8 à 9, puis l'application", questions: "Parcours utilisateur, ergonomie, fonctions métier",
    suivant: "Nom 4", suivantSujet: "les règles métier, la qualité et les limites",
    intro: "Contrairement aux trois autres parties, celle-ci est jouée en solo : vous enchaînez les quatre comptes de démonstration vous-même (gestionnaire, utilisateur qui crée le projet, utilisateur membre, administrateur). Préparez à l'avance quatre onglets déjà connectés pour basculer vite, sans ressaisir les identifiants à chaque fois.",
    sections: [
      { range: "8", title: "Démonstration — annonce", duree: "0 min 15",
        script: ["Le labo reçoit un analyseur de spectre. Une équipe le réserve pour sa campagne de mesures. Le projet se termine, l'appareil redevient libre. Je vais vous montrer ce parcours en quatre actes, avec les quatre profils de l'application."],
        ecran: "Diapositive des quatre actes, affichée quelques secondes avant de basculer dans l'application." },
      { range: "9 / Acte 1", title: "Gestionnaire — inventaire", duree: "1 min 00",
        script: [
          "Je me connecte avec le compte gestionnaire. Il tient l'inventaire actif et les catégories, mais n'a aucun accès aux projets.",
          "J'ouvre la fiche de l'analyseur, je montre le seuil d'alerte sur un autre matériel déjà en rupture — ici affiché à tous, pas seulement au gestionnaire — puis j'exporte l'inventaire en Excel.",
        ],
        ecran: "Inventaire : colonnes Quantité et Seuil d'alerte, bouton Exporter." },
      { range: "9 / Acte 2", title: "Utilisateur — crée le projet", duree: "1 min 15",
        script: [
          "Je bascule sur un compte utilisateur, déjà responsable du projet de démonstration — c'est-à-dire que c'est lui qui l'a créé.",
          "La fiche du projet est maintenant une vraie page, avec sa propre adresse, plutôt qu'une fenêtre. J'ajoute un membre, je fais avancer une tâche du Kanban jusqu'à la colonne En revue, et j'exporte la documentation en Word.",
        ],
        ecran: "Page du projet : onglets Membres et le tableau Kanban à quatre colonnes." },
      { range: "9 / Acte 3", title: "Utilisateur — membre", duree: "1 min 15",
        script: [
          "Je bascule sur le compte d'un simple membre du même projet.",
          "Je réserve le matériel individualisé sur un créneau de trente minutes, puis je tente un second créneau qui chevauche le premier : l'API le refuse.",
          "J'ouvre le calendrier : la réservation apparaît, et un projet auquel je n'ai pas accès reste masqué sous la mention « Réservé », sans révéler son nom.",
        ],
        ecran: "Message de refus de chevauchement, puis le calendrier avec le créneau réservé." },
      { range: "9 / Acte 4", title: "Administrateur", duree: "1 min 00",
        script: [
          "Je termine avec le compte administrateur. Je montre la gestion des comptes : changer un rôle, désactiver un compte.",
          "J'archive le matériel réservé par le projet de démonstration : une notification part vers les membres concernés. Puis je termine la dernière tâche du Kanban : le projet se clôt automatiquement, son statut passe à Clôturé.",
        ],
        ecran: "Page Utilisateurs, puis l'archivage et la clôture automatique visibles en direct." },
    ],
    secours: "Si une étape échoue : dire immédiatement « Nous avons préparé les étapes principales sous forme de captures afin de poursuivre le scénario sans perdre le fil », montrer l'Annexe D, et continuer les explications prévues sans chercher la cause devant le jury.",
    transition: "Ce parcours repose sur des règles communes à tous les écrans. Nom 4 va résumer ces contrôles, la qualité vérifiée et les suites possibles.",
  },
  {
    nom: "Nom 4", partie: "Droits, qualité, limites, évolutions et conclusion", duree: "4 min 30",
    slides: "10 à 13", questions: "Tests, règles de gestion, améliorations futures",
    suivant: null, suivantSujet: null,
    sections: [
      { range: "10", title: "Règles métier", duree: "1 min 30",
        script: [
          "Le point central du projet est la cohérence des droits et des données. Un projet privé ne doit pas être découvert par un utilisateur extérieur. Le gestionnaire travaille sur l'inventaire, mais ne peut consulter aucun projet. Ces règles sont contrôlées par l'API, même si quelqu'un contourne l'interface.",
          "Nommer un nouveau gestionnaire rétrograde automatiquement le précédent : un seul gestionnaire peut être actif à la fois. Les réservations concernent uniquement le matériel individualisé, et deux créneaux incompatibles ne peuvent jamais se chevaucher. L'archivage ne supprime pas les traces : il conserve l'historique et libère les réservations concernées. Enfin, terminer la dernière tâche active peut clôturer automatiquement le projet.",
        ],
        ecran: "Les six cartes de règles métier." },
      { range: "11", title: "Bilan", duree: "1 min 15",
        script: [
          "Nous avons exécuté 46 tests automatisés côté serveur et 14 côté interface, et tracé 23 décisions de cadrage avec le client.",
          "Le prototype garde des limites que nous assumons : l'authentification Intradef reste simulée, aucune fonction d'intelligence artificielle n'est livrée malgré le nom, la réservation se crée depuis le projet et non depuis le calendrier, supprimer un compte signifie le désactiver — jamais une suppression physique — et les notifications restent limitées à l'archivage d'un matériel réservé. Les sauvegardes et les volumes cibles restent à définir avec le client.",
        ],
        ecran: "Les trois chiffres clés et le bloc Limites assumées." },
      { range: "12", title: "Évolutions réalistes", duree: "1 min 00",
        script: [
          "La première évolution serait de brancher l'authentification réelle du réseau cible à la place de la connexion simulée, sans changer le reste de l'application.",
          "Ensuite, une analyse antivirus des pièces jointes avant leur mise à disposition : le circuit d'envoi par lien signé s'y prête déjà.",
          "Un QR code sur chaque appareil permettrait d'ouvrir sa fiche ou de le réserver directement depuis la paillasse. Et une aide fondée sur l'IA, hébergée en interne, pourra être étudiée plus tard, uniquement à partir d'un besoin validé et de règles de confidentialité claires.",
        ],
        ecran: "Les quatre pistes d'évolution, présentées comme des pistes et non des fonctions livrées." },
      { range: "13", title: "Conclusion", duree: "0 min 45",
        script: [
          "SUIVI réunit dans une seule application l'inventaire, les projets et les réservations du laboratoire. La séparation des profils protège les informations, les historiques et les archives assurent la traçabilité.",
          "Merci pour votre attention. Nous sommes prêts à répondre à vos questions.",
        ],
        ecran: "Diapositive de conclusion, fond sombre." },
    ],
  },
];

function buildDoc(speaker, allSpeakers) {
  const children = [];

  children.push(h1(`SUIVI — Fiche orateur · ${speaker.nom}`));
  children.push(infoTable([
    ["Partie principale", speaker.partie],
    ["Diapositives", speaker.slides],
    ["Durée cible", speaker.duree],
    ["Questions prioritaires", speaker.questions],
  ]));
  children.push(new Paragraph({ spacing: { before: 200 } }));

  if (speaker.intro) {
    children.push(tipBox("À savoir avant de commencer", [speaker.intro]));
    children.push(new Paragraph({ spacing: { before: 120 } }));
  }

  for (const s of speaker.sections) {
    children.push(timingLine(s.range, s.title, s.duree));
    s.script.forEach((line) => children.push(quote(line)));
    if (s.ecran) children.push(cue(s.ecran));
  }

  if (speaker.secours) {
    children.push(h2("Plan de secours"));
    children.push(body(speaker.secours));
  }

  if (speaker.transition) {
    children.push(h2("Transition"));
    children.push(quote(speaker.transition));
  }

  children.push(h2("Organisation des questions (10 minutes, hors chronométrage)"));
  children.push(bullet(`Vous répondez en priorité sur : ${speaker.questions.toLowerCase()}.`));
  children.push(bullet("Une personne répond d'abord ; une seconde complète seulement si elle apporte un élément nouveau."));
  children.push(bullet("Si la réponse n'est pas connue, dire ce qui reste à valider plutôt que d'improviser."));

  children.push(h2("Repères chronométrés de la répétition"));
  const rows = [["Intervenant", "Fin prévue"]];
  let cum = 0;
  for (const sp of allSpeakers) {
    cum += 4.5;
    rows.push([sp.nom + (sp.nom === speaker.nom ? " (vous)" : ""), `${Math.floor(cum)} min ${cum % 1 === 0 ? "00" : "30"}`]);
  }
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [4800, 4800],
    rows: rows.map(([a, b], i) => new TableRow({
      children: [a, b].map((t) => new TableCell({
        width: { size: 4800, type: WidthType.DXA },
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: "0D2046" } : undefined,
        margins: { top: 90, bottom: 90, left: 150, right: 100 },
        children: [new Paragraph({ children: [new TextRun({
          text: t, bold: i === 0, size: 20, font: "Calibri", color: i === 0 ? WHITE : "1A1A1A",
        })] })],
      })),
    })),
  }));

  const doc = new Document({
    numbering: {
      config: [{
        reference: "puces",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.18) } } } }],
      }],
    },
    sections: [{
      properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
      children,
    }],
  });
  return doc;
}

async function main() {
  for (const speaker of SPEAKERS) {
    const doc = buildDoc(speaker, SPEAKERS);
    const buf = await Packer.toBuffer(doc);
    const file = path.join(__dirname, `Fiche orateur - ${speaker.nom}.docx`);
    fs.writeFileSync(file, buf);
    console.log("written", file);
  }
}
main();
