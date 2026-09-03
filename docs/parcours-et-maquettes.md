# SUIVI — Parcours utilisateurs et maquettes

**Statut :** spécification de parcours dérivée du compte rendu. Les maquettes PNG sont des esquisses existantes, non modifiées dans cette mise à jour documentaire. Les comportements proposés doivent être examinés dans US-30.

## Sources visuelles

| Support | Observation | Correction / précision attendue |
| --- | --- | --- |
| [Administrateur](Maquette%20Simple/CRUD%20ADMIN.png) | Connexion, accueil avec projets, accès inventaire et zones de modales CRUD. | Détailler les actions, droits, confirmations et erreurs ; les modales sont actuellement des zones à compléter. |
| [Gestionnaire](Maquette%20Simple/CRUD%20GEST.png) | Connexion, inventaire et navigation vers une zone « CRUD Projet ». | Retirer tout accès aux projets conformément au compte rendu §2.2 ; masquer leurs informations dans les réservations visibles. |
| [Utilisateur standard](Maquette%20Simple/CRUD%20USER.png) | Connexion, projets et consultation d’un tableau, avec zone de modale. | Clarifier les libellés projet/inventaire et distinguer consultation publique et modification réservée aux membres. |

Le mot CRUD dans une image n’accorde pas automatiquement création, modification et suppression au profil représenté. Les images ne spécifient pas les fonctions supplémentaires éventuellement suggérées par un lien ou une case de connexion.

## Parcours d’accès commun

1. Saisir identifiant et mot de passe.
2. Valider via le mécanisme simulé convenu en Q-21.
3. Créer automatiquement le compte standard si c’est sa première connexion reconnue, ou retrouver son compte et son rôle ; appliquer l’exception `admin`.
4. Ouvrir le tableau de bord autorisé.

**Propositions d’états :** connexion en attente, champs incomplets, refus de connexion, accueil vide, chargement et erreur de récupération. Gestion des sessions, déconnexion et récupération de mot de passe doivent être spécifiées avant d’être développées (Q-24).

## Administrateur

Accueil → inventaire actif → fiche → création/modification/suppression, catégories, historique et exports. Accès aux matériels archivés et à leur historique ; aucun bouton de restauration.

Accueil → tous les projets autorisés au titre de l’administration → informations, membres, Kanban et réservations. Les actions sont disponibles sans adhésion au projet. Consultation des archives projets et modalités de suppression restent à définir.

Gestion des rôles → choix d’un utilisateur standard → attribution/retrait du rôle gestionnaire. Le parcours de remplacement et l’effet sur les participations suivent Q-02. L’écran peut être reporté après S1 selon Q-20.

## Gestionnaire

Accueil sans projet → inventaire actif → consultation et gestion des fiches/catégories → historique actif et exports autorisés.

Une réservation peut apparaître comme « Réservé », avec les informations de disponibilité autorisées ; elle ne mène pas à un projet. Aucun accès aux archives matériel ni à la réservation depuis un projet. Un changement de rôle doit actualiser les droits de tout accès, y compris aux notifications antérieures selon Q-02/Q-15.

## Utilisateur standard

Accueil → inventaire actif → recherche et détail en consultation. Pas d’export, de modification ni d’historique du matériel.

Accueil/navigation projets → projets publics ou privés autorisés → détail. Un public non membre reste en lecture. Un membre accède aux modifications, aux tâches, à l’ajout de membres et aux réservations. Le créateur dispose du droit de clôture/archivage ; ses autres droits contextuels dépendent de l’adhésion à préciser en Q-27.

Depuis un projet accessible en modification → sélection d’un exemplaire → période complète → validation sans conflit → réservation visible. Modification/annulation possibles par les autres membres du même projet. Le standard ne reçoit pas pour autant l’accès à l’historique des réservations de l’inventaire.

## Écrans à détailler après S1

| Écran / action | Informations et états attendus |
| --- | --- |
| Liste inventaire | Filtres combinés, tri, absence de résultats, disponibilité selon période, mention « Réservé » si nécessaire. |
| Fiche matériel | Nom, mode de suivi, références facultatives, catégories multiples, actions selon rôle. |
| Suppression matériel | **Proposition :** confirmation expliquant l’archivage irréversible et l’annulation des réservations ; résultat sans perte d’historique. |
| Historique / archives matériel | Événements date/auteur ; archivés réservés à l’administrateur ; projets masqués au gestionnaire. |
| Projet et membres | Visibilité, informations requises, dates facultatives, ajout immédiat et actions autorisées. |
| Kanban | Titre/description et colonnes convenues ; états vide/erreur ; pas de champs responsable/priorité/échéance. |
| Réservation | Début/fin obligatoires, minutes 00/30, valeurs projet comme défauts, message de conflit. |
| Clôture/archivage projet | **Proposition :** expliquer la libération du matériel avant confirmation ; libellés et actions suivant Q-12. |
| Notifications | Liste personnelle, lu/non lu individuel et contenu conforme aux droits actuels. |
| Export / calendrier | À concevoir après arbitrage des formats et du périmètre envisagé. |

**Propositions ergonomiques communes :** navigation au clavier, libellés explicites, erreurs près des champs, retour clair après enregistrement, absence de projet privé dans les suggestions ou messages de conflit. La maquette finale devra préciser ces états ; le présent document ne remplace pas leur réalisation visuelle.
