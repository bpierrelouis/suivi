# Sprint 2 — Réalisation technique

**État :** périmètre applicatif implémenté le 23 septembre 2026 ; recette PostgreSQL et acceptation formelle à consigner.  
**Stories :** US-03, US-14 à US-19, US-32 et tranche Sprint 2 de US-29. La clôture automatique de US-20 est également branchée conformément à D-13.

## Fonctionnalités disponibles

### Rôle gestionnaire

- écran d’administration réservé à l’administrateur ;
- nomination ou retrait du gestionnaire parmi les comptes existants ;
- remplacement atomique du gestionnaire précédent et unicité protégée en base ;
- refus de la nomination d’un responsable de projet actif ;
- retrait des autres participations lors de la nomination ;
- actualisation du rôle depuis la base à chaque requête authentifiée, sans attendre l’expiration du jeton.

### Projets et membres

- création publique ou privée avec nom, description et dates facultatives ;
- responsable automatiquement membre du projet créé ;
- liste et fiche détaillée filtrées selon le rôle, la visibilité et l’appartenance ;
- modification d’un projet actif par ses membres ou l’administrateur ;
- ajout immédiat d’un compte existant par un membre ou l’administrateur ;
- retrait d’un membre non responsable réservé à l’administrateur ;
- refus complet de toute donnée projet au gestionnaire ;
- réponse « projet introuvable » pour une fiche privée inaccessible afin de ne pas confirmer son existence.

### Kanban et clôture automatique

- colonnes fixes À faire, En cours et Fait ;
- création, modification, déplacement, affectation et suppression des tâches ;
- responsable de tâche facultatif limité aux membres du projet ;
- retrait d’un membre entraînant la désaffectation de ses tâches ;
- archivage transactionnel du projet quand sa dernière tâche non terminée passe à Fait ;
- verrouillage de toute modification après archivage, sans réouverture possible.

### Documentation du projet

- source Markdown enregistrée avec auteur et date de modification ;
- aperçu sûr dans le navigateur, sans interprétation de HTML arbitraire ;
- titres, paragraphes, listes, gras, italique, code en ligne et liens HTTP/HTTPS ;
- export DOCX accessible à toute personne autorisée à consulter le projet ;
- nom de fichier neutralisé et document structuré avec styles Word noirs ;
- images intégrées et historique de versions exclus de ce sprint.

## Organisation du code

Le backend sépare les contrôleurs HTTP, services applicatifs, politiques d’autorisation et repositories Prisma. Les services reçoivent leurs dépendances par injection, ce qui permet de tester les règles sans démarrer PostgreSQL. Les opérations composées sensibles — changement de gestionnaire, retrait de membre et clôture automatique — utilisent des transactions.

Le frontend sépare le client HTTP, le rendu Markdown, les vues et l’état de session. Les routes appliquent un premier filtrage ergonomique, tandis que l’API reste l’autorité de sécurité.

## Conformité des interfaces

Les vues reprennent la structure des maquettes de référence : panneau latéral bleu, barre supérieure, tableaux et cartes, ainsi que création et consultation des projets en modales au-dessus de la liste. Les écarts entre les anciennes images et les décisions fonctionnelles sont résolus en faveur de la documentation : le gestionnaire ne voit aucun projet et le Kanban est intégré à l’onglet `Description`, sans onglet Kanban séparé. Les fonctions d’inventaire prévues au Sprint 3 restent présentées comme un aperçu non interactif afin de ne pas simuler des opérations qui ne sont pas encore livrées.

## Modèle de données

- `Projet` : informations, visibilité, statut, responsable et dates facultatives ;
- `Participation` : association unique entre projet et utilisateur ;
- `Tache` : contenu, colonne, ordre et responsable facultatif ;
- `DocumentationProjet` : source Markdown unique par projet, auteur et date de modification ;
- enums de visibilité, statut de projet et état de tâche.

Deux migrations versionnées créent le domaine projet puis les tâches et documentations. Les clés étrangères, index et contraintes d’unicité complètent les contrôles applicatifs.

## Contrôles réalisés

- modèle Prisma formaté, validé et client généré ;
- 17 tests backend : droits, transformations, affectations, clôture, gestionnaire et export DOCX ;
- 6 tests frontend : rôle, liste des projets, reverse proxy et sécurité du rendu Markdown ;
- construction de production du frontend réussie ;
- document DOCX de démonstration généré, rendu en image et contrôlé visuellement ;
- absence d’erreur de format détectée par Git.

La stack Docker locale a été construite avec PostgreSQL 17, les migrations ont été appliquées et les services frontend/backend ont passé leurs contrôles de santé. Une recette applicative a validé la création d’un projet, l’ajout d’un membre, le Kanban, l’archivage automatique, la documentation et l’export DOCX. L’acceptation formelle des scénarios REC-03, REC-07, REC-08, REC-09 et REC-20 reste à consigner avec le validateur.
