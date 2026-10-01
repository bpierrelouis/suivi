# SUIVI — Registre des questions et décisions

**État au 23 septembre 2026 :** les réponses du compte rendu servent de référence ; les questions ci-dessous restent ouvertes sauf lorsqu’une décision est enregistrée comme appliquée. La terminologie des rôles a été confirmée par l’utilisateur : **administrateur (admin)**, **gestionnaire** et **utilisateur**, avec les situations **responsable**, **membre** et **simple** selon le projet. Le responsable est obligatoirement membre de son projet.

## Décisions appliquées

| ID | Décision | Incidence | État |
| --- | --- | --- | --- |
| D-01 | Les modifications d’un projet sont conservées dans un historique daté et attribué à leur auteur. | US-31, RG-30, données et recette. | Appliquée |
| D-02 | Une tâche peut avoir un responsable de tâche facultatif choisi parmi les membres du projet. | US-19, RG-19, données, parcours et recette. | Appliquée |
| D-03 | Clôture et archivage d’un projet sont équivalents : même action, même état et mêmes effets. | US-20, RG-20, glossaire, parcours et recette. | Appliquée |
| D-04 | Un projet archivé reste consultable selon sa visibilité, comme un projet actif. Le gestionnaire reste exclu de tous les projets. | US-21, US-31, RG-21, matrice des droits et recette. | Appliquée |
| D-05 | Un projet clôturé/archivé ne peut pas être rouvert. | US-20, US-21, RG-20, données, parcours et recette. | Appliquée |
| D-06 | Le calendrier des disponibilités et des réservations est retenu. Ses profils, vues, périodes et actions restent à préciser. | US-26, RG-31, backlog, parcours et recette. | Appliquée |
| D-07 | La notion de « créateur du projet » est remplacée par « responsable du projet ». Le responsable est obligatoirement membre du projet. | Cadrage, DCU, DCLAM, US-14 à US-22, règles, données, parcours et recette. | Appliquée |
| D-08 | Après le premier sprint, le périmètre Projets passe avant le périmètre Inventaire. | Backlog et contenu des sprints 2 et 3. | Appliquée |
| D-09 | Chaque projet reçoit un éditeur de documentation Markdown de type `README.md`, avec export DOCX. | US-32, RG-33, données et recette. | Appliquée ; modalités fixées en D-18 |
| D-10 | Le Kanban est intégré dans l’onglet Description du projet, sans onglet Kanban distinct ni retour obligatoire à une autre vue. | US-19, RG-19, parcours et recette. | Appliquée |
| D-11 | Une fiche matériel peut recevoir des documents, notamment une facture ou un bon de commande. | US-33, RG-32, données et recette. | Appliquée ; modalités Q-29 |
| D-12 | Le premier sprint est terminé avec la connexion, les maquettes et les tableaux de bord, puis présenté au client. | Sprint 1 et backlog. | Déclarée par l’équipe ; recette détaillée à consigner |
| D-13 | Lorsque la dernière tâche non terminée d’un projet passe à l’état terminé, le projet est automatiquement clôturé, donc archivé. Un projet sans tâche n’est pas clôturé automatiquement. | US-19, US-20, RG-19, RG-20, données, parcours et recette. | Appliquée |
| D-14 | La nomination d’un gestionnaire remplace atomiquement le gestionnaire précédent, qui redevient utilisateur. Le candidat ne doit être responsable d’aucun projet actif ; ses autres participations sont retirées. Le retrait du rôle rend le compte utilisateur sans restaurer automatiquement ses anciennes participations. | US-03, US-17, US-29 ; Q-02. | Appliquée au Sprint 2 |
| D-15 | L’administrateur et l’utilisateur choisissent la visibilité publique ou privée à la création. L’administrateur et les membres peuvent ensuite modifier les informations et la visibilité d’un projet actif. | US-14, US-16 ; Q-06. | Appliquée au Sprint 2 |
| D-16 | Le Kanban utilise trois colonnes fixes : À faire, En cours et Fait. Le titre et la description sont obligatoires ; les membres et l’administrateur peuvent créer, modifier, déplacer et supprimer une tâche. Seul le passage de la dernière tâche non terminée à Fait déclenche la clôture automatique. | US-19, US-20 ; Q-01, Q-26. | Appliquée au Sprint 2 |
| D-17 | Un membre ou l’administrateur ajoute uniquement un compte existant. Seul l’administrateur retire un membre non responsable ; les tâches qui lui étaient affectées deviennent sans responsable. Le responsable ne peut pas être retiré tant qu’aucun parcours de transfert n’est réalisé. | US-17, US-18 ; Q-07, Q-27. | Appliquée au Sprint 2 |
| D-18 | La documentation accepte titres, paragraphes, listes, gras, italique, code en ligne et liens HTTP ou HTTPS. Les images et l’historique de versions sont exclus. L’export DOCX reprend le nom du projet, les titres, paragraphes et listes enregistrés. | US-32, RG-33 ; Q-28. | Appliquée au Sprint 2 |
| D-19 | Modifier les dates du projet ne modifie aucune réservation automatiquement. Les contrôles de conflit seront appliqués lors du développement des réservations. | US-16, US-23 ; Q-13. | Appliquée au Sprint 2 |
| D-20 | Le matériel non individualisé reçoit une quantité et un seuil d'alerte. Sous le seuil, l'article est visible comme « à commander » pour l'administrateur et le gestionnaire uniquement ; à zéro, il est en rupture pour tous les profils. Un utilisateur peut signaler une rupture, que l'administrateur ou le gestionnaire marque ensuite comme traitée. Écart assumé avec le dictionnaire de données, qui ne prévoit aucune quantité précise ni signalement pour le non-individualisé — demandé explicitement par le client pour alimenter le tableau de bord. | US-04, US-07, US-09 ; Q-09, Q-14 ; dictionnaire de données (§ Matériel). | Appliquée hors sprint numéroté, le 25 septembre 2026 |
| D-21 | L'administrateur peut créer un compte manuellement (identifiant, mot de passe, rôle), modifier un identifiant/mot de passe, changer le rôle d'un compte existant vers n'importe lequel des trois rôles, et « supprimer » un compte. La suppression est en réalité une désactivation : un compte désactivé perd immédiatement l'accès (session révoquée) et n'apparaît plus dans les listes de sélection, mais son historique (matériel, réservations, tâches, notifications…) est conservé et peut être réactivé. La suppression physique n'est pas proposée car les clés étrangères de l'historique interdisent la suppression d'un compte ayant une activité. Un administrateur ne peut ni se désactiver lui-même, ni désactiver le dernier administrateur actif ; les règles de nomination unique du gestionnaire (D-14) restent appliquées lors d'un changement de rôle. Tout profil peut par ailleurs changer son propre mot de passe depuis une page Paramètres, en confirmant le mot de passe actuel. Écart assumé avec le compte rendu client et RG-01, qui excluent toute inscription ou création manuelle de compte — demandé explicitement par le client. | US-01 (RG-01), Q-05 ; dictionnaire de données (§ Utilisateur). | Appliquée hors sprint numéroté, le 25 septembre 2026 |
| D-22 | Le Kanban reçoit une quatrième colonne fixe « En revue », insérée entre « En cours » et « Fait ». Le comportement de clôture automatique reste inchangé : seul le passage de la dernière tâche non terminée à Fait archive le projet ; passer par En revue n'a aucun effet particulier. Écart assumé avec D-16/RG-19/US-19 CA3, qui fixaient trois colonnes — demandé explicitement par le client après usage du Kanban. | US-19, RG-19 ; D-16, Q-01. | Appliquée hors sprint numéroté, le 25 septembre 2026 |
| D-23 | Un projet actif affiche un tag d'état dérivé, distinct du statut de persistance (actif/archivé) : « En attente » tant que sa date de début n'est pas renseignée ou n'est pas encore atteinte, « Actif » une fois cette date atteinte, « Clôturé » pour un projet archivé (équivalence clôture/archivage inchangée, D-03). Aucune nouvelle valeur de statut n'est stockée : le tag est recalculé à chaque lecture à partir de `dateDebut`/`statut`. Écart assumé : ni le compte rendu client ni le dictionnaire de données ne décrivaient un état « en attente » — demandé explicitement par le client. | US-04, US-14, US-16 ; dictionnaire de données (§ Projet). | Appliquée hors sprint numéroté, le 25 septembre 2026 |

Q-01 à Q-21 reprennent les points à préciser de la source, avec quelques sous-questions nécessaires à leur application. Q-22 à Q-27 sont des précisions issues de la rédaction des stories, distinctes des demandes explicites du client.

## Questions provenant du compte rendu

| ID | Question / décision attendue | Incidence | Moment proposé |
| --- | --- | --- | --- |
| Q-01 | Décidé en D-16 : colonnes fixes À faire, En cours et Fait. Complété par D-22 : une quatrième colonne fixe « En revue » a été ajoutée entre En cours et Fait. | US-19, données du tableau ; D-22. | Close et appliquée |
| Q-02 | Décidé en D-14 pour les projets et participations. Le traitement des réservations et notifications sera complété avec leurs domaines respectifs. | US-03, US-17, US-27, US-29. | Partiellement close ; Sprint 2 appliqué |
| Q-03 | Décidé en D-05 : un projet clôturé/archivé ne peut pas être rouvert. | US-20, US-21 et matrice des droits. | Close et appliquée |
| Q-04 | Renseigner date de réunion, participants, rédacteur, personne validant le compte rendu et date de validation. | Statut de la source et acceptation du cadrage. | Avant engagement du périmètre. |
| Q-05 | Décidé en D-21 : l'administrateur gère les comptes (création, modification, rôle, désactivation) en plus des fonctions déjà décrites. Les autres profils n'ont aucun droit sur les comptes. | Périmètre éventuel supplémentaire ; écart assumé avec RG-01 (D-21). | Close et appliquée |
| Q-06 | Décidé en D-15 pour création, choix et changement de visibilité. La suppression et les droits de clôture manuelle restent à traiter au Sprint 4. | US-14, US-16, US-20 ; matrice des droits. | Partiellement close ; Sprint 2 appliqué |
| Q-07 | Décidé en D-17 pour sélection, ajout et retrait. L’effet sur les réservations sera complété au Sprint 4. | US-17, US-18 ; cohérence avec absence de création manuelle. | Partiellement close ; Sprint 2 appliqué |
| Q-08 | Quelles règles d’unicité pour les identifiants techniques ? Comment distinguer type, catégorie et exemplaire ? | US-06, US-07, US-09 ; dictionnaire. | Avant modèle d’inventaire. |
| Q-09 | Décidé en D-20 : quantité et seuil d'alerte sur le non-individualisé, signalement par l'utilisateur puis traitement par l'administrateur ou le gestionnaire. Aucune association informative à un projet n'est prévue. | US-07 et éventuelle story supplémentaire ; aucune réservation ni quantité précise (écart assumé, D-20). | Close et appliquée |
| Q-10 | Quelles catégories initiales prévoir ? | US-08 et données de démarrage. | Avant initialisation de l’inventaire. |
| Q-11 | Confirmer Excel/PDF, colonnes et informations exportées. L’export complet inclut-il des archives pour l’administrateur ? | US-13 ; confidentialité des fichiers. | Avant exports. |
| Q-12 | Quelles modifications restent possibles après archivage et comment fonctionne la suppression d’un projet ? La consultation selon la visibilité et l’équivalence clôture/archivage sont décidées en D-03/D-04. | US-20, US-21 ; pas de suppression physique présumée. | Avant cycle de vie des projets. |
| Q-13 | Décidé en D-19 : aucun déplacement automatique des réservations. | US-16, US-23. | Close et appliquée |
| Q-14 | Le tableau de bord affiche désormais projets actifs, matériels actifs, références en rupture, demandes de réapprovisionnement en attente et utilisateurs actifs (D-20 pour les deux indicateurs liés à la rupture). Reste ouvert : si « Mes projets » doit inclure uniquement participations/responsabilités ou aussi les projets publics consultables. | US-04, US-30 ; D-20. | Partiellement close ; le 25 septembre 2026 |
| Q-15 | Contenu, présentation, regroupement et durée de conservation des notifications ? Marquage lu explicite ou à l’ouverture ? Retour à non lu ? Quel contenu reste visible après perte d’accès au projet ? | US-27, US-28. | Avant notifications. |
| Q-16 | Le calendrier est retenu en D-06. Pour quels profils, matériels, vues, périodes et actions doit-il être disponible ? | US-26. | Modalités à fixer avant réalisation. |
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
| Q-25 | Confirmer les critères de recherche envisagés, les tris, la combinaison des catégories et la période de référence de « disponible ». | US-09, maquettes et recherche de créneaux. | Avant filtres ; disponibilité avant S4. |
| Q-26 | Décidé en D-16 pour le cycle des tâches. Le comportement d’une clôture manuelle reste au Sprint 4. | US-19, US-20, dictionnaire. | Partiellement close ; Sprint 2 appliqué |
| Q-27 | Décidé en D-17 : le responsable ne peut pas être retiré. Un parcours de transfert pourra être ajouté avec la clôture manuelle au Sprint 4. | US-18, US-20 ; droits contextuels. | Partiellement close ; Sprint 2 appliqué |
| Q-28 | Décidé en D-18 : syntaxe limitée, sans images ni versions, export DOCX structuré. | US-32, RG-33, données et recette. | Close et appliquée |
| Q-29 | L’utilisateur peut-il consulter et télécharger les pièces jointes ? Quels types et tailles autoriser ? Quels contrôles de sécurité appliquer ? Les pièces sont-elles conservées avec le matériel archivé et faut-il tracer leur retrait ? | US-33, RG-32, données et recette. | Avant réalisation des pièces jointes. |

## Désaccord entre sources visuelles et textuelles

La [maquette gestionnaire](prototype_maquettes/gestionnaire_inventory.png) présente un accès « CRUD Projet ». Le compte rendu consolidé §2.2 exclut tout accès du gestionnaire aux projets. La documentation dérivée suit ce dernier. L’image reste conservée comme source à corriger dans US-30 ; aucun nouvel accord client n’est déduit de cette correction documentaire.

Les éléments de connexion visibles dans les esquisses, tels qu’une option de mémorisation ou un lien de récupération, ne suffisent pas à spécifier une fonction. Leur éventuelle réalisation nécessite une décision en Q-19/Q-24.

## Enregistrement des décisions futures

Pour chaque décision, compléter : identifiant Q, réponse exacte, décideur, date, source de l’accord, documents/stories impactés, état (ouverte/décidée/appliquée). La clôture d’une question implique de reporter la décision dans les documents concernés. Pour le moment, décideurs et dates de décision sont **non renseignés** pour toutes les questions.
