import { z } from "zod";
import { env } from "../config/env.js";
import { authenticate, changerMotDePasse, createSessionToken } from "../services/auth.service.js";

const loginSchema = z.object({
  identifiant: z.string().trim().min(1).max(254),
  motDePasse: z.string().min(1).max(256),
});

const changePasswordSchema = z
  .object({
    motDePasseActuel: z.string().min(1).max(256),
    nouveauMotDePasse: z.string().min(8).max(200),
  })
  .strict();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "IDENTIFIANTS_REQUIS" });

  const utilisateur = await authenticate(parsed.data);
  if (!utilisateur) return res.status(401).json({ error: "IDENTIFIANTS_INVALIDES" });

  res.cookie("suivi_session", createSessionToken(utilisateur), cookieOptions);
  res.json({ utilisateur });
}

export function me(req, res) {
  res.json({ utilisateur: req.utilisateur });
}

export function logout(req, res) {
  res.clearCookie("suivi_session", { ...cookieOptions, maxAge: undefined });
  res.status(204).send();
}

export async function updatePassword(req, res) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "DONNEES_INVALIDES" });

  await changerMotDePasse(req.utilisateur.id, parsed.data.motDePasseActuel, parsed.data.nouveauMotDePasse);
  res.status(204).send();
}
