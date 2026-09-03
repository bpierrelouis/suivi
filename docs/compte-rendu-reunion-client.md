# SUIVI — Compte rendu de réunion client

**SUIVI** — **S**uivi des **U**sages, **I**nventaires, **V**ie des projets et **I**A

**Objet :** logiciel d’inventaire et de gestion de projets pour un laboratoire  
**Statut :** version consolidée  
**Date de la réunion :** à renseigner  
**Participants :** à renseigner  
**Rédacteur :** à renseigner

Les éléments indiqués comme envisagés ou à préciser restent à valider. Les points non résolus sont regroupés en section 8.

## 1. Contexte et objectifs

SUIVI doit permettre au laboratoire de gérer son inventaire, de suivre ses projets et d’organiser l’affectation et la réservation de matériel.

L’application vise d’abord une utilisation sur PC. Une adaptation mobile pourra être étudiée ultérieurement. L’environnement cible est **Intradef**, sans accès depuis Internet.

Pour le prototype et le premier sprint, cet environnement est simulé, sans intégration réelle à l’authentification Intradef : l’application gère elle-même la connexion et représente des utilisateurs supposés exister dans un système externe.

## 2. Connexion et droits d’accès

### 2.1. Connexion

La connexion utilise un **identifiant et un mot de passe**. L’identifiant peut être une adresse courriel.

Il n’y a pas d’inscription ni de création manuelle de comptes. L’application crée automatiquement chaque utilisateur à sa première connexion avec le **rôle standard**. Aux connexions suivantes, elle retrouve son compte et conserve son rôle.

Le compte administrateur est prédéfini avec l’identifiant **`admin`** et constitue l’exception au rôle standard attribué aux nouveaux utilisateurs. Son rôle ne peut pas être transféré.

### 2.2. Profils

Trois profils sont prévus : **administrateur**, **gestionnaire** et **utilisateur standard**. Il existe un seul administrateur et au maximum **un gestionnaire à un instant donné**.

L’administrateur peut attribuer le rôle de gestionnaire à un utilisateur standard et lui rendre ensuite le rôle standard. Il gère également les principales données de l’application.

| Fonctionnalité | Administrateur | Gestionnaire | Utilisateur standard |
| --- | --- | --- | --- |
| Consulter l’inventaire actif | Oui | Oui | Oui |
| Créer, modifier ou supprimer du matériel | Oui | Oui | Non prévu |
| Gérer les catégories | Oui | Oui | Non |
| Exporter l’inventaire | Oui | Oui | Non |
| Consulter l’historique du matériel actif | Oui | Oui, avec les informations de projet masquées | Non |
| Consulter le matériel archivé et son historique | Oui | Non | Non |
| Créer un projet | Oui | Non | Oui |
| Consulter les projets publics | Tous | Non | Tous |
| Consulter les projets privés | Tous | Non | Si créateur ou membre |
| Modifier un projet, ses tâches et ses réservations | Oui, même sans être membre | Non | Si membre |
| Ajouter des membres à un projet | Oui, même sans être membre | Non | Si membre |
| Clôturer ou archiver un projet | Oui, même sans être membre | Non | Si créateur ; autres cas à préciser |
| Supprimer un projet | Oui, modalités à préciser | Non | À préciser |
| Attribuer ou retirer le rôle de gestionnaire | Oui | Non prévu | Non prévu |

Le gestionnaire n’a accès à **aucun projet**, public ou privé, et ne peut pas y participer. L’administrateur peut gérer l’ensemble des projets, leurs informations, leurs membres, leurs tâches, leur visibilité et leurs réservations sans avoir à en être membre.

## 3. Gestion de l’inventaire

### 3.1. Fiches matériel

Le **nom est le seul champ obligatoire** à la création d’un matériel. Les catégories et les identifiants techniques sont facultatifs.

Deux modes de suivi sont prévus :

- **Matériel non individualisé :** consommables et petits équipements référencés sans suivi par exemplaire ni comptage précis. Exemples : vis, tournevis et petits outils. L’objectif est d’indiquer leur présence et leur disponibilité dans le laboratoire. Ces matériels ne sont pas réservables.
- **Matériel individualisé :** équipements enregistrés exemplaire par exemplaire, afin de connaître leur nombre exact et de suivre chaque matériel. Les fiches peuvent contenir un numéro de série, une adresse MAC, une référence constructeur, un numéro d’inventaire ou un autre identifiant utile.

Un même type de matériel peut ainsi regrouper plusieurs exemplaires distincts, par exemple trois Raspberry Pi 5 possédant chacun leur propre fiche. Les identifiants techniques restent facultatifs, même pour un exemplaire individualisé.

### 3.2. Catégories

L’inventaire est organisé par **catégories**, sans gestion de localisation physique : aucun rayon, armoire, étagère ou bac n’est à renseigner.

L’administrateur et le gestionnaire peuvent créer, modifier et supprimer les catégories. Un matériel peut appartenir à plusieurs catégories ou n’en avoir aucune.

Supprimer une catégorie retire son association aux matériels concernés, sans les supprimer ni les archiver. Leurs autres catégories sont conservées.

### 3.3. Recherche et consultation

L’inventaire permet de rechercher du matériel, de combiner plusieurs critères, de filtrer et trier les résultats, puis de consulter les fiches détaillées.

Les critères envisagés comprennent le type de matériel, les catégories, la disponibilité, le numéro de série, l’adresse MAC et le projet associé, dans le respect des droits d’accès.

### 3.4. Exports

Les exports sont réservés à **l’administrateur et au gestionnaire**. Ils peuvent porter sur l’inventaire complet ou uniquement sur les résultats correspondant aux filtres actifs.

Les formats envisagés sont **Excel** et **PDF**. Les informations exportées respectent les droits d’accès aux projets.

### 3.5. Suppression et archivage

L’action **« Supprimer »** archive le matériel : sa fiche disparaît de l’inventaire actif, mais ses données et son historique sont conservés. Aucune action de retrait distincte n’est prévue.

**Seul l’administrateur peut consulter les matériels archivés et leur historique. Aucune restauration n’est possible.** L’identification du matériel, la date de suppression et son auteur sont conservés.

La suppression annule les réservations en cours et futures du matériel, tout en conservant leur historique. Les membres des projets concernés reçoivent une notification dans l’application.

### 3.6. Historique de l’inventaire et des réservations

Les **créations, modifications et suppressions de matériel sont tracées avec leur date et leur auteur**.

L’historique des réservations permet de retrouver **qui a réservé quoi, quand et pour quel projet**. Il conserve :

- l’utilisateur ayant effectué la réservation ;
- le matériel concerné ;
- la date de création de la réservation ;
- les dates et heures de début et de fin prévues ;
- le projet associé ;
- la trace d’une éventuelle annulation, y compris après suppression du matériel.

Les réservations passées ou annulées restent conservées. L’historique du matériel actif et de ses réservations est accessible uniquement à l’administrateur et au gestionnaire. Les utilisateurs standards n’y ont pas accès, même pour leurs projets. Les règles de confidentialité s’appliquent aux informations affichées.

## 4. Gestion des projets

### 4.1. Création et visibilité

L’administrateur et les utilisateurs standards peuvent créer des projets. Les informations minimales sont le **nom**, la **description** et le **niveau de visibilité**. Les dates de début et de fin du projet sont facultatives.

Deux niveaux de visibilité sont retenus :

- **NP — public :** visible par tous les utilisateurs, à l’exception du gestionnaire ;
- **Secret — privé :** visible par l’administrateur, le créateur et les membres du projet.

Le terme « Secret » désigne ici une visibilité privée. Consulter un projet public ne donne pas automatiquement le droit de le modifier.

Lorsqu’un matériel est réservé pour un projet inaccessible à l’utilisateur, seule la mention **« Réservé »** apparaît à la place du nom du projet. Cette règle s’applique à l’inventaire, aux recherches, aux historiques et aux exports, notamment pour le gestionnaire.

### 4.2. Membres

L’ajout d’un membre est **immédiat**, sans acceptation d’une invitation. Il donne accès au projet privé concerné et permet de participer à son suivi. Le gestionnaire ne peut pas être membre d’un projet.

Pour le moment, tous les membres peuvent :

- consulter et modifier les informations du projet ;
- gérer ses tâches ;
- affecter du matériel réservable ;
- modifier ou annuler toute réservation du projet, même créée par un autre membre ;
- ajouter d’autres membres.

L’administrateur dispose de ces droits sur tous les projets et peut également gérer le retrait des membres. Les droits particuliers restant à définir sont regroupés en fin de document.

### 4.3. Suivi des tâches

Chaque projet possède un tableau **Kanban**, inspiré du fonctionnement de Trello. Les colonnes envisagées sont **À faire**, **En cours** et **Fait** ; leur caractère fixe ou personnalisable reste à préciser.

Chaque tâche comporte un **titre** et une **description**. Aucun responsable, aucune échéance et aucune priorité ne sont prévus.

### 4.4. Clôture et archivage

Le **créateur et l’administrateur** peuvent clôturer ou archiver un projet. Cette action libère immédiatement les matériels réservés pour ce projet. La trace des affectations reste conservée dans l’historique de l’inventaire et des réservations.

L’archive du projet conserve ses informations, ses participants, les matériels associés et les tâches réalisées. Ces données sont conservées **indéfiniment pour le moment**, aucune durée limite n’étant définie.

Aucun journal des modifications des projets n’est prévu. La traçabilité détaillée concerne l’inventaire et les réservations.

## 5. Affectation et réservation du matériel

Depuis un projet, les membres et l’administrateur peuvent associer du matériel individualisé et gérer ses réservations. Depuis l’inventaire, l’affectation peut être consultée selon les droits d’accès au projet.

Chaque réservation comporte obligatoirement une **date et une heure de début** ainsi qu’une **date et une heure de fin**. Les horaires sont sélectionnés à l’heure pile ou à la demi-heure : **minutes 00 ou 30 uniquement**.

Les dates propres à la réservation sont utilisées en priorité. À défaut, celles du projet servent de valeurs par défaut lorsqu’elles sont renseignées. Toute date ou heure manquante doit être complétée avant validation.

Un matériel ne peut pas être affecté à deux projets simultanément. Il est indisponible pour les autres projets pendant sa période de réservation. Des réservations successives sont possibles si elles ne se chevauchent pas ; une création ou modification incompatible doit être refusée.

Tous les membres peuvent modifier ou annuler les réservations de leur projet, quel qu’en soit l’auteur. L’administrateur dispose des mêmes droits sur tous les projets, même sans être membre. L’annulation libère le matériel pour la période concernée et reste tracée dans l’historique.

Un calendrier est envisagé pour visualiser les périodes de disponibilité, les réservations et éventuellement le projet associé, selon les droits d’accès.

**La réservation de matériel est hors périmètre du premier sprint.**

## 6. Tableau de bord et notifications

La page d’accueil sert de tableau de bord et présente notamment les projets de l’utilisateur selon ses droits. Le gestionnaire n’y voit aucun projet. L’administrateur dispose d’un accès direct à la gestion de l’inventaire.

Les notifications sont affichées **dans l’application**, avec un statut **lu ou non lu propre à chaque destinataire**.

Lorsqu’un matériel est supprimé, les membres des projets qui l’utilisent actuellement ou l’ont réservé pour une période future sont notifiés de l’annulation de leur réservation.

## 7. Premier sprint

Le premier sprint porte sur les fondations de l’application et prévoit :

- une **connexion fonctionnelle** selon les règles de la section 2, avec création automatique des utilisateurs standards et compte `admin` prédéfini ;
- les **maquettes** de l’organisation générale, de la navigation, de la page d’accueil, de la consultation des projets et de l’inventaire ;
- un **tableau de bord accessible après connexion**, alimenté par des données fictives.

L’environnement Intradef est simulé et la connexion est gérée par l’application. La réservation du matériel ne sera pas développée pendant ce sprint.

## 8. Points à préciser

### 8.1. Points à éclaircir avec le client

- **Kanban :** les colonnes « À faire », « En cours » et « Fait » sont-elles fixes ou personnalisables ?
- **Changement de rôle :** que deviennent les participations d’un utilisateur nommé gestionnaire ? Sont-elles conservées et masquées jusqu’à son retour au rôle standard, ou supprimées ?
- **Réouverture des projets :** peut-on rouvrir un projet après sa clôture ou son archivage ?

### 8.2. Autres précisions attendues

| Sujet | Points à définir |
| --- | --- |
| Réunion et validation | Date, participants, rédacteur, personne chargée de valider le compte rendu et date de validation. |
| Administration | Périmètre des « principales données » gérées par l’administrateur au-delà des fonctions décrites et éventuels droits des autres profils sur ces données. |
| Droits sur les projets | Droits des utilisateurs standards sur la suppression et le choix ou le changement de visibilité ; éventuel droit de clôture ou d’archivage pour les membres autres que le créateur. |
| Membres | Personnes autorisées à retirer un membre en plus de l’administrateur ; sélection des utilisateurs à ajouter, notamment avant leur première connexion. |
| Identification du matériel | Règles d’unicité des identifiants techniques renseignés et distinction entre type de matériel, catégorie et exemplaire. Une référence constructeur n’est pas présumée unique par exemplaire. |
| Matériel non individualisé | Signalement d’une indisponibilité ou rupture ; éventuelle association informative à un projet, sans réservation ni quantité précise. |
| Catégories | Liste initiale à prévoir. |
| Exports | Colonnes et informations à inclure dans les fichiers Excel et PDF. |
| Archives des projets | Droits de consultation, différence de fonctionnement entre clôture et archivage, modalités de suppression d’un projet. |
| Réservations | Incidence des changements de dates d’un projet sur les réservations existantes et traitement des conflits éventuels. |
| Tableau de bord | Informations et actions à présenter pour chaque profil. |
| Notifications | Contenu et présentation des notifications dans l’application. |
| Environnement technique | Application accessible par navigateur ou installée sur les PC ; navigateurs, serveurs et contraintes de déploiement sur Intradef. |
| Données initiales | Inventaire existant à reprendre et volumes attendus d’utilisateurs, de matériels et de projets. |
| Premier sprint | Échéance, validation, critères d’acceptation, autres écrans nécessaires et inclusion éventuelle de l’écran de changement des rôles. |
| Connexion simulée | Validation du mot de passe lors de la première connexion et des suivantes ; configuration du mot de passe du compte `admin`. |
