import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertAccount(identifiant, password, role, preserveRole = false) {
  const motDePasse = await bcrypt.hash(password, 12);
  return prisma.utilisateur.upsert({
    where: { identifiant },
    update: { motDePasse, ...(!preserveRole ? { role } : {}) },
    create: { identifiant, motDePasse, role },
  });
}

async function upsertProjet({ id, nom, description, visibilite, responsable, membres }) {
  await prisma.projet.upsert({
    where: { id },
    update: { nom, description, visibilite, responsableId: responsable.id },
    create: {
      id,
      nom,
      description,
      visibilite,
      responsableId: responsable.id,
    },
  });

  await prisma.participation.createMany({
    data: membres.map((utilisateur) => ({ projetId: id, utilisateurId: utilisateur.id })),
    skipDuplicates: true,
  });
  await prisma.documentationProjet.upsert({
    where: { projetId: id },
    update: {},
    create: {
      projetId: id,
      auteurId: responsable.id,
      contenu: `# ${nom}\n\n${description}\n\n## Objectifs\n\n- Centraliser le suivi\n- Faciliter la collaboration`,
    },
  });
}

async function upsertMateriel({ id, nom, modeSuivi, numeroSerie, referenceConstructeur, numeroInventaire, auteur, categories }) {
  const categoryRows = [];
  for (const categoryName of categories) {
    categoryRows.push(await prisma.categorie.upsert({ where: { nom: categoryName }, update: {}, create: { nom: categoryName } }));
  }
  const materiel = await prisma.materiel.upsert({
    where: { id },
    update: { nom, modeSuivi, numeroSerie, referenceConstructeur, numeroInventaire },
    create: { id, nom, modeSuivi, numeroSerie, referenceConstructeur, numeroInventaire, auteurCreationId: auteur.id },
  });
  await prisma.materielCategorie.createMany({ data: categoryRows.map((category) => ({ materielId: id, categorieId: category.id })), skipDuplicates: true });
  const historyCount = await prisma.historiqueMateriel.count({ where: { materielId: id } });
  if (!historyCount) await prisma.historiqueMateriel.create({ data: { materielId: id, auteurId: auteur.id, type: "creation", details: { nom } } });
  return materiel;
}

try {
  await upsertAccount("admin", process.env.ADMIN_PASSWORD, "administrateur");
  const gestionnaireExistant = await prisma.utilisateur.findFirst({ where: { role: "gestionnaire" }, select: { id: true } });
  await upsertAccount("gestionnaire", process.env.MANAGER_PASSWORD, gestionnaireExistant ? "utilisateur" : "gestionnaire", Boolean(gestionnaireExistant));
  const lea = await upsertAccount("lea.fournier@demo.local", process.env.SIMULATED_PASSWORD, "utilisateur", true);
  const marc = await upsertAccount("marc.vidal@demo.local", process.env.SIMULATED_PASSWORD, "utilisateur", true);

  await upsertProjet({
    id: "10000000-0000-4000-8000-000000000001",
    nom: "Modernisation du laboratoire",
    description: "Moderniser les équipements et les usages du laboratoire.",
    visibilite: "public",
    responsable: lea,
    membres: [lea],
  });
  await upsertProjet({
    id: "10000000-0000-4000-8000-000000000002",
    nom: "Migration des postes de mesure",
    description: "Préparer et suivre la migration des postes de mesure.",
    visibilite: "prive",
    responsable: lea,
    membres: [lea],
  });
  await upsertProjet({
    id: "10000000-0000-4000-8000-000000000003",
    nom: "Réorganisation du stock",
    description: "Réorganiser le stock et fiabiliser son suivi.",
    visibilite: "prive",
    responsable: marc,
    membres: [marc],
  });

  await prisma.tache.createMany({
    data: [
      {
        id: "20000000-0000-4000-8000-000000000001",
        projetId: "10000000-0000-4000-8000-000000000001",
        titre: "Recenser les besoins",
        description: "Consolider les besoins des équipes du laboratoire.",
        etat: "terminee",
        responsableId: lea.id,
        ordre: 0,
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        projetId: "10000000-0000-4000-8000-000000000001",
        titre: "Préparer le plan de déploiement",
        description: "Définir les étapes et les responsabilités.",
        etat: "en_cours",
        responsableId: lea.id,
        ordre: 0,
      },
    ],
    skipDuplicates: true,
  });

  await upsertMateriel({ id: "30000000-0000-4000-8000-000000000001", nom: "Oscilloscope MSO-4", modeSuivi: "individualise", numeroSerie: "MSO4-042", referenceConstructeur: "MSO44", numeroInventaire: "INV-0042", auteur: await prisma.utilisateur.findUnique({ where: { identifiant: "admin" } }), categories: ["Mesure", "Électronique"] });
  await upsertMateriel({ id: "30000000-0000-4000-8000-000000000002", nom: "Caméra thermique X2", modeSuivi: "individualise", numeroSerie: "TH-X2-117", referenceConstructeur: "X2", numeroInventaire: "INV-0117", auteur: await prisma.utilisateur.findUnique({ where: { identifiant: "admin" } }), categories: ["Imagerie"] });
  await upsertMateriel({ id: "30000000-0000-4000-8000-000000000003", nom: "Kit optique 532 nm", modeSuivi: "non_individualise", numeroSerie: null, referenceConstructeur: "KIT-532", numeroInventaire: null, auteur: await prisma.utilisateur.findUnique({ where: { identifiant: "admin" } }), categories: ["Optique"] });

  console.log("Données de démonstration des Sprints 1 à 3 initialisées.");
} finally {
  await prisma.$disconnect();
}
