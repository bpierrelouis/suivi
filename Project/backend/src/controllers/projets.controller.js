import { pool } from "../config/db.js";

export async function listProjets(req, res) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nom, p.description, p.visibilite, p.est_archive,
            p.date_debut, p.date_fin, u.identifiant AS createur
     FROM projets p
     JOIN utilisateurs u ON u.id = p.createur_id
     ORDER BY p.cree_le DESC`
  );
  res.json(rows);
}

export async function getProjet(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT p.id, p.nom, p.description, p.visibilite, p.est_archive,
            p.date_debut, p.date_fin, u.identifiant AS createur
     FROM projets p
     JOIN utilisateurs u ON u.id = p.createur_id
     WHERE p.id = $1`,
    [id]
  );

  if (!rows.length) return res.status(404).json({ error: "Projet introuvable." });
  res.json(rows[0]);
}

export async function createProjet(req, res) {
  const { nom, description, visibilite, createur_id, date_debut, date_fin } = req.body;

  if (!nom || !description || !visibilite || !createur_id) {
    return res.status(400).json({ error: "nom, description, visibilite et createur_id sont requis." });
  }
  if (!["public", "prive"].includes(visibilite)) {
    return res.status(400).json({ error: "visibilite doit valoir 'public' ou 'prive'." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO projets (nom, description, visibilite, createur_id, date_debut, date_fin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, description, visibilite, est_archive, date_debut, date_fin`,
      [nom, description, visibilite, createur_id, date_debut ?? null, date_fin ?? null]
    );
    const projet = rows[0];

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail)
       VALUES ($1, $2, 'creation', $3)`,
      [projet.id, createur_id, `Création du projet "${nom}".`]
    );

    await client.query("COMMIT");
    res.status(201).json(projet);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23503") return res.status(400).json({ error: "createur_id ne correspond à aucun utilisateur." });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function updateProjet(req, res) {
  const { id } = req.params;
  const { nom, description, visibilite, date_debut, date_fin, auteur_id } = req.body;

  if (!auteur_id) return res.status(400).json({ error: "auteur_id est requis pour tracer la modification." });
  if (visibilite && !["public", "prive"].includes(visibilite)) {
    return res.status(400).json({ error: "visibilite doit valoir 'public' ou 'prive'." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE projets SET
         nom = COALESCE($1, nom),
         description = COALESCE($2, description),
         visibilite = COALESCE($3, visibilite),
         date_debut = COALESCE($4, date_debut),
         date_fin = COALESCE($5, date_fin)
       WHERE id = $6 AND est_archive = false
       RETURNING id, nom, description, visibilite, est_archive, date_debut, date_fin`,
      [nom ?? null, description ?? null, visibilite ?? null, date_debut ?? null, date_fin ?? null, id]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Projet introuvable ou archivé." });
    }

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail)
       VALUES ($1, $2, $3, $4)`,
      [id, auteur_id, visibilite ? "visibilite" : "informations", "Modification des informations du projet."]
    );

    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function archiveProjet(req, res) {
  const { id } = req.params;
  const { auteur_id } = req.body;

  if (!auteur_id) return res.status(400).json({ error: "auteur_id est requis pour tracer l'archivage." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE projets SET est_archive = true WHERE id = $1 AND est_archive = false RETURNING id`,
      [id]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Projet introuvable ou déjà archivé." });
    }

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail)
       VALUES ($1, $2, 'cloture_archivage', 'Clôture / archivage du projet.')`,
      [id, auteur_id]
    );

    await client.query("COMMIT");
    res.status(204).send();
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
