import { verifySessionToken } from "../services/auth.service.js";

export function requireSession(req, res, next) {
  const token = req.cookies.suivi_session;
  if (!token) return res.status(401).json({ error: "AUTHENTIFICATION_REQUISE" });

  try {
    const session = verifySessionToken(token);
    req.utilisateur = {
      id: session.id,
      identifiant: session.identifiant,
      role: session.role,
    };
    next();
  } catch {
    res.clearCookie("suivi_session");
    return res.status(401).json({ error: "SESSION_INVALIDE" });
  }
}
