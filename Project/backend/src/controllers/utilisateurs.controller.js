import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const ROLES = ["administrateur", "gestionnaire", "utilisateur"];
const SALT_ROUNDS = 12;

function messageContrainte(err) {
  if (err.constraint === "utilisateurs_identifiant_key") return "Cet identifiant est déjà utilisé.";
  if (err.constraint === "un_seul_administrateur") return "Il y a déjà un administrateur.";
  if (err.constraint === "un_seul_gestionnaire") return "Il y a déjà un gestionnaire.";
  return "Conflit de données.";
}

export async function listUtilisateurs(req, res) {
  const { rows } = await pool.query(
    `SELECT id, identifiant, role, cree_le FROM utilisateurs ORDER BY cree_le`
  );
  res.json(rows);
}

export async function createUtilisateur(req, res) {
  const { identifiant, mot_de_passe, role } = req.body;

  if (!identifiant || !mot_de_passe) {
    return res.status(400).json({ error: "identifiant et mot_de_passe sont requis." });
  }
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: `role doit valoir ${ROLES.join(", ")}.` });
  }

  try {
    const hash = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
    const { rows } = await pool.query(
      `INSERT INTO utilisateurs (identifiant, mot_de_passe, role)
       VALUES ($1, $2, COALESCE($3, 'utilisateur'))
       RETURNING id, identifiant, role, cree_le`,
      [identifiant, hash, role ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: messageContrainte(err) });
    res.status(500).json({ error: err.message });
  }
}

export async function updateUtilisateur(req, res) {
  const { id } = req.params;
  const { identifiant, role, mot_de_passe } = req.body;

  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: `role doit valoir ${ROLES.join(", ")}.` });
  }

  try {
    const hash = mot_de_passe ? await bcrypt.hash(mot_de_passe, SALT_ROUNDS) : null;
    const { rows } = await pool.query(
      `UPDATE utilisateurs SET
         identifiant = COALESCE($1, identifiant),
         role = COALESCE($2, role),
         mot_de_passe = COALESCE($4, mot_de_passe)
       WHERE id = $3
       RETURNING id, identifiant, role, cree_le`,
      [identifiant ?? null, role ?? null, id, hash]
    );

    if (!rows.length) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: messageContrainte(err) });
    res.status(500).json({ error: err.message });
  }
}
