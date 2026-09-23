import { verifySessionToken } from "../services/auth.service.js";
import { findUtilisateurById } from "../repositories/utilisateur.repository.js";

export async function requireSession(req, res, next) {
  const token = req.cookies.suivi_session;
  if (!token) return res.status(401).json({ error: "AUTHENTIFICATION_REQUISE" });

  try {
    const session = verifySessionToken(token);
    const utilisateur = await findUtilisateurById(session.id);
    if (!utilisateur) throw new Error("Utilisateur introuvable");
    req.utilisateur = utilisateur;
    next();
  } catch {
    res.clearCookie("suivi_session");
    return res.status(401).json({ error: "SESSION_INVALIDE" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ error: "ACCES_INTERDIT" });
    }
    next();
  };
}
