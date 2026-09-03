# SUIVI — Règles de gestion et droits

**Source :** [compte rendu client](compte-rendu-reunion-client.md). Les questions renvoient au [registre](decisions-et-questions.md). Une permission non définie ne constitue pas une autorisation acquise.

## Connexion et rôles

| ID | Règle |
| --- | --- |
| RG-01 | La connexion demande un identifiant et un mot de passe. L’identifiant peut être un courriel. Aucun formulaire d’inscription ni création manuelle de compte. La vérification des secrets simulés reste à définir, Q-21. |
| RG-02 | À la première connexion validée, un utilisateur standard est créé automatiquement. Les connexions suivantes retrouvent le même compte et conservent son rôle. |
| RG-03 | Un seul administrateur existe, avec l’identifiant prédéfini `admin`. Son rôle ne peut pas être transféré. |
| RG-04 | Il existe au plus un gestionnaire. Seul l’administrateur attribue ou retire ce rôle à un utilisateur standard. Le devenir de ses participations est à arbitrer, Q-02. |
| RG-05 | Le gestionnaire ne consulte, ne crée et ne gère aucun projet ; il ne peut pas y participer. L’administrateur gère tous les projets sans obligation d’en être membre. |

## Inventaire

| ID | Règle |
| --- | --- |
| RG-06 | Le nom est le seul champ obligatoire saisi à la création d’un matériel. Catégories et identifiants techniques sont facultatifs. Le choix ou la valeur par défaut du mode de suivi est à arbitrer, Q-23. |
| RG-07 | Le matériel individualisé est suivi exemplaire par exemplaire. Le non-individualisé indique une présence/disponibilité sans quantité précise ni réservation. |
| RG-08 | Un matériel appartient à zéro, une ou plusieurs catégories. Aucune localisation physique n’est gérée. Supprimer une catégorie ne supprime ni n’archive ses matériels et préserve leurs autres catégories. |
| RG-09 | L’inventaire actif est consultable par les trois profils. Recherche multicritère, filtres et tri respectent les droits ; la liste exacte des critères envisagés est à confirmer, Q-25. |
| RG-10 | L’administrateur et le gestionnaire peuvent exporter tout l’inventaire actif ou les résultats filtrés, sous réserve des informations autorisées. Excel et PDF sont envisagés, Q-11. L’inclusion des archives n’est pas définie. |
| RG-11 | « Supprimer » un matériel l’archive : il disparaît de l’inventaire actif, ses données et son historique sont conservés. Seul l’administrateur les consulte. Aucune restauration ni action distincte de retrait. |
| RG-12 | Supprimer un matériel annule ses réservations en cours et futures, conserve leur trace et notifie les membres des projets concernés. |
| RG-13 | Les créations, modifications et suppressions de matériel portent une date et un auteur. L’identification du matériel, la date et l’auteur de sa suppression sont conservés. |
| RG-14 | Seuls l’administrateur et le gestionnaire consultent l’historique du matériel actif et de ses réservations. Le gestionnaire ne voit pas les informations des projets ; le standard n’a aucun accès à ces historiques, même pour ses projets. |

## Projets

| ID | Règle |
| --- | --- |
| RG-15 | L’administrateur et le standard créent un projet avec nom, description et visibilité. Les dates de début et de fin sont facultatives. Les droits du standard sur le choix/changement de visibilité restent à préciser, Q-06. |
| RG-16 | NP/public est consultable par tous sauf le gestionnaire. Secret/privé est consultable par l’administrateur, le créateur et les membres. « Secret » désigne une visibilité privée dans l’application. |
| RG-17 | Pour une réservation liée à un projet inaccessible, afficher « Réservé » à la place du nom du projet. Ne pas divulguer ses informations via inventaire, recherche, historique ou export. |
| RG-18 | L’ajout d’un membre est immédiat, sans invitation à accepter. Les membres peuvent modifier les informations, gérer les tâches et les réservations et ajouter des membres. L’administrateur peut aussi retirer des membres. Les autres droits de retrait restent ouverts, Q-07. |
| RG-19 | Chaque tâche possède un titre et une description. Aucun responsable, échéance ou priorité. Les colonnes À faire, En cours et Fait sont envisagées ; leur personnalisation reste à arbitrer, Q-01. Le détail du cycle de vie des tâches est suivi en Q-26. |
| RG-20 | Créateur et administrateur peuvent clôturer ou archiver un projet ; les matériels réservés sont immédiatement libérés et la trace des affectations conservée. Droits des autres membres, réouverture et différences d’état restent à arbitrer. |
| RG-21 | Une archive de projet conserve informations, participants, matériels associés et tâches réalisées, indéfiniment pour le moment. Aucun journal des modifications des projets n’est prévu. Consultation et suppression : Q-12. |

## Réservations et notifications

| ID | Règle |
| --- | --- |
| RG-22 | Seul le matériel individualisé est réservable depuis un projet par ses membres ou par l’administrateur. |
| RG-23 | Une réservation exige début et fin avec date et heure, minutes 00 ou 30. Les valeurs saisies pour la réservation priment ; les dates du projet peuvent préremplir les champs manquants. Toute information manquante doit être complétée avant validation. |
| RG-24 | Un matériel ne peut pas être réservé simultanément par deux projets. Toute création ou modification incompatible est refusée. Des réservations successives sans chevauchement sont possibles. Bornes et chevauchement dans un même projet : Q-22. |
| RG-25 | Tous les membres peuvent modifier ou annuler toute réservation de leur projet, quel qu’en soit l’auteur. L’administrateur agit sur tous les projets. Une annulation libère le créneau et reste tracée. |
| RG-26 | L’historique conserve le réservant, le matériel, la création, le début et la fin prévus, le projet et les éventuelles annulations, y compris après suppression du matériel. Réservations passées et annulées sont conservées. |
| RG-27 | Les notifications sont internes à l’application. Chaque destinataire possède son propre état lu/non lu. La suppression d’un matériel notifie les membres des projets avec réservation en cours ou future. Contenu et présentation : Q-15. |
| RG-28 | Le tableau de bord tient compte du profil. Le gestionnaire n’y voit aucun projet. L’administrateur dispose d’un accès direct à la gestion de l’inventaire. Contenu détaillé : Q-14. |
| RG-29 | Premier sprint : connexion fonctionnelle simulée, maquettes et tableau de bord avec données fictives. La réservation est exclue de ce sprint. |

## Matrice des droits

« À préciser » signifie qu’un arbitrage est nécessaire. La qualité de créateur ou membre est relative au projet consulté.

| Action | Administrateur | Gestionnaire | Standard |
| --- | --- | --- | --- |
| Consulter l’inventaire actif et les fiches | Oui | Oui | Oui |
| Créer/modifier/supprimer un matériel | Oui | Oui | Non prévu |
| Gérer les catégories | Oui | Oui | Non |
| Exporter l’inventaire | Oui | Oui, projets masqués | Non |
| Consulter l’historique actif | Oui | Oui, projets masqués | Non |
| Consulter matériel archivé et historique | Oui | Non | Non |
| Restaurer un matériel | Non | Non | Non |
| Créer un projet | Oui | Non | Oui, modalités de visibilité à préciser |
| Lire un projet public | Oui | Non | Oui |
| Lire un projet privé | Oui | Non | Créateur ou membre |
| Modifier les informations du projet | Oui, sans adhésion | Non | Membre |
| Choisir/changer la visibilité | Oui | Non | À préciser, Q-06 |
| Gérer tâches et réservations | Oui, sans adhésion | Non | Membre |
| Ajouter un membre | Oui | Non | Membre |
| Retirer un membre | Oui | Non | À préciser, Q-07 |
| Clôturer/archiver un projet | Oui | Non | Créateur ; autres membres à préciser |
| Consulter un projet archivé | À préciser | Non | À préciser |
| Supprimer un projet | Oui, modalités à préciser | Non | À préciser |
| Rouvrir un projet | À préciser | Non | À préciser |
| Attribuer/retirer le rôle gestionnaire | Oui | Non prévu | Non prévu |

Le droit de consulter un projet public ne permet pas de le modifier. La consultation opérationnelle des réservations d’un projet et l’historique de l’inventaire sont deux accès distincts ; l’un ne donne pas accès à l’autre.
