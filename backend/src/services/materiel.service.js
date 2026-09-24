import { conflict, forbidden, notFound } from "../errors/app.error.js";

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
function validateFile(file) {
  const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
  if (!file.nomFichier || !allowed.has(file.typeMime)) throw conflict("TYPE_FICHIER_INTERDIT");
  if (!file.contenu?.length) throw conflict("FICHIER_VIDE");
  if (file.contenu.length > 10 * 1024 * 1024) throw conflict("FICHIER_TROP_VOLUMINEUX");
  const signatureOk = file.typeMime === "application/pdf"
    ? file.contenu.subarray(0, 5).toString() === "%PDF-"
    : file.typeMime === "image/png"
      ? file.contenu.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : file.contenu[0] === 0xff && file.contenu[1] === 0xd8 && file.contenu.at(-2) === 0xff && file.contenu.at(-1) === 0xd9;
  if (!signatureOk) throw conflict("CONTENU_FICHIER_INVALIDE");
  return { ...file, nomFichier: safeFilename(file.nomFichier) };
}

export function createMaterielService(repository) {
  async function requireActive(id) {
    const materiel = await repository.findActiveMaterielById(id);
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
    listCategories() { return repository.listCategories(); },
    async createCategory(user, nom) { assertManager(user); return repository.createCategorie(nom); },
    async updateCategory(user, id, nom) { assertManager(user); return repository.updateCategorie(id, nom); },
    async deleteCategory(user, id) { assertManager(user); return repository.deleteCategorie(id); },
    async addAttachment(user, id, file) { assertManager(user); await requireActive(id); return repository.createAttachment(id, validateFile(file), user.id); },
    async downloadAttachment(user, id, pieceId) {
      assertManager(user); await requireActive(id);
      const piece = await repository.findAttachment(pieceId, id);
      if (!piece) throw notFound("PIECE_JOINTE_INTROUVABLE");
      return piece;
    },
    async removeAttachment(user, id, pieceId) {
      assertManager(user); await requireActive(id);
      if (!await repository.findAttachment(pieceId, id)) throw notFound("PIECE_JOINTE_INTROUVABLE");
      return repository.deleteAttachment(pieceId, id, user.id);
    },
  };
}
