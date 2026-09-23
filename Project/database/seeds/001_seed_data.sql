-- Données de test SUIVI.
-- mot_de_passe : placeholders (pas de vrais hachages) — le hachage réel arrivera avec la fonctionnalité d'authentification.

INSERT INTO utilisateurs (identifiant, mot_de_passe, role) VALUES
  ('alexandre.s@labo.fr',    'seed_placeholder_hash', 'administrateur'),
  ('camille.dore@labo.fr',   'seed_placeholder_hash', 'gestionnaire'),
  ('lea.fournier@labo.fr',   'seed_placeholder_hash', 'utilisateur'),
  ('marc.vidal@labo.fr',     'seed_placeholder_hash', 'utilisateur'),
  ('yanis.belkacem@labo.fr', 'seed_placeholder_hash', 'utilisateur');

INSERT INTO categories (libelle) VALUES
  ('Matières premières'),
  ('Composants'),
  ('Consommables');

INSERT INTO materiel (nom, mode_suivi, numero_serie, reference_constructeur, numero_inventaire) VALUES
  ('Profilé aluminium 40x40',       'non_individualise', NULL,          'PRO-AL-4040', 'REF-1024'),
  ('Tôle acier galvanisée 2m',      'non_individualise', NULL,          'TAG-2000',    'REF-1038'),
  ('Roulement à billes 6204',       'individualise',     'RB6204-0091', '6204-2RS',    'REF-2087'),
  ('Vérin pneumatique EV220',       'individualise',     'EV220-0044', 'EV220',       'REF-2092'),
  ('Carton triple cannelure',       'non_individualise', NULL,          'CTC-STD',     'REF-3044');

INSERT INTO materiel_categories (materiel_id, categorie_id) VALUES
  (1, 1), (2, 1),
  (3, 2), (4, 2),
  (5, 3);

INSERT INTO projets (nom, description, visibilite, createur_id, date_debut, date_fin) VALUES
  ('Refonte entrepôt Nord', 'Réorganisation complète des zones de stockage et mise à jour du plan d''implantation.', 'public', 2, '2026-08-01', '2026-10-12'),
  ('Migration ERP',         'Migration des données de gestion de stock vers le nouvel ERP.',                        'prive',  1, '2026-09-01', '2026-09-29'),
  ('Audit stock saisonnier','Contrôle et audit du stock avant la saison haute.',                                    'public', 2, '2026-09-15', '2026-10-14');

INSERT INTO projet_participants (projet_id, utilisateur_id) VALUES
  (1, 3), (1, 4),
  (2, 5),
  (3, 3);

INSERT INTO taches (projet_id, titre, description, colonne, responsable_id, ordre) VALUES
  (1, 'Baliser les zones de la zone B',            NULL, 'a_faire',  3, 1),
  (1, 'Commander les racks modulables',            NULL, 'a_faire',  4, 2),
  (1, 'Cartographier les flux de picking',         NULL, 'en_cours', 3, 1),
  (1, 'Réunion de cadrage',                        NULL, 'fait',     2, 1),
  (2, 'Recenser les références actives dans l''ERP', NULL, 'a_faire', 5, 1);

INSERT INTO historique_projet (projet_id, auteur_id, nature, detail) VALUES
  (1, 2, 'creation',   'Création du projet "Refonte entrepôt Nord".'),
  (1, 2, 'membres',    'Ajout de Léa Fournier et Marc Vidal comme membres.'),
  (2, 1, 'creation',   'Création du projet "Migration ERP".'),
  (3, 2, 'creation',   'Création du projet "Audit stock saisonnier".');
