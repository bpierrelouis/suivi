CREATE TYPE "VisibiliteProjet" AS ENUM ('public', 'prive');
CREATE TYPE "StatutProjet" AS ENUM ('actif', 'archive');

CREATE TABLE "projets" (
  "id" UUID NOT NULL,
  "nom" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "visibilite" "VisibiliteProjet" NOT NULL,
  "statut" "StatutProjet" NOT NULL DEFAULT 'actif',
  "date_debut" DATE,
  "date_fin" DATE,
  "responsable_id" UUID NOT NULL,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "projets_responsable_id_fkey"
    FOREIGN KEY ("responsable_id") REFERENCES "utilisateurs"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "participations_projets" (
  "projet_id" UUID NOT NULL,
  "utilisateur_id" UUID NOT NULL,
  "rejoint_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "participations_projets_pkey" PRIMARY KEY ("projet_id", "utilisateur_id"),
  CONSTRAINT "participations_projets_projet_id_fkey"
    FOREIGN KEY ("projet_id") REFERENCES "projets"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "participations_projets_utilisateur_id_fkey"
    FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "projets_statut_visibilite_idx" ON "projets"("statut", "visibilite");
CREATE INDEX "participations_projets_utilisateur_id_idx" ON "participations_projets"("utilisateur_id");
