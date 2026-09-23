-- Schéma initial SUIVI — voir docs/dictionnaire-donnees.md pour le détail métier.
-- Volontairement absent de ce schéma (questions ouvertes non arbitrées) : type de matériel (Q-08),
-- quantité/localisation du matériel non individualisé, notifications, réservations.

CREATE TABLE utilisateurs (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  identifiant     TEXT NOT NULL UNIQUE,
  mot_de_passe    TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('administrateur', 'gestionnaire', 'utilisateur')) DEFAULT 'utilisateur',
  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un seul administrateur, zéro ou un gestionnaire (RG du dictionnaire de données).
CREATE UNIQUE INDEX un_seul_administrateur ON utilisateurs (role) WHERE role = 'administrateur';
CREATE UNIQUE INDEX un_seul_gestionnaire ON utilisateurs (role) WHERE role = 'gestionnaire';

CREATE TABLE categories (
  id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  libelle  TEXT NOT NULL UNIQUE
);

CREATE TABLE materiel (
  id                      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom                     TEXT NOT NULL,
  mode_suivi              TEXT CHECK (mode_suivi IN ('individualise', 'non_individualise')),
  numero_serie            TEXT,
  reference_constructeur  TEXT,
  numero_inventaire       TEXT,
  est_archive             BOOLEAN NOT NULL DEFAULT false,
  archive_le              TIMESTAMPTZ,
  archive_par             INTEGER REFERENCES utilisateurs(id),
  cree_le                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE materiel_categories (
  materiel_id   INTEGER NOT NULL REFERENCES materiel(id) ON DELETE CASCADE,
  categorie_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (materiel_id, categorie_id)
);

CREATE TABLE projets (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom          TEXT NOT NULL,
  description  TEXT NOT NULL,
  visibilite   TEXT NOT NULL CHECK (visibilite IN ('public', 'prive')),
  createur_id  INTEGER NOT NULL REFERENCES utilisateurs(id),
  date_debut   DATE,
  date_fin     DATE,
  est_archive  BOOLEAN NOT NULL DEFAULT false,
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un utilisateur au rôle gestionnaire ne peut pas être membre d'un projet (RG du dictionnaire) :
-- règle vérifiée côté application, une contrainte SQL portant sur une autre table n'étant pas possible ici.
CREATE TABLE projet_participants (
  projet_id       INTEGER NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  utilisateur_id  INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  rejoint_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (projet_id, utilisateur_id)
);

CREATE TABLE taches (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  projet_id       INTEGER NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  titre           TEXT NOT NULL,
  description     TEXT,
  colonne         TEXT NOT NULL CHECK (colonne IN ('a_faire', 'en_cours', 'fait')) DEFAULT 'a_faire',
  responsable_id  INTEGER REFERENCES utilisateurs(id),
  ordre           INTEGER,
  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE historique_projet (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  projet_id    INTEGER NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  auteur_id    INTEGER NOT NULL REFERENCES utilisateurs(id),
  horodatage   TIMESTAMPTZ NOT NULL DEFAULT now(),
  nature       TEXT NOT NULL,
  detail       TEXT
);

CREATE INDEX idx_taches_projet ON taches (projet_id);
CREATE INDEX idx_historique_projet_projet ON historique_projet (projet_id);
CREATE INDEX idx_materiel_categories_categorie ON materiel_categories (categorie_id);
