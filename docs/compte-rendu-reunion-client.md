# SUIVI — Compte rendu de réunion client

**SUIVI** — **S**uivi des **U**sages, **I**nventaires, **V**ie des projets et **I**A

**Objet :** logiciel d’inventaire et de gestion de projets pour un laboratoire  
**Statut :** version consolidée ; clarification en cours  
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

Trois profils sont prévus : administrateur, gestionnaire et utilisateur standard. Une seule personne dispose du rôle d’administrateur et **une seule personne peut disposer du rôle de gestionnaire à un instant donné**. Le rôle d’administrateur ne peut pas être transféré.

| Fonctionnalité | Administrateur | Gestionnaire | Utilisateur standard |
| --- | --- | --- | --- |
| Consulter l’inventaire | Oui | Oui | Oui |
| Créer ou modifier du matériel | Oui | Oui | Non prévu |
| Supprimer du matériel (archivage) | Oui | Oui | Non prévu |
| Consulter les matériels archivés | Oui | Non | Non |
| Consulter l’historique des matériels actifs et de leurs réservations | Oui | Oui, avec les informations de projet masquées | Non |
| Restaurer un matériel archivé | Non | Non | Non |
| Créer, modifier ou supprimer des catégories | Oui | Oui | Non |
| Exporter l’inventaire complet ou les résultats filtrés | Oui | Oui | Non |
| Créer un projet | Oui | Non | Oui |
| Clôturer ou archiver un projet | Oui si créateur ; autres cas à préciser | Non | Oui si créateur ; autres cas à préciser |
| Supprimer un projet | Oui, modalités à préciser | Non | À préciser |
| Consulter les projets NP (publics) | Tous | Non | Tous |
| Consulter les projets Secret (privés) | Tous | Non | Si créateur ou membre du projet |
| Participer à un projet après ajout immédiat comme membre | À préciser | Non | Oui |
| Modifier le projet, gérer ses tâches, affecter du matériel et inviter des membres | Oui en tant que membre ; hors participation à préciser | Non | Oui, si membre du projet |
| Modifier ou annuler une réservation du projet, quel que soit son auteur | Oui en tant que membre ; hors participation à préciser | Non | Oui, si membre du projet |
| Créer manuellement des comptes utilisateurs | Non | Non | Non |
| Attribuer le rôle de gestionnaire à un utilisateur standard | Oui | Non prévu | Non prévu |
| Rendre au gestionnaire le rôle d’utilisateur standard | Oui | Non prévu | Non prévu |
| Transférer le rôle d’administrateur | Non | Non | Non |
| Gérer les principales données de l’application | Oui, périmètre à préciser | À préciser | À préciser |

Le gestionnaire n’a accès à aucun projet, public ou privé, et ne peut pas y participer. Les projets NP sont publics pour les autres profils. Les projets Secret sont privés et visibles par l’administrateur, leur créateur et leurs membres autorisés.

La connexion utilise un **identifiant et un mot de passe**. L’identifiant peut être une adresse courriel. Les utilisateurs sont créés automatiquement à leur première connexion avec le **rôle standard**, sans inscription ni création manuelle par l’administrateur. Cette création simule une identité existant dans un autre système. Lors des connexions suivantes, l’application doit retrouver le même utilisateur et conserver son rôle.

Le compte administrateur est prédéfini avec l’identifiant **`admin`**. Il constitue l’exception à la création automatique avec le rôle standard. L’administrateur peut nommer un utilisateur standard gestionnaire et rendre au gestionnaire le rôle standard. Ces changements doivent respecter la limite d’un seul gestionnaire à un instant donné. L’administrateur ne peut pas transférer son propre rôle.

Les règles d’accès aux projets s’appliquent également aux informations présentées dans l’inventaire, les recherches, les historiques et les exports. Lorsqu’un matériel est réservé pour un projet auquel l’utilisateur n’a pas accès, seule la mention **« Réservé »** apparaît à la place du nom du projet. Cette règle s’applique notamment au gestionnaire, qui n’a accès à aucun projet.

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

L’administrateur et le gestionnaire peuvent créer, modifier et supprimer les catégories. Un matériel peut appartenir à **plusieurs catégories**. L’affectation d’une catégorie est facultative, seul le nom étant obligatoire à la création du matériel.

La suppression d’une catégorie la retire des matériels auxquels elle était associée, sans supprimer ni archiver ces matériels. Leurs autres catégories sont conservées. La liste initiale des catégories reste à préciser.

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

L’export est réservé à **l’administrateur et au gestionnaire**. Ils doivent pouvoir choisir entre :

- l’export de l’inventaire complet ;
- l’export des seuls résultats correspondant aux filtres de recherche actifs.

Dans les deux cas, les exports respectent les droits d’accès aux informations des projets. Les colonnes et informations précises à inclure dans les fichiers Excel et PDF restent à définir.

## 7. Suppression, archivage et historique du matériel

### 7.1. Suppression et accès aux archives

L’application propose une action **« Supprimer »** qui entraîne l’archivage du matériel. Il n’existe pas d’action de retrait distincte. Le matériel disparaît de l’inventaire actif, mais sa fiche et son historique sont conservés : la suppression n’efface pas définitivement les données.

Les informations à conserver comprennent notamment :

- l’identification du matériel archivé ;
- la date de l’archivage ;
- éventuellement, l’auteur de la suppression ayant entraîné l’archivage.

**Seul l’administrateur peut consulter les matériels archivés. Aucune restauration n’est possible.**

La suppression d’un matériel annule ses réservations en cours et futures, tout en conservant leur historique. Les membres des projets qui utilisent actuellement ce matériel ou l’ont réservé pour une période future sont notifiés de cette annulation **dans l’application**. Le contenu et la présentation de ces notifications restent à préciser.

### 7.2. Historique de l’inventaire et des réservations

L’historique porte sur l’inventaire et les réservations de matériel. Il doit notamment permettre de retrouver **qui a réservé quoi, quand et pour quel projet**, en conservant :

- l’utilisateur ayant effectué la réservation ;
- le matériel concerné ;
- la date de création de la réservation ;
- les dates et heures de début et de fin prévues ;
- le projet associé ;
- la trace d’une éventuelle annulation, y compris après suppression du matériel.

Les réservations passées ou annulées restent conservées. **Seuls l’administrateur et le gestionnaire peuvent consulter l’historique des matériels actifs et de leurs réservations.** Les utilisateurs standards n’y ont pas accès, même lorsqu’ils sont membres d’un projet concerné. Les informations de projet affichées dans cet historique respectent les règles de confidentialité : le gestionnaire voit « Réservé » à la place du nom du projet.

L’accès aux matériels archivés et à leur historique demeure réservé à l’administrateur. Le détail des autres événements d’inventaire à tracer reste à préciser.

## 8. Création et suivi des projets

La création de projets est ouverte à l’administrateur et aux utilisateurs standards. Le gestionnaire ne dispose pas de ce droit.

Les informations minimales à renseigner à la création sont :

- le nom du projet ;
- sa description ;
- son niveau de confidentialité.

Les dates de début et de fin du projet sont facultatives. Toute réservation de matériel doit en revanche avoir une date et une heure de début ainsi qu’une date et une heure de fin. Les horaires sont sélectionnés à l’heure pile ou à la demi-heure. Les dates du projet peuvent servir de valeurs par défaut ; toute date ou heure manquante doit être renseignée sur la réservation avant sa validation.

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

Lorsqu’un matériel est réservé pour un projet inaccessible à l’utilisateur, l’application affiche uniquement **« Réservé »**, sans révéler le nom du projet. Cette règle vaut aussi pour les recherches, les historiques et les exports.

Les profils autorisés à choisir ou à modifier le niveau de visibilité restent à préciser.

## 10. Participants et invitations

L’ajout d’un utilisateur comme membre d’un projet est **immédiat et ne nécessite aucune acceptation** de sa part. Le terme « invitation » désigne cet ajout direct. Le gestionnaire ne peut pas participer à un projet. Pour un projet privé, l’appartenance au projet donne immédiatement le droit de le consulter. Les projets publics sont déjà consultables par tous les utilisateurs sauf le gestionnaire, sans ajout comme membre.

Pour le moment, tous les membres disposent des mêmes droits de participation :

- la consultation du projet ;
- la modification de ses informations ;
- la gestion des tâches ;
- l’affectation de matériel au projet ;
- la modification ou l’annulation de toute réservation du projet, même créée par un autre membre ;
- l’ajout immédiat d’autres membres.

Le créateur peut clôturer ou archiver le projet, ce qui libère immédiatement le matériel réservé. Tous les membres peuvent également libérer du matériel en annulant sa réservation. Les droits de retrait d’un participant et de suppression du projet restent à préciser, ainsi que l’éventuelle extension du droit de clôture ou d’archivage à d’autres personnes. La règle de droits identiques entre membres pourra être réévaluée ultérieurement.

## 11. Affectation du matériel aux projets

Depuis la fiche d’un projet, il doit être possible d’associer du matériel pour identifier les équipements utilisés.

Réciproquement, l’inventaire ou la fiche d’un matériel doit permettre d’identifier son affectation à un projet, dans le respect des droits d’accès. Une personne sans accès au projet voit uniquement la mention **« Réservé »**, sans le nom du projet.

Un même matériel ne peut pas être affecté à deux projets au même moment. Son affectation le rend indisponible pour les autres projets pendant sa période de réservation, qui comporte obligatoirement une date et une heure de début ainsi qu’une date et une heure de fin. Les minutes autorisées sont uniquement **00 ou 30**, par exemple 09:00 ou 09:30.

Les dates de réservation propres au matériel sont utilisées en priorité. À défaut, les dates du projet servent de valeurs par défaut lorsqu’elles sont renseignées. Toute date ou heure manquante doit être complétée sur la réservation : une réservation sans période complète ne peut pas être validée.

Des affectations successives à des projets différents sont possibles si leurs périodes ne se chevauchent pas. Une affectation avec une période incompatible doit être refusée. Ces règles décrivent le fonctionnement cible ; la réservation reste hors périmètre du premier sprint.

Tous les membres peuvent affecter du matériel à leur projet et modifier ou annuler ses réservations, quel que soit le membre qui les a créées. Toute création ou modification doit respecter une période complète et disponible. L’annulation libère le matériel pour la période concernée et reste conservée dans l’historique.

La clôture ou l’archivage du projet par son créateur libère immédiatement les matériels réservés pour ce projet. La trace des affectations passées est conservée dans l’historique de l’inventaire et des réservations, avec la référence du projet concerné.

La suppression d’un matériel annule ses réservations en cours et futures, conserve leur historique et déclenche une notification dans l’application aux membres des projets concernés.

Les règles suivantes restent à définir :

- les droits d’affectation, de modification et d’annulation des réservations par l’administrateur lorsqu’il n’est pas membre du projet ;
- le traitement des matériels non individualisés ;
- l’incidence d’un changement des dates du projet sur les réservations existantes et le traitement des conflits éventuels.

## 12. Clôture et archivage des projets

Les projets terminés peuvent être archivés pour conserver leurs données. Aucun journal des modifications des projets n’est prévu. La traçabilité des usages du matériel est assurée par l’historique de l’inventaire et des réservations décrit en section 7.2.

Le **créateur du projet peut le clôturer ou l’archiver**. Dans les deux cas, les matériels réservés pour ce projet sont immédiatement libérés, tout en conservant leur association passée dans l’historique.

L’archive d’un projet permet de conserver :

- les informations du projet ;
- ses participants ;
- les matériels associés ;
- les tâches réalisées.

Les projets archivés et leurs données sont conservés **indéfiniment pour le moment**, aucune durée limite n’étant définie. Cette règle pourra être revue ultérieurement. La différence de fonctionnement entre clôture et archivage, les droits éventuels des autres profils sur ces actions et les règles de suppression restent à préciser.

## 13. Tableau de bord et page d’accueil

La page d’accueil servira principalement de tableau de bord et affichera notamment les projets de l’utilisateur, selon ses droits d’accès. Le tableau de bord du gestionnaire ne présentera aucun projet.

Les actions proposées dépendront de son profil. Pour l’administrateur, un accès direct à la gestion de l’inventaire est notamment prévu.

Le contenu détaillé du tableau de bord sera défini lors du maquettage. Au premier sprint, il sera accessible après une connexion fonctionnelle et présentera des données fictives.

## 14. Réservation du matériel — évolution envisagée

Une fonctionnalité de réservation est envisagée à terme. Elle s’appuierait sur un calendrier permettant de visualiser :

- les périodes de disponibilité ;
- les périodes de réservation ;
- éventuellement, le projet associé à chaque réservation.

Toute réservation comporte obligatoirement une date et une heure de début ainsi qu’une date et une heure de fin, avec des horaires à l’heure pile ou à la demi-heure (minutes 00 ou 30 uniquement). Elle rend le matériel indisponible pour tout autre projet sur cette période. Les dates du projet peuvent être utilisées par défaut, mais toute date ou heure manquante doit être renseignée sur la réservation avant validation. Tous les membres peuvent modifier ou annuler les réservations de leur projet, quel qu’en soit l’auteur. Toute modification doit respecter les règles de disponibilité. La clôture ou l’archivage du projet libère immédiatement ses matériels réservés. **Cette fonctionnalité est hors périmètre du premier sprint.**

Si le matériel est supprimé, ses réservations en cours et futures sont annulées et conservées dans l’historique. Les membres des projets concernés reçoivent une notification dans l’application. Le contenu et la présentation des notifications restent à définir.

## 15. Périmètre du premier sprint

Le premier sprint porte sur les fondations de l’application.

### 15.1. Authentification

Mettre en place une **connexion fonctionnelle avec des comptes propres à l’application**, en tenant compte des trois profils : administrateur, gestionnaire et utilisateur standard. Pour ce sprint, on fait comme si l’application était sur Intradef ; l’application gère elle-même la connexion.

L’écran de connexion comporte un **identifiant**, qui peut être une adresse courriel, et un **mot de passe**. Il n’y a pas d’inscription. À la première connexion, l’application crée automatiquement l’utilisateur avec le **rôle standard** pour simuler son existence dans un système externe. Aux connexions suivantes, elle retrouve son compte et conserve son rôle.

Le compte administrateur est prédéfini avec l’identifiant **`admin`**. Le mécanisme de validation du mot de passe lors de la première connexion simulée et la configuration du mot de passe administrateur restent à définir.

L’administrateur peut nommer un gestionnaire parmi les utilisateurs standards et lui rendre le rôle standard, en respectant la limite d’un seul gestionnaire à un instant donné. Son propre rôle ne peut pas être transféré. L’inclusion de l’écran de changement des rôles dans le premier sprint reste à confirmer.

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

La clarification des points ouverts reprend. La question sur la personnalisation du Kanban reste réservée au client.

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
| R3-02 | Dates de réservation | Toute réservation de matériel possède obligatoirement une date et une heure de début et de fin, même si le projet n’a pas de dates. |
| R3-03 | Administration et gestionnaire | Un seul administrateur, dont le rôle ne peut pas être transféré, et un seul gestionnaire à un instant donné, selon la correction R10-00. |
| R4-01 | Informations de connexion | Identifiant et mot de passe ; l’identifiant peut être une adresse courriel. |
| R4-02 | Rôle initial et administrateur | Chaque nouvel utilisateur reçoit le rôle standard. Le compte administrateur prédéfini a pour identifiant `admin`. |
| R4-03 | Ajout aux projets | L’ajout d’un membre est immédiat, sans acceptation d’une invitation. |
| R5-02 | Organisation de l’inventaire | Classement par catégories uniquement, sans gestion de localisation physique. |
| R5-03 | Clôture et archivage | Le créateur peut clôturer ou archiver le projet ; cette action libère immédiatement le matériel réservé. |
| R6-01 | Catégories | Gérées par l’administrateur et le gestionnaire ; un matériel peut appartenir à plusieurs catégories. |
| R6-02 | Création du matériel | Le nom est le seul champ obligatoire. |
| R6-03 | Exports | Réservés à l’administrateur et au gestionnaire, avec le choix entre inventaire complet et résultats filtrés. |
| R7-01 | Suppression du matériel | L’action de suppression archive le matériel et conserve son historique. Il n’y a pas d’action de retrait distincte. |
| R7-02 | Conservation des projets | Les projets archivés sont conservés indéfiniment pour le moment, sans durée limite définie. |
| R7-03 | Confidentialité des affectations | Pour un projet inaccessible, afficher « Réservé » sans révéler le nom du projet. |
| R8-01 | Archives du matériel | Consultables uniquement par l’administrateur ; aucune restauration possible. |
| R8-02 | Suppression d’un matériel réservé | Annulation des réservations en cours et futures, conservation de l’historique et notification aux membres des projets concernés. |
| R8-03 | Périmètre de l’historique | Historique de l’inventaire et des réservations : qui a réservé quoi, quand et pour quel projet. Aucun journal des modifications des projets ; leurs archives restent conservées. |
| R9-01 | Notifications | Les notifications sont affichées dans l’application. |
| R9-02 | Accès à l’historique | Historique des matériels actifs réservé à l’administrateur et au gestionnaire, dans le respect des droits d’accès aux projets. Les archives du matériel restent réservées à l’administrateur. |
| R9-03 | Gestion des réservations | Tous les membres peuvent modifier ou annuler les réservations de leur projet, même créées par un autre membre. |
| R10-00 | Nombre de gestionnaires | Un seul gestionnaire possible à un instant donné. Cette correction remplace la possibilité antérieure d’en avoir plusieurs. |
| R10-01 | Horaires des réservations | Dates et heures de début et de fin obligatoires ; minutes limitées à 00 ou 30. |
| R10-02 | Suppression d’une catégorie | Retire la catégorie des matériels associés sans supprimer ces matériels. |
| R10-03 | Retour au rôle standard | L’administrateur peut rendre au gestionnaire le rôle d’utilisateur standard. |

### 16.2. Question explicitement reportée au client

- **R5-01 — Kanban :** conserve-t-on les colonnes fixes « À faire », « En cours » et « Fait », ou faut-il permettre leur personnalisation ? **À poser au client ; aucune décision prise.**

### 16.3. Autres points à compléter

| Référence | Sujet | Questions à traiter |
| --- | --- | --- |
| Q06 | Réunion | Quelle est la date de la réunion ? Qui y a participé et qui valide ce compte rendu ? |
| Q07 | Profils | Que deviennent les participations aux projets d’un utilisateur nommé gestionnaire, puisqu’il perd l’accès à tous les projets ? Que recouvre la gestion des « principales données » ? |
| Q08 | Droits sur les projets | En plus du créateur, d’autres personnes peuvent-elles clôturer ou archiver le projet ? Qui peut le supprimer ou changer sa visibilité ? Quels droits l’administrateur possède-t-il lorsqu’il n’est pas membre ? |
| Q09 | Membres | Qui peut retirer un participant ? Comment sélectionner les personnes à ajouter, notamment si elles ne se sont jamais connectées ? |
| Q10 | Fiches matériel | Quels identifiants techniques doivent être uniques lorsqu’ils sont renseignés ? Comment distinguer les types de matériel et les exemplaires ? |
| Q11 | Matériel non individualisé | Comment signaler sa disponibilité ou sa rupture ? Comment l’associer à un projet sans gérer de quantité précise ? |
| Q12 | Catégories | Quelle liste initiale de catégories prévoir ? |
| Q13 | Kanban | La personnalisation des colonnes est à demander au client, voir R5-01. Quels champs et actions faut-il prévoir pour les tâches : responsable, échéance, description, commentaires, pièces jointes ? |
| Q14 | Exports | Quelles colonnes et informations doivent figurer dans les fichiers Excel et PDF ? |
| Q15 | Historique de l’inventaire | Outre les réservations et annulations, quels événements faut-il tracer : création, modification, suppression, changement de catégories ? Faut-il enregistrer systématiquement leurs auteurs et leurs dates ? |
| Q16 | Archives des projets | Qui peut consulter les projets archivés, dans le respect de leur visibilité publique ou privée ? |
| Q17 | Fin de projet | Quelle différence de fonctionnement faut-il entre clôture et archivage ? Peut-on rouvrir un projet terminé ? |
| Q19 | Tableau de bord | Quelles informations et actions doivent apparaître pour chaque profil ? |
| Q20 | Réservations futures | Quels matériels seront réservables ? Que faire si une modification des dates d’un projet crée un chevauchement ? |
| Q21 | Environnement technique | L’application sera-t-elle accessible par navigateur ou installée sur les PC ? Quels navigateurs, serveurs et contraintes de déploiement sont imposés sur Intradef ? |
| Q22 | Données initiales et volume | Existe-t-il un inventaire à reprendre ? Combien d’utilisateurs, de matériels et de projets sont prévus ? |
| Q23 | Validation du premier sprint | Quelle est l’échéance ? Qui valide les maquettes, la connexion et le tableau de bord ? Quels critères doivent être remplis ? L’écran de changement des rôles est-il inclus ? |
| Q24 | Mots de passe de la simulation | Comment valider le mot de passe lors de la première connexion et des suivantes ? Comment configurer celui du compte `admin` ? |
| Q25 | Notifications | Quelles informations afficher dans les notifications de l’application et faut-il un suivi lu / non lu ? |

### 16.4. Suivi de la validation

- **Réponses et décisions complémentaires :** les décisions issues des dix séries de réponses sont intégrées dans le corps du document et récapitulées en section 16.1. La question Kanban reportée au client figure en section 16.2.
- **Points restant ouverts :** voir les sections 16.2 et 16.3.
- **Date de validation globale :** à renseigner.
- **Validé par :** à renseigner.
