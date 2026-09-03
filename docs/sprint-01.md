# SUIVI — Préparation du premier sprint

**Statut :** proposition de préparation, pas sprint engagé. Durée, échéance, équipe, capacité, responsable de validation et date de démonstration : **à renseigner** en Q-04/Q-20.

## Objectif

Démontrer une connexion fonctionnelle dans l’environnement simulé, ouvrir un tableau de bord avec des données fictives et présenter les maquettes de navigation et de consultation adaptées aux profils.

## Périmètre issu du compte rendu

| Livrable | Stories | Résultat attendu |
| --- | --- | --- |
| Connexion fonctionnelle | [US-01](user-stories.md#us-01), [US-02](user-stories.md#us-02) | Identifiant/mot de passe, création automatique du standard à la première connexion validée, compte `admin` prédéfini, rôle conservé ensuite. |
| Maquettes | [US-30](user-stories.md#us-30) | Organisation générale, connexion, navigation, accueil, consultation des projets et inventaire. |
| Tableau de bord | [US-04](user-stories.md#us-04) | Accès après connexion, données fictives, contenu adapté au profil et accès direct à l’inventaire pour l’administrateur. |
| Vérification des droits du périmètre | Tranche S1 de [US-29](user-stories.md#us-29) | Aucun projet pour le gestionnaire ; aucune donnée de projet privé inaccessible au standard. |

L’interface de changement des rôles (US-03) n’est pas incluse par défaut : Q-20 doit trancher. La matrice des trois profils reste à prendre en compte dans les maquettes et la démonstration ; le mode de préparation du rôle gestionnaire doit être convenu dans les données de simulation.

## Travaux proposés

| Ordre | Travail | Preuve attendue |
| --- | --- | --- |
| 1 | Fixer le mécanisme d’authentification simulée et le secret initial de `admin` (CAD-02). | Décision Q-21 consignée, règles d’identifiants et de refus explicites. |
| 2 | Convenir du mode d’exécution du prototype et de sa configuration (TEC-01, TEC-03). | Procédure reproductible, gestion des secrets/sessions décrite. |
| 3 | Reprendre les parcours et corriger les contradictions des esquisses (US-30). | Écrans par profil, dont gestionnaire sans accès aux projets. |
| 4 | Réaliser connexion, création automatique et conservation du rôle (US-01/US-02). | Démonstration première connexion/reconnexion et accès administrateur. |
| 5 | Préparer des données fictives distinctes pour les profils (TEC-02). | Inventaire d’exemple, projets publics/privés et profils identifiables comme données de démonstration. |
| 6 | Réaliser le tableau de bord convenu (US-04) avec les droits applicables. | Écran accessible après connexion pour les profils représentés. |
| 7 | Exécuter REC-01, REC-02, REC-04 et REC-19, plus la tranche S1 de REC-18. | Résultats réels consignés, écarts et retours du validateur. |

Ces travaux n’imposent ni bibliothèque, ni serveur, ni protocole. Leur choix dépend de Q-17.

## Exclusions du premier sprint

La réservation n’est pas développée. L’intégration réelle à l’authentification Intradef n’est pas réalisée. Les CRUD complets de matériel/projets, les exports, les historiques métier et les notifications ne sont pas engagés dans le périmètre initial. Les écrans de consultation peuvent être représentés par des maquettes ; seul le tableau de bord et la connexion sont explicitement demandés fonctionnels dans la source.

## Préparation nécessaire

- Q-21 : validation du mot de passe et configuration du compte administrateur, indispensable à une connexion fonctionnelle.
- Q-14 : contenu du tableau de bord ; Q-19 : autres écrans attendus.
- Q-17 : support d’exécution du prototype ; Q-24 : règles minimales de secrets et de session.
- Q-04/Q-20 : validateur, échéance, critères retenus et éventuel écran de gestion des rôles.

Les maquettes et la rédaction des scénarios peuvent avancer avant ces réponses ; les comportements indécis ne doivent pas être présentés comme validés.

## Démonstration proposée

1. Présenter les maquettes et les différences de navigation entre profils.
2. Se connecter avec un utilisateur simulé reconnu mais encore absent de SUIVI ; constater la création du rôle standard et l’ouverture de l’accueil.
3. Revenir avec le même compte ; constater qu’aucun doublon n’est créé et que le rôle est conservé.
4. Se connecter avec `admin` ; montrer son profil et l’accès direct à l’inventaire.
5. Avec le scénario gestionnaire convenu, montrer l’absence totale de projets, y compris dans les données fournies à l’écran.
6. Montrer que les données fictives privées ne sont visibles que selon les droits attendus et que les identifiants refusés ne donnent pas accès à l’accueil, après définition de Q-21.

## Achèvement proposé

Les critères des quatre stories S1 sont vérifiés sur leur périmètre, les contrôles de confidentialité correspondants sont passés, les résultats sont consignés et les retours de validation sont traités. US-29 reste ouverte pour les surfaces livrées ultérieurement. Les conditions finales d’acceptation sont soumises à Q-20.
