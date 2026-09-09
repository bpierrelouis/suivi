# Prototype StockFlow — PWA responsive (rôle Admin)

Prototype codé en HTML/CSS/JS (sans framework, sans backend) pour valider la structure de navigation et le comportement responsive de l'application avant développement. Données en dur dans `assets/js/data.js` (réinitialisées à chaque rechargement).

## Lancer le prototype

Le service worker (mode hors ligne) exige d'être servi en HTTP — l'ouverture directe des fichiers (`file://`) ne l'activera pas. Depuis ce dossier :

```bash
npx serve .
# ou
python -m http.server 5500
```

Puis ouvrir `http://localhost:5500` (ou le port indiqué). Teste en réduisant la fenêtre du navigateur (< 1024px) pour voir basculer la sidebar en navigation basse mobile, et via les outils développeur (mode « appareil mobile »).

## Ce qui est couvert

- **Connexion** (`index.html`) → redirige vers le tableau de bord.
- **Tableau de bord** — KPI + alertes de stock + projets en cours.
- **Projets** — liste groupée par statut, recherche, modale de création/édition.
- **Détail d'un projet** — onglets Vue d'ensemble / Kanban (glisser-déposer + panneau de détail) / Historique.
- **Inventaire** — liste filtrable par catégorie/statut, modale d'article.
- **Utilisateurs** — liste + modale de création.
- **Paramètres** — thème clair/sombre, profil.

Toutes les entrées du menu (desktop en sidebar, mobile en barre basse) mènent vers une vraie page.

## Éléments PWA inclus

- `manifest.webmanifest` (nom, icône, couleur de thème, mode `standalone`).
- `service-worker.js` : met en cache l'app shell et sert `offline.html` en secours hors ligne.
- Bandeau « Installer l'application » (capture de `beforeinstallprompt`) et bandeau « Mode hors ligne ».
- Thème sombre complet (pas seulement la barre latérale), persistant via `localStorage`.

## Limites à connaître

- Rôle Admin uniquement — Gestionnaire/Utilisateur restent à dupliquer en masquant Utilisateurs/Paramètres et les actions de suppression.
- Icône d'app en SVG simple : à remplacer par le vrai logo (PNG 192/512 recommandés pour une compatibilité magasin d'applications maximale).
- Aucune persistance réelle : les créations/éditions ne survivent pas à un rechargement (pas de backend).
