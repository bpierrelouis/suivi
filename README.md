# SUIVI

**S**uivi des **U**sages, **I**nventaires, **V**ie des projets et **I**A.

SUIVI est un projet d’application destiné à un laboratoire pour gérer son inventaire, suivre ses projets et organiser l’utilisation du matériel.

## Fonctionnalités prévues

- Inventaire du matériel organisé par catégories.
- Projets publics ou privés avec Kanban intégré à l’onglet Description, clôture automatique lorsque la dernière tâche en cours passe à l’état terminé, documentation Markdown exportable en DOCX et historique des modifications.
- Pièces jointes associées aux matériels, notamment factures et bons de commande.
- Affectation et réservation du matériel par projet.
- Calendrier des disponibilités et des réservations.
- Gestion des droits : un administrateur, un gestionnaire et des utilisateurs.
- Historique et exports de l’inventaire.

## État du projet

Le Sprint 1 a livré le socle Vue/Express/Prisma, la connexion simulée et les tableaux de bord adaptés aux rôles. Le Sprint 2 a livré l’administration du gestionnaire, les projets, les membres, le Kanban, la clôture automatique et la documentation Markdown exportable en DOCX. Le Sprint 3 a livré l’inventaire actif, les catégories, la recherche, l’historique et les pièces jointes. Le Sprint 4 a livré les réservations sans chevauchement, les archives, les historiques détaillés et les notifications internes. Le Sprint 5 ajoute le calendrier hebdomadaire des disponibilités et les exports Excel/PDF de l’inventaire actif. L’environnement Intradef reste simulé, avec une connexion gérée par l’application.

Le suivi des tâches et de l’avancement est disponible sur le [tableau Trello du projet](https://trello.com/b/DgAQwynT).

Pour lancer l’application complète, copier `.env.example` vers `.env`, renseigner toutes les valeurs, puis exécuter `docker compose up --build`. Avec `APP_PORT=8080`, l’application est disponible sur `http://localhost:8080`. Seul le reverse proxy Nginx est exposé ; Compose lui injecte l’adresse interne du service backend sans l’intégrer au bundle frontend. PostgreSQL et Express restent internes au réseau Docker.

Les maquettes de l’application sont disponibles dans le [projet Figma](https://www.figma.com/design/jajh8IuesCXPLS03wqmoSm/Maquettes-CRUD-%E2%80%94-Admin---Gestionnaire---User?node-id=0-1&t=ju2YbvuAWpwhaLhP-1).

## Documentation

Le [dossier documentaire](docs/README.md) regroupe le cadrage, les user stories, le backlog, les règles métier, les droits, le dictionnaire de données, le glossaire et la préparation de la recette.

- [Stack technique initiale et décisions d’architecture](docs/stack-technique.md).
- [Réalisation technique du Sprint 1](docs/sprint-01-realisation.md).
- [Réalisation technique du Sprint 2](docs/sprint-02-realisation.md).
- [Réalisation technique du Sprint 3](docs/sprint-03-realisation.md).
- [Réalisation technique du Sprint 4](docs/sprint-04-realisation.md).
- [Réalisation technique du Sprint 5](docs/sprint-05-realisation.md).
- [Compte rendu de réunion client](docs/compte-rendu-reunion-client.md) — source des besoins.
- [User stories et critères d’acceptation](docs/user-stories.md).
- [Backlog produit et proposition de lots](docs/backlog.md).
- [Premier sprint](docs/sprint-01.md).
- [Contenu des prochains sprints](docs/prochains-sprints.md).
- [Questions et décisions à valider](docs/decisions-et-questions.md).

La documentation a été actualisée le 24 septembre 2026 avec la réalisation applicative du Sprint 5. Le contenu des sprints formalise les priorités fonctionnelles sans engager de durée ni de date de livraison.
