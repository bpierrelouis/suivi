import { createHash, randomUUID } from "node:crypto";
import { conflict, forbidden, notFound } from "../errors/app.error.js";
import { prepareInventoryRows } from "./inventory-export.service.js";

const MANAGERS = new Set(["administrateur", "gestionnaire"]);

function assertManager(user) {
  if (!MANAGERS.has(user.role)) throw forbidden();
}
function mapMateriel(item, includeAttachments = false) {
  return {
    ...item,
    categories: item.categories.map(({ categorie }) => categorie),
    ...(includeAttachments ? {} : { piecesJointes: undefined }),
  };
}
function safeFilename(value) {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").replace(/[\\/]/g, "-").trim().slice(0, 180);
}
function validateFileMetadata(file) {
  const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
  if (!file.nomFichier || !allowed.has(file.typeMime)) throw conflict("TYPE_FICHIER_INTERDIT");
  if (!Number.isInteger(file.taille) || file.taille <= 0) throw conflict("FICHIER_VIDE");
  if (file.taille > 10 * 1024 * 1024) throw conflict("FICHIER_TROP_VOLUMINEUX");
  if (!/^[a-f0-9]{64}$/i.test(file.empreinte || "")) throw conflict("EMPREINTE_FICHIER_INVALIDE");
  return { ...file, nomFichier: safeFilename(file.nomFichier), empreinte: file.empreinte.toLowerCase() };
}
function validateFileContent(file, contenu) {
  const signatureOk = file.typeMime === "application/pdf"
    ? contenu.subarray(0, 5).toString() === "%PDF-"
    : file.typeMime === "image/png"
      ? contenu.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : contenu[0] === 0xff && contenu[1] === 0xd8 && contenu.at(-2) === 0xff && contenu.at(-1) === 0xd9;
  if (!signatureOk) throw conflict("CONTENU_FICHIER_INVALIDE");
  if (contenu.length !== file.taille || createHash("sha256").update(contenu).digest("hex") !== file.empreinte) throw conflict("EMPREINTE_FICHIER_INVALIDE");
}

function canSeeProject(user, project) {
  return user.role === "administrateur" || (user.role === "utilisateur" && (project.visibilite === "public" || project.participations.some(({ utilisateurId }) => utilisateurId === user.id)));
}

export function createMaterielService(repository, storage) {
  async function requireActive(id) {
    const materiel = await repository.findActiveMaterielById(id);
    if (!materiel) throw notFound("MATERIEL_INTROUVABLE");
    return materiel;
  }
  async function requireArchived(user, id) {
    if (user.role !== "administrateur") throw forbidden("ARCHIVES_MATERIEL_RESERVEES_ADMINISTRATEUR");
    const materiel = await repository.findArchivedMaterielById(id);
    if (!materiel) throw notFound("MATERIEL_INTROUVABLE");
    return materiel;
  }
  async function validateCategories(ids) {
    const unique = [...new Set(ids)];
    if (unique.length && await repository.findCategoriesByIds(unique) !== unique.length) throw conflict("CATEGORIE_INVALIDE");
    return unique;
  }
  return {
    async list(user, filters) {
      const items = await repository.findActiveMateriels(filters);
      return items.map((item) => mapMateriel(item));
    },
    async get(user, id) {
      const item = await requireActive(id);
      return { ...mapMateriel(item, MANAGERS.has(user.role)), droits: { gerer: MANAGERS.has(user.role), voirHistorique: MANAGERS.has(user.role), voirPiecesJointes: MANAGERS.has(user.role) } };
    },
    async listArchived(user, filters) { if (user.role !== "administrateur") throw forbidden("ARCHIVES_MATERIEL_RESERVEES_ADMINISTRATEUR"); return (await repository.findArchivedMateriels(filters)).map((item) => mapMateriel(item)); },
    async getArchived(user, id) { const item = await requireArchived(user, id); return { ...mapMateriel(item, true), droits: { gerer: false, voirHistorique: true, voirPiecesJointes: true }, archive: { le: item.archiveLe, par: item.archivePar } }; },
    async create(user, data) {
      assertManager(user);
      data.categorieIds = await validateCategories(data.categorieIds);
      return repository.createMateriel(data, user.id);
    },
    async update(user, id, data) {
      assertManager(user); await requireActive(id);
      data.categorieIds = await validateCategories(data.categorieIds);
      return repository.updateMateriel(id, data, user.id);
    },
    async history(user, id) { assertManager(user); await requireActive(id); return repository.findMaterielHistory(id); },
    async archivedHistory(user, id) { await requireArchived(user, id); return repository.findMaterielHistory(id); },
    async archive(user, id) { assertManager(user); await requireActive(id); return repository.archiveMateriel(id, user.id); },
    async exportData(user, filters, scope) {
      assertManager(user);
      const effectiveFilters = scope === "all" ? {} : filters;
      const [items, category] = await Promise.all([
        repository.findActiveMaterielsForExport(effectiveFilters),
        effectiveFilters.categorieId ? repository.listCategories().then((rows) => rows.find(({ id }) => id === effectiveFilters.categorieId)) : null,
      ]);
      return { rows: prepareInventoryRows(items, user), filters: { ...effectiveFilters, categorieNom: category?.nom || "" } };
    },
    async calendar(user, debut, fin, materielIds) {
      const items = await repository.findCalendarMateriels(debut, fin, materielIds);
      return items.map((item) => ({
        ...item,
        reservations: item.reservations.map((reservation) => ({
          id: reservation.id, debut: reservation.debut, fin: reservation.fin,
          projet: canSeeProject(user, reservation.projet) ? { id: reservation.projet.id, nom: reservation.projet.nom } : { id: null, nom: "Réservé" },
        })),
      }));
    },
    listCategories() { return repository.listCategories(); },
    async createCategory(user, nom) { assertManager(user); return repository.createCategorie(nom); },
    async updateCategory(user, id, nom) { assertManager(user); return repository.updateCategorie(id, nom); },
    async deleteCategory(user, id) { assertManager(user); return repository.deleteCategorie(id); },
    async authorizeAttachment(user, id, file) {
      assertManager(user); await requireActive(id);
      const metadata = validateFileMetadata(file);
      metadata.cleObjet = `materiels/${id}/${randomUUID()}`;
      const pending = await repository.createAttachmentUpload(id, metadata, user.id);
      try {
        const uploadUrl = await storage.createUploadUrl(pending);
        return { pieceJointe: { id: pending.id, nomFichier: pending.nomFichier, typeMime: pending.typeMime, taille: pending.taille }, uploadUrl, headers: { "Content-Type": pending.typeMime, "x-amz-meta-sha256": pending.empreinte }, expireDansSecondes: 300 };
      } catch (error) {
        await repository.discardAttachment(pending.id);
        throw error;
      }
    },
    async confirmAttachment(user, id, pieceId) {
      assertManager(user); await requireActive(id);
      const pending = await repository.findPendingAttachment(pieceId, id, user.id);
      if (!pending) throw notFound("PIECE_JOINTE_INTROUVABLE");
      try {
        const [head, contenu] = await Promise.all([storage.inspect(pending.cleObjet), storage.read(pending.cleObjet)]);
        if (Number(head.ContentLength) !== pending.taille || head.ContentType !== pending.typeMime || head.Metadata?.sha256 !== pending.empreinte) throw conflict("METADONNEES_FICHIER_INVALIDES");
        validateFileContent(pending, contenu);
        const piece = await repository.confirmAttachment(pieceId, id, user.id);
        if (!piece) throw notFound("PIECE_JOINTE_INTROUVABLE");
        return piece;
      } catch (error) {
        await storage.delete(pending.cleObjet).catch(() => {});
        await repository.discardAttachment(pieceId);
        throw error;
      }
    },
    async downloadAttachment(user, id, pieceId) {
      assertManager(user);
      const active = await repository.findActiveMaterielById(id);
      if (!active) await requireArchived(user, id);
      const piece = await repository.findAttachment(pieceId, id);
      if (!piece) throw notFound("PIECE_JOINTE_INTROUVABLE");
      return { ...piece, url: await storage.createDownloadUrl(piece) };
    },
    async removeAttachment(user, id, pieceId) {
      assertManager(user); await requireActive(id);
      const piece = await repository.findAttachment(pieceId, id);
      if (!piece) throw notFound("PIECE_JOINTE_INTROUVABLE");
      await storage.delete(piece.cleObjet);
      return repository.deleteAttachment(pieceId, id, user.id);
    },
  };
}
