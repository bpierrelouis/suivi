# SUIVI — Compte rendu de réunion client

**SUIVI** — **S**uivi des **U**sages, **I**nventaires, **V**ie des projets et **I**A

**Objet :** logiciel d’inventaire et de gestion de projets pour un laboratoire  
**Statut :** version consolidée ; clarification en pause, points ouverts conservés pour une reprise ultérieure  
**Date de la réunion :** à renseigner  
**Participants :** à renseigner  
**Rédacteur :** à renseigner

> Ce document reprend les besoins exprimés dans le compte rendu initial et les clarifications apportées ensuite. Les éléments signalés comme « à confirmer », « à préciser » ou « envisagés » ne constituent pas des décisions validées. Les questions de la dernière section servent à compléter le cadrage.

## 1. Contexte et objectifs

L’application **SUIVI** doit permettre au laboratoire de gérer :

- l’inventaire de ses matériels ;
- ses projets et leur suivi ;
- l’affectation des matériels aux projets ;
- à terme, la réservation de certains matériels.

Le développement vise d’abord une utilisation sur PC. Une adaptation mobile pourra être étudiée ultérieurement.

L’application sera utilisée exclusivement dans l’environnement **Intradef** et ne sera pas accessible depuis Internet.

Pour le prototype et le premier sprint, on considère que l’application fonctionne dans l’environnement Intradef, sans intégration réelle à son authentification. L’application gère elle-même la connexion et crée automatiquement l’utilisateur à sa première connexion pour simuler son existence dans un système externe. Il n’y a pas d’inscription.

## 2. Utilisateurs et droits d’accès

Trois profils sont prévus : administrateur, gestionnaire et utilisateur standard. Une seule personne dispose du rôle d’administrateur. Plusieurs personnes peuvent disposer du rôle de gestionnaire. Le rôle d’administrateur ne peut pas être transféré.

| Fonctionnalité | Administrateur | Gestionnaire | Utilisateur standard |
| --- | --- | --- | --- |
| Consulter l’inventaire | Oui | Oui | Oui |
| Créer ou modifier du matériel | Oui | Oui | Non prévu |
| Retirer du matériel de l’inventaire | Oui | Oui | Non prévu |
| Créer, modifier ou supprimer des catégories | Oui | Oui | Non |
| Exporter l’inventaire complet ou les résultats filtrés | Oui | Oui | Non |
| Créer un projet | Oui | Non | Oui |
| Clôturer ou archiver un projet | Oui si créateur ; autres cas à préciser | Non | Oui si créateur ; autres cas à préciser |
| Supprimer un projet | Oui, modalités à préciser | Non | À préciser |
| Consulter les projets NP (publics) | Tous | Non | Tous |
| Consulter les projets Secret (privés) | Tous | Non | Si créateur ou membre du projet |
| Participer à un projet après ajout immédiat comme membre | À préciser | Non | Oui |
| Modifier le projet, gérer ses tâches, affecter du matériel et inviter des membres | Oui en tant que membre ; hors participation à préciser | Non | Oui, si membre du projet |
| Créer manuellement des comptes utilisateurs | Non | Non | Non |
| Attribuer le rôle de gestionnaire à un utilisateur standard | Oui | Non prévu | Non prévu |
| Transférer le rôle d’administrateur | Non | Non | Non |
| Gérer les principales données de l’application | Oui, périmètre à préciser | À préciser | À préciser |

Le gestionnaire n’a accès à aucun projet, public ou privé, et ne peut pas y participer. Les projets NP sont publics pour les autres profils. Les projets Secret sont privés et visibles par l’administrateur, leur créateur et leurs membres autorisés.

La connexion utilise un **identifiant et un mot de passe**. L’identifiant peut être une adresse courriel. Les utilisateurs sont créés automatiquement à leur première connexion avec le **rôle standard**, sans inscription ni création manuelle par l’administrateur. Cette création simule une identité existant dans un autre système. Lors des connexions suivantes, l’application doit retrouver le même utilisateur et conserver son rôle.

Le compte administrateur est prédéfini avec l’identifiant **`admin`**. Il constitue l’exception à la création automatique avec le rôle standard. L’administrateur peut attribuer le rôle de gestionnaire à des utilisateurs standards, sans limite à une seule personne. Il ne peut pas transférer son rôle d’administrateur. La possibilité de retirer le rôle de gestionnaire reste à préciser.

Les règles d’accès aux projets doivent également s’appliquer aux informations de projet présentées dans les autres écrans et les exports. Leur traduction précise reste à valider, notamment pour les matériels affectés à un projet privé ou pour la consultation de l’inventaire par le gestionnaire.

## 3. Gestion de l’inventaire

Le **nom est le seul champ obligatoire à saisir lors de la création d’un matériel**, qu’il soit individualisé ou non. Les autres informations, notamment les catégories et les identifiants techniques, sont facultatives.

### 3.1. Matériel non individualisé

Certains consommables et petits équipements seront référencés sans suivi individuel ni comptage précis des quantités.

Exemples : vis, tournevis, petits outils et consommables divers.

L’objectif est de savoir que ces matériels sont présents et disponibles dans le laboratoire. La manière de signaler une indisponibilité ou une rupture reste à préciser.

### 3.2. Matériel individualisé

Les équipements nécessitant une traçabilité seront enregistrés exemplaire par exemplaire. Leurs fiches pourront notamment contenir :

- un numéro de série ;
- une adresse MAC ;
- une référence constructeur ;
- un numéro d’inventaire ;
- tout autre identifiant utile ou unique.

Pour un même type de matériel, plusieurs exemplaires pourront être enregistrés. Par exemple :

| Type de matériel | Exemplaire | Numéro de série |
| --- | --- | --- |
| Raspberry Pi 5 | Raspberry Pi n° 1 | XXXXXX |
| Raspberry Pi 5 | Raspberry Pi n° 2 | YYYYYY |
| Raspberry Pi 5 | Raspberry Pi n° 3 | ZZZZZZ |

L’application doit permettre de connaître le nombre exact d’exemplaires enregistrés et de suivre chacun d’eux.

Les identifiants techniques restent facultatifs, y compris pour un exemplaire individualisé. Les règles d’unicité lorsqu’ils sont renseignés et la distinction entre type, catégorie et exemplaire restent à préciser. Une référence constructeur ne doit pas être présumée unique par exemplaire sans validation.

## 4. Catégories de matériel

L’inventaire est organisé par **catégories de matériel**. La gestion des emplacements physiques n’est pas retenue : aucun rayon, armoire, étagère ou bac n’est à renseigner.

L’administrateur et les gestionnaires peuvent créer, modifier et supprimer les catégories. Un matériel peut appartenir à **plusieurs catégories**. L’affectation d’une catégorie est facultative, seul le nom étant obligatoire à la création du matériel.

La liste initiale des catégories et le traitement de la suppression d’une catégorie encore utilisée restent à préciser.

## 5. Recherche et consultation de l’inventaire

La consultation de l’inventaire doit permettre :

- la recherche de matériels ;
- le filtrage et le tri des résultats ;
- la combinaison de plusieurs critères de recherche ;
- l’accès à la fiche détaillée d’un matériel.

Les critères envisagés sont :

- le type de matériel ;
- la catégorie ;
- la disponibilité ;
- le numéro de série ;
- l’adresse MAC ;
- le projet associé, dans le respect des droits d’accès.

## 6. Export de l’inventaire

L’application doit permettre l’export des données de l’inventaire. Les formats envisagés sont **Excel** et **PDF**.

L’export est réservé à **l’administrateur et aux gestionnaires**. Ils doivent pouvoir choisir entre :

- l’export de l’inventaire complet ;
- l’export des seuls résultats correspondant aux filtres de recherche actifs.

Dans les deux cas, les exports respectent les droits d’accès aux informations des projets. Les colonnes et informations précises à inclure dans les fichiers Excel et PDF restent à définir.

## 7. Retrait et historique du matériel

Le retrait d’un matériel ne doit pas entraîner la disparition de toute trace de son existence. Un mécanisme de retrait ou d’archivage devra donc préserver son historique.

Les informations à conserver comprennent notamment :

- l’identification du matériel retiré ;
- la date du retrait ;
- éventuellement, l’auteur du retrait ;
- éventuellement, le motif du retrait.

Les modalités d’archivage, de consultation de l’historique et d’éventuelle remise en service restent à définir.

## 8. Création et suivi des projets

La création de projets est ouverte à l’administrateur et aux utilisateurs standards. Le gestionnaire ne dispose pas de ce droit.

Les informations minimales à renseigner à la création sont :

- le nom du projet ;
- sa description ;
- son niveau de confidentialité.

Les dates de début et de fin du projet sont facultatives. Toute réservation de matériel doit en revanche avoir une date de début et une date de fin. Les dates du projet peuvent servir de valeurs par défaut ; si elles sont absentes ou incomplètes, les dates manquantes doivent être renseignées sur la réservation avant sa validation.

Chaque projet disposera d’un tableau de suivi des tâches de type **Kanban**, inspiré du fonctionnement de Trello.

Les colonnes envisagées sont :

1. À faire ;
2. En cours ;
3. Fait.

**Question à poser au client :** les colonnes « À faire », « En cours » et « Fait » doivent-elles être fixes ou personnalisables ? Ce choix reste ouvert. Les informations à renseigner sur les tâches restent également à préciser.

## 9. Confidentialité des projets

Deux niveaux de visibilité sont retenus :

- **NP — public :** visible par tous les utilisateurs de l’application, à l’exception du gestionnaire ;
- **Secret — privé :** visible par l’administrateur, le créateur du projet et ses membres.

Dans ce document, le terme « Secret » désigne donc une visibilité privée. Le gestionnaire est exclu de tous les projets, y compris privés. La visibilité publique d’un projet NP ne donne pas automatiquement le droit de le modifier : les droits de participation sont accordés aux membres, comme décrit en section 10.

Les points suivants nécessitent une validation :

- les profils autorisés à choisir ou à modifier le niveau de visibilité ;
- les informations visibles dans l’inventaire, les recherches, les historiques et les exports lorsqu’un matériel est associé à un projet auquel l’utilisateur n’a pas accès.

## 10. Participants et invitations

L’ajout d’un utilisateur comme membre d’un projet est **immédiat et ne nécessite aucune acceptation** de sa part. Le terme « invitation » désigne cet ajout direct. Le gestionnaire ne peut pas participer à un projet. Pour un projet privé, l’appartenance au projet donne immédiatement le droit de le consulter. Les projets publics sont déjà consultables par tous les utilisateurs sauf le gestionnaire, sans ajout comme membre.

Pour le moment, tous les membres disposent des mêmes droits de participation :

- la consultation du projet ;
- la modification de ses informations ;
- la gestion des tâches ;
- l’affectation de matériel au projet ;
- l’ajout immédiat d’autres membres.

Le créateur peut clôturer ou archiver le projet, ce qui libère immédiatement le matériel réservé. Les droits de retrait d’un participant, de libération manuelle du matériel et de suppression du projet restent à préciser, ainsi que l’éventuelle extension du droit de clôture ou d’archivage à d’autres personnes. La règle de droits identiques entre membres pourra être réévaluée ultérieurement.

## 11. Affectation du matériel aux projets

Depuis la fiche d’un projet, il doit être possible d’associer du matériel pour identifier les équipements utilisés.

Réciproquement, l’inventaire ou la fiche d’un matériel doit permettre d’identifier son affectation à un projet, dans le respect des droits d’accès. Les informations à afficher à une personne sans accès au projet restent à préciser.

Un même matériel ne peut pas être affecté à deux projets au même moment. Son affectation le rend indisponible pour les autres projets pendant sa période de réservation, qui comporte obligatoirement une date de début et une date de fin.

Les dates de réservation propres au matériel sont utilisées en priorité. À défaut, les dates du projet servent de valeurs par défaut lorsqu’elles sont renseignées. Toute date manquante doit être complétée sur la réservation : une réservation sans période complète ne peut pas être validée.

Des affectations successives à des projets différents sont possibles si leurs périodes ne se chevauchent pas. Une affectation avec une période incompatible doit être refusée. Ces règles décrivent le fonctionnement cible ; la réservation reste hors périmètre du premier sprint.

Tous les membres peuvent affecter du matériel à leur projet, sous réserve de renseigner une période de réservation complète et disponible.

La clôture ou l’archivage du projet par son créateur libère immédiatement les matériels réservés pour ce projet. La trace des affectations passées est conservée dans l’historique du projet.

Les règles suivantes restent à définir :

- les profils autorisés à libérer manuellement du matériel en cours de projet et les droits d’affectation de l’administrateur lorsqu’il n’est pas membre du projet ;
- le traitement des matériels non individualisés ;
- l’incidence d’un changement des dates du projet sur les réservations existantes et le traitement des conflits éventuels.

## 12. Clôture et historique des projets

Les projets doivent être historisés. La fin d’un projet ne doit pas nécessairement entraîner sa suppression.

Le **créateur du projet peut le clôturer ou l’archiver**. Dans les deux cas, les matériels réservés pour ce projet sont immédiatement libérés, tout en conservant leur association passée dans l’historique.

L’historique doit permettre de conserver :

- les informations du projet ;
- ses participants ;
- les matériels associés ;
- les tâches réalisées ;
- éventuellement, les modifications effectuées au cours du projet.

La durée de conservation de l’historique est à déterminer avec le client. La différence de fonctionnement entre clôture et archivage, les droits éventuels des autres profils sur ces actions et les règles de suppression restent à préciser.

## 13. Tableau de bord et page d’accueil

La page d’accueil servira principalement de tableau de bord et affichera notamment les projets de l’utilisateur, selon ses droits d’accès. Le tableau de bord du gestionnaire ne présentera aucun projet.

Les actions proposées dépendront de son profil. Pour l’administrateur, un accès direct à la gestion de l’inventaire est notamment prévu.

Le contenu détaillé du tableau de bord sera défini lors du maquettage. Au premier sprint, il sera accessible après une connexion fonctionnelle et présentera des données fictives.

## 14. Réservation du matériel — évolution envisagée

Une fonctionnalité de réservation est envisagée à terme. Elle s’appuierait sur un calendrier permettant de visualiser :

- les périodes de disponibilité ;
- les périodes de réservation ;
- éventuellement, le projet associé à chaque réservation.

Toute réservation comporte obligatoirement une date de début et une date de fin. Elle rend le matériel indisponible pour tout autre projet sur cette période. Les dates du projet peuvent être utilisées par défaut, mais toute date manquante doit être renseignée sur la réservation avant validation. La clôture ou l’archivage du projet libère immédiatement ses matériels réservés. Les modalités de modification et d’annulation manuelles restent à définir. **Cette fonctionnalité est hors périmètre du premier sprint.**

## 15. Périmètre du premier sprint

Le premier sprint porte sur les fondations de l’application.

### 15.1. Authentification

Mettre en place une **connexion fonctionnelle avec des comptes propres à l’application**, en tenant compte des trois profils : administrateur, gestionnaire et utilisateur standard. Pour ce sprint, on fait comme si l’application était sur Intradef ; l’application gère elle-même la connexion.

L’écran de connexion comporte un **identifiant**, qui peut être une adresse courriel, et un **mot de passe**. Il n’y a pas d’inscription. À la première connexion, l’application crée automatiquement l’utilisateur avec le **rôle standard** pour simuler son existence dans un système externe. Aux connexions suivantes, elle retrouve son compte et conserve son rôle.

Le compte administrateur est prédéfini avec l’identifiant **`admin`**. Le mécanisme de validation du mot de passe lors de la première connexion simulée et la configuration du mot de passe administrateur restent à définir.

L’administrateur peut nommer plusieurs gestionnaires parmi les utilisateurs standards ; son propre rôle ne peut pas être transféré. L’inclusion de l’écran de changement des rôles dans le premier sprint reste à confirmer.

### 15.2. Maquettes et tableau de bord

Créer les premières interfaces pour valider :

- l’organisation générale de l’application ;
- la navigation ;
- la page d’accueil ;
- la consultation des projets ;
- la consultation de l’inventaire ;
- les autres écrans principaux à identifier.

Le sprint doit livrer les maquettes ainsi qu’un **tableau de bord accessible après connexion, alimenté par des données fictives**. L’échéance, le contenu exact de ce tableau de bord et les critères de validation restent à préciser.

### 15.3. Hors périmètre

La réservation de matériel ne sera pas développée pendant le premier sprint.

## 16. Questions de validation et de complément

La phase de questions est suspendue à la demande de l’utilisateur. Les points ouverts ci-dessous sont conservés pour une reprise ultérieure.

Les questions ci-dessous regroupent les points ouverts du compte rendu initial et les compléments proposés lors de sa reformulation. Elles n’ajoutent pas de fonctionnalités validées au périmètre.

### 16.1. Réponses intégrées

| Référence | Sujet | Décision confirmée |
| --- | --- | --- |
| Q01 | Projets Secret | Projets privés, visibles par l’administrateur, leur créateur et leurs membres. |
| Q02 | Projets NP | Projets publics, visibles par tous sauf le gestionnaire. |
| Q03 | Affectation et disponibilité | Un matériel ne peut pas être affecté à deux projets simultanément. Il est indisponible pendant sa période de réservation obligatoire, dont les dates peuvent provenir du projet par défaut. |
| Q04 | Connexion | Comptes propres à l’application ; environnement Intradef simulé. |
| Q05 | Premier sprint | Maquettes, connexion fonctionnelle et tableau de bord présentant des données fictives. |
| R2-01 | Gestionnaire | Aucun accès aux projets, publics ou privés, et aucune participation. |
| R2-02 | Dates des projets | Les dates de début et de fin sont facultatives. |
| R2-03 | Droits des membres | Pour le moment, tous les membres peuvent modifier le projet, gérer les tâches, affecter du matériel et inviter d’autres membres. |
| R2-04 | Gestion des comptes | L’administrateur ne crée pas de comptes ; il peut attribuer le rôle de gestionnaire aux utilisateurs standards. |
| R2-05 | Intradef | On considère que l’application est sur Intradef ; l’application gère elle-même la connexion. |
| R3-01 | Création des utilisateurs | Aucune inscription. Création automatique à la première connexion pour simuler l’existence de l’utilisateur dans un autre système. |
| R3-02 | Dates de réservation | Toute réservation de matériel possède obligatoirement une date de début et une date de fin, même si le projet n’a pas de dates. |
| R3-03 | Administration et gestionnaires | Un seul administrateur, dont le rôle ne peut pas être transféré ; plusieurs gestionnaires possibles. |
| R4-01 | Informations de connexion | Identifiant et mot de passe ; l’identifiant peut être une adresse courriel. |
| R4-02 | Rôle initial et administrateur | Chaque nouvel utilisateur reçoit le rôle standard. Le compte administrateur prédéfini a pour identifiant `admin`. |
| R4-03 | Ajout aux projets | L’ajout d’un membre est immédiat, sans acceptation d’une invitation. |
| R5-02 | Organisation de l’inventaire | Classement par catégories uniquement, sans gestion de localisation physique. |
| R5-03 | Clôture et archivage | Le créateur peut clôturer ou archiver le projet ; cette action libère immédiatement le matériel réservé. |
| R6-01 | Catégories | Gérées par l’administrateur et les gestionnaires ; un matériel peut appartenir à plusieurs catégories. |
| R6-02 | Création du matériel | Le nom est le seul champ obligatoire. |
| R6-03 | Exports | Réservés à l’administrateur et aux gestionnaires, avec le choix entre inventaire complet et résultats filtrés. |

### 16.2. Question explicitement reportée au client

- **R5-01 — Kanban :** conserve-t-on les colonnes fixes « À faire », « En cours » et « Fait », ou faut-il permettre leur personnalisation ? **À poser au client ; aucune décision prise.**

### 16.3. Autres points à compléter

| Référence | Sujet | Questions à traiter |
| --- | --- | --- |
| Q06 | Réunion | Quelle est la date de la réunion ? Qui y a participé et qui valide ce compte rendu ? |
| Q07 | Profils | L’administrateur peut-il retirer le rôle de gestionnaire pour rétablir le rôle standard ? Que deviennent les participations aux projets d’un utilisateur nommé gestionnaire, puisqu’il perd l’accès à tous les projets ? Que recouvre la gestion des « principales données » ? |
| Q08 | Droits sur les projets | En plus du créateur, d’autres personnes peuvent-elles clôturer ou archiver le projet ? Qui peut le supprimer ou changer sa visibilité ? Quels droits l’administrateur possède-t-il lorsqu’il n’est pas membre ? |
| Q09 | Membres | Qui peut retirer un participant ? Comment sélectionner les personnes à ajouter, notamment si elles ne se sont jamais connectées ? |
| Q10 | Fiches matériel | Quels identifiants techniques doivent être uniques lorsqu’ils sont renseignés ? Comment distinguer les types de matériel et les exemplaires ? |
| Q11 | Matériel non individualisé | Comment signaler sa disponibilité ou sa rupture ? Comment l’associer à un projet sans gérer de quantité précise ? |
| Q12 | Catégories | Quelle liste initiale de catégories prévoir ? Que se passe-t-il lorsqu’une catégorie encore utilisée est supprimée ? |
| Q13 | Kanban | La personnalisation des colonnes est à demander au client, voir R5-01. Quels champs et actions faut-il prévoir pour les tâches : responsable, échéance, description, commentaires, pièces jointes ? |
| Q14 | Exports | Quelles colonnes et informations doivent figurer dans les fichiers Excel et PDF ? |
| Q15 | Retrait de matériel | Le motif et l’auteur du retrait sont-ils obligatoires ? Peut-on remettre un matériel retiré en service ? Que faire s’il est encore affecté à un projet ? |
| Q16 | Historique des projets | Combien de temps conserver les projets et leurs données ? Faut-il tracer les modifications, leurs auteurs et leurs dates ? Qui peut consulter les archives ? |
| Q17 | Fin de projet | Quelle différence de fonctionnement faut-il entre clôture et archivage ? Peut-on rouvrir un projet terminé ? |
| Q18 | Confidentialité transversale | Que voit un utilisateur lorsqu’un matériel est utilisé par un projet auquel il n’a pas accès ? Quelles informations faut-il masquer dans les recherches, historiques et exports, notamment pour le gestionnaire ? |
| Q19 | Tableau de bord | Quelles informations et actions doivent apparaître pour chaque profil ? |
| Q20 | Réservations futures | Quels matériels seront réservables ? Qui pourra réserver, modifier ou annuler ? Quelle précision de dates ou d’horaires faut-il ? Que faire si une modification des dates d’un projet crée un chevauchement ? |
| Q21 | Environnement technique | L’application sera-t-elle accessible par navigateur ou installée sur les PC ? Quels navigateurs, serveurs et contraintes de déploiement sont imposés sur Intradef ? |
| Q22 | Données initiales et volume | Existe-t-il un inventaire à reprendre ? Combien d’utilisateurs, de matériels et de projets sont prévus ? |
| Q23 | Validation du premier sprint | Quelle est l’échéance ? Qui valide les maquettes, la connexion et le tableau de bord ? Quels critères doivent être remplis ? L’écran de changement des rôles est-il inclus ? |
| Q24 | Mots de passe de la simulation | Comment valider le mot de passe lors de la première connexion et des suivantes ? Comment configurer celui du compte `admin` ? |

### 16.4. Suivi de la validation

- **Réponses et décisions complémentaires :** les décisions issues des six séries de réponses sont intégrées dans le corps du document et récapitulées en section 16.1. La question Kanban reportée au client figure en section 16.2.
- **Points restant ouverts :** voir les sections 16.2 et 16.3.
- **Date de validation globale :** à renseigner.
- **Validé par :** à renseigner.
