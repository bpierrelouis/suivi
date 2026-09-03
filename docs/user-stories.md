# SUIVI — User stories et critères d’acceptation

**Statut :** rédaction proposée à partir du [compte rendu](compte-rendu-reunion-client.md). Les [priorités, lots et états](backlog.md) sont centralisés dans le backlog. Les critères ci-dessous servent à préparer la recette ; ils ne prouvent pas qu’une fonction existe.

Chaque story est rattachée aux [règles de gestion](regles-de-gestion.md). Les `Q-xx` renvoient aux [arbitrages](decisions-et-questions.md). Les précisions nouvelles sont marquées « proposition » et restent à valider. Les autorisations se vérifient aussi lors d’un accès direct aux données, selon l’architecture retenue.

## E1 — Accès et accueil

<a id="us-01"></a>
### US-01 — Se connecter et retrouver son compte

En tant qu’utilisateur, je veux me connecter avec mon identifiant et mon mot de passe afin d’accéder à mon espace avec mon rôle.

**Référence :** compte rendu §2.1 et §7 ; RG-01, RG-02, RG-29. **Arbitrage :** Q-21.

- CA1 : lorsqu’une première connexion est validée par le mécanisme de simulation convenu, un seul compte standard est créé automatiquement, sans inscription ni création manuelle.
- CA2 : lors d’une nouvelle connexion avec le même identifiant reconnu, le compte existant est retrouvé et son rôle est conservé.
- CA3 : la connexion demande un identifiant et un mot de passe ; le mécanisme de validation de ces valeurs doit être décidé avant de déclarer la story prête.
- CA4 : une connexion réussie ouvre le tableau de bord. **Proposition :** une connexion refusée n’ouvre pas de session et ne crée pas de compte ; un message compréhensible est présenté.

<a id="us-02"></a>
### US-02 — Accéder au compte administrateur prédéfini

En tant qu’administrateur, je veux utiliser le compte `admin` afin d’administrer SUIVI.

**Référence :** §2.1 et §7 ; RG-03. **Arbitrage :** Q-21 pour la configuration du secret.

- CA1 : le compte `admin` est disponible avec le rôle administrateur dès l’initialisation du prototype.
- CA2 : une connexion de ce compte ne lui attribue jamais le rôle standard.
- CA3 : aucune opération d’attribution de rôle ne transfère le rôle administrateur ou ne crée un deuxième administrateur.

<a id="us-03"></a>
### US-03 — Attribuer et retirer le rôle gestionnaire

En tant qu’administrateur, je veux désigner un gestionnaire et lui rendre ensuite le rôle standard afin d’organiser la tenue de l’inventaire.

**Référence :** §2.2 ; RG-03 à RG-05. **Arbitrages :** Q-02, Q-20.

- CA1 : seul l’administrateur peut attribuer ce rôle à un utilisateur standard existant ou le lui retirer.
- CA2 : aucune séquence d’attribution, y compris simultanée, ne laisse plus d’un gestionnaire ; le parcours de remplacement est à préciser en Q-02.
- CA3 : après retrait, l’utilisateur a le rôle standard ; une reconnexion conserve ce rôle.
- CA4 : dès l’attribution, aucun accès aux projets ni participation opérationnelle n’est autorisé au gestionnaire. Le traitement des adhésions antérieures doit suivre l’arbitrage Q-02.

<a id="us-04"></a>
### US-04 — Consulter un tableau de bord adapté à son profil

En tant qu’utilisateur connecté, je veux voir un accueil adapté à mes droits afin de rejoindre les fonctions utiles.

**Référence :** §6 et §7 ; RG-05, RG-28, RG-29. **Arbitrages :** Q-14, Q-20.

- CA1 : après connexion, le tableau de bord est accessible ; au premier sprint, il utilise des données fictives.
- CA2 : le gestionnaire n’y voit aucun projet ; le standard ne voit aucun projet privé auquel il n’a pas accès.
- CA3 : l’administrateur dispose d’un accès direct à la gestion de l’inventaire.
- CA4 : les informations et actions affichées par profil correspondent à la maquette retenue ; leur liste finale doit être validée en Q-14.

## E2 — Inventaire et catégories

<a id="us-05"></a>
### US-05 — Consulter l’inventaire et les fiches

En tant qu’utilisateur connecté, je veux consulter les matériels actifs et leur détail afin d’identifier les équipements du laboratoire.

**Référence :** §3.1 à §3.3 ; RG-06, RG-07, RG-09, RG-17.

- CA1 : chaque profil peut consulter les fiches actives, y compris celles sans catégorie ni identifiant technique.
- CA2 : plusieurs exemplaires d’un même type possèdent des fiches distinctes ; le non-individualisé n’affiche pas de comptage précis comme exigence métier.
- CA3 : un matériel supprimé n’apparaît plus dans l’inventaire actif.
- CA4 : lorsqu’un projet associé est inaccessible, son nom est remplacé par « Réservé » et aucune information de ce projet n’est divulguée.

<a id="us-06"></a>
### US-06 — Créer une fiche matériel

En tant qu’administrateur ou gestionnaire, je veux ajouter du matériel afin de tenir l’inventaire à jour.

**Référence :** §3.1 et §3.6 ; RG-06, RG-07, RG-13. **Arbitrages :** Q-08, Q-23.

- CA1 : une fiche peut être créée en ne saisissant que son nom ; un nom absent empêche la validation. Le mode de suivi reçoit le comportement convenu en Q-23.
- CA2 : les catégories et les identifiants techniques sont facultatifs, y compris pour un exemplaire individualisé.
- CA3 : l’auteur et la date de création sont tracés ; la fiche est consultable dans l’inventaire actif.
- CA4 : le standard ne peut pas créer de matériel. Aucune unicité des identifiants techniques n’est imposée au titre d’une décision client avant Q-08.

<a id="us-07"></a>
### US-07 — Modifier une fiche matériel

En tant qu’administrateur ou gestionnaire, je veux corriger une fiche active afin de maintenir des informations fiables.

**Référence :** §3.1 et §3.6 ; RG-06, RG-13. **Arbitrages :** Q-08, Q-09, Q-23.

- CA1 : les informations autorisées d’une fiche active peuvent être modifiées en conservant un nom obligatoire.
- CA2 : la modification est tracée avec date et auteur ; les informations enregistrées sont visibles à la consultation suivante.
- CA3 : un standard ne peut pas modifier la fiche.
- CA4 : les changements de mode de suivi et le signalement d’indisponibilité du non-individualisé suivent les décisions Q-23 et Q-09 ; ils ne sont pas considérés comme acquis.

<a id="us-08"></a>
### US-08 — Gérer les catégories

En tant qu’administrateur ou gestionnaire, je veux gérer les catégories et les associations des matériels afin d’organiser l’inventaire.

**Référence :** §3.2 ; RG-08. **Arbitrage :** Q-10 pour la liste initiale.

- CA1 : l’administrateur et le gestionnaire peuvent créer, modifier et supprimer une catégorie ; le standard ne le peut pas.
- CA2 : une fiche accepte zéro, une ou plusieurs catégories ; aucun champ de localisation physique n’est demandé.
- CA3 : supprimer une catégorie retire seulement ses associations ; les matériels restent actifs et leurs autres catégories sont conservées.

<a id="us-09"></a>
### US-09 — Rechercher, filtrer et trier l’inventaire

En tant qu’utilisateur connecté, je veux combiner des critères de recherche afin de retrouver le matériel pertinent.

**Référence :** §3.3 et §4.1 ; RG-09, RG-17. **Arbitrages :** Q-08, Q-25.

- CA1 : plusieurs critères peuvent être combinés ; résultats et tri correspondent aux critères convenus en Q-25.
- CA2 : les critères envisagés sont type, catégories, disponibilité, numéro de série et projet associé ; cette liste doit être confirmée.
- CA3 : un critère ou une suggestion ne révèle pas un projet inaccessible ; un filtre ne permet pas de retrouver son nom ou son identifiant masqué.
- CA4 : une recherche sans résultat présente une liste vide et permet de modifier les filtres (**proposition ergonomique**).

<a id="us-10"></a>
### US-10 — Supprimer un matériel en conservant sa trace

En tant qu’administrateur ou gestionnaire, je veux supprimer un matériel de l’inventaire actif afin qu’il ne soit plus proposé à l’utilisation.

**Référence :** §3.5 ; RG-11 à RG-13, RG-27.

- CA1 : l’action « Supprimer » archive la fiche, sans effacer ses données ni son historique et sans possibilité de restauration.
- CA2 : identification du matériel, auteur et date de suppression sont conservés ; seuls les administrateurs consultent cette archive.
- CA3 : toutes les réservations en cours et futures sont annulées, les créneaux libérés, et les réservations passées ou annulées restent tracées.
- CA4 : les membres des projets ayant des réservations en cours/futures reçoivent une notification interne. Une réservation uniquement passée ne déclenche pas cette notification.

<a id="us-11"></a>
### US-11 — Consulter les archives du matériel

En tant qu’administrateur, je veux retrouver les matériels supprimés et leur historique afin de conserver la mémoire de l’inventaire.

**Référence :** §3.5 ; RG-11, RG-13, RG-26.

- CA1 : l’administrateur retrouve la fiche archivée, son identification, la date et l’auteur de suppression.
- CA2 : l’historique du matériel et de ses réservations reste consultable, y compris les annulations liées à la suppression.
- CA3 : gestionnaire et standard ne peuvent accéder à ces données, même en visant directement une fiche connue.
- CA4 : aucune action de restauration n’est disponible ou exécutable.

<a id="us-12"></a>
### US-12 — Consulter l’historique du matériel actif

En tant qu’administrateur ou gestionnaire, je veux consulter les événements d’un matériel actif afin d’en comprendre l’évolution.

**Référence :** §3.6 ; RG-13, RG-14, RG-17.

- CA1 : les créations et modifications sont retrouvées avec date et auteur ; après suppression, l’historique relève de l’accès aux archives administrateur.
- CA2 : le gestionnaire ne reçoit pas d’informations de projets dans les événements affichés.
- CA3 : aucun standard n’accède à cet historique, même s’il est membre d’un projet utilisant le matériel.

<a id="us-13"></a>
### US-13 — Exporter l’inventaire

En tant qu’administrateur ou gestionnaire, je veux exporter l’inventaire complet ou filtré afin de disposer d’un état exploitable hors de l’écran.

**Référence :** §3.4 ; RG-10, RG-17. **Arbitrage :** Q-11.

- CA1 : l’utilisateur choisit l’ensemble de l’inventaire actif ou les résultats des filtres actifs ; le fichier contient le périmètre choisi.
- CA2 : le format et les colonnes suivent l’arbitrage Q-11 ; Excel et PDF sont envisagés, sans choix final présumé.
- CA3 : l’export du gestionnaire ne contient aucune information de projet inaccessible ; « Réservé » remplace le nom concerné.
- CA4 : un standard ne peut déclencher ni récupérer un export réservé à un autre profil.

## E3 — Projets et collaboration

<a id="us-14"></a>
### US-14 — Créer un projet

En tant qu’administrateur ou utilisateur standard, je veux créer un projet afin d’organiser un travail du laboratoire.

**Référence :** §4.1 ; RG-15, RG-16. **Arbitrages :** Q-06, Q-27.

- CA1 : la création recueille nom, description et visibilité ; les dates de début et de fin restent facultatives.
- CA2 : l’utilisateur à l’origine du projet est identifié comme créateur ; son adhésion automatique comme membre reste à confirmer en Q-27.
- CA3 : le projet suit les droits NP/public ou Secret/privé ; les modalités du choix par un standard sont fixées en Q-06.
- CA4 : le gestionnaire ne peut pas créer de projet.

<a id="us-15"></a>
### US-15 — Consulter les projets autorisés

En tant qu’administrateur ou utilisateur standard, je veux consulter les projets auxquels j’ai accès afin de suivre leur activité.

**Référence :** §2.2 et §4.1 ; RG-05, RG-16, RG-17.

- CA1 : un standard consulte les projets publics ainsi que les projets privés dont il est créateur ou membre ; les autres projets privés sont inaccessibles.
- CA2 : l’administrateur consulte tous les projets actifs sans obligation d’adhésion.
- CA3 : le gestionnaire ne reçoit ni liste ni détail de projet, public ou privé.
- CA4 : consulter un projet public sans être membre n’accorde aucun droit de modification.

<a id="us-16"></a>
### US-16 — Modifier les informations d’un projet

En tant que membre ou administrateur, je veux modifier les informations d’un projet afin de maintenir son suivi à jour.

**Référence :** §2.2 et §4.2 ; RG-15, RG-18. **Arbitrages :** Q-06, Q-13.

- CA1 : un membre modifie les informations de son projet ; l’administrateur agit aussi sans être membre.
- CA2 : le gestionnaire et un standard non membre ne peuvent pas effectuer la modification.
- CA3 : le nom, la description et la visibilité restent renseignés ; les droits de changement de visibilité suivent Q-06.
- CA4 : l’effet d’un changement des dates du projet sur les réservations existantes doit être fixé par Q-13 avant réalisation de ce comportement.

<a id="us-17"></a>
### US-17 — Ajouter des membres

En tant que membre ou administrateur, je veux ajouter un utilisateur à un projet afin qu’il puisse y collaborer immédiatement.

**Référence :** §4.2 ; RG-05, RG-18. **Arbitrage :** Q-07.

- CA1 : un membre ajoute d’autres membres à son projet ; l’administrateur peut le faire sur tout projet sans adhésion.
- CA2 : l’ajout donne immédiatement les droits du membre, y compris la consultation d’un projet privé, sans acceptation d’invitation.
- CA3 : le gestionnaire ne peut pas être ajouté ; un standard non membre ne peut pas ajouter d’utilisateur.
- CA4 : le mode de sélection, notamment pour un utilisateur jamais connecté, suit Q-07 et n’introduit pas de création manuelle de compte.

<a id="us-18"></a>
### US-18 — Retirer un membre

En tant qu’administrateur, je veux retirer un membre afin de gérer la composition des projets.

**Référence :** §4.2 ; RG-18. **Arbitrages :** Q-07, Q-27.

- CA1 : l’administrateur peut retirer un membre d’un projet sans en être lui-même membre.
- CA2 : après retrait d’un standard qui n’est pas créateur, l’appartenance ne donne plus de droits ; un projet privé devient inaccessible sauf autre droit applicable.
- CA3 : les droits éventuels de retrait des autres profils, le retrait du créateur et l’effet sur les réservations existantes doivent être décidés en Q-07/Q-27.

<a id="us-19"></a>
### US-19 — Gérer les tâches en Kanban

En tant que membre ou administrateur, je veux gérer les tâches d’un projet dans un Kanban afin de suivre le travail.

**Référence :** §4.3 ; RG-18, RG-19. **Arbitrages :** Q-01, Q-26.

- CA1 : chaque tâche présente un titre et une description ; aucun responsable, échéance ni priorité n’est demandé.
- CA2 : **proposition de détail du suivi** : un membre ou l’administrateur crée/modifie une tâche et la déplace entre colonnes ; ces opérations et l’éventuelle suppression sont à confirmer en Q-26.
- CA3 : les colonnes et leur caractère fixe/personnalisable suivent Q-01 ; À faire, En cours et Fait sont la proposition initiale.
- CA4 : les personnes autorisées à consulter le projet peuvent voir son tableau ; les personnes sans droit de modification ne peuvent pas le changer.

<a id="us-20"></a>
### US-20 — Clôturer ou archiver un projet

En tant que créateur ou administrateur, je veux terminer un projet afin de libérer son matériel et conserver ses éléments.

**Référence :** §4.4 ; RG-20, RG-21, RG-26. **Arbitrages :** Q-03, Q-06, Q-12.

- CA1 : le créateur et l’administrateur peuvent déclencher la clôture ou l’archivage ; les droits des autres membres restent à préciser.
- CA2 : les matériels réservés pour le projet sont immédiatement libérés, y compris pour les périodes futures ; la trace des affectations est conservée.
- CA3 : l’archive conserve informations, participants, matériels associés et tâches réalisées, sans échéance de suppression définie.
- CA4 : les différences entre clôture et archivage, les modifications ultérieures et la réouverture suivent Q-03/Q-12 ; aucun comportement supplémentaire n’est présumé.

<a id="us-21"></a>
### US-21 — Consulter les archives des projets

**Story candidate, rôle à confirmer en Q-12.** En tant qu’utilisateur autorisé à consulter les archives de projets, je veux retrouver un projet archivé afin de consulter les éléments conservés.

**Référence :** §4.4 et §8.2 ; RG-21. **Arbitrages :** Q-03, Q-12.

- CA1 : les informations, participants, matériels associés et tâches réalisées restent conservés indéfiniment pour le moment.
- CA2 : l’affichage des archives suit les profils et droits qui seront décidés en Q-12 ; le gestionnaire reste exclu des projets.
- CA3 : la consultation ne présente pas un journal des modifications de projet, absent du périmètre.
- CA4 : les actions de modification, suppression et réouverture ne sont pas intégrées comme acquises ; elles nécessitent un arbitrage puis, si retenues, des stories complémentaires.

## E4 — Réservations et traçabilité

<a id="us-22"></a>
### US-22 — Réserver un exemplaire pour un projet

En tant que membre ou administrateur, je veux réserver un matériel individualisé afin d’en disposer pour mon projet pendant une période donnée.

**Référence :** §5 ; RG-17, RG-22 à RG-24, RG-26. **Arbitrages :** Q-22, Q-27. Hors premier sprint.

- CA1 : un membre réserve pour son projet, l’administrateur pour tout projet ; le gestionnaire, le non-membre standard et le matériel non individualisé sont exclus.
- CA2 : début et fin comprennent chacun date et heure ; seules les minutes 00 et 30 sont acceptées. Une valeur manquante empêche la validation.
- CA3 : les valeurs propres à la réservation priment sur celles du projet ; les dates projet renseignées servent de défaut, sans inventer les horaires manquants.
- CA4 : une réservation qui chevauche celle d’un autre projet est refusée ; des créneaux successifs sans chevauchement sont possibles.
- CA5 : réservant, matériel, projet, création et période prévue sont conservés. **Propositions à valider :** fin strictement après début, convention de bornes, fuseau et contrôle des demandes simultanées, Q-22.

<a id="us-23"></a>
### US-23 — Modifier une réservation

En tant que membre ou administrateur, je veux modifier une réservation du projet afin d’adapter l’utilisation du matériel.

**Référence :** §5 ; RG-23 à RG-26. **Arbitrage :** Q-22.

- CA1 : tout membre modifie une réservation de son projet, même créée par un autre ; l’administrateur agit sur tous les projets.
- CA2 : une modification respecte les dates/heures obligatoires et les minutes 00 ou 30, sans créer de chevauchement interdit.
- CA3 : **proposition de cohérence** : une modification refusée conserve la réservation initiale et son créneau.
- CA4 : les informations nécessaires à la traçabilité sont conservées ; la granularité des valeurs avant/après et les opérations sur réservations passées/annulées suivent Q-22.

<a id="us-24"></a>
### US-24 — Annuler une réservation

En tant que membre ou administrateur, je veux annuler une réservation du projet afin de libérer le matériel sur la période concernée.

**Référence :** §5 ; RG-25, RG-26. **Arbitrage :** Q-22 pour le cycle de vie détaillé.

- CA1 : un membre annule toute réservation de son projet indépendamment du réservant ; l’administrateur agit sans adhésion.
- CA2 : après annulation, le créneau n’empêche plus une réservation compatible par un autre projet.
- CA3 : la réservation et la trace de son annulation restent conservées dans l’historique autorisé.
- CA4 : gestionnaire et standard non membre ne peuvent pas annuler une réservation.

<a id="us-25"></a>
### US-25 — Consulter l’historique des réservations

En tant qu’administrateur ou gestionnaire, je veux retrouver les réservations d’un matériel actif afin de savoir qui l’a réservé et sur quelle période.

**Référence :** §3.6 ; RG-14, RG-17, RG-26.

- CA1 : l’historique conserve réservant, matériel, date de création, début et fin prévus, projet et trace d’annulation éventuelle.
- CA2 : les réservations passées et annulées restent disponibles ; après suppression du matériel, seul l’administrateur accède à l’historique archivé.
- CA3 : le gestionnaire ne voit pas les informations du projet ; la référence visible au projet est remplacée par « Réservé ».
- CA4 : aucun standard n’accède à cet historique, même pour une réservation qu’il a créée ou un projet dont il est membre.

<a id="us-26"></a>
### US-26 — Visualiser un calendrier de disponibilité

**Story candidate, fonctionnalité envisagée.** En tant qu’utilisateur autorisé à consulter l’inventaire, je veux visualiser les périodes de disponibilité afin de préparer l’utilisation du matériel.

**Référence :** §5 ; RG-17, RG-24. **Arbitrages :** Q-16, Q-22.

- CA1 : si le calendrier est retenu, il représente les périodes disponibles et réservées selon le périmètre validé en Q-16.
- CA2 : le nom d’un projet inaccessible est remplacé par « Réservé », sans accès au détail du projet.
- CA3 : les périodes affichées correspondent aux réservations en vigueur ; les créneaux annulés n’apparaissent plus comme bloquants.
- CA4 : consulter ce calendrier n’accorde pas de droit de réservation ni d’accès à l’historique réservé aux profils habilités.

## E5 — Notifications et confidentialité

<a id="us-27"></a>
### US-27 — Être notifié après suppression d’un matériel réservé

En tant que membre d’un projet concerné, je veux être informé de l’annulation provoquée par une suppression de matériel afin d’adapter le projet.

**Référence :** §3.5 et §6 ; RG-12, RG-27. **Arbitrages :** Q-02, Q-15.

- CA1 : supprimer un matériel déclenche une notification interne pour les membres des projets ayant une réservation en cours ou future de ce matériel.
- CA2 : une réservation uniquement passée n’est pas un motif de notification au titre de cet événement.
- CA3 : la notification indique l’annulation ; ses champs, son regroupement éventuel et le traitement des changements de rôle suivent Q-15/Q-02.
- CA4 : l’état de lecture est propre à chaque destinataire ; aucun envoi de courriel n’est requis.

<a id="us-28"></a>
### US-28 — Consulter ses notifications et les marquer comme lues

En tant que destinataire, je veux distinguer mes notifications lues et non lues afin de suivre les informations reçues.

**Référence :** §6 ; RG-27. **Arbitrage :** Q-15.

- CA1 : le destinataire consulte ses notifications internes avec leur état lu/non lu.
- CA2 : lorsqu’il marque une notification comme lue, l’état des autres destinataires reste inchangé.
- CA3 : le parcours de lecture et l’éventuel retour à non lu sont à fixer en Q-15 ; ils ne sont pas présumés.
- CA4 : **proposition de confidentialité** : un accès direct ne permet pas de lire ou modifier les notifications d’un autre destinataire ; le contenu respecte les droits actuels sur les projets.

<a id="us-29"></a>
### US-29 — Préserver la confidentialité selon les droits

En tant qu’utilisateur d’un projet privé, je veux que ses informations soient accessibles uniquement aux personnes autorisées afin de respecter la visibilité choisie.

**Référence :** §2.2, §3.4, §3.6 et §4.1 ; RG-05, RG-14, RG-16, RG-17.

- CA1 : un projet privé est inaccessible à un standard extérieur ; tous les projets sont inaccessibles au gestionnaire.
- CA2 : inventaire, recherches, historiques et exports ne révèlent pas les informations d’un projet inaccessible ; « Réservé » remplace son nom.
- CA3 : un accès autorisé à un projet n’ouvre pas l’historique du matériel ou des réservations à un standard.
- CA4 : **proposition technique** : les restrictions sont vérifiées lors des lectures et écritures de données, pas uniquement par l’absence de bouton ; elles sont rejouées après un changement de rôle ou de membres.

## E6 — Conception du premier sprint

<a id="us-30"></a>
### US-30 — Examiner les maquettes et les parcours par profil

En tant que représentant du laboratoire, je veux examiner les principaux écrans afin de valider l’organisation et la navigation de SUIVI.

**Référence :** §7 ; RG-05, RG-28, RG-29. **Arbitrages :** Q-14, Q-17, Q-20.

- CA1 : les maquettes couvrent connexion, navigation générale, accueil, consultation des projets et inventaire, avec les différences entre profils.
- CA2 : la version proposée corrige l’accès aux projets montré dans la maquette gestionnaire existante ; aucun projet n’y est accessible.
- CA3 : les écrans de modification distinguent les autorisations administrateur, gestionnaire et membre ; un public non membre reste en consultation.
- CA4 : le représentant désigné peut examiner les parcours et consigner ses retours ; la personne, la date et les modalités de validation doivent être fixées en Q-04/Q-20.
