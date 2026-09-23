# Prototype SUIVI — PWA responsive (3 rôles)

Prototype codé en HTML/CSS/JS (sans framework, sans backend) pour valider la structure de navigation et le comportement de l'application avant développement. Données en dur dans `assets/js/data.js`, persistées en session via `localStorage` (voir « Persistance des données » ci-dessous).

## Lancer le prototype

Le service worker (mode hors ligne) exige d'être servi en HTTP — l'ouverture directe des fichiers (`file://`) ne l'activera pas. Depuis ce dossier :

```bash
npx serve .
# ou
python -m http.server 5500
```

Puis ouvrir `http://localhost:5500` (ou le port indiqué).

## Changer de rôle

Le sélecteur en bas de la barre latérale (dans la fiche du compte) permet de basculer à tout moment entre **Administrateur**, **Gestionnaire** et **Utilisateur**, sans vrai système d'authentification multi-compte. Chaque page adapte ce qu'elle affiche et autorise selon le rôle actif (navigation, colonnes, boutons, contenus visibles).

## Ce qui est couvert

- **Connexion** (`index.html`) → redirige vers le tableau de bord.
- **Tableau de bord** — KPI (projets actifs, ruptures, demandes en attente, utilisateurs actifs), projets en cours et derniers matériels ajoutés, filtrés selon le rôle.
- **Projets** — liste groupée par statut, recherche, modale de création ; accès refusé pour le gestionnaire.
- **Détail d'un projet** — onglets Vue d'ensemble (description + Kanban glisser-déposer), Membres, Réservations, Historique et Documentation (Markdown avec aperçu et export DOCX simulé). Clôture/archivage manuel ou automatique (dernière tâche terminée), verrouillage complet une fois clôturé.
- **Inventaire** — liste filtrable par catégorie, mode de suivi et disponibilité ; création/modification/suppression (archivage) de fiches ; vue des archives réservée à l'administrateur ; export CSV du périmètre affiché.
- **Détail d'un matériel** — onglets Vue d'ensemble, Réservations (historique, admin/gestionnaire), Historique et Documents (pièces jointes) ; signalement de rupture et commande.
- **Calendrier** — disponibilité hebdomadaire d'un matériel individualisé, en lecture seule.
- **Notifications** — cloche présente sur toutes les pages, centre de notifications avec lu/non lu.
- **Utilisateurs** — liste + modale de création ; réservé à l'administrateur.
- **Paramètres** — thème clair/sombre, profil, gestion des catégories de matériel, réinitialisation des données de démonstration.

Toutes les entrées de la barre latérale mènent vers une vraie page.

## Persistance des données

Les actions faites dans la maquette (créer/annuler une réservation, clôturer un projet, supprimer un matériel, ajouter un membre, marquer une notification comme lue…) sont sauvegardées dans `localStorage` et restent visibles en changeant de page ou en rechargeant. Le bouton **Réinitialiser les données de démonstration** (page Paramètres) efface cette sauvegarde et repart des données d'origine. Le rôle actif et le thème clair/sombre sont persistés séparément, indépendamment de cette réinitialisation.

## Éléments PWA inclus

- `manifest.webmanifest` (nom, icône, couleur de thème, mode `standalone`).
- `service-worker.js` : met en cache l'ensemble des pages et scripts (app shell) et sert `offline.html` en secours hors ligne.
- Bandeau « Installer l'application » (capture de `beforeinstallprompt`) et bandeau « Mode hors ligne ».
- Thème sombre complet, persistant via `localStorage`.

## Limites et écarts assumés à connaître

- **Export** : génère un CSV réel (pas de Excel/PDF) — Q-11 du registre des décisions n'est pas tranchée.
- **Calendrier** : vue "un matériel à la fois" par semaine — Q-16 n'est pas tranchée sur les profils/vues attendus.
- **Réservations** : bornes `[début, fin[`, minutes 00/30 uniquement, aucun fuseau horaire dédié — hypothèses de travail, Q-22 ouverte.
- **Quantité/seuil d'alerte** et **catégorie unique par article** s'écartent du dictionnaire de données (qui ne prévoit aucun compteur précis et une relation matériel↔catégorie plusieurs-à-plusieurs) — demandés explicitement par le client, signalés en commentaire dans `data.js`.
- Disponibilité/notifications de réapprovisionnement (US non formalisée, Q-09 ouverte) et notifications internes (US-27/28) restent des fonctionnalités mockées sans vrai backend ni envoi réel.
- Icône d'app en SVG simple : à remplacer par le vrai logo (PNG 192/512 recommandés pour une compatibilité magasin d'applications maximale).
- Persistance de session uniquement (`localStorage` du navigateur) : aucune synchronisation entre appareils, aucun vrai backend.
