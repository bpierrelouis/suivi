CREATE TYPE "EtatTache" AS ENUM ('a_faire', 'en_cours', 'terminee');

CREATE TABLE "taches" (
  "id" UUID NOT NULL,
  "projet_id" UUID NOT NULL,
  "titre" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "etat" "EtatTache" NOT NULL DEFAULT 'a_faire',
  "ordre" INTEGER NOT NULL DEFAULT 0,
  "responsable_id" UUID,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "taches_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "taches_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "projets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "taches_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "documentations_projets" (
  "projet_id" UUID NOT NULL,
  "contenu" TEXT NOT NULL DEFAULT '',
  "auteur_id" UUID NOT NULL,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "documentations_projets_pkey" PRIMARY KEY ("projet_id"),
  CONSTRAINT "documentations_projets_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "projets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "documentations_projets_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "taches_projet_id_etat_ordre_idx" ON "taches"("projet_id", "etat", "ordre");
