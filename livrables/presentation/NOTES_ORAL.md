# Présentation du projet SUIVI - notes d'oral

Ces notes servent d'aide-mémoire. Elles ne doivent pas être lues mot à mot. Les indications entre crochets sont à remplacer ou à exécuter avant l'oral.

## Répartition chronométrée

| Intervenant | Début | Fin | Temps de parole |
| --- | ---: | ---: | ---: |
| `[Nom 1]` | 0 min 00 | 4 min 30 | 4 min 30 |
| `[Nom 2]` | 4 min 30 | 9 min 00 | 4 min 30 |
| `[Nom 3]` | 9 min 00 | 13 min 30 | 4 min 30 |
| `[Nom 4]` | 13 min 30 | 18 min 00 | 4 min 30 |

## `[Nom 1]` - contexte, équipe et réponse fonctionnelle

### Diapositive 1 - SUIVI - 30 secondes

« Bonjour. Nous allons vous présenter SUIVI, une application interne destinée à un laboratoire. Son nom signifie Suivi des Usages, Inventaires, Vie des projets et IA. Pendant cette présentation, nous allons partir du besoin, expliquer notre solution et nos choix techniques, puis montrer l'application avec un scénario concret. »

### Diapositive 2 - Contexte et besoin - 1 minute 30

Points à garder en tête :

- Le laboratoire doit pouvoir retrouver son matériel et savoir s'il est disponible.
- Les projets mobilisent des personnes, des tâches, de la documentation et parfois du matériel réservé.
- Une information dispersée rend les droits, les conflits de réservation et l'historique difficiles à contrôler.
- SUIVI réunit ces activités dans un outil commun.

Formulation possible :

« Le besoin ne se limite pas à faire une liste de matériel. Il faut relier le matériel aux projets qui l'utilisent, empêcher les doubles réservations et conserver une trace des opérations. Notre objectif a donc été de construire une application où chaque profil voit les bonnes informations et peut réaliser uniquement les actions qui lui sont autorisées. »

### Diapositive 3 - Équipe et responsabilités - 1 minute

Avant l'oral, remplacer cette partie par quatre contributions réelles et courtes.

« Nous sommes quatre sur le projet. `[Nom 1]` s'est principalement occupé de `[rôle et réalisations]`. `[Nom 2]` a pris en charge `[rôle et réalisations]`. `[Nom 3]` a travaillé sur `[rôle et réalisations]`. Enfin, `[Nom 4]` a assuré `[rôle et réalisations]`. Nous avons partagé `[revues, arbitrages ou tests réellement communs]`. »

Ne pas dépasser deux réalisations par personne. Privilégier des exemples visibles dans le livrable.

### Diapositive 4 - Utilisateurs et réponse fonctionnelle - 1 minute 30

« L'application vise les équipes d'un laboratoire. Elle distingue trois profils. L'administrateur supervise les données, les projets et les archives. Le gestionnaire tient l'inventaire, mais n'accède jamais aux projets. L'utilisateur consulte le matériel et travaille sur les projets auxquels il a accès. »

« À partir de ces profils, nous avons développé quatre ensembles cohérents : la gestion de l'inventaire et des pièces jointes, la collaboration sur les projets, la réservation du matériel et enfin la traçabilité grâce aux historiques, aux archives et aux exports. »

Transition :

« Pour réaliser cet ensemble, nous avons choisi une architecture web qui sépare clairement l'interface, les règles métier, les données et les fichiers. `[Nom 2]` va vous présenter ces choix. »

## `[Nom 2]` - technologies, architecture et réalisation

### Diapositive 5 - Choix techniques - 2 minutes 15

Ne pas énumérer toutes les versions. Relier chaque choix à son usage.

« Vue 3 structure l'interface en composants réutilisables. Ce choix convient aux tableaux, aux formulaires, au Kanban et aux écrans qui changent selon le profil. Vite simplifie le développement et produit la version destinée au déploiement. »

« L'API repose sur Express et Node.js. Elle centralise les autorisations et les règles métier : l'interface ne décide jamais seule si une action est permise. Zod contrôle les données reçues. »

« PostgreSQL répond au caractère relationnel du projet : utilisateurs, projets, membres, tâches, matériels et réservations sont liés. Prisma fournit le modèle de données, les migrations et les transactions utilisées par l'API. »

« Les pièces jointes ne sont pas enregistrées dans la base. Elles sont stockées dans un bucket S3 privé. La base conserve seulement leurs métadonnées. Enfin, Docker Compose permet de lancer les différents services de façon reproductible. »

### Diapositive 6 - Architecture et sécurité - 1 minute 30

« Le navigateur passe par Nginx, qui sert l'interface Vue et transmet les appels vers l'API Express. L'API applique les droits et accède à PostgreSQL. Dans la configuration Docker, l'API et la base ne sont pas exposées directement sur le poste. »

« Pour les fichiers, l'API vérifie d'abord l'autorisation, puis fournit une URL temporaire. Le navigateur communique alors avec le stockage S3 privé sans recevoir les identifiants permanents du stockage. »

« La session utilise un jeton de courte durée placé dans un cookie HttpOnly. Dans le prototype, la connexion simule encore l'environnement Intradef ; c'est une limite que nous présenterons à la fin. »

### Diapositive 7 - Réalisation et préparation de la démo - 45 secondes

« Le projet a avancé en cinq incréments. Le premier a posé le socle et les profils. Le deuxième a livré les projets, le Kanban et la documentation. Le troisième a ajouté l'inventaire et les pièces jointes. Le quatrième a relié les projets aux réservations, aux archives et aux notifications. Le cinquième a ajouté le calendrier et les exports. »

Transition :

« Ces incréments forment aujourd'hui un parcours continu. `[Nom 3]` va le montrer en se plaçant dans la situation d'un membre de projet. »

## `[Nom 3]` - démonstration fonctionnelle

### Diapositive 8 et application - 4 minutes 30

#### 0 min 00 à 0 min 25 - connexion

« Notre utilisateur prépare une activité de laboratoire. Il se connecte avec un compte déjà membre du projet de démonstration. »

[Se connecter. Ne pas saisir lentement. Utiliser les identifiants préparés.]

#### 0 min 25 à 0 min 50 - tableau de bord

« Le tableau de bord présente uniquement les informations accessibles à ce profil. Les raccourcis conduisent vers l'inventaire, les projets et les notifications. »

[Montrer le rôle connecté et les informations principales, puis ouvrir l'inventaire.]

#### 0 min 50 à 1 min 25 - inventaire

« Il recherche le matériel nécessaire. La fiche indique ses caractéristiques, ses catégories et sa disponibilité. Un utilisateur peut consulter le matériel actif, mais il ne peut pas modifier l'inventaire. »

[Filtrer avec une valeur déjà connue, ouvrir la fiche du matériel préparé, puis revenir au projet.]

#### 1 min 25 à 2 min 05 - projet et membres

« Ce projet est privé. Seuls ses membres et l'administrateur peuvent le consulter. La fiche regroupe la description, les membres, la documentation et les tâches. Le gestionnaire d'inventaire reste exclu de tous les projets. »

[Ouvrir le projet préparé et passer rapidement sur les onglets concernés.]

#### 2 min 05 à 2 min 45 - Kanban

« Le Kanban permet d'organiser les tâches. Chaque tâche peut avoir un responsable membre du projet. Ici, nous faisons avancer cette tâche. Si la dernière tâche en cours est terminée, le projet se clôt automatiquement. »

[Déplacer une tâche préparée. Garder la dernière tâche pour la fin du scénario si la clôture automatique est montrée.]

#### 2 min 45 à 3 min 35 - réservation

« Depuis le projet, le membre réserve un matériel individualisé sur des créneaux de trente minutes. L'API refuse les chevauchements, y compris si deux demandes arrivent presque en même temps. »

[Créer la réservation préparée. Montrer le message de succès. Si le refus de conflit est fiable et rapide, montrer un second créneau incompatible ; sinon, expliquer le contrôle sans provoquer d'erreur imprévue.]

#### 3 min 35 à 4 min 00 - documentation

« Le projet possède aussi une documentation Markdown modifiable par les personnes autorisées et exportable en document Word. Cela permet de conserver les informations techniques au même endroit que le suivi du projet. »

[Afficher l'aperçu déjà rempli. Ne pas lancer un téléchargement s'il risque d'ouvrir une fenêtre.]

#### 4 min 00 à 4 min 30 - calendrier et fin du scénario

« Le calendrier permet ensuite de retrouver les périodes réservées et disponibles. Les personnes qui n'ont pas accès au projet voient seulement la mention Réservé. »

[Montrer la réservation dans le calendrier. Si la clôture automatique a été suffisamment répétée, terminer la dernière tâche et montrer que le projet est archivé et que le matériel est libéré. Sinon, conserver cette explication pour la diapositive suivante.]

Transition :

« Ce parcours repose sur des règles communes à tous les écrans. `[Nom 4]` va résumer ces contrôles, la qualité vérifiée et les suites possibles. »

### Secours si la démonstration échoue

Dire immédiatement :

« Nous avons préparé les étapes principales sous forme de captures afin de poursuivre le scénario sans perdre le fil. »

Ne pas chercher la cause devant le jury. Montrer les captures dans le même ordre et continuer les explications prévues.

## `[Nom 4]` - règles, qualité, évolutions et conclusion

### Diapositive 9 - Droits et règles métier - 1 minute 30

« Le point central du projet est la cohérence des droits et des données. Un projet privé ne doit pas être découvert par un utilisateur extérieur. Le gestionnaire travaille sur l'inventaire, mais ne peut consulter aucun projet. Ces règles sont contrôlées par l'API, même si quelqu'un contourne l'interface. »

« Les réservations concernent uniquement le matériel individualisé et deux créneaux incompatibles ne peuvent pas se chevaucher. L'archivage ne supprime pas les traces : il conserve l'historique et libère les réservations concernées. Enfin, terminer la dernière tâche active peut clôturer automatiquement le projet. »

### Diapositive 10 - Qualité et limites actuelles - 1 minute 15

« Lors du dernier sprint documenté, nous avons exécuté 34 tests serveur et 10 tests d'interface. Nous avons aussi contrôlé la compilation Vue, le démarrage de la stack Docker, les exports et plusieurs refus d'accès. »

« Le prototype garde toutefois des limites. L'authentification Intradef est simulée. Les sauvegardes, les volumes attendus et les seuils de performance doivent encore être décidés avec l'environnement cible. Le calendrier sert aujourd'hui à consulter les disponibilités ; les réservations se créent depuis les projets. Enfin, aucune fonction d'intelligence artificielle n'est livrée malgré le nom de l'application. »

### Diapositive 11 - Évolutions réalistes - 1 minute

« La première évolution serait de connecter l'application au vrai système d'authentification. Il faudrait ensuite mettre en place des sauvegardes supervisées et tester leur restauration, puis mesurer les performances avec des volumes représentatifs. »

« Pour les pièces jointes, une analyse antivirus avant mise à disposition compléterait les contrôles existants. Un usage mobile ou une aide intelligente pourront être étudiés plus tard, uniquement à partir d'un besoin validé et de règles de confidentialité claires. »

### Diapositive 12 - Conclusion - 45 secondes

« SUIVI réunit dans une seule application l'inventaire, les projets et les réservations du laboratoire. La séparation des profils protège les informations, tandis que les historiques et les archives assurent la traçabilité. Le prototype couvre aujourd'hui le parcours fonctionnel prévu sur cinq sprints et fournit une base claire pour l'intégration dans l'environnement cible. Merci pour votre attention. Nous sommes prêts à répondre à vos questions. »

## Organisation des 10 minutes de questions

- `[Nom 1]` répond en priorité sur le besoin, le périmètre et l'organisation de l'équipe.
- `[Nom 2]` répond sur les technologies, l'architecture, le déploiement et la sécurité.
- `[Nom 3]` répond sur les écrans, l'expérience utilisateur et le scénario de démonstration.
- `[Nom 4]` répond sur les règles métier, les tests, les limites et les évolutions.
- Une personne répond d'abord ; une seconde complète seulement si elle apporte un élément nouveau.
- Si la réponse n'est pas connue, dire ce qui reste à valider au lieu d'improviser.

## Dernière répétition

- À 4 min 30, `[Nom 1]` doit avoir terminé.
- À 9 min 00, la démonstration doit commencer.
- À 13 min 30, la démonstration doit être terminée.
- À 17 min 15, la conclusion doit commencer.
- À 18 min 00, la parole doit être rendue au jury.

