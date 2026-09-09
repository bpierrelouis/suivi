# SUIVI — Diagramme de classes d'analyse métier (DCLAM)

Le DCLAM ci-dessous décrit le modèle métier conceptuel de SUIVI. Il ne constitue pas encore un schéma de base de données ni un découpage des classes techniques.

```mermaid
classDiagram
    direction LR

    class Utilisateur {
        +UUID id
        +String identifiantConnexion
        +RoleUtilisateur role
        +seConnecter()
        +consulterNotifications()
        +marquerNotificationLue()
    }

    class Materiel {
        +UUID id
        +String nom
        +ModeSuivi modeSuivi
        +String numeroSerie
        +String referenceConstructeur
        +String numeroInventaire
        +EtatMateriel etat
        +DateTime dateSuppression
        +calculerDisponibilite(debut, fin)
        +archiver(auteur)
    }

    class Categorie {
        +UUID id
        +String libelle
        +renommer(libelle)
    }

    class Projet {
        +UUID id
        +String nom
        +String description
        +VisibiliteProjet visibilite
        +Date dateDebut
        +Date dateFin
        +EtatProjet etat
        +modifierInformations()
        +ajouterMembre(utilisateur)
        +retirerMembre(utilisateur)
        +archiver(auteur)
    }

    class Participation {
        +UUID id
        +DateTime dateAjout
        +ajouter()
        +retirer()
    }

    class Tache {
        +UUID id
        +String titre
        +String description
        +EtatTache colonne
        +Integer ordre
        +modifier()
        +deplacer(colonne, ordre)
        +affecterResponsableTache(utilisateur)
    }

    class Reservation {
        +UUID id
        +DateTime creeeLe
        +DateTime debutPrevu
        +DateTime finPrevue
        +EtatReservation etat
        +DateTime annuleeLe
        +creer()
        +modifierPeriode(debut, fin)
        +annuler(auteur, motif)
        +chevauche(debut, fin) bool
    }

    class EvenementMateriel {
        +UUID id
        +DateTime dateHeure
        +NatureEvenementMateriel nature
        +String detail
    }

    class EvenementProjet {
        +UUID id
        +DateTime dateHeure
        +NatureEvenementProjet nature
        +String detail
    }

    class Notification {
        +UUID id
        +DateTime creeeLe
        +String contenu
    }

    class NotificationDestinataire {
        +UUID id
        +Boolean lue
        +DateTime lueLe
        +marquerLue()
    }

    class RoleUtilisateur {
        <<enumeration>>
        ADMINISTRATEUR
        GESTIONNAIRE
        UTILISATEUR
    }

    class ModeSuivi {
        <<enumeration>>
        INDIVIDUALISE
        NON_INDIVIDUALISE
    }

    class EtatMateriel {
        <<enumeration>>
        ACTIF
        ARCHIVE
    }

    class VisibiliteProjet {
        <<enumeration>>
        NP_PUBLIC
        SECRET_PRIVE
    }

    class EtatProjet {
        <<enumeration>>
        ACTIF
        ARCHIVE
    }

    class EtatTache {
        <<enumeration>>
        A_FAIRE
        EN_COURS
        FAIT
    }

    class EtatReservation {
        <<enumeration>>
        PLANIFIEE
        EN_COURS
        PASSEE
        ANNULEE
    }

    class NatureEvenementMateriel {
        <<enumeration>>
        CREATION
        MODIFICATION
        SUPPRESSION
        RESERVATION
        ANNULATION_RESERVATION
    }

    class NatureEvenementProjet {
        <<enumeration>>
        CREATION
        MODIFICATION_INFORMATIONS
        MODIFICATION_VISIBILITE
        AJOUT_MEMBRE
        RETRAIT_MEMBRE
        MODIFICATION_TACHE
        ARCHIVAGE
    }

    Utilisateur --> RoleUtilisateur : possède
    Materiel --> ModeSuivi : est suivi selon
    Materiel --> EtatMateriel : possède
    Projet --> VisibiliteProjet : possède
    Projet --> EtatProjet : possède
    Tache --> EtatTache : occupe
    Reservation --> EtatReservation : possède
    EvenementMateriel --> NatureEvenementMateriel : qualifie
    EvenementProjet --> NatureEvenementProjet : qualifie

    Utilisateur "1" <-- "0..*" Projet : responsable
    Utilisateur "1" -- "0..*" Participation : concerne
    Projet "1" *-- "0..*" Participation : membres
    Projet "1" *-- "0..*" Tache : tâches
    Utilisateur "0..1" <-- "0..*" Tache : responsable de tâche

    Materiel "0..*" -- "0..*" Categorie : classé dans
    Materiel "1" *-- "0..*" Reservation : réservations
    Projet "1" *-- "0..*" Reservation : utilise
    Utilisateur "1" <-- "0..*" Reservation : réservant

    Materiel "1" *-- "0..*" EvenementMateriel : historique
    Utilisateur "1" <-- "0..*" EvenementMateriel : auteur
    Projet "1" *-- "0..*" EvenementProjet : historique
    Utilisateur "1" <-- "0..*" EvenementProjet : auteur

    Notification "1" *-- "1..*" NotificationDestinataire : états de lecture
    Utilisateur "1" <-- "0..*" NotificationDestinataire : destinataire
    Materiel "0..1" <-- "0..*" Notification : concerne
    Reservation "0..1" <-- "0..*" Notification : provoquée par
```

## Contraintes métier portées par le modèle

- Un seul utilisateur possède le rôle `ADMINISTRATEUR` et son identifiant de connexion est `admin`.
- Il existe au maximum un utilisateur de rôle `GESTIONNAIRE` ; un gestionnaire ne participe à aucun projet.
- Chaque projet possède exactement un responsable. Ce responsable est obligatoirement relié au projet par une participation de membre.
- Une seule participation active est proposée par couple utilisateur–projet.
- Une tâche appartient à un seul projet ; son responsable de tâche facultatif doit être membre de ce projet.
- Une réservation concerne exactement un matériel individualisé, un projet et son réservant. Son début et sa fin sont obligatoires et alignés sur des minutes `00` ou `30`.
- Deux réservations en vigueur de projets différents ne peuvent pas se chevaucher pour le même matériel.
- Archiver un matériel conserve son historique et ses réservations, mais annule les réservations en cours et futures.
- Archiver un projet conserve ses membres, tâches, réservations et événements, libère ses réservations et interdit toute réouverture.
- L'état lu/non lu d'une notification appartient à chaque destinataire, jamais à la notification globalement.

Les attributs `ordre` d'une tâche, le détail des annulations et les états calculés d'une réservation restent des propositions de conception soumises aux arbitrages Q-22 et Q-26.
