import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertAccount(identifiant, password, role) {
  const motDePasse = await bcrypt.hash(password, 12);
  await prisma.utilisateur.upsert({
    where: { identifiant },
    update: { motDePasse, role },
    create: { identifiant, motDePasse, role },
  });
}

try {
  await upsertAccount("admin", process.env.ADMIN_PASSWORD, "administrateur");
  await upsertAccount("gestionnaire@demo.local", process.env.MANAGER_PASSWORD, "gestionnaire");
  console.log("Comptes de démonstration du Sprint 1 initialisés.");
} finally {
  await prisma.$disconnect();
}
