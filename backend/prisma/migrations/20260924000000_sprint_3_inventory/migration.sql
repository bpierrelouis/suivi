CREATE TYPE "ModeSuiviMateriel" AS ENUM ('individualise', 'non_individualise');
CREATE TYPE "StatutMateriel" AS ENUM ('actif', 'archive');
CREATE TYPE "TypeEvenementMateriel" AS ENUM ('creation', 'modification', 'ajout_piece_jointe', 'retrait_piece_jointe');

CREATE TABLE "materiels" (
  "id" UUID NOT NULL,
  "nom" TEXT NOT NULL,
  "mode_suivi" "ModeSuiviMateriel" NOT NULL DEFAULT 'individualise',
  "numero_serie" TEXT,
  "reference_constructeur" TEXT,
  "numero_inventaire" TEXT,
  "statut" "StatutMateriel" NOT NULL DEFAULT 'actif',
  "auteur_creation_id" UUID NOT NULL,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "materiels_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "categories" (
  "id" UUID NOT NULL,
  "nom" TEXT NOT NULL,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "materiels_categories" (
  "materiel_id" UUID NOT NULL,
  "categorie_id" UUID NOT NULL,
  CONSTRAINT "materiels_categories_pkey" PRIMARY KEY ("materiel_id", "categorie_id")
);
CREATE TABLE "historique_materiels" (
  "id" UUID NOT NULL,
  "materiel_id" UUID NOT NULL,
  "type" "TypeEvenementMateriel" NOT NULL,
  "details" JSONB,
  "auteur_id" UUID NOT NULL,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historique_materiels_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "pieces_jointes_materiels" (
  "id" UUID NOT NULL,
  "materiel_id" UUID NOT NULL,
  "nom_fichier" TEXT NOT NULL,
  "type_mime" TEXT NOT NULL,
  "taille" INTEGER NOT NULL,
  "contenu" BYTEA NOT NULL,
  "auteur_id" UUID NOT NULL,
  "ajoute_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pieces_jointes_materiels_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "categories_nom_key" ON "categories"("nom");
CREATE INDEX "materiels_statut_nom_idx" ON "materiels"("statut", "nom");
CREATE INDEX "materiels_categories_categorie_id_idx" ON "materiels_categories"("categorie_id");
CREATE INDEX "historique_materiels_materiel_id_cree_le_idx" ON "historique_materiels"("materiel_id", "cree_le");
CREATE INDEX "pieces_jointes_materiels_materiel_id_ajoute_le_idx" ON "pieces_jointes_materiels"("materiel_id", "ajoute_le");
ALTER TABLE "materiels" ADD CONSTRAINT "materiels_auteur_creation_id_fkey" FOREIGN KEY ("auteur_creation_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "materiels_categories" ADD CONSTRAINT "materiels_categories_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "materiels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "materiels_categories" ADD CONSTRAINT "materiels_categories_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historique_materiels" ADD CONSTRAINT "historique_materiels_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "materiels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historique_materiels" ADD CONSTRAINT "historique_materiels_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pieces_jointes_materiels" ADD CONSTRAINT "pieces_jointes_materiels_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "materiels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pieces_jointes_materiels" ADD CONSTRAINT "pieces_jointes_materiels_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
