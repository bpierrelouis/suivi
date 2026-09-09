# SUIVI — Dictionnaire de données conceptuel

**Statut :** proposition de modèle métier fondée sur les informations du [compte rendu](compte-rendu-reunion-client.md). Il ne s’agit ni d’un schéma de base de données arrêté ni d’un contrat d’API. Les noms de champs, types techniques, tailles et clés de stockage seront choisis lors de la conception.

« Requis métier » désigne une information attendue ; elle peut être fournie automatiquement. Cela ne signifie pas qu’un champ supplémentaire doit être saisi par l’utilisateur. Les identifiants internes stables ci-dessous sont une proposition de conception.

## Utilisateur

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant interne | Proposition, automatique | Référence stable pour membres, auteurs et destinataires. |
| Identifiant de connexion | Requis métier, texte | Peut être un courriel ; `admin` réservé au compte administrateur. Reconnaissance/normalisation à préciser en Q-21. |
| Rôle | Requis métier, administrateur / gestionnaire / utilisateur | Un administrateur, zéro ou un gestionnaire ; utilisateur par défaut à la première connexion. |
| Données d’authentification | À définir | La simulation et la configuration des secrets relèvent de Q-21/Q-24. Aucun stockage de mot de passe en clair n’est proposé. |

Aucun nom, prénom, courriel distinct ou annuaire éditable n’est imposé par le besoin actuel. Les utilisateurs supposés exister à l’extérieur et non encore connectés nécessitent Q-07.

## Matériel

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant interne | Proposition, automatique | Distingue deux exemplaires même si leurs références techniques sont absentes. |
| Nom | Seul champ obligatoire à saisir, texte | Présent à la création et à la modification. |
| Mode de suivi | Information nécessaire au comportement, individualisé / non individualisé | Choix/défaut et changement à préciser en Q-23 ; ne pas ajouter de saisie obligatoire non décidée. |
| Type de matériel | Concept à préciser | Regroupement éventuel des exemplaires ; Q-08 avant ajout d’une entité Type. |
| Catégories | Facultatif, zéro à plusieurs références | Suppression de catégorie = retrait des associations uniquement. |
| Numéro de série | Facultatif, texte | Unicité à arbitrer. |
| Référence constructeur | Facultatif, texte | Non présumée unique par exemplaire. |
| Numéro d’inventaire / autre identifiant | Facultatif, texte | Liste et unicité à arbitrer en Q-08. |
| État actif/archivé | Requis métier, géré par l’application | Suppression = archivage irréversible. |
| Date et auteur de suppression | Requis si supprimé | Conservés avec l’identification et l’historique. |
| Disponibilité | Dérivée des réservations pour l’individualisé | Doit être interprétée pour une période ; Q-25. Indisponibilité du non-individualisé : Q-09. |

Aucun champ quantité précise pour le non-individualisé ni localisation physique. Une réservation concerne un exemplaire, pas un type ou une catégorie.

## Catégorie et association matériel–catégorie

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant de catégorie | Proposition, automatique | Référence stable. |
| Libellé | Proposition de représentation, texte | Longueur, unicité et liste initiale non définies. |
| Association | Référence matériel + référence catégorie | Plusieurs catégories par matériel ; proposition : éviter les doublons d’association. |

## Projet

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant interne | Proposition, automatique | Référence stable ; ne doit pas être divulguée par une surface masquant le projet. |
| Nom | Minimum requis, texte | Avec description et visibilité. |
| Description | Minimum requis, texte | Format/longueur non définis. |
| Visibilité | Minimum requis, NP/public ou Secret/privé | Droits de l’utilisateur sur choix et changement à préciser en Q-06. |
| Responsable | Requis métier, référence utilisateur | Utilisateur à l’origine du projet, obligatoirement membre ; droit de clôture/archivage. |
| Date de début / date de fin | Facultatives | Peuvent préremplir une réservation ; aucun horaire projet n’est spécifié. |
| État de cycle de vie | Actif ou archivé | Clôture et archivage sont équivalents et produisent l’état archivé, sans retour possible à l’état actif. |
| Participants, matériels associés, tâches réalisées | Informations à conserver dans l’archive | Consultation selon la visibilité du projet ; le gestionnaire reste exclu. |

## Participation à un projet

Les notions **responsable**, **membre** et **simple** décrivent la relation d’un utilisateur à un projet. Le responsable est identifié par le projet et possède obligatoirement une participation de membre ; l’utilisateur simple ne possède aucune participation au projet concerné. Il ne s’agit pas de valeurs supplémentaires du rôle global administrateur/gestionnaire/utilisateur.

Association entre un projet et un utilisateur. L’ajout produit ses effets immédiatement. Un projet peut avoir plusieurs membres et un utilisateur participer à plusieurs projets ; le gestionnaire ne peut pas participer. L’administrateur exerce ses droits sans avoir besoin d’une association.

**Proposition :** une seule participation active par couple utilisateur/projet. Le sort de l’association lors d’un changement de rôle reste ouvert en Q-02. Le responsable étant membre, son retrait ou son remplacement doit préserver la présence d’un responsable membre selon Q-27.

## Tâche

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant interne et projet | Proposition de référence, automatiques | Une tâche appartient à un projet. |
| Titre / description | Présents selon le compte rendu | Règles de saisie obligatoire et valeurs vides à confirmer en Q-26. |
| Colonne / état Kanban | Nécessaire au suivi, valeurs à confirmer | À faire, En cours, Fait envisagés ; personnalisation Q-01. |
| Responsable de la tâche | Facultatif, zéro ou une référence utilisateur | Doit être membre du projet ; peut être modifié ou retiré. |
| Ordre dans la colonne | Proposition seulement | À retenir si nécessaire au parcours validé, Q-26. |

Aucune date d’échéance ni priorité. Suppression de tâche et conservation des tâches non terminées lors de l’archivage : Q-26.

## Historique des modifications d’un projet

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Projet | Requis, référence projet | Relie l’événement au projet actif ou archivé. |
| Date et heure | Requises | Moment de la modification. |
| Auteur | Requis, référence utilisateur | Personne ayant effectué la modification. |
| Nature de la modification | Requise | Création, informations, visibilité, membres, tâches ou clôture/archivage au minimum. |
| Détail | À concevoir | Doit permettre de comprendre la modification sans imposer ici un format technique. |

L’historique suit les droits de consultation du projet et reste conservé après archivage.

## Réservation

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Identifiant interne | Proposition, automatique | Référence de la réservation et de ses événements. |
| Matériel | Requis métier, une référence | Exclusivement individualisé. |
| Projet | Requis métier, une référence | Projet autorisé pour l’acteur ; informations masquées aux non-habilités. |
| Réservant | Requis métier, référence utilisateur | Auteur de la création, distinct d’un membre qui modifie/annule ensuite. |
| Création | Requis métier, date et heure | Conservée dans l’historique. |
| Début prévu / fin prévue | Obligatoires, date et heure chacune | Minutes 00 ou 30 ; période complète avant validation. |
| Trace d’annulation | Requise si annulation | Conservée après suppression du matériel ; détail auteur/date/motif à formaliser en Q-22. |
| État opérationnel | Proposition : planifiée, en cours, passée ou annulée | Planifiée/en cours/passée peuvent être calculés ; aucun modèle de stockage n’est imposé. |

Les bornes, le fuseau, les opérations dans le passé et les chevauchements au sein d’un même projet restent à définir. La disponibilité d’un matériel ne doit pas être réduite à un booléen permanent sans rapport avec les périodes réservées.

## Historique

| Information | Portée | Règle |
| --- | --- | --- |
| Événement de matériel | Création, modification, suppression | Date et auteur obligatoires. |
| Référence du matériel | Tous les événements concernés | Doit rester exploitable après archivage. |
| Informations de réservation | Réservant, création, période, projet, annulation | Conserver passé et annulé selon RG-26. |
| Détail des changements | Proposition à préciser | Conservation des anciennes/nouvelles valeurs et granularité des modifications : Q-22/Q-24. |

La suppression du matériel ne doit pas entraîner une suppression de son historique. L’historique n’est pas un journal global des projets. Les droits sont ceux de RG-11/RG-14 ; le masquage des projets s’applique aussi aux détails d’événements.

## Notification et destinataire

| Information | Obligation / forme conceptuelle | Règle |
| --- | --- | --- |
| Événement déclencheur | Suppression de matériel avec réservations en cours/futures | Annulation associée, contenu exact à préciser en Q-15. |
| Contenu et date | Proposition de représentation | Champs et présentation à valider. |
| Destinataire | Requis métier, référence utilisateur | Membre d’un projet concerné à la suppression ; changements de rôle à arbitrer. |
| État de lecture | Requis métier, lu/non lu | Propre à chaque destinataire, jamais global à tous. |

**Proposition :** séparer la notification de ses états par destinataire, ou créer une notification propre à chacun. Ces deux conceptions sont possibles ; le choix de stockage n’est pas arrêté.

## Relations et conservation

| Relation | Cardinalité / contrainte métier |
| --- | --- |
| Utilisateur → projets sous responsabilité | Un responsable par projet ; plusieurs projets possibles par responsable. Le responsable possède aussi une participation de membre au projet. |
| Utilisateur ↔ projet | Plusieurs participations possibles des deux côtés ; règles de rôle applicables. |
| Projet → tâches | Zéro à plusieurs tâches ; une tâche appartient à un projet. |
| Matériel ↔ catégorie | Zéro à plusieurs de chaque côté. |
| Matériel → réservations | Plusieurs réservations dans le temps, aucune pour le non-individualisé. |
| Projet → réservations | Zéro à plusieurs ; chaque réservation concerne un seul projet. |
| Réservation → réservant | Un auteur de création ; les autres membres peuvent ensuite agir. |
| Matériel → historique | Événements conservés après suppression/archivage. |
| Notification → destinataires | Un ou plusieurs, avec état individuel de lecture. |

Les archives de projets sont conservées indéfiniment pour le moment. Aucune durée précise n’est fixée pour l’historique matériel/réservations ou les notifications. Sauvegarde et restauration technique sont à spécifier ; elles ne créent pas de fonction de restauration d’un matériel supprimé.
