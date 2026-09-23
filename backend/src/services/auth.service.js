import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {
  createUtilisateur,
  findUtilisateurByIdentifiant,
  markUtilisateurConnected,
} from "../repositories/utilisateur.repository.js";

const DUMMY_HASH = "$2b$12$CwTycUXWue0Thq9StjUM0uJ8U5CzRQAP0dEIvaWY7q3iUMlvhY4Rq";

export function normalizeIdentifiant(value) {
  return value.trim().toLowerCase();
}

function isSimulatedIdentity(identifiant) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifiant);
}

function publicUtilisateur(utilisateur) {
  return {
    id: utilisateur.id,
    identifiant: utilisateur.identifiant,
    role: utilisateur.role,
  };
}

export async function authenticate({ identifiant, motDePasse }) {
  const normalized = normalizeIdentifiant(identifiant);
  let utilisateur = await findUtilisateurByIdentifiant(normalized);

  if (!utilisateur) {
    const simulationValide = isSimulatedIdentity(normalized) && motDePasse === env.SIMULATED_PASSWORD;
    await bcrypt.compare(motDePasse, DUMMY_HASH);

    if (!simulationValide) return null;

    utilisateur = await createUtilisateur({
      identifiant: normalized,
      motDePasse: await bcrypt.hash(motDePasse, 12),
      role: "utilisateur",
    });
  } else {
    const passwordValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!passwordValide) return null;
  }

  utilisateur = await markUtilisateurConnected(utilisateur.id);
  return publicUtilisateur(utilisateur);
}

export function createSessionToken(utilisateur) {
  return jwt.sign(utilisateur, env.JWT_SECRET, {
    expiresIn: env.SESSION_TTL,
    issuer: "suivi-api",
    audience: "suivi-web",
  });
}

export function verifySessionToken(token) {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: "suivi-api",
    audience: "suivi-web",
  });
}
