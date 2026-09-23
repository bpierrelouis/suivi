# Sprint 1 — Réalisation technique

**État :** implémentation initiale.  
**Périmètre :** US-01, US-02, US-04, US-30 et tranche S1 de US-29.

## Fonctionnalités livrées

- connexion avec identifiant et mot de passe ;
- session conservée dans un cookie `HttpOnly` ;
- compte administrateur prédéfini ;
- compte gestionnaire de démonstration ;
- création automatique d’un compte utilisateur lors de sa première connexion simulée ;
- conservation du rôle lors des connexions suivantes ;
- tableau de bord alimenté par des données fictives ;
- filtrage des projets côté serveur selon le rôle, la visibilité et l’appartenance ;
- absence totale de données projet dans la réponse destinée au gestionnaire ;
- accès direct à l’aperçu de l’inventaire pour l’administrateur ;
- pages préparatoires non fonctionnelles pour Projets et Inventaire, dont les fonctions restent dans leurs sprints respectifs.

## Hypothèse temporaire Q-21

En l’absence d’un annuaire Intradef connecté, l’environnement local utilise trois secrets configurables :

- `ADMIN_PASSWORD` pour le compte `admin` ;
- `MANAGER_PASSWORD` pour `gestionnaire@demo.local` ;
- `SIMULATED_PASSWORD` pour valider la première connexion d’une adresse électronique encore inconnue.

Une adresse inconnue accompagnée du mot de passe de simulation crée exactement un compte de rôle `utilisateur`. Toute autre combinaison est refusée. Les mots de passe sont hachés avant stockage. Cette convention est une hypothèse de développement, pas une décision métier définitive.

## Démarrage

1. Copier `.env.example` vers `.env` et remplacer les secrets.
2. Lancer `docker compose up --build` depuis la racine.
3. Ouvrir le port défini par `APP_PORT`, par exemple `http://localhost:8080` avec le fichier d’exemple.

Une tâche dédiée applique les migrations Prisma et initialise les comptes de démonstration avant le démarrage de l’API. Nginx sert le frontend de production et relaie `/api` vers le backend. PostgreSQL et l’API restent accessibles uniquement sur le réseau Docker et aucun de leurs ports n’est publié sur l’hôte.

## Comptes de démonstration

| Profil | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin` | valeur de `ADMIN_PASSWORD` |
| Gestionnaire | `gestionnaire@demo.local` | valeur de `MANAGER_PASSWORD` |
| Utilisateur membre d’un projet privé | `lea.fournier@demo.local` | valeur de `SIMULATED_PASSWORD` lors de la première connexion |
| Nouvel utilisateur | toute autre adresse valide | valeur de `SIMULATED_PASSWORD` lors de la première connexion |

## Contrôles automatisés

- le gestionnaire ne reçoit aucun projet ;
- un utilisateur extérieur ne reçoit que les projets publics ;
- un membre reçoit les projets publics et ses projets privés ;
- le composant de rôle présente le libellé attendu ;
- la construction de production du frontend et la migration Prisma sont vérifiées avant clôture du sprint.

## Limites assumées du Sprint 1

- authentification Intradef réelle non branchée ;
- aucune interface de changement de rôle ;
- aucune opération de gestion des projets ou de l’inventaire ;
- données de tableau de bord fictives ;
- renouvellement silencieux de session non développé ; une reconnexion est demandée à expiration.

## Dépendances et sécurité

L’audit du frontend ne remonte aucun avis connu. Le CLI Prisma 7 utilisé uniquement pour générer le client et appliquer les migrations embarque actuellement des dépendances transitives signalées par npm (`deepmerge-ts` et `mysql2`). Le chemin d’exécution applicatif utilise PostgreSQL via `@prisma/adapter-pg`, pas MySQL. L’image de production retire le CLI, les dépendances de développement et les dépendances pair après génération du client. Une mise à jour Prisma sera appliquée lorsqu’une version 7 compatible corrigera ces dépendances ; aucun `audit fix --force` vers Prisma 6 n’est appliqué car il constituerait une régression majeure non testée.
