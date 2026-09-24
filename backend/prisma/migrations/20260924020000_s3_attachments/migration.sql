DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "pieces_jointes_materiels") THEN
    RAISE EXCEPTION 'Migration S3 interrompue : exporter les pièces jointes existantes avant de supprimer leur contenu PostgreSQL.';
  END IF;
END $$;

ALTER TABLE "pieces_jointes_materiels"
  ADD COLUMN "cle_objet" TEXT NOT NULL,
  ADD COLUMN "empreinte" TEXT NOT NULL,
  ADD COLUMN "etat" TEXT NOT NULL DEFAULT 'en_attente',
  DROP COLUMN "contenu";

CREATE UNIQUE INDEX "pieces_jointes_materiels_cle_objet_key"
  ON "pieces_jointes_materiels"("cle_objet");
