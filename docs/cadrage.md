# SUIVI — Cadrage fonctionnel

**Statut :** synthèse du [compte rendu](compte-rendu-reunion-client.md), complétée par des propositions explicitement signalées.

## Finalité

Centraliser l’inventaire d’un laboratoire, le suivi de ses projets et l’utilisation du matériel. Permettre de retrouver le matériel disponible, de suivre les tâches d’un projet et de conserver la trace des mouvements d’inventaire, des réservations et des modifications des projets.

Le nom signifie **Suivi des Usages, Inventaires, Vie des projets et IA**. Aucune fonctionnalité d’intelligence artificielle n’est spécifiée à ce stade.

## Acteurs

L’application comporte trois rôles : **administrateur (admin)**, **gestionnaire** et **utilisateur**.

| Acteur | Besoin principal | Limite structurante |
| --- | --- | --- |
| Administrateur unique | Administrer les données, les projets et le rôle gestionnaire. | Compte `admin` prédéfini ; rôle non transférable. |
| Gestionnaire, zéro ou un | Tenir l’inventaire, ses catégories et ses exports. | Aucun accès ni participation aux projets ; archives du matériel inaccessibles. |
| Utilisateur | Consulter l’inventaire et collaborer sur les projets autorisés. | Aucun historique du matériel ou des réservations, même pour ses propres projets. |

Pour le rôle utilisateur, les droits dépendent aussi de sa relation avec chaque projet :

| Situation dans le projet | Droits et limites |
| --- | --- |
| Créateur | Utilisateur à l’origine du projet ; peut le consulter, le clôturer ou l’archiver. L’adhésion automatique comme membre reste à préciser en Q-27. |
| Membre | Utilisateur ajouté au projet ; peut modifier ses informations, gérer ses tâches et réservations et ajouter des membres, selon les règles définies. |
| Simple | Utilisateur ni créateur ni membre du projet ; peut consulter ce projet s’il est public, sans le modifier. N’accède pas au projet privé. |

Ces situations sont propres à chaque projet : un utilisateur peut être créateur d’un projet, membre d’un autre et simple sur un troisième. Elles ne créent pas de rôles globaux supplémentaires.

La [matrice des droits](regles-de-gestion.md#matrice-des-droits) détaille les autorisations.

## Périmètre retenu au compte rendu

- Connexion applicative simulant un environnement externe, création automatique au premier accès et conservation du rôle.
- Inventaire individualisé ou non individualisé, catégories multiples facultatives, recherche, filtres et tri.
- Archivage irréversible du matériel, historique daté et attribué à un auteur.
- Projets publics ou privés, membres ajoutés immédiatement, tâches en Kanban avec responsable facultatif et historique des modifications.
- Réservations du matériel individualisé par créneaux de trente minutes, sans conflit entre projets.
- Libération du matériel lors des annulations, de la suppression du matériel et de la clôture, équivalente à l’archivage du projet.
- Tableau de bord selon le profil et notifications internes avec état de lecture individuel.

Les exports Excel/PDF et le calendrier sont envisagés ; leurs modalités restent à valider.

## Premier incrément

Le [premier sprint](sprint-01.md) comprend une connexion fonctionnelle, des maquettes et un tableau de bord alimenté par des données fictives. Les réservations en sont exclues. Les lots ultérieurs du backlog sont une proposition d’ordre de réalisation.

## Éléments exclus ou non spécifiés

| Élément | Position actuelle |
| --- | --- |
| Inscription, création manuelle des comptes | Non prévues. |
| Intégration réelle à l’authentification Intradef | Exclue du prototype et du premier sprint. |
| Accès Internet à l’application cible | Non prévu ; environnement Intradef. |
| Localisation physique : armoire, rayon, bac | Non gérée. |
| Quantités précises et réservation du non-individualisé | Non gérées. |
| Restauration d’un matériel supprimé | Impossible selon le besoin retenu. |
| Priorité ou échéance d’une tâche | Non prévues. Un responsable facultatif peut être affecté à une tâche. |
| Mobile | Étude ultérieure possible, priorité au PC. |
| IA, courriels de notification, import automatique | Aucune fonctionnalité spécifiée ; ne pas les déduire du nom ou des besoins voisins. |

## Exigences transverses

| Référence | Exigence | Statut et validation |
| --- | --- | --- |
| EX-01 | Respecter les droits dans l’inventaire, les projets, les recherches, les historiques et les exports. | Retenu ; recette avec chaque profil. |
| EX-02 | Exploiter l’application sur PC dans l’environnement cible Intradef. | Retenu ; architecture, installation ou navigateur à arbitrer en Q-17. |
| EX-03 | Conserver les données et historiques du matériel supprimé ; conserver les archives et l’historique des modifications des projets indéfiniment pour le moment. | Retenu ; politique opérationnelle et sauvegardes à définir, Q-24. |
| EX-04 | Contrôler les autorisations à chaque accès aux données et chaque mutation, y compris en contournant l’interface. | Proposition technique nécessaire pour concrétiser EX-01 ; protocole selon l’architecture retenue. |
| EX-05 | Ne pas conserver ni journaliser de mot de passe en clair ; définir la gestion des sessions et des secrets du prototype. | Proposition technique ; Q-21 et Q-24. |
| EX-06 | Garantir l’absence de double réservation même lors de demandes simultanées. | Proposition de mise en œuvre de la règle de non-chevauchement ; REC-11. |
| EX-07 | Prévoir messages d’erreur compréhensibles, navigation au clavier et états vide/chargement/erreur. | Proposition ergonomique à examiner avec les maquettes. |
| EX-08 | Fixer les volumes, temps de réponse visés et conditions de sauvegarde/restauration. | Aucun seuil convenu ; Q-18 et Q-24 avant validation technique. |

## Critères de réussite proposés

Le prototype démontre les parcours du premier sprint avec des comptes distincts et sans divulgation de projets au gestionnaire. À terme, un utilisateur retrouve du matériel, un membre organise son projet et réserve un exemplaire disponible, et une suppression de matériel libère les créneaux, notifie les membres concernés et conserve la trace. Les seuils quantitatifs et la personne habilitée à accepter les livrables restent à définir.
