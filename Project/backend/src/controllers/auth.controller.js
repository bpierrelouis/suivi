import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// Hash bcrypt aléatoire, jamais valide pour un vrai mot de passe : comparer systématiquement
// contre un hash (même quand l'identifiant n'existe pas) évite qu'un attaquant déduise si un
// identifiant existe en mesurant le temps de réponse.
const DUMMY_HASH = "$2b$12$CwTycUXWue0Thq9StjUM0uJ8U5CzRQAP0dEIvaWY7q3iUMlvhY4Rq";

export async function login(req, res) {
  const { identifiant, mot_de_passe } = req.body;

  if (!identifiant || !mot_de_passe) {
    return res.status(400).json({ error: "identifiant et mot_de_passe sont requis." });
  }

  const { rows } = await pool.query(
    `SELECT id, identifiant, mot_de_passe, role FROM utilisateurs WHERE identifiant = $1`,
    [identifiant]
  );
  const utilisateur = rows[0];

  const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur?.mot_de_passe ?? DUMMY_HASH);

  if (!utilisateur || !motDePasseValide) {
    return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
  }

  const token = jwt.sign(
    { id: utilisateur.id, identifiant: utilisateur.identifiant, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    utilisateur: { id: utilisateur.id, identifiant: utilisateur.identifiant, role: utilisateur.role },
  });
}
