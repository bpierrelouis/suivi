/* Mock data shared across pages — no backend, kept in memory (resets on reload) */
window.StockFlowData = {
  projets: [
    { id: "PRJ-2041", nom: "Refonte entrepôt Nord", responsable: "Camille Doré", echeance: "12 oct. 2026", statut: "Actif", groupe: "En cours" },
    { id: "PRJ-2038", nom: "Migration ERP", responsable: "Yanis Belkacem", echeance: "29 sept. 2026", statut: "Actif", groupe: "En cours" },
    { id: "PRJ-2035", nom: "Audit stock saisonnier", responsable: "Léa Fournier", echeance: "14 oct. 2026", statut: "Actif", groupe: "En cours" },
    { id: "PRJ-2029", nom: "Réassort fournisseur B", responsable: "Marc Vidal", echeance: "—", statut: "En attente", groupe: "En attente" },
    { id: "PRJ-2027", nom: "Ouverture site Rennes", responsable: "Camille Doré", echeance: "—", statut: "En attente", groupe: "En attente" },
    { id: "PRJ-1998", nom: "Inventaire annuel 2025", responsable: "Léa Fournier", echeance: "31 déc. 2025", statut: "Clôturé", groupe: "Clôturés" },
    { id: "PRJ-1984", nom: "Refonte étiquetage", responsable: "Marc Vidal", echeance: "15 août 2025", statut: "Clôturé", groupe: "Clôturés" },
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

  kanban: {
    "a-faire": {
      title: "À faire",
      tasks: [
        { id: "t1", title: "Baliser les zones de la zone B", tag: { label: "Sécurité", tone: "danger" }, due: "18 sept.", assignee: "CD" },
        { id: "t2", title: "Commander les racks modulables", tag: { label: "Achats", tone: "warning" }, due: "22 sept.", assignee: "YB" },
        { id: "t3", title: "Valider le plan d'implantation", tag: { label: "Logistique", tone: "info" }, due: "25 sept.", assignee: "LF" },
      ],
    },
    "en-cours": {
      title: "En cours",
      tasks: [
        { id: "t4", title: "Cartographier les flux de picking", tag: { label: "Logistique", tone: "info" }, due: "20 sept.", assignee: "CD" },
      ],
    },
    "en-revue": {
      title: "En revue",
      tasks: [
        { id: "t5", title: "Droits fournisseur nauyoscage", tag: { label: "Process", tone: "success" }, due: "—", assignee: "MV" },
        { id: "t6", title: "Aide de sécurité mise à jour", tag: { label: "Sécurité", tone: "danger" }, due: "—", assignee: "LF" },
      ],
    },
    "termine": {
      title: "Terminé",
      tasks: [
        { id: "t7", title: "Réunion de cadrage", tag: { label: "Réunion", tone: "info" }, due: "—", assignee: "CD" },
      ],
    },
  },

  historique: [
    { date: "8 sept. 2026", ref: "PRJ-2041", nom: "Refonte entrepôt Nord", responsable: "Camille Doré", statut: "Actif" },
    { date: "8 sept. 2026", ref: "PRJ-2038", nom: "Migration ERP", responsable: "Yanis Belkacem", statut: "Actif" },
    { date: "4 sept. 2026", ref: "PRJ-2035", nom: "Audit stock saisonnier", responsable: "Léa Fournier", statut: "Actif" },
    { date: "18 août 2026", ref: "PRJ-2029", nom: "Réassort fournisseur B", responsable: "Marc Vidal", statut: "En attente" },
    { date: "3 août 2026", ref: "PRJ-2027", nom: "Ouverture site Rennes", responsable: "Camille Doré", statut: "En attente" },
    { date: "31 déc. 2025", ref: "PRJ-1998", nom: "Inventaire annuel 2025", responsable: "Léa Fournier", statut: "Clôturé" },
    { date: "15 août 2025", ref: "PRJ-1984", nom: "Refonte étiquetage", responsable: "Marc Vidal", statut: "Clôturé" },
  ],
};
