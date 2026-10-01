-- D-21 : gestion complète des comptes par l'administrateur (création, modification, rôle, désactivation).
ALTER TABLE "utilisateurs" ADD COLUMN "actif" BOOLEAN NOT NULL DEFAULT true;
