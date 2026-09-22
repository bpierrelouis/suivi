import { pool } from "../config/db.js";

const MODES_SUIVI = ["individualise", "non_individualise"];

export async function listMateriel(req, res) {
  const { rows } = await pool.query(
    `SELECT m.id, m.nom, m.mode_suivi, m.numero_serie, m.reference_constructeur,
            m.numero_inventaire, m.est_archive,
            COALESCE(array_agg(c.libelle) FILTER (WHERE c.libelle IS NOT NULL), '{}') AS categories
     FROM materiel m
     LEFT JOIN materiel_categories mc ON mc.materiel_id = m.id
     LEFT JOIN categories c ON c.id = mc.categorie_id
     GROUP BY m.id
     ORDER BY m.cree_le DESC`
  );
  res.json(rows);
}

export async function createMateriel(req, res) {
  const { nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire, categorie_ids } = req.body;

  if (!nom) return res.status(400).json({ error: "nom est requis." });
  if (mode_suivi && !MODES_SUIVI.includes(mode_suivi)) {
    return res.status(400).json({ error: `mode_suivi doit valoir ${MODES_SUIVI.join(" ou ")}.` });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO materiel (nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire, est_archive`,
      [nom, mode_suivi ?? null, numero_serie ?? null, reference_constructeur ?? null, numero_inventaire ?? null]
    );
    const materiel = rows[0];

    if (Array.isArray(categorie_ids) && categorie_ids.length) {
      const values = categorie_ids.map((_, i) => `($1, $${i + 2})`).join(", ");
      await client.query(
        `INSERT INTO materiel_categories (materiel_id, categorie_id) VALUES ${values}`,
        [materiel.id, ...categorie_ids]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ ...materiel, categories: categorie_ids ?? [] });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23503") return res.status(400).json({ error: "categorie_ids contient une référence invalide." });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function updateMateriel(req, res) {
  const { id } = req.params;
  const { nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire, categorie_ids } = req.body;

  if (mode_suivi && !MODES_SUIVI.includes(mode_suivi)) {
    return res.status(400).json({ error: `mode_suivi doit valoir ${MODES_SUIVI.join(" ou ")}.` });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE materiel SET
         nom = COALESCE($1, nom),
         mode_suivi = COALESCE($2, mode_suivi),
         numero_serie = COALESCE($3, numero_serie),
         reference_constructeur = COALESCE($4, reference_constructeur),
         numero_inventaire = COALESCE($5, numero_inventaire)
       WHERE id = $6 AND est_archive = false
       RETURNING id, nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire, est_archive`,
      [nom ?? null, mode_suivi ?? null, numero_serie ?? null, reference_constructeur ?? null, numero_inventaire ?? null, id]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Matériel introuvable ou archivé." });
    }

    if (Array.isArray(categorie_ids)) {
      await client.query(`DELETE FROM materiel_categories WHERE materiel_id = $1`, [id]);
      if (categorie_ids.length) {
        const values = categorie_ids.map((_, i) => `($1, $${i + 2})`).join(", ");
        await client.query(
          `INSERT INTO materiel_categories (materiel_id, categorie_id) VALUES ${values}`,
          [id, ...categorie_ids]
        );
      }
    }

    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23503") return res.status(400).json({ error: "categorie_ids contient une référence invalide." });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function archiveMateriel(req, res) {
  const { id } = req.params;
  const { archive_par } = req.body;

  if (!archive_par) return res.status(400).json({ error: "archive_par est requis pour tracer l'archivage." });

  const { rows } = await pool.query(
    `UPDATE materiel SET est_archive = true, archive_le = now(), archive_par = $1
     WHERE id = $2 AND est_archive = false
     RETURNING id`,
    [archive_par, id]
  );

  if (!rows.length) return res.status(404).json({ error: "Matériel introuvable ou déjà archivé." });
  res.status(204).send();
}
