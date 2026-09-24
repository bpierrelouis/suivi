# Sprint 4 — Réservations, archivage et traçabilité

**Réalisation :** 24 septembre 2026.

## Périmètre livré

- réservation d’un matériel individualisé depuis un projet, avec modification et annulation ;
- créneaux limités aux minutes `00` et `30`, fin strictement postérieure au début ;
- intervalles semi-ouverts `[début, fin[` : deux réservations adjacentes sont autorisées ;
- double protection contre les chevauchements : contrôle applicatif lisible et contrainte d’exclusion PostgreSQL sûre en concurrence ;
- archivage manuel d’un projet par son responsable ou un administrateur, et archivage automatique à la dernière tâche terminée ;
- libération des réservations en cours ou futures lors de l’archivage d’un projet ou d’un matériel ;
- conservation des réservations annulées ou libérées et de leurs événements ;
- historique des projets couvrant informations, membres, tâches et archivage ;
- consultation des matériels archivés réservée à l’administrateur, sans restauration ;
- historique des réservations d’un matériel pour l’administrateur et le gestionnaire, avec projet masqué en « Réservé » pour le gestionnaire ;
- notification interne par destinataire lors de l’archivage d’un matériel réservé, avec état lu indépendant.

## Hypothèses de prototype

Les questions métier encore ouvertes ont été traitées de façon prudente et réversible :

- les dates envoyées par l’interface sont converties en UTC et restituées dans le fuseau du navigateur ;
- la clôture manuelle est réservée au responsable du projet et à l’administrateur ;
- un projet ou un matériel archivé ne peut être ni modifié ni restauré ;
- une réservation annulée ou libérée ne peut plus être modifiée ou annulée une seconde fois ;
- les pièces jointes d’un matériel sont conservées dans l’archive et restent accessibles à l’administrateur ;
- une notification peut passer de non lue à lue, sans retour à l’état non lu.

## Contrôles réalisés

- 30 tests automatisés serveur ;
- 9 tests automatisés interface ;
- compilation de production Vue ;
- migration et démarrage complet de la stack Docker ;
- recette API : création, refus d’un chevauchement avec code 409, libération à l’archivage projet ;
- recette API : archivage matériel, libération et notification personnelle marquée comme lue ;
- contrôle visuel des vues Notifications, Archives projets et Archives matériel.
