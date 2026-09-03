# SUIVI — Glossaire

Les définitions suivent le [compte rendu](compte-rendu-reunion-client.md). Les distinctions encore ouvertes sont indiquées explicitement.

| Terme | Définition dans SUIVI |
| --- | --- |
| SUIVI | Suivi des Usages, Inventaires, Vie des projets et IA. Aucune fonction IA n’est définie à ce stade. |
| Administrateur | Rôle unique du compte `admin`, non transférable ; gère tous les projets et l’inventaire. |
| Gestionnaire | Rôle attribué à au plus un utilisateur ; gère l’inventaire sans accès ni participation aux projets. |
| Utilisateur standard | Rôle attribué automatiquement à la première connexion, hors compte administrateur. |
| Créateur | Utilisateur à l’origine d’un projet ; peut le clôturer ou l’archiver. Ce n’est pas un rôle global. |
| Membre / participant | Utilisateur ajouté à un projet, avec effet immédiat et droits de collaboration. |
| Inventaire actif | Ensemble des matériels qui n’ont pas été supprimés/archivés. |
| Matériel | Fiche décrivant un équipement individualisé ou un ensemble non individualisé. |
| Matériel individualisé | Équipement suivi exemplaire par exemplaire, réservable, même sans identifiant technique renseigné. |
| Exemplaire | Un équipement distinct possédant sa propre fiche, par exemple un Raspberry Pi parmi trois. |
| Matériel non individualisé | Consommable ou petit équipement suivi en présence/disponibilité, sans comptage précis ni réservation. |
| Mode de suivi | Distinction individualisé/non individualisé ; choix initial et changement à préciser. |
| Type de matériel | Désignation commune de matériels similaires ; distinction exacte avec catégorie et exemplaire à valider. |
| Catégorie | Classement facultatif ; un matériel peut en avoir plusieurs. Ne représente pas une localisation physique. |
| Identifiant technique | Numéro de série, référence constructeur, numéro d’inventaire ou autre référence facultative. |
| Référence constructeur | Référence de produit, non présumée unique par exemplaire. |
| Disponibilité | Possibilité d’utiliser un matériel ; pour un exemplaire réservable, dépend de la période recherchée. Signalement de rupture du non-individualisé à préciser. |
| Affectation | Association d’un matériel à un projet ; pour le matériel réservable, la réservation porte la période. Aucun cycle indépendant d’affectation n’est spécifié. |
| Réservation | Utilisation prévue d’un exemplaire pour un projet, avec début et fin datés et horaires obligatoires. |
| Créneau | Intervalle de réservation dont les horaires utilisent uniquement les minutes 00 ou 30. |
| Chevauchement / conflit | Périodes incompatibles pour un même exemplaire ; deux projets ne peuvent pas le réserver simultanément. |
| Annulation | Arrêt d’une réservation, libérant sa période sans effacer sa trace. |
| Projet | Espace de collaboration avec nom, description, visibilité, membres, tâches et réservations. |
| NP / public | Visibilité permettant la consultation par tous les utilisateurs sauf le gestionnaire. N’accorde pas automatiquement de droit de modification. |
| Secret / privé | Visibilité limitée à l’administrateur, au créateur et aux membres. « Secret » est ici un libellé de visibilité applicative. |
| Réservé | Mention remplaçant le nom d’un projet inaccessible lorsqu’une réservation doit être signalée. |
| Kanban | Tableau de suivi des tâches par colonnes ; À faire, En cours et Fait sont envisagées. |
| Tâche | Élément de travail d’un projet comportant titre et description ; sans responsable, priorité ni échéance. |
| Clôture de projet | Action de fin de projet libérant immédiatement ses matériels ; différence avec archivage et réouverture à préciser. |
| Archivage de projet | Conservation des informations, participants, matériels associés et tâches réalisées ; modalités de consultation à préciser. |
| Suppression de matériel | Archivage irréversible de sa fiche, conservée avec son historique pour l’administrateur. Annule les réservations en cours/futures. |
| Suppression de projet | Action dont les modalités et certains droits restent à définir ; ne pas l’assimiler à la suppression du matériel. |
| Historique | Trace datée de l’inventaire et des réservations, avec auteur. Aucun journal des modifications des projets n’est prévu. |
| Notification | Message dans l’application ; état lu/non lu propre à chaque destinataire. |
| Export filtré | Fichier contenant les résultats correspondant aux filtres actifs et aux droits de l’utilisateur. |
| Tableau de bord | Page d’accueil après connexion, adaptée au profil ; données fictives au premier sprint. |
| Intradef | Environnement cible interne, sans accès depuis Internet selon le besoin ; simulé au premier sprint. |
| Connexion simulée | Connexion gérée par SUIVI représentant des utilisateurs supposés exister dans un système externe, sans intégration réelle. |
| CRUD | Créer, consulter, modifier et supprimer ; ces quatre actions ne sont pas automatiquement autorisées à chaque profil. |
| Maquette | Représentation d’un écran ou parcours ; ne constitue pas une fonction développée. |
| User story / US | Besoin exprimé du point de vue d’un acteur avec un objectif et des critères d’acceptation. |
| Epic | Groupe de stories portant un objectif fonctionnel commun. |
| Backlog produit | Liste ordonnée des besoins et travaux ; priorités et état sont tenus dans le backlog. |
| Sprint | Période de travail avec objectif et périmètre convenus ; durée du premier sprint non définie. |
| Critère d’acceptation | Condition observable permettant de vérifier une story. |
| Recette | Vérification des comportements attendus, avec résultats et anomalies consignés. |
| Dépendance | Élément à réaliser ou décision à obtenir avant un autre élément. |
| Definition of Ready / DoR | Conditions proposées pour engager une story. |
| Definition of Done / DoD | Conditions proposées pour déclarer une story terminée. |
