ALTER TYPE "TypeEvenementMateriel" ADD VALUE 'archivage';

CREATE TYPE "StatutReservation" AS ENUM ('active', 'annulee', 'liberee');
CREATE TYPE "TypeEvenementReservation" AS ENUM ('creation', 'modification', 'annulation', 'liberation');
CREATE TYPE "TypeEvenementProjet" AS ENUM ('creation', 'modification', 'ajout_membre', 'retrait_membre', 'creation_tache', 'modification_tache', 'suppression_tache', 'archivage');
CREATE TYPE "TypeNotification" AS ENUM ('materiel_archive', 'reservation_liberee');

ALTER TABLE "materiels" ADD COLUMN "archive_le" TIMESTAMPTZ(3);
ALTER TABLE "materiels" ADD COLUMN "archive_par_id" UUID;

CREATE TABLE "reservations" (
  "id" UUID NOT NULL,
  "materiel_id" UUID NOT NULL,
  "projet_id" UUID NOT NULL,
  "reserve_par_id" UUID NOT NULL,
  "debut" TIMESTAMPTZ(3) NOT NULL,
  "fin" TIMESTAMPTZ(3) NOT NULL,
  "statut" "StatutReservation" NOT NULL DEFAULT 'active',
  "annule_le" TIMESTAMPTZ(3),
  "annule_par_id" UUID,
  "motif_annulation" TEXT,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifie_le" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "reservations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reservations_intervalle_valide" CHECK ("fin" > "debut")
);

CREATE TABLE "historique_reservations" (
  "id" UUID NOT NULL,
  "reservation_id" UUID NOT NULL,
  "type" "TypeEvenementReservation" NOT NULL,
  "details" JSONB,
  "auteur_id" UUID,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historique_reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "historique_projets" (
  "id" UUID NOT NULL,
  "projet_id" UUID NOT NULL,
  "type" "TypeEvenementProjet" NOT NULL,
  "details" JSONB,
  "auteur_id" UUID,
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historique_projets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" UUID NOT NULL,
  "destinataire_id" UUID NOT NULL,
  "type" "TypeNotification" NOT NULL,
  "titre" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "details" JSONB,
  "lu_le" TIMESTAMPTZ(3),
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "reservations_projet_id_debut_idx" ON "reservations"("projet_id", "debut");
CREATE INDEX "reservations_materiel_id_debut_idx" ON "reservations"("materiel_id", "debut");
CREATE INDEX "historique_reservations_reservation_id_cree_le_idx" ON "historique_reservations"("reservation_id", "cree_le");
CREATE INDEX "historique_projets_projet_id_cree_le_idx" ON "historique_projets"("projet_id", "cree_le");
CREATE INDEX "notifications_destinataire_id_lu_le_cree_le_idx" ON "notifications"("destinataire_id", "lu_le", "cree_le");

ALTER TABLE "materiels" ADD CONSTRAINT "materiels_archive_par_id_fkey" FOREIGN KEY ("archive_par_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "materiels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reserve_par_id_fkey" FOREIGN KEY ("reserve_par_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_annule_par_id_fkey" FOREIGN KEY ("annule_par_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historique_reservations" ADD CONSTRAINT "historique_reservations_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historique_reservations" ADD CONSTRAINT "historique_reservations_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historique_projets" ADD CONSTRAINT "historique_projets_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historique_projets" ADD CONSTRAINT "historique_projets_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataire_id_fkey" FOREIGN KEY ("destinataire_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_sans_chevauchement"
  EXCLUDE USING gist (
    "materiel_id" WITH =,
    tstzrange("debut", "fin", '[)') WITH &&
  ) WHERE ("statut" = 'active');
