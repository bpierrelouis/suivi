-- D-22 : ajout de la colonne Kanban "En revue" entre "En cours" et "Fait".
ALTER TYPE "EtatTache" ADD VALUE 'en_revue' BEFORE 'terminee';
