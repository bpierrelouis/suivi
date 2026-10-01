-- Écart assumé avec le dictionnaire de données (aucune quantité précise pour le non-individualisé
-- n'y est prévue) : ajouté à la demande du client pour piloter la rupture et son signalement.
-- Voir D-20 dans decisions-et-questions.md.

ALTER TABLE "materiels" ADD COLUMN "quantite" INTEGER;
ALTER TABLE "materiels" ADD COLUMN "seuil_alerte" INTEGER;

CREATE TYPE "StatutDemandeReapprovisionnement" AS ENUM ('nouvelle', 'traitee');

CREATE TABLE "demandes_reapprovisionnement" (
  "id" UUID NOT NULL,
  "materiel_id" UUID NOT NULL,
  "demande_par_id" UUID NOT NULL,
  "statut" "StatutDemandeReapprovisionnement" NOT NULL DEFAULT 'nouvelle',
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "traitee_le" TIMESTAMPTZ(3),
  "traitee_par_id" UUID,
  CONSTRAINT "demandes_reapprovisionnement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "demandes_reapprovisionnement_materiel_id_statut_idx" ON "demandes_reapprovisionnement"("materiel_id", "statut");

ALTER TABLE "demandes_reapprovisionnement" ADD CONSTRAINT "demandes_reapprovisionnement_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "materiels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demandes_reapprovisionnement" ADD CONSTRAINT "demandes_reapprovisionnement_demande_par_id_fkey" FOREIGN KEY ("demande_par_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "demandes_reapprovisionnement" ADD CONSTRAINT "demandes_reapprovisionnement_traitee_par_id_fkey" FOREIGN KEY ("traitee_par_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
