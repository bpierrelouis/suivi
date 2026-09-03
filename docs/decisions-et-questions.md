# SUIVI — Registre des questions et décisions

**État au 3 septembre 2026 :** aucune décision client supplémentaire n’est enregistrée dans ce dossier. Les réponses du compte rendu servent de référence ; les questions ci-dessous restent ouvertes.

Q-01 à Q-21 reprennent les points à préciser de la source, avec quelques sous-questions nécessaires à leur application. Q-22 à Q-27 sont des précisions issues de la rédaction des stories, distinctes des demandes explicites du client.

## Questions provenant du compte rendu

| ID | Question / décision attendue | Incidence | Moment proposé |
| --- | --- | --- | --- |
| Q-01 | Les colonnes Kanban sont-elles fixes ou personnalisables ? Confirmer leurs libellés. | US-19, données du tableau. | Avant réalisation du Kanban. |
| Q-02 | Lors d’une nomination comme gestionnaire, les adhésions antérieures sont-elles conservées et masquées ou supprimées ? Comment traiter les projets créés, réservations, notifications et le retour au rôle standard ? Faut-il retirer le gestionnaire actuel avant toute nouvelle nomination ? | US-03, US-17, US-27, US-29. | Avant changement de rôle. |
| Q-03 | Un projet clôturé ou archivé peut-il être rouvert ? Par qui, et avec quel effet sur les réservations libérées ? | US-20, US-21 ; story de réouverture seulement si retenue. | Avant cycle de vie des projets. |
| Q-04 | Renseigner date de réunion, participants, rédacteur, personne validant le compte rendu et date de validation. | Statut de la source et acceptation du cadrage. | Avant engagement du périmètre. |
| Q-05 | Quelles « principales données » l’administrateur gère-t-il en plus des fonctions décrites ? Quels droits pour les autres profils ? | Périmètre éventuel supplémentaire. | Avant ajout de fonctions d’administration. |
| Q-06 | Quels droits pour le standard sur suppression, choix/changement de visibilité et clôture/archivage par les membres non créateurs ? Comment appliquer une visibilité obligatoire à la création tant que les droits de choix sont indéfinis ? | US-14, US-16, US-20 ; matrice des droits. | Avant gestion des projets. |
| Q-07 | Qui peut retirer un membre, en plus de l’administrateur ? Comment sélectionner les utilisateurs à ajouter, notamment ceux jamais connectés ? Quel effet du retrait sur les réservations qu’ils ont créées ? | US-17, US-18 ; cohérence avec absence de création manuelle. | Avant gestion des membres. |
| Q-08 | Quelles règles d’unicité pour les identifiants techniques ? Comment distinguer type, catégorie et exemplaire ? | US-06, US-07, US-09 ; dictionnaire. | Avant modèle d’inventaire. |
| Q-09 | Comment signaler une rupture/indisponibilité du non-individualisé ? Une association informative à un projet est-elle souhaitée ? | US-07 et éventuelle story supplémentaire ; aucune réservation ni quantité précise. | Avant traitement du non-individualisé. |
| Q-10 | Quelles catégories initiales prévoir ? | US-08 et données de démarrage. | Avant initialisation de l’inventaire. |
| Q-11 | Confirmer Excel/PDF, colonnes et informations exportées. L’export complet inclut-il des archives pour l’administrateur ? | US-13 ; confidentialité des fichiers. | Avant exports. |
| Q-12 | Quels droits de consultation des archives projets ? Quelle différence entre clôture et archivage, quelles modifications restent possibles et comment fonctionne la suppression d’un projet ? | US-20, US-21 ; pas de suppression physique présumée. | Avant cycle de vie des projets. |
| Q-13 | Un changement des dates du projet modifie-t-il les réservations existantes ? Si oui, comment traiter les conflits ? | US-16, US-23. | Avant liaison dates projet/réservations. |
| Q-14 | Quelles informations et actions figurent au tableau de bord de chaque profil ? « Mes projets » inclut-il uniquement participations/créations ou aussi les projets publics consultables ? | US-04, US-30. | Pendant conception S1. |
| Q-15 | Contenu, présentation, regroupement et durée de conservation des notifications ? Marquage lu explicite ou à l’ouverture ? Retour à non lu ? Quel contenu reste visible après perte d’accès au projet ? | US-27, US-28. | Avant notifications. |
| Q-16 | Le calendrier envisagé est-il retenu ? Pour quels profils, matériels, périodes et actions ? | US-26. | Avant engagement de cette candidate. |
| Q-17 | Application par navigateur ou installée ? Quels PC, navigateurs éventuels, serveurs et contraintes Intradef ? | TEC-01, TEC-05 ; aucune pile choisie. | Mode du prototype avant S1 ; cible avant déploiement. |
| Q-18 | Quel inventaire existe déjà ? Quelle reprise et quels volumes de comptes, matériels et projets prévoir ? | Données initiales, import éventuel et objectifs de performance. | Avant conception de la reprise et dimensionnement. |
| Q-19 | Quels autres écrans sont nécessaires au premier sprint ? | US-30, périmètre de conception. | Avant engagement S1. |
| Q-20 | Quelle durée/échéance du premier sprint, qui valide et avec quels critères ? Inclut-il l’écran de changement de rôle ? | Backlog, US-03, sprint et recette. | Avant engagement S1. |
| Q-21 | Comment valider le mot de passe aux premières connexions et aux suivantes dans la simulation ? Comment configurer le secret de `admin` ? Comment reconnaître un identifiant déjà connu ? | US-01, US-02, données de démonstration. | Avant réalisation de la connexion. |

## Précisions issues de l’analyse

Ces questions ne constituent pas des changements décidés du besoin.

| ID | Question / proposition à examiner | Incidence | Moment proposé |
| --- | --- | --- | --- |
| Q-22 | Confirmer fin strictement après début et bornes de créneau, par exemple `[début, fin[` autorisant un enchaînement à la même heure. Interdire aussi les chevauchements au sein d’un même projet ? Autoriser la saisie dans le passé et quelles modifications après fin/annulation ? Quel fuseau et traitement des changements d’heure ? Quel détail conserver pour les modifications, auteurs/motifs d’annulation et libérations à la clôture ? | US-22 à US-26, EX-06, recette de concurrence et historique. | Avant réservations. |
| Q-23 | Comment choisir le mode individualisé/non individualisé tout en gardant le nom seul champ obligatoire saisi ? Quelle valeur par défaut ? Peut-on changer le mode avec des réservations existantes ? | US-06, US-07, modèle matériel. | Avant création/modification de matériel. |
| Q-24 | Quelle gestion des sessions, déconnexion/expiration, secrets, sauvegardes et restauration technique ? Quels objectifs mesurables de performance et de disponibilité ? Comment garantir la cohérence des opérations composées et gérer leurs échecs ? | EX-03 à EX-08, TEC-03 à TEC-05 ; travail technique à spécifier. | Sécurité du prototype avant S1 ; exploitation avant cible. |
| Q-25 | Confirmer les critères de recherche envisagés, les tris, la combinaison des catégories et la période de référence de « disponible ». | US-09, maquettes et recherche de créneaux. | Avant filtres ; disponibilité avant L4. |
| Q-26 | Confirmer création, modification, déplacement et éventuelle suppression des tâches ; champs obligatoires, ordre et comportement des tâches non terminées à l’archivage. | US-19, US-20, dictionnaire. | Avant Kanban. |
| Q-27 | Le créateur devient-il automatiquement membre ? Peut-il être retiré, quitter le projet ou perdre les droits de collaboration tout en gardant consultation et clôture ? | US-14, US-18, US-20, US-22 ; droits contextuels. | Avant création/membres. |

## Désaccord entre sources visuelles et textuelles

La [maquette gestionnaire](Maquette%20Simple/CRUD%20GEST.png) présente un accès « CRUD Projet ». Le compte rendu consolidé §2.2 exclut tout accès du gestionnaire aux projets. La documentation dérivée suit ce dernier. L’image reste conservée comme source à corriger dans US-30 ; aucun nouvel accord client n’est déduit de cette correction documentaire.

Les éléments de connexion visibles dans les esquisses, tels qu’une option de mémorisation ou un lien de récupération, ne suffisent pas à spécifier une fonction. Leur éventuelle réalisation nécessite une décision en Q-19/Q-24.

## Enregistrement des décisions futures

Pour chaque décision, compléter : identifiant Q, réponse exacte, décideur, date, source de l’accord, documents/stories impactés, état (ouverte/décidée/appliquée). La clôture d’une question implique de reporter la décision dans les documents concernés. Pour le moment, décideurs et dates de décision sont **non renseignés** pour toutes les questions.
