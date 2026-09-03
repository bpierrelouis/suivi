# SUIVI — Plan de recette fonctionnelle

**Statut :** scénarios proposés, **non exécutés**. Le dépôt contient le cadrage et des esquisses, pas d’application à tester. Les résultats ne devront être renseignés qu’après exécution sur une version identifiée.

Les critères détaillés figurent dans les [user stories](user-stories.md). Les scénarios ci-dessous regroupent les vérifications métier et les cas de refus. Les critères marqués « proposition » et les questions ouvertes doivent être décidés avant d’accepter les scénarios correspondants.

## Préparation

Consigner version testée, environnement, date, testeur et arbitrages applicables. Réinitialiser un jeu de données contrôlé entre les scénarios destructifs sur ce jeu, notamment suppressions et changements de rôle. Utiliser des données fictives sans secrets réels.

| Donnée proposée | Utilisation |
| --- | --- |
| Compte `admin` | Administrateur unique ; secret configuré selon Q-21. |
| Compte G | Gestionnaire unique, préparé selon le mécanisme convenu ; aucune participation opérationnelle à un projet. |
| Comptes A, B, C | Standards ; A créateur et membre de P-PUB/P-PRIV, B membre, C extérieur. La double qualité d’A est préparée explicitement sans présumer de Q-27. |
| Identifiant D reconnu par la simulation, absent de SUIVI | Première connexion, création automatique puis reconnexion. |
| P-PUB | Projet public accessible à C en lecture seule. |
| P-PRIV | Projet privé accessible à A/B/admin, inaccessible à C/G. |
| P-AUTRE | Projet distinct accessible à C, pour vérifier les conflits entre projets. |
| M-1 et M-2 | Deux exemplaires individualisés d’un même type ; M-2 sans identifiant technique. |
| M-NI | Fiche non individualisée, sans quantité précise. |
| CAT-A et CAT-B | Deux catégories associées à M-1. |
| Créneaux relatifs à une date de test T | Une réservation passée, une en cours et une future. Horaires 00/30 ; fuseau convenu en Q-22. |

Au premier sprint, ne préparer que les données nécessaires aux scénarios S1 et au tableau de bord fictif. Les réservations des lots suivants ne sont pas requises pour cette démonstration.

## Scénarios

### REC-01 — Première connexion et reconnexion

**Stories :** US-01. **Périmètre :** S1, après Q-21.

1. Se connecter avec D et un mot de passe reconnu par la simulation ; constater un unique compte standard et l’accès au tableau de bord.
2. Refaire une connexion avec D ; constater le même compte et le même rôle, sans doublon.
3. Selon les règles de simulation décidées, soumettre des identifiants refusés et des champs manquants ; constater le refus d’accès et l’absence de création indue.

### REC-02 — Administrateur prédéfini

**Stories :** US-02. **Périmètre :** S1, après Q-21.

Se connecter avec `admin` : rôle administrateur conservé et accès adapté. Vérifier qu’aucune opération exposée ne transfère le rôle ou ne crée un deuxième administrateur. Lors de la livraison de la gestion des rôles, rejouer ce dernier contrôle via les accès directs disponibles.

### REC-03 — Gestionnaire unique et évolution des droits

**Stories :** US-03, US-29. **Précondition :** Q-02 décidé ; interface/routine d’administration disponible.

Attribuer puis retirer le rôle à un standard existant ; vérifier unicité, retour au standard et conservation à la reconnexion. Tester deux attributions concurrentes : au plus un gestionnaire subsiste. Vérifier le devenir des adhésions selon Q-02 et l’absence immédiate d’accès aux projets/notifications non autorisées. Un non-administrateur ne peut ni attribuer ni retirer ce rôle.

### REC-04 — Tableau de bord par profil

**Stories :** US-04, tranche S1 de US-29. **Précondition :** contenu Q-14 convenu.

Avec les trois profils, ouvrir l’accueil après connexion : données fictives conformes à la maquette retenue, aucun projet pour G, aucun P-PRIV pour C, accès direct à l’inventaire pour admin. Tester aussi le cas où aucune donnée autorisée n’est disponible. Vérifier les données fournies à l’écran autant que les éléments visuellement affichés.

### REC-05 — Fiches matériel et catégories

**Stories :** US-05 à US-08, US-12. **Préconditions :** Q-08/Q-23 décidés pour les comportements concernés.

1. Avec admin puis G, créer une fiche en ne saisissant que le nom : réussite selon le défaut de mode convenu. Sans nom : refus.
2. Consulter M-1/M-2 comme fiches distinctes ; absence de numéro technique acceptée. Vérifier le non-individualisé sans quantité précise.
3. Modifier un champ ; retrouver la modification avec date et auteur dans l’historique autorisé.
4. Créer et renommer une catégorie ; affecter CAT-A et CAT-B à M-1, puis supprimer CAT-A. M-1 reste actif, CAT-B est conservée ; une fiche sans catégorie reste valide.
5. Avec un standard, consulter puis tenter les opérations de création/modification/suppression et de catégories : aucune écriture autorisée.

### REC-06 — Recherche et confidentialité des filtres

**Stories :** US-09, US-29. **Précondition :** Q-25 décidé ; critères de réservation testés en L4.

Combiner des critères convenus et vérifier résultats/tri, puis retirer les filtres et vérifier une recherche vide. Avec C/G, rechercher le nom ou une référence de P-PRIV : aucune suggestion, donnée ou possibilité de filtre ne divulgue ce projet. Le matériel réservé peut rester visible avec « Réservé » et les seules informations autorisées. Vérifier la disponibilité sur la période convenue.

### REC-07 — Visibilité et modification des projets

**Stories :** US-14 à US-16, US-29. **Préconditions :** Q-06/Q-27 et effet des dates Q-13 décidés pour les fonctions testées.

Créer un projet avec nom, description et visibilité sans dates ; vérifier les champs minimums. C consulte P-PUB mais ne le modifie pas et n’accède pas à P-PRIV. A/B modifient leurs projets selon leurs droits ; admin agit sans être membre. G ne peut lister, consulter, créer ou modifier aucun projet. Vérifier les changements de visibilité selon Q-06 et les changements de dates selon Q-13 sans laisser de conflit de réservation non traité.

### REC-08 — Membres et retrait

**Stories :** US-17, US-18, US-29. **Préconditions :** Q-07/Q-27 décidés.

Faire ajouter C à P-PRIV par B : accès immédiat sans invitation, puis droits de collaboration. Admin retire C : perte des droits de membre et de l’accès privé, puisqu’il n’est pas créateur. Vérifier le traitement des réservations existantes selon Q-07. Refuser l’ajout de G et l’ajout de membres par un extérieur. Vérifier séparément les règles retenues pour créateur et utilisateurs jamais connectés.

### REC-09 — Kanban

**Stories :** US-19. **Préconditions :** Q-01/Q-26 décidés.

Vérifier titre, description, colonnes et opérations convenues : création, modification, déplacement, éventuelle suppression si retenue. A/B/admin peuvent agir selon leurs droits ; C sur P-PUB reste en lecture ; G et les extérieurs à P-PRIV ne voient pas son tableau. Aucun responsable, échéance ou priorité n’est requis. Vérifier la personnalisation seulement si elle a été retenue.

### REC-10 — Création de réservation et horaires

**Stories :** US-22. **Précondition :** Q-22 décidé.

1. B réserve M-1 pour son projet avec début/fin complets ; admin fait de même sur un projet sans adhésion.
2. Préremplir les dates à partir du projet, puis les remplacer explicitement : les dates de réservation priment. Des horaires manquants doivent être complétés avant validation.
3. Tester les minutes 00 et 30 (acceptées), puis 15 et 45 (refusées) et chaque champ obligatoire manquant (refus).
4. Refuser une réservation de M-NI et une action par G ou un standard non membre.
5. Tester les périodes inversées, de durée nulle, dans le passé et aux limites de fuseau selon les décisions Q-22 ; aucune réponse à ces cas ne doit être inventée pendant la recette.

### REC-11 — Conflits et demandes simultanées

**Stories :** US-22, US-23 ; EX-06 proposé. **Précondition :** Q-22 décidé.

Pour M-1, créer une réservation de P-PRIV de 10 h à 11 h à une date future. Depuis P-AUTRE, essayer 10 h 30–11 h 30 : refus sans divulguer P-PRIV. Tester inclusion totale, période identique et début/fin à l’intérieur du créneau. Tester 11 h–12 h selon la convention de bornes décidée. M-2 reste réservable sur la même période.

Envoyer deux demandes concurrentes de projets différents pour un même créneau libre de M-1 : une seule réservation incompatible peut être acceptée. Tester également deux modifications simultanées vers le même créneau et le cas au sein d’un même projet selon Q-22.

### REC-12 — Modification, annulation et historique

**Stories :** US-23 à US-25.

A crée une réservation ; B la modifie puis l’annule. Vérifier les droits indépendants de l’auteur initial, le contrôle de conflit à la modification, la conservation de l’état initial en cas de refus selon le critère proposé, puis la libération du créneau à l’annulation. Admin peut agir sans adhésion ; C extérieur ne peut pas agir. L’historique conserve réservant, matériel, création, période prévue, projet et trace d’annulation selon Q-22.

### REC-13 — Suppression d’un matériel réservé

**Stories :** US-10, US-11, US-25, US-27. **Préconditions :** réservations/notifications réalisées ; Q-15/Q-22 décidés.

Préparer pour M-1 une réservation passée, une en cours et une future, avec plusieurs membres destinataires. Supprimer M-1 avec G, puis répéter sur un autre jeu avec admin. Attendre : disparition de l’inventaire actif ; annulation des réservations en cours/futures ; créneaux libérés ; notifications des membres concernés ; conservation de la fiche et de toutes les traces passées/annulées.

Admin retrouve l’archive, l’identification et date/auteur de suppression ; G et les standards ne peuvent plus la consulter, même via une référence connue. Aucun profil ne peut restaurer le matériel. Une réservation uniquement passée ne déclenche pas de notification de suppression au titre de ce cas.

### REC-14 — Accès aux historiques

**Stories :** US-11, US-12, US-25, US-29.

Pour un matériel actif, admin accède à son historique et aux projets ; G accède aux traces autorisées avec projets masqués. A/B, même membres et auteurs de réservation, ne peuvent accéder à aucun historique du matériel/réservations. Après archivage, seul admin accède aux traces. Vérifier les détails d’événements autant que la liste.

### REC-15 — Clôture et archives de projet

**Stories :** US-20, US-21. **Préconditions :** Q-03/Q-06/Q-12/Q-26 décidés.

Clôturer puis, dans un autre jeu, archiver un projet comme créateur et comme admin non membre. Les matériels sont immédiatement libérés, les affectations restent tracées. L’archive conserve les informations, participants, matériels associés et tâches réalisées. Vérifier droits de lecture/modification après l’action et tâches restantes selon arbitrage. Tester les autres membres, suppression et réouverture uniquement selon les décisions retenues ; si une opération est exclue, elle ne doit pas être disponible.

### REC-16 — Notifications personnelles

**Stories :** US-27, US-28. **Précondition :** Q-15 décidé.

Déclencher une suppression avec plusieurs destinataires A/B. Chaque destinataire voit sa notification et son état individuel. A la marque lue : celle de B reste non lue. Un tiers ne peut pas lire ou modifier les notifications de A/B par accès direct. Après retrait de membre ou attribution du rôle gestionnaire, vérifier le contenu autorisé selon Q-02/Q-15. Aucun courriel n’est requis.

### REC-17 — Exports et calendrier

**Stories :** US-13, US-26. **Préconditions :** Q-11/Q-16 décidés et fonctions retenues disponibles.

Exporter tout l’inventaire actif puis un sous-ensemble filtré avec admin et G ; comparer lignes, colonnes et format aux décisions. Aucun fichier de G ne contient de données de projet interdites ; le standard ne déclenche ni ne récupère un export non autorisé. Tester les formats retenus avec un résultat vide et des noms accentués.

Si le calendrier est retenu, vérifier périodes réservées/libres, actualisation après modification/annulation et masquage des projets. Son accès n’accorde ni droit de réservation supplémentaire ni accès à l’historique.

### REC-18 — Contrôles d’accès transverses

**Stories :** US-29 et stories du lot. **Périmètre :** uniquement les surfaces effectivement livrées.

Pour chaque case de la matrice des droits, vérifier un accès autorisé et les refus applicables dans l’interface ainsi que par le mécanisme d’accès aux données choisi (API si application web, service ou autre interface si application installée). Réutiliser les références d’objets connus avec un compte non autorisé. Inspecter les données retournées, filtres, messages d’erreur, exports et détails pour détecter les informations masquées seulement à l’écran. Rejouer les contrôles après changement de rôle, visibilité ou membres selon arbitrages.

### REC-19 — Revue des maquettes du premier sprint

**Stories :** US-30. **Périmètre :** S1.

Parcourir connexion, accueil, inventaire et projets pour chaque profil. Vérifier les différences de lecture/modification, l’absence de projets pour le gestionnaire et la clarté des libellés. Consigner les retours du validateur, les écrans acceptés et ceux à reprendre. L’existence des anciennes images ne suffit pas à valider ce scénario.

## Suivi d’exécution

Pour chaque scénario exécuté, renseigner une ligne contenant : ID REC et critères US vérifiés, version, environnement, date, testeur, jeu de données, résultat attendu/observé, preuve, anomalies et décision du validateur. Résultats possibles : **non exécuté**, **réussi**, **échoué**, **bloqué par un arbitrage**.

Tous les scénarios de ce document sont actuellement **non exécutés**. Un test bloqué par une question ouverte ne doit pas être noté réussi. La recette finale d’une story couvre tous ses critères, y compris ceux complétés dans un lot ultérieur. Les seuils de performance et les contrôles d’exploitation feront l’objet de scénarios distincts après Q-18/Q-24.
