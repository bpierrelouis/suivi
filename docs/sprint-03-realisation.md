# Sprint 3 — Réalisation technique

**État :** périmètre applicatif implémenté le 24 septembre 2026 ; acceptation formelle à consigner.  
**Stories :** US-05 à US-09 (tranche sans réservations), US-12, US-33 et tranche Sprint 3 de US-29.

## Fonctionnalités disponibles

### Inventaire actif

- consultation des matériels actifs par les trois profils ;
- création et modification réservées à l’administrateur et au gestionnaire ;
- nom obligatoire, mode individualisé par défaut et identifiants techniques facultatifs ;
- recherche insensible à la casse sur le nom, le numéro de série, la référence constructeur et le numéro d’inventaire ;
- filtres par catégorie et mode de suivi, avec tris alphabétique et chronologique ;
- fiche détaillée sans quantité précise pour le matériel non individualisé.

### Catégories et historique

- création, renommage et suppression des catégories par l’administrateur et le gestionnaire ;
- association de zéro à plusieurs catégories à chaque matériel ;
- suppression d’une catégorie sans suppression du matériel ;
- journal des créations, modifications, ajouts et retraits de pièces jointes ;
- historique visible uniquement par l’administrateur et le gestionnaire.

### Pièces jointes

- ajout, téléchargement et retrait depuis une fiche active par l’administrateur et le gestionnaire ;
- conservation du nom, du type, de la taille, de l’auteur et de la date d’ajout ;
- stockage transactionnel en base de données ;
- validation du type déclaré et de la signature du contenu ;
- PDF, JPEG et PNG autorisés, avec une taille maximale de 10 Mo ;
- nom de fichier neutralisé avant stockage et téléchargement.

## Hypothèses provisoires à valider

Les questions Q-08, Q-09, Q-10, Q-23, Q-25 et Q-29 n’ayant pas reçu d’arbitrage client, le prototype applique des choix réversibles : identifiants techniques non uniques, mode individualisé par défaut, filtre de catégorie inclusif, absence de disponibilité avant les réservations du Sprint 4, liste initiale de catégories limitée aux données de démonstration, et pièces jointes non accessibles au rôle utilisateur. L’archivage des matériels et le devenir de leurs documents restent au Sprint 4.

## Organisation technique

Le domaine inventaire suit la séparation déjà utilisée pour les projets : routes et contrôleurs HTTP, service métier testable, repository Prisma et contrôles d’accès côté serveur. Les créations et modifications écrivent leur événement d’historique dans la même transaction que la fiche. Les mouvements de pièces jointes sont également transactionnels.

Une migration versionnée ajoute les matériels, catégories, associations, événements et pièces jointes. Les données de démonstration couvrent les deux modes de suivi et les associations multicatégories.

## Contrôles réalisés

- schéma Prisma formaté et validé, client généré ;
- 23 tests backend réussis, dont 6 dédiés aux droits et fichiers du Sprint 3 ;
- 8 tests frontend réussis, dont 2 dédiés à l’inventaire ;
- construction de production du frontend réussie ;
- syntaxe des nouveaux contrôleurs, services et repositories vérifiée.
- images Docker reconstruites, migration appliquée sur PostgreSQL 17 et données de démonstration initialisées ;
- contrôles de santé frontend/backend réussis et lecture authentifiée de 3 matériels et 4 catégories via le reverse proxy.

## Passe fonctionnelle et UI/UX du 24 septembre 2026

Une recette dans le navigateur a couvert la connexion administrateur et utilisateur, la recherche, la remise à zéro des filtres, la création et la modification d’une fiche, l’affichage de son historique et la lecture seule sans actions sensibles. L’ajout, la consultation, le téléchargement et le retrait d’une image PNG ainsi que le cycle création/renommage/suppression d’une catégorie ont été vérifiés sur l’API déployée. Le gestionnaire a pu consulter les trois matériels tout en recevant un refus HTTP 403 sur les projets. Les rôles initiaux et les données temporaires de recette ont ensuite été restaurés.

Cette passe a conduit aux améliorations suivantes : tableau de bord alimenté par PostgreSQL plutôt que par des valeurs fictives, progression calculée depuis les tâches, activité récente issue de l’inventaire, libellés de filtres accessibles, en-tête débarrassé d’une fausse recherche désactivée, états d’attente sur les écritures, confirmation avant retrait d’un document, fermeture des modales avec Échap et texte d’aide de l’inventaire centré sur l’usage.

La recette des écritures et pièces jointes ainsi que l’acceptation formelle restent à consigner avec le validateur.
