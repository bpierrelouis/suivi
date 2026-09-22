# SUIVI — Contenu des prochains sprints

**Mise à jour :** 15 septembre 2026. **Statut :** formalisation du retour client après le premier sprint. Les durées, dates, responsables et capacités restent à planifier avec l’équipe.

## Décisions de planification

Le premier sprint est terminé avec la connexion, les maquettes et les tableaux de bord. La réunion de fin de sprint a conduit le client à demander les ajustements suivants :

- le périmètre **Projets** passe avant le périmètre **Inventaire** ;
- chaque projet dispose d’une documentation rédigée en Markdown, de type `README.md`, avec export au format DOCX ;
- le Kanban est intégré dans l’onglet Description du projet ;
- une fiche matériel peut recevoir des pièces jointes, notamment une facture ou un bon de commande.

Cette réorganisation reprend les domaines du support client du 14 septembre 2026, mais inverse les lots Projets et Inventaire présentés sur sa diapositive 8. Aucun identifiant existant de user story, règle, scénario ou question n’est renuméroté.

## Sprint 2 — Projets et collaboration

**Objectif :** permettre aux utilisateurs autorisés de créer un projet, de le consulter et de collaborer depuis sa fiche descriptive.

| Contenu | Stories | Résultat attendu |
| --- | --- | --- |
| Rôle gestionnaire | [US-03](user-stories.md#us-03) | Attribution ou retrait du rôle par l’administrateur, avec exclusion immédiate de tous les projets. |
| Création et consultation | [US-14](user-stories.md#us-14), [US-15](user-stories.md#us-15) | Création avec nom, description et visibilité ; consultation conforme aux droits public/privé. |
| Modification et membres | [US-16](user-stories.md#us-16), [US-17](user-stories.md#us-17), [US-18](user-stories.md#us-18) | Informations du projet et composition modifiables par les profils autorisés. |
| Kanban dans la description | [US-19](user-stories.md#us-19) | Kanban intégré à l’onglet Description du projet ; gestion des tâches, colonnes et responsable facultatif. La dernière tâche terminée déclenche la clôture automatique définie pour le cycle de vie du projet. |
| Documentation du projet | [US-32](user-stories.md#us-32) | Édition d’un document Markdown propre au projet, aperçu lisible et export DOCX. |
| Confidentialité | Tranche de [US-29](user-stories.md#us-29) | Aucun projet privé ni document associé n’est divulgué à une personne non autorisée ; le gestionnaire reste exclu. |

Les arbitrages Q-01, Q-02, Q-06, Q-07, Q-26 à Q-28 doivent être résolus avant la recette des comportements concernés. L’archivage du projet et son historique détaillé restent au Sprint 4 afin d’être traités avec les réservations et la libération du matériel.

### Démonstration attendue

1. Créer un projet public puis un projet privé et vérifier leur visibilité avec les profils prévus.
2. Ouvrir un projet depuis le tableau de bord et utiliser le Kanban directement dans l’onglet Description, sans ouvrir un onglet Kanban distinct.
3. Ajouter un membre, créer une tâche, la déplacer et lui affecter ou retirer un responsable.
4. Rédiger la documentation du projet en Markdown, vérifier son aperçu puis produire un fichier DOCX.
5. Vérifier qu’un utilisateur non autorisé et le gestionnaire ne peuvent pas lire ou modifier le projet, son Kanban ou sa documentation.

## Sprint 3 — Inventaire et pièces jointes

**Objectif :** rendre l’inventaire actif exploitable et permettre de conserver les justificatifs associés à chaque article.

| Contenu | Stories | Résultat attendu |
| --- | --- | --- |
| Fiches matériel | [US-05](user-stories.md#us-05), [US-06](user-stories.md#us-06), [US-07](user-stories.md#us-07) | Consultation, création et modification des matériels individualisés ou non. |
| Catégories et recherche | [US-08](user-stories.md#us-08), première tranche de [US-09](user-stories.md#us-09) | Classement multicatégorie, recherche, filtres et tri hors disponibilité liée aux réservations. |
| Historique actif | [US-12](user-stories.md#us-12) | Traçabilité des créations et modifications selon les droits. |
| Documents d’un article | [US-33](user-stories.md#us-33) | Ajout, consultation, téléchargement et retrait contrôlé de pièces jointes telles qu’une facture ou un bon de commande. |
| Confidentialité | Tranche de [US-29](user-stories.md#us-29) | Les droits de lecture et de gestion s’appliquent aussi aux pièces jointes. |

La suppression et les archives du matériel restent au Sprint 4, car leur recette dépend de l’annulation des réservations et des notifications. Les contraintes de fichiers de Q-29 doivent être fixées avant la réalisation de US-33.

### Démonstration attendue

1. Créer et modifier des matériels individualisés et non individualisés, puis les retrouver par catégorie et recherche.
2. Consulter l’historique actif avec l’administrateur et le gestionnaire, puis vérifier son refus pour un utilisateur.
3. Joindre une facture et un bon de commande à une fiche matériel, les consulter et les télécharger.
4. Retirer une pièce jointe avec un profil autorisé et vérifier le refus avec un utilisateur en lecture seule.

## Sprint 4 — Réservations, archivage et traçabilité

**Objectif :** relier les projets à l’inventaire en garantissant la cohérence des réservations et des archives.

Ce sprint regroupe US-10, US-11, US-20 à US-25, US-27, US-28 et US-31, ainsi que les tranches restantes de US-09 et US-29. Il couvre les réservations sans chevauchement, leur modification et leur annulation, l’archivage des projets et matériels, les historiques et les notifications.

Pour le cycle de vie d’un projet, terminer sa dernière tâche non terminée déclenche automatiquement la clôture/archivage. La recette doit vérifier les mêmes effets qu’une clôture manuelle, notamment la libération du matériel, la conservation des traces et l’impossibilité de rouvrir le projet.

## Sprint 5 — Calendrier et exports

**Objectif :** compléter l’exploitation des données avec les vues et fichiers prévus dans le cadrage.

Ce sprint regroupe [US-13](user-stories.md#us-13) pour les exports d’inventaire et [US-26](user-stories.md#us-26) pour le calendrier de disponibilité. Les formats, colonnes, périodes, vues et actions doivent suivre les décisions Q-11, Q-16 et Q-22.

## Conditions communes d’achèvement

Pour chaque sprint, les critères d’acceptation du périmètre sont vérifiés, les résultats de recette sont consignés, les accès directs non autorisés sont refusés et les anomalies bloquantes sont corrigées. Une story répartie sur plusieurs sprints reste ouverte tant que tous ses critères ne sont pas validés.
