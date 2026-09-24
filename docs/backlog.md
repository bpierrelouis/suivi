# SUIVI — Backlog produit

**Date :** 24 septembre 2026. **Statut :** Sprint 3 implémenté et migration PostgreSQL appliquée ; recette métier complète et acceptation formelle à consigner.

## Priorisation et états

- **P0** : fondations du premier sprint, maintenant terminé.
- **P1** : cœur fonctionnel ; les projets passent avant l’inventaire à la demande du client.
- **P2** : extension envisagée ou complément placé après le cœur ; ce classement n’annule aucun besoin.

Les priorités portent sur l’ordre proposé, pas sur une validation client. **À préparer** : critères rédigés, préparation/validation encore nécessaire. **À arbitrer** : décision affectant le comportement attendu. **Candidate** : périmètre encore envisagé. Aucun élément n’est « prêt » par défaut.

Les sprints S2 à S5 décrivent la suite fonctionnelle, sans durée ni date. Les dépendances indiquent ce qui doit être disponible pour la recette complète ; une dépendance dans le même sprint peut être développée ensemble. Les estimations, responsables et dates seront renseignés avec l’équipe après arbitrage ; aucune vélocité n’est supposée. Le détail est présenté dans les [prochains sprints](prochains-sprints.md).

## Stories

| ID | Intitulé | Epic | Priorité | Sprint proposé | Dépendances | État / questions |
| --- | --- | --- | --- | --- | --- | --- |
| [US-01](user-stories.md#us-01) | Connexion et compte automatique | E1 | P0 | S1 | Q-21 | Terminé selon le retour d’équipe ; recette détaillée à consigner |
| [US-02](user-stories.md#us-02) | Compte administrateur prédéfini | E1 | P0 | S1 | US-01, Q-21 | Terminé selon le retour d’équipe ; recette détaillée à consigner |
| [US-03](user-stories.md#us-03) | Attribution du gestionnaire | E1 | P1 | S2 | US-01, US-02 ; D-14 | Implémenté ; recette à exécuter |
| [US-04](user-stories.md#us-04) | Tableau de bord par profil | E1 | P0 | S1 | US-01, US-02, US-30 ; Q-14 | Terminé selon le retour d’équipe ; recette détaillée à consigner |
| [US-05](user-stories.md#us-05) | Consultation du matériel actif | E2 | P1 | S3 | US-01 | Implémenté ; réservations branchées en S4 |
| [US-06](user-stories.md#us-06) | Création de matériel | E2 | P1 | S3 | US-01, US-02 ; Q-08, Q-23 | Implémenté avec hypothèses provisoires |
| [US-07](user-stories.md#us-07) | Modification de matériel | E2 | P1 | S3 | US-06 ; Q-08, Q-09, Q-23 | Implémenté avec hypothèses provisoires |
| [US-08](user-stories.md#us-08) | Catégories et associations | E2 | P1 | S3 | US-06 ; Q-10 | Implémenté ; initialisation à valider |
| [US-09](user-stories.md#us-09) | Recherche, filtres et tri | E2 | P1 | S3 puis S4 | US-05, US-08 ; Q-08, Q-25 | Tranche S3 implémentée ; projet/disponibilité en S4 |
| [US-10](user-stories.md#us-10) | Suppression/archivage de matériel | E2 | P1 | S4 | US-06, US-12 ; US-24, US-27 | À préparer |
| [US-11](user-stories.md#us-11) | Archives du matériel | E2 | P1 | S4 | US-10, US-12, US-25 | À préparer |
| [US-12](user-stories.md#us-12) | Historique du matériel actif | E2 | P1 | S3 | US-06, US-07 | Implémenté ; recette à exécuter |
| [US-13](user-stories.md#us-13) | Exports de l’inventaire | E2 | P2 | S5 | US-09, US-29 ; Q-11 | À arbitrer ; formats envisagés |
| [US-33](user-stories.md#us-33) | Pièces jointes d’un matériel | E2 | P1 | S3 | US-05, US-06 ; Q-29 | Implémenté avec contraintes provisoires à valider |
| [US-14](user-stories.md#us-14) | Création de projet | E3 | P1 | S2 | US-01 ; D-15 | Implémenté ; recette à exécuter |
| [US-15](user-stories.md#us-15) | Consultation des projets | E3 | P1 | S2 | US-14 | Implémenté ; recette à exécuter |
| [US-16](user-stories.md#us-16) | Modification de projet | E3 | P1 | S2 puis S4 | US-14, US-17 ; D-15, D-19 | Tranche S2 implémentée ; archivage S4 restant |
| [US-17](user-stories.md#us-17) | Ajout de membres | E3 | P1 | S2 | US-14 ; D-17 | Implémenté ; recette à exécuter |
| [US-18](user-stories.md#us-18) | Retrait de membres | E3 | P1 | S2 | US-17 ; D-17 | Implémenté pour membre non responsable ; recette à exécuter |
| [US-19](user-stories.md#us-19) | Tâches Kanban avec responsable de tâche facultatif | E3 | P1 | S2 | US-14, US-17 ; D-16 | Implémenté ; recette à exécuter |
| [US-20](user-stories.md#us-20) | Clôture/archivage de projet | E3 | P1 | S4 | US-14, US-19, US-24, US-25 ; Q-06, Q-12, Q-26 | Équivalence, clôture automatique sur dernière tâche terminée et absence de réouverture décidées ; autres actions à arbitrer |
| [US-21](user-stories.md#us-21) | Consultation des archives projets | E3 | P1 | S4 | US-20 ; Q-12 | Droits de lecture et absence de réouverture décidés ; autres actions à arbitrer |
| [US-31](user-stories.md#us-31) | Historique des modifications d’un projet | E3 | P1 | S4 | US-14 à US-21 | À préparer |
| [US-32](user-stories.md#us-32) | Documentation Markdown et export DOCX | E3 | P1 | S2 | US-14, US-15 ; D-18 | Implémenté et rendu DOCX vérifié ; recette applicative à exécuter |
| [US-22](user-stories.md#us-22) | Création de réservation | E4 | P1 | S4 | US-05, US-14, US-17 ; Q-22 | À arbitrer |
| [US-23](user-stories.md#us-23) | Modification de réservation | E4 | P1 | S4 | US-22 ; Q-22 | À arbitrer |
| [US-24](user-stories.md#us-24) | Annulation de réservation | E4 | P1 | S4 | US-22 ; Q-22 | À arbitrer |
| [US-25](user-stories.md#us-25) | Historique des réservations | E4 | P1 | S4 | US-22, US-23, US-24 | À préparer |
| [US-26](user-stories.md#us-26) | Calendrier de disponibilité | E4 | P2 | S5 | US-22, US-23, US-24 ; Q-16, Q-22 | Retenu ; modalités à arbitrer |
| [US-27](user-stories.md#us-27) | Notification de suppression | E5 | P1 | S4 | US-17, US-22, US-24 ; Q-02, Q-15 | À arbitrer ; intégré à US-10 |
| [US-28](user-stories.md#us-28) | Lecture des notifications | E5 | P1 | S4 | US-27 ; Q-15 | À arbitrer |
| [US-29](user-stories.md#us-29) | Confidentialité et droits | E5 | P0 | S1 puis tous les sprints | Chaque surface de données livrée | Validation progressive |
| [US-30](user-stories.md#us-30) | Maquettes et parcours | E6 | P0 | S1 | Q-04, Q-14, Q-17, Q-20 | Terminé selon le retour d’équipe ; recette détaillée à consigner |

Une story répartie entre sprints reste ouverte tant que tous ses critères ne sont pas vérifiés. Par exemple, la recherche d’inventaire commence en S3, mais la disponibilité liée aux réservations se vérifie en S4. Si l’outil de suivi exige des éléments livrables indépendants, créer des sous-stories liées en conservant ces critères.

## Travaux de cadrage et d’ingénierie proposés

Ces éléments ne sont pas des besoins utilisateurs supplémentaires et n’imposent aucune pile technique.

| ID | Travail / résultat attendu | Lot | Dépendance ou question | État |
| --- | --- | --- | --- | --- |
| CAD-01 | Faire valider la référence client, les priorités et le périmètre S1. | Avant S1 | Q-04, Q-20 | Réunion réalisée ; trace formelle à compléter |
| CAD-02 | Définir la simulation d’authentification et la configuration de `admin`. | Avant US-01 | Q-21 | Réalisé selon le retour d’équipe ; décision détaillée à consigner |
| CAD-03 | Statuer sur rôles/membres, visibilité, cycles de vie, documentation, pièces jointes et créneaux. | Avant fonctions concernées | Q-01, Q-02, Q-06 à Q-09, Q-12, Q-13, Q-16, Q-22, Q-23, Q-26 à Q-29 | À faire |
| TEC-01 | Choisir le mode d’exécution et documenter démarrage/configuration du prototype. | S1 | Q-17, Q-24 | Réalisé pour S1 ; décision détaillée à consigner |
| TEC-02 | Préparer données fictives et comptes de démonstration cohérents. | S1 | Q-21 ; scénario gestionnaire sans interface d’attribution obligatoire | Réalisé selon le retour d’équipe |
| TEC-03 | Définir contrôles d’accès, gestion des secrets et des sessions. | S1 puis chaque sprint | EX-04, EX-05 ; Q-24 | À compléter au fil des surfaces livrées |
| TEC-04 | Garantir cohérence entre réservation, annulation, archivage et notifications, y compris en concurrence. | S4 | EX-06 ; Q-22, Q-24 | À définir |
| TEC-05 | Définir reprise de données, volumes et exploitation sur Intradef. | Avant déploiement cible | Q-17, Q-18, Q-24 | À définir |
| REC-LOT | Exécuter et consigner la recette du sprint, corriger les anomalies bloquantes. | Chaque sprint | Plan de recette et critères des US du sprint | S1 à consigner ; suivants non exécutés |

## Conditions de préparation et d’achèvement proposées

**DoR :** acteur et périmètre explicites ; critères vérifiables ; arbitrages bloquants résolus ; dépendances disponibles ou planifiées ensemble ; droits et maquettes utiles relus ; estimation et capacité discutées avec l’équipe.

**DoD :** comportement réalisé sur le périmètre annoncé ; critères d’acceptation vérifiés et résultats consignés ; cas de refus et confidentialité vérifiés ; anomalies bloquantes corrigées ; documentation actualisée ; démonstration faite et acceptation obtenue selon Q-20. Pour les maquettes, la preuve porte sur les écrans et parcours, sans prétendre à une implémentation.

## Couverture de la source

| Section du compte rendu | Couverture principale |
| --- | --- |
| §1 Contexte | Cadrage, TEC-01, TEC-05 |
| §2 Connexion et droits | US-01 à US-03, US-15, US-29 |
| §3 Inventaire et retour après S1 | US-05 à US-13, US-25, US-27, US-33 |
| §4 Projets et retour après S1 | US-14 à US-21, US-29, US-31, US-32 |
| §5 Réservations | US-22 à US-26 |
| §6 Accueil et notifications | US-04, US-27, US-28 |
| §7 Premier sprint | US-01, US-02, US-04, US-30 ; tranche S1 de US-29 |
| §8 Points à préciser | Registre Q-01 à Q-21, complété par Q-22 à Q-29 |
| §9 Retour client après S1 | D-08 à D-13, US-19, US-20, US-32, US-33 et prochains sprints |

Les décisions sur la suppression de projet, l’administration supplémentaire, l’import ou la personnalisation pourront produire de nouvelles stories si elles sont retenues. Leur présence dans le registre ne les engage pas au développement.
