/* Mock data shared across pages — no backend, kept in memory (resets on reload) */
window.StockFlowData = {
  projets: [
    { id: "PRJ-2041", nom: "Refonte entrepôt Nord", responsable: "Léa Fournier", echeance: "12 oct. 2026", statut: "Actif", groupe: "En cours", description: "Réorganisation complète des zones de stockage et mise à jour du plan d'implantation de l'entrepôt Nord, avec balisage des zones et cartographie des flux de picking." },
    { id: "PRJ-2038", nom: "Migration ERP", responsable: "Marc Vidal", echeance: "29 sept. 2026", statut: "Actif", groupe: "En cours", description: "Migration des données de gestion de stock et des projets en cours vers le nouvel ERP, sans interruption de service." },
    { id: "PRJ-2035", nom: "Audit stock saisonnier", responsable: "Léa Fournier", echeance: "14 oct. 2026", statut: "Actif", groupe: "En cours", description: "Contrôle et audit du stock avant la saison haute, avec rapprochement des écarts d'inventaire." },
    { id: "PRJ-2029", nom: "Réassort fournisseur B", responsable: "Marc Vidal", echeance: "—", statut: "En attente", groupe: "En attente", description: "Préparation d'une commande de réassort auprès du fournisseur B, en attente de validation budgétaire." },
    { id: "PRJ-2027", nom: "Ouverture site Rennes", responsable: "Marc Vidal", echeance: "—", statut: "En attente", groupe: "En attente", description: "Cadrage de l'ouverture d'un nouveau site de stockage à Rennes." },
    { id: "PRJ-1998", nom: "Inventaire annuel 2025", responsable: "Léa Fournier", echeance: "31 déc. 2025", statut: "Clôturé", groupe: "Clôturés", description: "Inventaire physique annuel de l'ensemble du stock, toutes catégories confondues." },
    { id: "PRJ-1984", nom: "Refonte étiquetage", responsable: "Marc Vidal", echeance: "15 août 2025", statut: "Clôturé", groupe: "Clôturés", description: "Refonte des étiquettes et codes-barres de l'ensemble du matériel non individualisé." },
  ],

  inventaire: [
    { ref: "REF-1024", designation: "Profilé aluminium 40x40", categorie: "Matières premières", emplacement: "Nord - Allée A2", stock: 240, seuil: 80, statut: "En stock" },
    { ref: "REF-1038", designation: "Tôle acier galvanisée 2m", categorie: "Matières premières", emplacement: "Nord - Allée A3", stock: 12, seuil: 20, statut: "Stock bas" },
    { ref: "REF-1053", designation: "Joint EPDM 3m", categorie: "Matières premières", emplacement: "Sud - Allée B1", stock: 4, seuil: 15, statut: "Rupture" },
    { ref: "REF-2087", designation: "Roulement à billes 6204", categorie: "Composants", emplacement: "Nord - Allée C2", stock: 512, seuil: 100, statut: "En stock" },
    { ref: "REF-2092", designation: "Vérin pneumatique EV220", categorie: "Composants", emplacement: "Sud - Allée C4", stock: 24, seuil: 30, statut: "Stock bas" },
    { ref: "REF-2106", designation: "Capteur inductif M18", categorie: "Composants", emplacement: "Nord - Allée C1", stock: 176, seuil: 40, statut: "En stock" },
    { ref: "REF-3044", designation: "Carton triple cannelure", categorie: "Consommables", emplacement: "Nord - Allée D2", stock: 1240, seuil: 300, statut: "En stock" },
    { ref: "REF-3059", designation: "Ruban adhésif renforcé", categorie: "Consommables", emplacement: "Sud - Allée D1", stock: 8, seuil: 50, statut: "Rupture" },
  ],

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
  // (créateur/membre), distincte du rôle global de l'utilisateur.
  projetMembres: {
    "PRJ-2041": [
      { userId: "USR-03", role: "Créateur" },
      { userId: "USR-04", role: "Membre" },
    ],
    "PRJ-2038": [{ userId: "USR-04", role: "Créateur" }],
    "PRJ-2035": [{ userId: "USR-03", role: "Créateur" }],
    "PRJ-2029": [{ userId: "USR-04", role: "Créateur" }],
    "PRJ-2027": [{ userId: "USR-04", role: "Créateur" }],
    "PRJ-1998": [{ userId: "USR-03", role: "Créateur" }],
    "PRJ-1984": [{ userId: "USR-04", role: "Créateur" }],
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

  historique: [
    { date: "8 sept. 2026", ref: "PRJ-2041", nom: "Refonte entrepôt Nord", responsable: "Léa Fournier", statut: "Actif" },
    { date: "8 sept. 2026", ref: "PRJ-2038", nom: "Migration ERP", responsable: "Marc Vidal", statut: "Actif" },
    { date: "4 sept. 2026", ref: "PRJ-2035", nom: "Audit stock saisonnier", responsable: "Léa Fournier", statut: "Actif" },
    { date: "18 août 2026", ref: "PRJ-2029", nom: "Réassort fournisseur B", responsable: "Marc Vidal", statut: "En attente" },
    { date: "3 août 2026", ref: "PRJ-2027", nom: "Ouverture site Rennes", responsable: "Marc Vidal", statut: "En attente" },
    { date: "31 déc. 2025", ref: "PRJ-1998", nom: "Inventaire annuel 2025", responsable: "Léa Fournier", statut: "Clôturé" },
    { date: "15 août 2025", ref: "PRJ-1984", nom: "Refonte étiquetage", responsable: "Marc Vidal", statut: "Clôturé" },
  ],
};
