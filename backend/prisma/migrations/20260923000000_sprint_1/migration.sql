CREATE TYPE "Role" AS ENUM ('administrateur', 'gestionnaire', 'utilisateur');

CREATE TABLE "utilisateurs" (
  "id" UUID NOT NULL,
  "identifiant" TEXT NOT NULL,
  "mot_de_passe" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'utilisateur',
  "cree_le" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "derniere_connexion" TIMESTAMPTZ(3),
  CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "utilisateurs_identifiant_key" ON "utilisateurs"("identifiant");
CREATE UNIQUE INDEX "un_seul_administrateur" ON "utilisateurs"("role") WHERE "role" = 'administrateur';
CREATE UNIQUE INDEX "un_seul_gestionnaire" ON "utilisateurs"("role") WHERE "role" = 'gestionnaire';
