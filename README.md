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

Le développement de la nouvelle application commence par le Sprint 1 : socle Vue/Express/Prisma, connexion simulée et tableaux de bord adaptés aux rôles. Après ce socle, la gestion des projets passe avant celle de l’inventaire. L’environnement Intradef reste simulé, avec une connexion gérée par l’application.

Le suivi des tâches et de l’avancement est disponible sur le [tableau Trello du projet](https://trello.com/b/DgAQwynT).

Les maquettes de l’application sont disponibles dans le [projet Figma](https://www.figma.com/design/jajh8IuesCXPLS03wqmoSm/Maquettes-CRUD-%E2%80%94-Admin---Gestionnaire---User?node-id=0-1&t=ju2YbvuAWpwhaLhP-1).

## Documentation

Le [dossier documentaire](docs/README.md) regroupe le cadrage, les user stories, le backlog, les règles métier, les droits, le dictionnaire de données, le glossaire et la préparation de la recette.

- [Stack technique initiale et décisions d’architecture](docs/stack-technique.md).
- [Réalisation technique du Sprint 1](docs/sprint-01-realisation.md).
- [Compte rendu de réunion client](docs/compte-rendu-reunion-client.md) — source des besoins.
- [User stories et critères d’acceptation](docs/user-stories.md).
- [Backlog produit et proposition de lots](docs/backlog.md).
- [Premier sprint](docs/sprint-01.md).
- [Contenu des prochains sprints](docs/prochains-sprints.md).
- [Questions et décisions à valider](docs/decisions-et-questions.md).

La documentation a été actualisée le 15 septembre 2026 après la réunion de fin du premier sprint. Le contenu des prochains sprints formalise les priorités fonctionnelles sans engager de durée ni de date de livraison.
