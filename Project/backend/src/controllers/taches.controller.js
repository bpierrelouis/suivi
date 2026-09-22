import { pool } from "../config/db.js";

const COLONNES = ["a_faire", "en_cours", "fait"];

export async function listTachesParProjet(req, res) {
  const { projetId } = req.params;
  const { rows } = await pool.query(
    `SELECT t.id, t.projet_id, t.titre, t.description, t.colonne, t.ordre,
            u.identifiant AS responsable
     FROM taches t
     LEFT JOIN utilisateurs u ON u.id = t.responsable_id
     WHERE t.projet_id = $1
     ORDER BY t.colonne, t.ordre NULLS LAST, t.cree_le`,
    [projetId]
  );
  res.json(rows);
}

export async function createTache(req, res) {
  const { projetId } = req.params;
  const { titre, description, colonne, responsable_id, ordre, auteur_id } = req.body;

  if (!titre) return res.status(400).json({ error: "titre est requis." });
  if (colonne && !COLONNES.includes(colonne)) {
    return res.status(400).json({ error: `colonne doit valoir ${COLONNES.join(", ")}.` });
  }
  if (!auteur_id) return res.status(400).json({ error: "auteur_id est requis pour tracer la modification." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO taches (projet_id, titre, description, colonne, responsable_id, ordre)
       VALUES ($1, $2, $3, COALESCE($4, 'a_faire'), $5, $6)
       RETURNING id, projet_id, titre, description, colonne, responsable_id, ordre`,
      [projetId, titre, description ?? null, colonne ?? null, responsable_id ?? null, ordre ?? null]
    );

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail) VALUES ($1, $2, 'taches', $3)`,
      [projetId, auteur_id, `Ajout de la tâche "${titre}".`]
    );

    await client.query("COMMIT");
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23503") return res.status(400).json({ error: "projet_id ou responsable_id invalide." });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function updateTache(req, res) {
  const { id } = req.params;
  const { titre, description, colonne, responsable_id, ordre, auteur_id } = req.body;

  if (colonne && !COLONNES.includes(colonne)) {
    return res.status(400).json({ error: `colonne doit valoir ${COLONNES.join(", ")}.` });
  }
  if (!auteur_id) return res.status(400).json({ error: "auteur_id est requis pour tracer la modification." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE taches SET
         titre = COALESCE($1, titre),
         description = COALESCE($2, description),
         colonne = COALESCE($3, colonne),
         responsable_id = COALESCE($4, responsable_id),
         ordre = COALESCE($5, ordre)
       WHERE id = $6
       RETURNING id, projet_id, titre, description, colonne, responsable_id, ordre`,
      [titre ?? null, description ?? null, colonne ?? null, responsable_id ?? null, ordre ?? null, id]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tâche introuvable." });
    }
    const tache = rows[0];

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail) VALUES ($1, $2, 'taches', $3)`,
      [tache.projet_id, auteur_id, `Modification de la tâche "${tache.titre}".`]
    );

    await client.query("COMMIT");
    res.json(tache);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23503") return res.status(400).json({ error: "responsable_id invalide." });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

// Suppression définitive : le dictionnaire de données laisse ce comportement ouvert (Q-26,
// conservation des tâches non terminées lors de l'archivage). À revoir si la règle est tranchée.
export async function deleteTache(req, res) {
  const { id } = req.params;
  const { auteur_id } = req.body;

  if (!auteur_id) return res.status(400).json({ error: "auteur_id est requis pour tracer la modification." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`DELETE FROM taches WHERE id = $1 RETURNING projet_id, titre`, [id]);

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tâche introuvable." });
    }
    const { projet_id, titre } = rows[0];

    await client.query(
      `INSERT INTO historique_projet (projet_id, auteur_id, nature, detail) VALUES ($1, $2, 'taches', $3)`,
      [projet_id, auteur_id, `Suppression de la tâche "${titre}".`]
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
