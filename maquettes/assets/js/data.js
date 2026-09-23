/* Mock data shared across pages — no backend. Persistée en session via localStorage (voir le bloc
   de sauvegarde en fin de fichier), pour que les actions faites sur une page (créer une réservation,
   clôturer un projet, supprimer un matériel...) restent visibles après avoir changé de page — sans
   quoi chaque navigation rechargerait les données de démonstration d'origine. */
window.StockFlowData = {
  // visibilite ajouté : champ minimum requis par le dictionnaire de données, absent jusqu'ici.
  projets: [
    { id: "PRJ-2041", nom: "Refonte entrepôt Nord", responsable: "Léa Fournier", echeance: "12 oct. 2026", statut: "Actif", groupe: "En cours", visibilite: "public", description: "Réorganisation complète des zones de stockage et mise à jour du plan d'implantation de l'entrepôt Nord, avec balisage des zones et cartographie des flux de picking." },
    { id: "PRJ-2038", nom: "Migration ERP", responsable: "Marc Vidal", echeance: "29 sept. 2026", statut: "Actif", groupe: "En cours", visibilite: "prive", description: "Migration des données de gestion de stock et des projets en cours vers le nouvel ERP, sans interruption de service." },
    { id: "PRJ-2035", nom: "Audit stock saisonnier", responsable: "Léa Fournier", echeance: "14 oct. 2026", statut: "Actif", groupe: "En cours", visibilite: "public", description: "Contrôle et audit du stock avant la saison haute, avec rapprochement des écarts d'inventaire." },
    { id: "PRJ-2029", nom: "Réassort fournisseur B", responsable: "Marc Vidal", echeance: "—", statut: "En attente", groupe: "En attente", visibilite: "public", description: "Préparation d'une commande de réassort auprès du fournisseur B, en attente de validation budgétaire." },
    { id: "PRJ-2027", nom: "Ouverture site Rennes", responsable: "Marc Vidal", echeance: "—", statut: "En attente", groupe: "En attente", visibilite: "prive", description: "Cadrage de l'ouverture d'un nouveau site de stockage à Rennes." },
    { id: "PRJ-1998", nom: "Inventaire annuel 2025", responsable: "Léa Fournier", echeance: "31 déc. 2025", statut: "Clôturé", groupe: "Clôturés", visibilite: "public", description: "Inventaire physique annuel de l'ensemble du stock, toutes catégories confondues." },
    { id: "PRJ-1984", nom: "Refonte étiquetage", responsable: "Marc Vidal", echeance: "15 août 2025", statut: "Clôturé", groupe: "Clôturés", visibilite: "public", description: "Refonte des étiquettes et codes-barres de l'ensemble du matériel non individualisé." },
  ],

  // Champs alignés sur docs/dictionnaire-donnees.md (§ Matériel), à deux exceptions près :
  // - quantite/seuilAlerte ont été réintroduits à la demande du client (écart assumé avec le
  //   dictionnaire, qui ne prévoyait aucun compteur — à faire valider dans les décisions du projet) ;
  //   uniquement pertinent pour le non-individualisé (quantite/seuilAlerte restent null sinon).
  // - categorie est un champ UNIQUE par demande explicite du client, alors que le dictionnaire
  //   décrit une relation matériel↔catégorie 0..n / 0..n (§ Catégorie, § Relations). Écart assumé,
  //   à faire valider dans les décisions du projet.
  categoriesMateriel: ["Matières premières", "Composants", "Consommables"],

  inventaire: [
    { ref: "REF-1024", designation: "Profilé aluminium 40x40", categorie: "Matières premières", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "PRO-AL-4040", numeroInventaire: "REF-1024", quantite: 240, seuilAlerte: 80, statut: "Actif", suppression: null, creeLe: "3 sept. 2026", creePar: "Camille Doré" },
    { ref: "REF-1038", designation: "Tôle acier galvanisée 2m", categorie: "Matières premières", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "TAG-2000", numeroInventaire: "REF-1038", quantite: 12, seuilAlerte: 20, statut: "Actif", suppression: null, creeLe: "3 sept. 2026", creePar: "Camille Doré" },
    { ref: "REF-1053", designation: "Joint EPDM 3m", categorie: "Matières premières", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "EPDM-3M", numeroInventaire: "REF-1053", quantite: 0, seuilAlerte: 15, statut: "Actif", suppression: null, creeLe: "4 sept. 2026", creePar: "Camille Doré" },
    { ref: "REF-2087", designation: "Roulement à billes 6204", categorie: "Composants", modeSuivi: "individualise", numeroSerie: "RB6204-0091", referenceConstructeur: "6204-2RS", numeroInventaire: "REF-2087", quantite: null, seuilAlerte: null, statut: "Actif", suppression: null, creeLe: "5 sept. 2026", creePar: "Yanis Belkacem" },
    { ref: "REF-2092", designation: "Vérin pneumatique EV220", categorie: "Composants", modeSuivi: "individualise", numeroSerie: "EV220-0044", referenceConstructeur: "EV220", numeroInventaire: "REF-2092", quantite: null, seuilAlerte: null, statut: "Actif", suppression: null, creeLe: "5 sept. 2026", creePar: "Yanis Belkacem" },
    { ref: "REF-2106", designation: "Capteur inductif M18", categorie: "Composants", modeSuivi: "individualise", numeroSerie: "CAP-M18-0012", referenceConstructeur: "M18-IND", numeroInventaire: "REF-2106", quantite: null, seuilAlerte: null, statut: "Actif", suppression: null, creeLe: "8 sept. 2026", creePar: "Alexandre S." },
    { ref: "REF-3044", designation: "Carton triple cannelure", categorie: "Consommables", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "CTC-STD", numeroInventaire: "REF-3044", quantite: 1240, seuilAlerte: 300, statut: "Actif", suppression: null, creeLe: "10 sept. 2026", creePar: "Camille Doré" },
    { ref: "REF-3059", designation: "Ruban adhésif renforcé", categorie: "Consommables", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "RUB-REN", numeroInventaire: "REF-3059", quantite: 8, seuilAlerte: 50, statut: "Actif", suppression: null, creeLe: "10 sept. 2026", creePar: "Camille Doré" },
  ],

  // Historique par matériel (US-12) — accessible uniquement admin/gestionnaire ; le gestionnaire
  // ne voit jamais d'information de projet dans ces événements (CA2).
  historiqueMateriel: {
    "REF-1024": [{ date: "3 sept. 2026", auteur: "Camille Doré", nature: "creation", detail: "Création de la fiche." }],
    "REF-1038": [{ date: "3 sept. 2026", auteur: "Camille Doré", nature: "creation", detail: "Création de la fiche." }],
    "REF-1053": [{ date: "4 sept. 2026", auteur: "Camille Doré", nature: "creation", detail: "Création de la fiche." }],
    "REF-2087": [
      { date: "5 sept. 2026", auteur: "Yanis Belkacem", nature: "creation", detail: "Création de la fiche." },
      { date: "12 sept. 2026", auteur: "Alexandre S.", nature: "modification", detail: "Référence constructeur corrigée." },
    ],
    "REF-2092": [{ date: "5 sept. 2026", auteur: "Yanis Belkacem", nature: "creation", detail: "Création de la fiche." }],
    "REF-2106": [{ date: "8 sept. 2026", auteur: "Alexandre S.", nature: "creation", detail: "Création de la fiche." }],
    "REF-3044": [{ date: "10 sept. 2026", auteur: "Camille Doré", nature: "creation", detail: "Création de la fiche." }],
    "REF-3059": [{ date: "10 sept. 2026", auteur: "Camille Doré", nature: "creation", detail: "Création de la fiche." }],
  },

  // Pièces jointes par matériel (US-33) — nom, date d'ajout et auteur au minimum (CA2).
  // Le stockage réel du fichier n'existe pas dans cette maquette statique : seules les métadonnées sont mockées.
  piecesJointesMateriel: {
    "REF-2087": [
      { nom: "facture-roulements-sept2026.pdf", dateAjout: "5 sept. 2026", auteur: "Yanis Belkacem" },
    ],
    "REF-2092": [
      { nom: "bon-commande-verins-2026.pdf", dateAjout: "5 sept. 2026", auteur: "Yanis Belkacem" },
      { nom: "facture-verins-2026.pdf", dateAjout: "6 sept. 2026", auteur: "Camille Doré" },
    ],
  },

  utilisateurs: [
    { id: "USR-01", nom: "Camille Doré", email: "camille.dore@labo.fr", role: "Gestionnaire", statut: "Actif" },
    { id: "USR-02", nom: "Yanis Belkacem", email: "yanis.belkacem@labo.fr", role: "Gestionnaire", statut: "Actif" },
    { id: "USR-03", nom: "Léa Fournier", email: "lea.fournier@labo.fr", role: "Utilisateur", statut: "Actif" },
    { id: "USR-04", nom: "Marc Vidal", email: "marc.vidal@labo.fr", role: "Utilisateur", statut: "Actif" },
    { id: "USR-05", nom: "Alexandre S.", email: "alexandre.s@labo.fr", role: "Administrateur", statut: "Actif" },
    { id: "USR-06", nom: "Nora Haddad", email: "nora.haddad@labo.fr", role: "Utilisateur", statut: "Suspendu" },
  ],

  // Un tableau Kanban par projet. Cohérent avec le statut déclaré ci-dessus :
  // En attente -> tout en "a-faire" ; Clôturé -> tout en "termine" ; Actif -> au moins une tâche ailleurs.
  kanbanParProjet: {
    "PRJ-2041": {
      "a-faire": { title: "À faire", tasks: [
        { id: "t1", title: "Baliser les zones de la zone B", tag: { label: "Sécurité", tone: "danger" }, due: "18 sept.", assignee: "LF" },
        { id: "t2", title: "Commander les racks modulables", tag: { label: "Achats", tone: "warning" }, due: "22 sept.", assignee: "MV" },
        { id: "t3", title: "Valider le plan d'implantation", tag: { label: "Logistique", tone: "info" }, due: "25 sept.", assignee: "LF" },
        { id: "t20", title: "Vérifier les accès badge zone B", tag: { label: "Sécurité", tone: "danger" }, due: "26 sept.", assignee: "LF" },
        { id: "t21", title: "Nettoyer l'allée C avant travaux", tag: { label: "Logistique", tone: "info" }, due: "28 sept.", assignee: "MV" },
      ]},
      "en-cours": { title: "En cours", tasks: [
        { id: "t4", title: "Cartographier les flux de picking", tag: { label: "Logistique", tone: "info" }, due: "20 sept.", assignee: "MV" },
        { id: "t22", title: "Réceptionner les nouveaux racks", tag: { label: "Achats", tone: "warning" }, due: "1 oct.", assignee: "MV" },
      ]},
      "en-revue": { title: "En revue", tasks: [
        { id: "t5", title: "Droits fournisseur nauyoscage", tag: { label: "Process", tone: "success" }, due: "—", assignee: "MV" },
        { id: "t6", title: "Aide de sécurité mise à jour", tag: { label: "Sécurité", tone: "danger" }, due: "—", assignee: "LF" },
      ]},
      "termine": { title: "Terminé", tasks: [
        { id: "t7", title: "Réunion de cadrage", tag: { label: "Réunion", tone: "info" }, due: "—", assignee: "LF" },
      ]},
    },

    "PRJ-2038": {
      "a-faire": { title: "À faire", tasks: [
        { id: "t8", title: "Recenser les références actives dans l'ancien ERP", tag: { label: "Process", tone: "success" }, due: "18 sept.", assignee: "MV" },
        { id: "t9", title: "Planifier la bascule des accès", tag: { label: "Process", tone: "success" }, due: "24 sept.", assignee: "MV" },
        { id: "t23", title: "Nettoyer les doublons fournisseurs", tag: { label: "Process", tone: "success" }, due: "26 sept.", assignee: "MV" },
      ]},
      "en-cours": { title: "En cours", tasks: [
        { id: "t10", title: "Cartographier les champs à migrer", tag: { label: "Process", tone: "success" }, due: "15 sept.", assignee: "MV" },
        { id: "t24", title: "Former les référents métier", tag: { label: "Réunion", tone: "info" }, due: "19 sept.", assignee: "MV" },
      ]},
      "en-revue": { title: "En revue", tasks: [
        { id: "t25", title: "Valider le mapping des statuts de commande", tag: { label: "Process", tone: "success" }, due: "—", assignee: "MV" },
      ]},
      "termine": { title: "Terminé", tasks: [
        { id: "t11", title: "Réunion de cadrage ERP", tag: { label: "Réunion", tone: "info" }, due: "—", assignee: "MV" },
      ]},
    },

    "PRJ-2035": {
      "a-faire": { title: "À faire", tasks: [
        { id: "t12", title: "Préparer les fiches de comptage zone Matières premières", tag: { label: "Logistique", tone: "info" }, due: "1 oct.", assignee: "LF" },
        { id: "t26", title: "Bloquer les mouvements de stock pendant l'audit", tag: { label: "Process", tone: "success" }, due: "2 oct.", assignee: "LF" },
      ]},
      "en-cours": { title: "En cours", tasks: [
        { id: "t13", title: "Compter la zone Composants", tag: { label: "Logistique", tone: "info" }, due: "28 sept.", assignee: "LF" },
      ]},
      "en-revue": { title: "En revue", tasks: [
        { id: "t27", title: "Valider les écarts avant clôture", tag: { label: "Process", tone: "success" }, due: "—", assignee: "LF" },
      ]},
      "termine": { title: "Terminé", tasks: [] },
    },

    "PRJ-2029": {
      "a-faire": { title: "À faire", tasks: [
        { id: "t14", title: "Demander un devis au fournisseur B", tag: { label: "Achats", tone: "warning" }, due: "—", assignee: "MV" },
        { id: "t15", title: "Valider le budget avec l'administrateur", tag: { label: "Achats", tone: "warning" }, due: "—", assignee: "MV" },
        { id: "t28", title: "Comparer les tarifs avec le fournisseur A", tag: { label: "Achats", tone: "warning" }, due: "—", assignee: "MV" },
        { id: "t29", title: "Rédiger le bon de commande", tag: { label: "Achats", tone: "warning" }, due: "—", assignee: "MV" },
      ]},
      "en-cours": { title: "En cours", tasks: [] },
      "en-revue": { title: "En revue", tasks: [] },
      "termine": { title: "Terminé", tasks: [] },
    },

    "PRJ-2027": {
      "a-faire": { title: "À faire", tasks: [
        { id: "t16", title: "Identifier un local disponible", tag: { label: "Logistique", tone: "info" }, due: "—", assignee: "MV" },
        { id: "t30", title: "Estimer le budget d'aménagement", tag: { label: "Achats", tone: "warning" }, due: "—", assignee: "MV" },
        { id: "t31", title: "Contacter l'agence immobilière", tag: { label: "Logistique", tone: "info" }, due: "—", assignee: "MV" },
      ]},
      "en-cours": { title: "En cours", tasks: [] },
      "en-revue": { title: "En revue", tasks: [] },
      "termine": { title: "Terminé", tasks: [] },
    },

    "PRJ-1998": {
      "a-faire": { title: "À faire", tasks: [] },
      "en-cours": { title: "En cours", tasks: [] },
      "en-revue": { title: "En revue", tasks: [] },
      "termine": { title: "Terminé", tasks: [
        { id: "t17", title: "Compter l'ensemble des zones", tag: { label: "Logistique", tone: "info" }, due: "—", assignee: "LF" },
        { id: "t18", title: "Rapprocher les écarts d'inventaire", tag: { label: "Process", tone: "success" }, due: "—", assignee: "LF" },
        { id: "t32", title: "Archiver les fiches de comptage", tag: { label: "Process", tone: "success" }, due: "—", assignee: "LF" },
        { id: "t33", title: "Transmettre le rapport à la direction", tag: { label: "Réunion", tone: "info" }, due: "—", assignee: "LF" },
      ]},
    },

    "PRJ-1984": {
      "a-faire": { title: "À faire", tasks: [] },
      "en-cours": { title: "En cours", tasks: [] },
      "en-revue": { title: "En revue", tasks: [] },
      "termine": { title: "Terminé", tasks: [
        { id: "t19", title: "Réimprimer les étiquettes composants", tag: { label: "Process", tone: "success" }, due: "—", assignee: "MV" },
        { id: "t34", title: "Mettre à jour le gabarit d'impression", tag: { label: "Process", tone: "success" }, due: "—", assignee: "MV" },
        { id: "t35", title: "Distribuer les nouvelles étiquettes en zone Nord", tag: { label: "Logistique", tone: "info" }, due: "—", assignee: "MV" },
      ]},
    },
  },

  // Membres par projet — le gestionnaire ne peut jamais être membre d'un projet (RG dictionnaire de données).
  // Chaque entrée référence un id de StockFlowData.utilisateurs ; "role" est la relation au projet
  // (Responsable/Membre — terminologie D-07, qui remplace "créateur"), distincte du rôle global de l'utilisateur.
  // Le responsable est obligatoirement membre (dictionnaire § Participation à un projet).
  projetMembres: {
    "PRJ-2041": [
      { userId: "USR-03", role: "Responsable" },
      { userId: "USR-04", role: "Membre" },
    ],
    "PRJ-2038": [{ userId: "USR-04", role: "Responsable" }],
    "PRJ-2035": [{ userId: "USR-03", role: "Responsable" }],
    "PRJ-2029": [{ userId: "USR-04", role: "Responsable" }],
    "PRJ-2027": [{ userId: "USR-04", role: "Responsable" }],
    "PRJ-1998": [{ userId: "USR-03", role: "Responsable" }],
    "PRJ-1984": [{ userId: "USR-04", role: "Responsable" }],
  },

  // Documentation Markdown par projet — un seul document par projet (US-32), pas une liste de fichiers.
  // Les projets sans entrée ici affichent un message "aucune documentation rédigée" (comportement normal).
  documentation: {
    "PRJ-2041": `# Refonte entrepôt Nord

## Objectif

Réorganiser les zones de stockage de l'entrepôt Nord et mettre à jour le plan d'implantation
pour fluidifier les flux de picking.

## Périmètre

- Balisage des zones A, B et C
- Cartographie des flux de picking
- Réagencement des racks modulables

## Notes

Ce document sert de référence pour l'équipe projet. Il peut être exporté en **DOCX** pour être
partagé en dehors de SUIVI.
`,
    "PRJ-2038": `# Migration ERP

## Objectif

Migrer les données de gestion de stock et de suivi de projets vers le nouvel ERP, sans
interruption de service.

## Périmètre

- Recensement des références actives
- Cartographie des champs à migrer
- Bascule des accès utilisateurs
`,
  },

  // Historique des modifications d'un projet (US-31) — événements datés et attribués (création,
  // informations, visibilité, membres, tâches, clôture/archivage — dictionnaire § Historique des
  // modifications d'un projet). Remplace l'ancien tableau plat "historique" du Sprint 2, qui n'était
  // qu'un instantané figé de création et ne s'alimentait jamais réellement (US-31 étant du Sprint 4).
  historiqueProjet: {
    "PRJ-2041": [{ date: "8 sept. 2026", auteur: "Léa Fournier", nature: "creation", detail: "Création du projet." }],
    "PRJ-2038": [{ date: "8 sept. 2026", auteur: "Marc Vidal", nature: "creation", detail: "Création du projet." }],
    "PRJ-2035": [{ date: "4 sept. 2026", auteur: "Léa Fournier", nature: "creation", detail: "Création du projet." }],
    "PRJ-2029": [{ date: "18 août 2026", auteur: "Marc Vidal", nature: "creation", detail: "Création du projet." }],
    "PRJ-2027": [{ date: "3 août 2026", auteur: "Marc Vidal", nature: "creation", detail: "Création du projet." }],
    "PRJ-1998": [
      { date: "31 déc. 2025", auteur: "Léa Fournier", nature: "creation", detail: "Création du projet." },
      { date: "31 déc. 2025", auteur: "Léa Fournier", nature: "cloture", detail: "Projet clôturé automatiquement (dernière tâche terminée)." },
    ],
    "PRJ-1984": [
      { date: "15 août 2025", auteur: "Marc Vidal", nature: "creation", detail: "Création du projet." },
      { date: "15 août 2025", auteur: "Marc Vidal", nature: "cloture", detail: "Projet clôturé automatiquement (dernière tâche terminée)." },
    ],
  },

  // Réservations de matériel individualisé pour un projet (US-22 à US-25). Une réservation
  // n'existe que pour du matériel individualisé (dictionnaire § Réservation) ; les bornes suivent
  // la proposition [début, fin[ et les minutes 00/30 (Q-22 non tranchée, retenu comme hypothèse de
  // travail à valider). "statut" : "active" ou "annulee" ; l'état planifiée/en cours/passée se calcule
  // à partir des dates (StockFlowData.etatReservation), il n'est pas stocké.
  reservations: [
    { id: "RES-0001", ref: "REF-2087", projetId: "PRJ-2041", reservantId: "USR-03", reservantNom: "Léa Fournier", creeLe: "10 sept. 2026", debut: "2026-09-10T08:00", fin: "2026-09-12T17:00", statut: "annulee", annuleLe: "11 sept. 2026", annulePar: "Léa Fournier", motifAnnulation: "Changement de planning" },
    { id: "RES-0002", ref: "REF-2092", projetId: "PRJ-2041", reservantId: "USR-04", reservantNom: "Marc Vidal", creeLe: "15 sept. 2026", debut: "2026-09-20T09:00", fin: "2026-09-20T12:00", statut: "active", annuleLe: null, annulePar: null, motifAnnulation: null },
    { id: "RES-0003", ref: "REF-2106", projetId: "PRJ-2038", reservantId: "USR-04", reservantNom: "Marc Vidal", creeLe: "18 sept. 2026", debut: "2026-09-22T00:00", fin: "2026-09-26T00:00", statut: "active", annuleLe: null, annulePar: null, motifAnnulation: null },
  ],

  // Notifications internes déclenchées par un événement système (US-27, US-28) — une ligne par
  // destinataire (dictionnaire § Notification : "créer une notification propre à chacun"), distinctes
  // des demandes de réapprovisionnement (StockFlowData.notifications, mock du Sprint 3).
  notificationsInternes: [],
};

// Réservations (US-22 à US-25) — matériel individualisé uniquement (dictionnaire § Réservation).
// Bornes [début, fin[ : une réservation qui finit à l'instant T n'empêche pas une autre de
// commencer à T (Q-22 non tranchée, hypothèse de travail à documenter côté décisions du projet).
function chevaucheIntervalle(debutA, finA, debutB, finB) {
  return debutA < finB && debutB < finA;
}
window.StockFlowData.reservationsDuMateriel = function (ref) {
  return window.StockFlowData.reservations.filter((r) => r.ref === ref);
};
window.StockFlowData.reservationsDuProjet = function (projetId) {
  return window.StockFlowData.reservations.filter((r) => r.projetId === projetId);
};
// État calculé d'une réservation active : planifiée / en cours / passée (dictionnaire § Réservation :
// "peuvent être calculés"). Une réservation annulée garde son propre statut, distinct de ces trois états.
window.StockFlowData.etatReservation = function (reservation, maintenant) {
  if (reservation.statut === "annulee") return "annulee";
  const now = maintenant || new Date();
  const debut = new Date(reservation.debut);
  const fin = new Date(reservation.fin);
  if (now < debut) return "planifiee";
  if (now >= fin) return "passee";
  return "en_cours";
};
window.StockFlowData.reservationActiveMaintenant = function (ref, maintenant) {
  const now = maintenant || new Date();
  return window.StockFlowData.reservationsDuMateriel(ref).find((r) => window.StockFlowData.etatReservation(r, now) === "en_cours") || null;
};
window.StockFlowData.chevauchementReservation = function (ref, debut, fin, excludeId) {
  const debutMs = new Date(debut).getTime();
  const finMs = new Date(fin).getTime();
  return window.StockFlowData.reservations.some((r) =>
    r.ref === ref && r.statut === "active" && r.id !== excludeId &&
    chevaucheIntervalle(debutMs, finMs, new Date(r.debut).getTime(), new Date(r.fin).getTime())
  );
};
// CA2/CA5 (US-22) : fin strictement après début, minutes 00 ou 30 uniquement (proposition Q-22).
window.StockFlowData.reservationValide = function (debut, fin) {
  if (!debut || !fin) return false;
  const d = new Date(debut), f = new Date(fin);
  if (isNaN(d) || isNaN(f) || f <= d) return false;
  return d.getMinutes() % 30 === 0 && f.getMinutes() % 30 === 0;
};
window.StockFlowData.creerReservation = function ({ ref, projetId, debut, fin, reservantId, reservantNom }) {
  const id = `RES-${String(window.StockFlowData.reservations.length + 1).padStart(4, "0")}-${Date.now()}`;
  const reservation = { id, ref, projetId, reservantId, reservantNom, creeLe: "aujourd'hui", debut, fin, statut: "active", annuleLe: null, annulePar: null, motifAnnulation: null };
  window.StockFlowData.reservations.push(reservation);
  return reservation;
};
window.StockFlowData.modifierReservation = function (id, { debut, fin }) {
  const r = window.StockFlowData.reservations.find((x) => x.id === id);
  if (r) { r.debut = debut; r.fin = fin; }
  return r;
};
window.StockFlowData.annulerReservation = function (id, auteurNom, motif) {
  const r = window.StockFlowData.reservations.find((x) => x.id === id);
  if (!r || r.statut === "annulee") return r;
  r.statut = "annulee";
  r.annuleLe = "aujourd'hui";
  r.annulePar = auteurNom;
  r.motifAnnulation = motif || "Annulation manuelle";
  return r;
};
// US-20 CA3 : la clôture d'un projet libère immédiatement son matériel réservé (futur compris).
window.StockFlowData.libererReservationsProjet = function (projetId, auteurNom, motif) {
  return window.StockFlowData.reservationsDuProjet(projetId)
    .filter((r) => r.statut === "active")
    .map((r) => window.StockFlowData.annulerReservation(r.id, auteurNom, motif));
};

// Notifications internes (US-27, US-28) — une ligne par destinataire.
window.StockFlowData.notifierMembresProjet = function (projetId, contenu) {
  const membres = window.StockFlowData.projetMembres[projetId] || [];
  membres.forEach((m) => {
    window.StockFlowData.notificationsInternes.push({
      id: `NOTIF-INT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      destinataireId: m.userId,
      date: "aujourd'hui",
      lu: false,
      ...contenu,
    });
  });
};
window.StockFlowData.notificationsDe = function (userId) {
  return window.StockFlowData.notificationsInternes.filter((n) => n.destinataireId === userId);
};
window.StockFlowData.marquerNotificationLue = function (id) {
  const n = window.StockFlowData.notificationsInternes.find((x) => x.id === id);
  if (n) n.lu = true;
  return n;
};

// US-10 : la suppression d'un matériel l'archive (jamais de suppression physique ni de restauration,
// CA1/CA4), annule ses réservations en cours/futures (CA3) et notifie les membres concernés (CA4/US-27).
// Une réservation strictement passée n'est pas concernée (US-27 CA2).
window.StockFlowData.supprimerMateriel = function (ref, auteurNom) {
  const m = window.StockFlowData.inventaire.find((i) => i.ref === ref);
  if (!m || m.statut === "Archivé") return m;
  m.statut = "Archivé";
  m.suppression = { date: "aujourd'hui", auteur: auteurNom };
  const now = new Date();
  window.StockFlowData.reservationsDuMateriel(ref)
    .filter((r) => r.statut === "active" && window.StockFlowData.etatReservation(r, now) !== "passee")
    .forEach((r) => {
      window.StockFlowData.annulerReservation(r.id, auteurNom, "Suppression du matériel");
      window.StockFlowData.notifierMembresProjet(r.projetId, {
        type: "reservation_annulee",
        message: `La réservation de « ${m.designation} » (${m.ref}) a été annulée : le matériel a été supprimé de l'inventaire.`,
      });
    });
  return m;
};

// Disponibilité — écart assumé avec le dictionnaire de données pour le non-individualisé (Q-09 sur
// la façon de signaler une rupture/indisponibilité reste ouverte). Pour l'individualisé, la
// disponibilité est bien dérivée des réservations comme demandé par le dictionnaire (§ Matériel) :
// "reserve" si une réservation active couvre l'instant présent, "disponible" sinon.
// Pour le non-individualisé, trois états : "rupture" (quantité à zéro), "a_commander" (quantité au
// seuil ou en dessous, hors rupture — réservé à l'administrateur et au gestionnaire, cf. plus bas),
// "disponible" (au-dessus du seuil). Pour un simple utilisateur, l'article reste "disponible" tant
// qu'il en reste (seul un rôle passé en second argument peut faire apparaître "a_commander") —
// cohérence demandée par le client : d'un point de vue utilisateur, un article n'est jamais "à
// moitié disponible", il l'est ou ne l'est pas (rupture).
window.StockFlowData.disponibilite = function (materiel, role) {
  if (materiel.quantite === null || materiel.quantite === undefined) {
    return window.StockFlowData.reservationActiveMaintenant(materiel.ref) ? "reserve" : "disponible";
  }
  if (materiel.quantite === 0) return "rupture";
  const peutVoirAlerteSeuil = role === "administrateur" || role === "gestionnaire";
  if (peutVoirAlerteSeuil && materiel.quantite <= materiel.seuilAlerte) return "a_commander";
  return "disponible";
};

// Visibilité des projets par rôle (US-03 CA4, US-04 CA2, US-15 CA1/CA2) :
// - le gestionnaire n'a accès à aucun projet ;
// - l'administrateur voit tous les projets, sans condition de membre ;
// - l'utilisateur voit les projets publics, plus les projets privés dont il est membre.
window.StockFlowData.estMembreProjet = function (projetId, nomPersonne) {
  const membres = window.StockFlowData.projetMembres[projetId] || [];
  return membres.some((m) => {
    const u = window.StockFlowData.utilisateurs.find((u2) => u2.id === m.userId);
    return u && u.nom === nomPersonne;
  });
};
window.StockFlowData.projetVisible = function (projet, role, nomPersonne) {
  if (role === "gestionnaire") return false;
  if (role === "administrateur") return true;
  if (projet.visibilite === "public") return true;
  return window.StockFlowData.estMembreProjet(projet.id, nomPersonne);
};
window.StockFlowData.estResponsableProjet = function (projetId, nomPersonne) {
  const membres = window.StockFlowData.projetMembres[projetId] || [];
  return membres.some((m) => {
    if (m.role !== "Responsable") return false;
    const u = window.StockFlowData.utilisateurs.find((u2) => u2.id === m.userId);
    return u && u.nom === nomPersonne;
  });
};
// D-03 : clôture = archivage, même état. D-05 : un projet clôturé ne peut pas être rouvert
// (aucune action de la maquette ne repasse un projet de "Clôturé" à un autre statut).
window.StockFlowData.estProjetArchive = function (projet) {
  return projet.statut === "Clôturé";
};
window.StockFlowData.ajouterHistoriqueProjet = function (projetId, auteur, nature, detail) {
  window.StockFlowData.historiqueProjet[projetId] = window.StockFlowData.historiqueProjet[projetId] || [];
  window.StockFlowData.historiqueProjet[projetId].push({ date: "aujourd'hui", auteur, nature, detail });
};
// US-20 CA1 : le responsable ou l'administrateur peuvent déclencher la clôture manuellement,
// indépendamment de l'état du Kanban. CA3 : libère immédiatement le matériel réservé.
window.StockFlowData.cloturerProjet = function (projetId, auteurNom, detail) {
  const projet = window.StockFlowData.projets.find((p) => p.id === projetId);
  if (!projet || window.StockFlowData.estProjetArchive(projet)) return projet;
  projet.statut = "Clôturé";
  projet.groupe = "Clôturés";
  window.StockFlowData.libererReservationsProjet(projetId, auteurNom, "Clôture du projet");
  window.StockFlowData.ajouterHistoriqueProjet(projetId, auteurNom, "cloture", detail || "Projet clôturé manuellement.");
  return projet;
};

// Demandes de réapprovisionnement (mock) — un utilisateur peut signaler une rupture au gestionnaire.
window.StockFlowData.notifications = [];

// Commandes fournisseur passées par l'administrateur/le gestionnaire (mock, aucun vrai fournisseur relié).
window.StockFlowData.commandes = {};

// Persistance de session (localStorage) — voir le commentaire en tête de fichier. JSON.stringify
// ignore naturellement les propriétés fonctions (disponibilite, creerReservation, etc.), donc seules
// les données sont sauvegardées/restaurées ; les fonctions ci-dessus restent celles du code, jamais
// celles d'une session précédente. VERSION change à chaque évolution de la forme des données
// (ex. renommage de champ) pour ignorer une sauvegarde devenue incompatible plutôt que de la fusionner.
(function () {
  const CLE = "SUIVI-donnees-demo";
  const VERSION = 1;
  try {
    const sauvegarde = JSON.parse(localStorage.getItem(CLE) || "null");
    if (sauvegarde && sauvegarde.version === VERSION) Object.assign(window.StockFlowData, sauvegarde.donnees);
  } catch (e) {
    // Sauvegarde corrompue ou stockage indisponible : on repart des données de démonstration.
  }

  // reload() déclenche lui-même "beforeunload" : sans ce garde-fou, sauvegarder() re-écrirait les
  // anciennes données juste après le removeItem() de reinitialiser(), et la réinitialisation
  // n'aurait alors aucun effet visible (bug constaté).
  let reinitialisationEnCours = false;
  function sauvegarder() {
    if (reinitialisationEnCours) return;
    try {
      localStorage.setItem(CLE, JSON.stringify({ version: VERSION, donnees: window.StockFlowData }));
    } catch (e) {
      // Stockage plein ou indisponible (navigation privée) : la session en cours continue sans persistance.
    }
  }
  window.addEventListener("pagehide", sauvegarder);
  window.addEventListener("beforeunload", sauvegarder);

  // Utilisé par le bouton "Réinitialiser les données de démonstration" (parametres.html).
  window.StockFlowData.reinitialiser = function () {
    reinitialisationEnCours = true;
    try { localStorage.removeItem(CLE); } catch (e) {}
    window.location.reload();
  };
})();
