# Sprint 5 — Calendrier et exports

**Réalisation :** 24 septembre 2026.

## Périmètre livré

- calendrier hebdomadaire accessible aux trois profils, limité aux matériels actifs et individualisés ;
- navigation semaine précédente, semaine courante et semaine suivante ;
- affichage des créneaux réservés et disponibles dans le fuseau du navigateur ;
- respect des intervalles semi-ouverts `[début, fin[` et exclusion des réservations annulées ou libérées ;
- confidentialité des projets : leur nom et leur lien ne sont affichés qu’aux personnes autorisées, sinon le libellé « Réservé » est utilisé ;
- export de l’inventaire actif aux formats Excel et PDF pour l’administrateur et le gestionnaire ;
- choix entre l’inventaire actif complet et les résultats correspondant aux filtres courants ;
- masquage systématique du projet courant dans les exports du gestionnaire ;
- refus serveur des exports demandés par un utilisateur standard.

## Hypothèses de prototype

Les questions Q-11 et Q-16 restant ouvertes, le prototype retient les choix suivants :

- une vue hebdomadaire commune à tous les profils autorisés à consulter l’inventaire ;
- aucune création ou modification de réservation depuis le calendrier : ces actions restent dans la fiche projet ;
- deux formats d’export proposés, Excel pour la réutilisation des données et PDF pour l’impression ;
- colonnes exportées : matériel, mode de suivi, numéros d’inventaire et de série, référence constructeur, catégories, disponibilité, projet visible et fin de réservation ;
- seuls les matériels actifs sont exportés ; les archives conservent leur écran dédié.

Ces choix pourront être ajustés sans modifier le modèle de réservation.

## Contrôles réalisés

- 34 tests automatisés serveur ;
- 10 tests automatisés interface ;
- compilation de production Vue ;
- démarrage et contrôle de santé de la stack Docker locale ;
- recette API du calendrier sur une semaine contenant une réservation ;
- vérification du refus d’export pour un utilisateur standard ;
- ouverture et rendu visuel de l’export Excel ;
- rendu visuel du PDF en A4 paysage, sur une page avec pagination correcte.

Le contrôle interactif par navigateur n’a pas pu être rejoué lors de la dernière passe, l’outil de pilotage Windows n’ayant pas pu s’initialiser. Les vues restent couvertes par les tests de composants et la compilation de production.
