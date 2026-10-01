# Présentation du projet SUIVI - contenu du support

## Informations à compléter

- `[Nom 1]` : rôle réel dans le projet et contributions principales.
- `[Nom 2]` : rôle réel dans le projet et contributions principales.
- `[Nom 3]` : rôle réel dans le projet et contributions principales.
- `[Nom 4]` : rôle réel dans le projet et contributions principales.
- Date exacte à afficher sur la couverture.
- Version ou commit utilisé pour la démonstration.

## Fil conducteur

SUIVI centralise l'inventaire d'un laboratoire, la vie de ses projets et l'utilisation du matériel. La présentation part du problème rencontré, explique la réponse fonctionnelle et technique, puis la démontre avec un parcours utilisateur complet.

Durée cible : **18 minutes**, hors questions.

| N° | Diapositive | Intervenant | Durée | Cumul |
| ---: | --- | --- | ---: | ---: |
| 1 | SUIVI | `[Nom 1]` | 0 min 30 | 0 min 30 |
| 2 | Contexte et besoin | `[Nom 1]` | 1 min 30 | 2 min 00 |
| 3 | Équipe et responsabilités | `[Nom 1]` | 1 min 00 | 3 min 00 |
| 4 | Utilisateurs et réponse fonctionnelle | `[Nom 1]` | 1 min 30 | 4 min 30 |
| 5 | Choix techniques | `[Nom 2]` | 2 min 15 | 6 min 45 |
| 6 | Architecture et sécurité | `[Nom 2]` | 1 min 30 | 8 min 15 |
| 7 | Réalisation et préparation de la démo | `[Nom 2]` | 0 min 45 | 9 min 00 |
| 8 | Démonstration fonctionnelle | `[Nom 3]` | 4 min 30 | 13 min 30 |
| 9 | Droits et règles métier | `[Nom 4]` | 1 min 30 | 15 min 00 |
| 10 | Qualité et limites actuelles | `[Nom 4]` | 1 min 15 | 16 min 15 |
| 11 | Évolutions réalistes | `[Nom 4]` | 1 min 00 | 17 min 15 |
| 12 | Conclusion | `[Nom 4]` | 0 min 45 | 18 min 00 |

## Diapositive 1 - SUIVI

**Titre :** SUIVI

**Sous-titre :** Suivi des Usages, Inventaires, Vie des projets et IA

**À afficher :**

- Application interne de gestion pour un laboratoire.
- Noms des quatre membres.
- Date et contexte de la présentation.

**Visuel conseillé :** une capture propre du tableau de bord ou le logo du projet.

## Diapositive 2 - Contexte et besoin

**Message principal :** les informations sur le matériel, les projets et les réservations doivent être réunies dans un outil unique.

**À afficher :**

- Retrouver rapidement un matériel et connaître sa disponibilité.
- Suivre les projets, leurs membres et leurs tâches.
- Réserver le matériel sans chevauchement.
- Conserver l'historique des modifications et des mouvements.

**Phrase de synthèse :** SUIVI remplace une gestion dispersée par une application commune, traçable et adaptée aux droits de chacun.

## Diapositive 3 - Équipe et responsabilités

**À afficher sous forme de quatre lignes :**

| Membre | Rôle réel | Contributions à citer |
| --- | --- | --- |
| `[Nom 1]` | `[à compléter]` | `[deux réalisations vérifiables]` |
| `[Nom 2]` | `[à compléter]` | `[deux réalisations vérifiables]` |
| `[Nom 3]` | `[à compléter]` | `[deux réalisations vérifiables]` |
| `[Nom 4]` | `[à compléter]` | `[deux réalisations vérifiables]` |

Ne pas employer quatre intitulés artificiels si le travail a été partagé. Décrire dans ce cas les responsabilités dominantes et les sujets réalisés en commun.

## Diapositive 4 - Utilisateurs et réponse fonctionnelle

**Public visé :** un laboratoire et ses équipes, sur poste de travail dans l'environnement interne cible.

**Trois profils :**

- Administrateur : gère l'ensemble des données, les projets, les archives et le rôle gestionnaire.
- Gestionnaire : tient l'inventaire actif, les catégories et les exports, sans accéder aux projets.
- Utilisateur : consulte l'inventaire et collabore sur les projets auxquels ses droits donnent accès.

**Fonctions à faire apparaître :**

- inventaire et pièces jointes ;
- projets publics ou privés, membres, Kanban et documentation ;
- réservations, calendrier et notifications ;
- historiques, archives et exports Excel ou PDF.

## Diapositive 5 - Choix techniques

**À afficher :**

| Technologie | Utilisation | Justification à dire |
| --- | --- | --- |
| Vue 3 et Vite | Interface web | Composants adaptés aux formulaires, tableaux et vues métier ; construction rapide. |
| Express 5 sur Node.js | API | Socle JavaScript simple pour centraliser les règles métier et les droits. |
| Prisma 7 | Accès aux données et migrations | Modèle centralisé, migrations versionnées et transactions. |
| PostgreSQL 17 | Données métier | Relations, contraintes et transactions nécessaires aux projets et réservations. |
| API compatible S3 | Pièces jointes | Les fichiers restent hors de la base ; le bucket privé utilise des accès temporaires. |
| Docker Compose et Nginx | Exécution intégrée | Environnement reproductible et point d'entrée unique pour l'interface et l'API. |

Éviter de lire le tableau. Expliquer les liens entre les choix, les besoins et les risques du projet.

## Diapositive 6 - Architecture et sécurité

**Schéma à afficher :**

`Navigateur -> Nginx -> Vue / API Express -> PostgreSQL`

`Navigateur -> URL signée temporaire -> Stockage S3 privé`

**Points à expliquer :**

- Nginx fournit un point d'entrée unique.
- L'API contrôle chaque accès et applique les règles métier.
- PostgreSQL stocke les données et les métadonnées des fichiers.
- Le contenu des pièces jointes se trouve dans un stockage objet privé.
- L'authentification utilise un jeton court dans un cookie `HttpOnly`.
- PostgreSQL et l'API ne sont pas directement exposés sur l'hôte dans la configuration Docker.

## Diapositive 7 - Réalisation et préparation de la démo

**À afficher :**

- Sprint 1 : socle, connexion simulée et tableaux de bord par profil.
- Sprint 2 : projets, membres, Kanban et documentation exportable.
- Sprint 3 : inventaire, catégories, recherche, historique et pièces jointes.
- Sprint 4 : réservations, archives et notifications.
- Sprint 5 : calendrier et exports Excel/PDF.

**Transition :** les fonctions sont maintenant réunies dans un parcours continu présenté avec un compte utilisateur.

## Diapositive 8 - Démonstration fonctionnelle

Cette diapositive reste affichée quelques secondes, puis la démonstration se déroule dans l'application.

**Scénario :** un membre prépare un projet de laboratoire, trouve un matériel, organise le travail, réserve l'équipement et suit sa disponibilité.

**Parcours de démonstration :**

1. Se connecter avec un compte utilisateur déjà membre du projet de démonstration.
2. Montrer le tableau de bord adapté à ce profil.
3. Rechercher un matériel individualisé dans l'inventaire et ouvrir sa fiche.
4. Ouvrir le projet préparé et montrer sa visibilité, ses membres et sa documentation.
5. Déplacer ou terminer une tâche dans le Kanban.
6. Créer une réservation sur un créneau libre ; expliquer le contrôle des chevauchements.
7. Montrer la réservation dans le calendrier.
8. Terminer la dernière tâche préparée pour illustrer la clôture automatique et la libération du matériel, uniquement si cette étape a été répétée et fiabilisée.

**Plan de secours :** captures d'écran dans le même ordre, avec une capture du résultat attendu après chaque action importante.

## Diapositive 9 - Droits et règles métier

**Message principal :** la séparation des profils protège les données et évite les opérations incohérentes.

**Exemples à afficher :**

- Un projet privé reste invisible aux utilisateurs extérieurs.
- Le gestionnaire ne peut accéder à aucun projet.
- Seul le matériel individualisé peut être réservé.
- Deux réservations incompatibles ne peuvent pas occuper le même créneau.
- L'archivage conserve les traces et libère les réservations concernées.
- Un projet se clôt automatiquement lorsque sa dernière tâche en cours est terminée.

## Diapositive 10 - Qualité et limites actuelles

**Éléments vérifiés lors du Sprint 5 :**

- 34 tests automatisés côté serveur.
- 10 tests automatisés côté interface.
- Compilation de production Vue.
- Démarrage et contrôles de santé de la stack Docker locale.
- Vérifications des exports et des refus d'accès.

**Limites à annoncer clairement :**

- L'authentification Intradef reste simulée dans le prototype.
- Certaines décisions d'exploitation restent à valider, notamment les sauvegardes, les volumes cibles et les seuils de performance.
- Le calendrier sert à consulter les disponibilités ; la création des réservations reste dans un projet.
- L'intelligence artificielle figure dans le nom SUIVI, mais aucune fonction d'IA n'est livrée à ce stade.

## Diapositive 11 - Évolutions réalistes

**À afficher :**

- Intégrer l'authentification réelle de l'environnement cible.
- Ajouter une sauvegarde supervisée et une procédure de restauration testée.
- Définir les volumes attendus et mesurer les performances.
- Ajouter l'analyse antivirus des pièces jointes avant leur mise à disposition.
- Étudier l'usage mobile après validation de l'expérience sur PC.
- Étudier une aide intelligente seulement après définition d'un besoin concret et des règles de confidentialité.

Présenter ces éléments comme des pistes, pas comme des fonctions déjà disponibles.

## Diapositive 12 - Conclusion

**À afficher :**

> SUIVI réunit l'inventaire, les projets et les réservations dans une application unique, avec des droits précis et une traçabilité complète.

**Dernière ligne :** Merci. Nous sommes prêts à répondre à vos questions.

## Diapositives de secours pour les questions

Ces diapositives ne comptent pas dans les 18 minutes :

- matrice détaillée des droits ;
- architecture complète ;
- modèle de données simplifié ;
- liste des principales user stories ;
- stratégie de tests et résultats ;
- captures des profils administrateur et gestionnaire ;
- limites connues et questions encore ouvertes.

