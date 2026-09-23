<script setup>
import { computed, inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import ModalShell from "../components/ModalShell.vue";
import { api, apiBlob } from "../services/api.js";
import { renderMarkdown } from "../utils/markdown.js";

const route = useRoute();
const router = useRouter();
const projet = ref(null);
const utilisateurs = ref([]);
const chargement = ref(true);
const erreur = ref("");
const message = ref("");
const form = reactive({ nom: "", description: "", visibilite: "public", dateDebut: "", dateFin: "" });
const nouveauMembre = ref("");
const nouvelleTache = reactive({ titre: "", description: "", responsableId: "" });
const documentation = ref("");
const onglet = ref("description");
const edition = ref(false);
const rafraichirProjets = inject("rafraichirProjets", async () => {});

const colonnes = [
  { id: "a_faire", label: "À faire" },
  { id: "en_cours", label: "En cours" },
  { id: "terminee", label: "Fait" },
];
const membresAjoutables = computed(() => {
  const ids = new Set(projet.value?.membres.map((membre) => membre.id) || []);
  return utilisateurs.value.filter((utilisateur) => !ids.has(utilisateur.id) && utilisateur.role !== "gestionnaire");
});
const markdownHtml = computed(() => renderMarkdown(documentation.value));
const relationLabel = computed(() => ({
  responsable: "Créateur",
  membre: "Membre",
  lecteur: "Lecture seule",
  administrateur: "Administrateur",
})[projet.value?.relation] || "Projet");

function dateInput(value) { return value ? value.slice(0, 10) : ""; }
function formatDate(value) { return value ? new Intl.DateTimeFormat("fr-FR").format(new Date(value)) : "Non renseignée"; }
function close() { router.push({ name: "projets" }); }
function hydrate(data) {
  projet.value = data;
  Object.assign(form, {
    nom: data.nom,
    description: data.description,
    visibilite: data.visibilite,
    dateDebut: dateInput(data.dateDebut),
    dateFin: dateInput(data.dateFin),
  });
  documentation.value = data.documentation.contenu;
}

async function charger() {
  try {
    const [{ projet: data }, users] = await Promise.all([
      api(`/projets/${route.params.id}`),
      api("/utilisateurs?mode=ajoutables"),
    ]);
    hydrate(data);
    utilisateurs.value = users.utilisateurs;
  } catch (error) {
    erreur.value = error.status === 404 ? "Ce projet n’existe pas ou ne vous est pas accessible." : "Impossible de charger le projet.";
  } finally {
    chargement.value = false;
  }
}

async function action(callback, success) {
  erreur.value = "";
  message.value = "";
  try {
    await callback();
    message.value = success;
    await charger();
    await rafraichirProjets();
  } catch (error) {
    erreur.value = error.message === "PROJET_ARCHIVE_VERROUILLE"
      ? "Le projet est archivé et ne peut plus être modifié."
      : "L’opération n’a pas pu être effectuée.";
  }
}

function saveProject() {
  return action(async () => {
    await api(`/projets/${projet.value.id}`, { method: "PATCH", body: JSON.stringify(form) });
    edition.value = false;
  }, "Informations enregistrées.");
}
function addMember() {
  if (!nouveauMembre.value) return;
  return action(async () => {
    await api(`/projets/${projet.value.id}/membres`, { method: "POST", body: JSON.stringify({ utilisateurId: nouveauMembre.value }) });
    nouveauMembre.value = "";
  }, "Membre ajouté.");
}
function removeMember(membre) {
  return action(() => api(`/projets/${projet.value.id}/membres/${membre.id}`, { method: "DELETE" }), "Membre retiré.");
}
function createTask() {
  return action(async () => {
    await api(`/projets/${projet.value.id}/taches`, {
      method: "POST",
      body: JSON.stringify({ ...nouvelleTache, responsableId: nouvelleTache.responsableId || null }),
    });
    Object.assign(nouvelleTache, { titre: "", description: "", responsableId: "" });
  }, "Tâche créée.");
}
function updateTask(tache, patch) {
  return action(() => api(`/projets/${projet.value.id}/taches/${tache.id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }), patch.etat === "terminee" ? "Tâche terminée. Le projet est archivé si toutes les tâches sont finies." : "Tâche enregistrée.");
}
function saveTask(tache) {
  return updateTask(tache, {
    titre: tache.titre,
    description: tache.description,
    responsableId: tache.responsable?.id || null,
  });
}
function deleteTask(tache) {
  return action(() => api(`/projets/${projet.value.id}/taches/${tache.id}`, { method: "DELETE" }), "Tâche supprimée.");
}
function saveDocumentation() {
  return action(() => api(`/projets/${projet.value.id}/documentation`, {
    method: "PUT",
    body: JSON.stringify({ contenu: documentation.value }),
  }), "Documentation enregistrée.");
}
async function exportDocumentation() {
  try {
    const { blob, disposition } = await apiBlob(`/projets/${projet.value.id}/documentation/export`);
    const filename = disposition.match(/filename="([^"]+)"/)?.[1] || "documentation-projet.docx";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch {
    erreur.value = "L’export DOCX a échoué.";
  }
}

onMounted(charger);
</script>

<template>
  <ModalShell :label="projet ? relationLabel : ''" :title="projet?.nom || 'Projet'" wide @close="close">
    <template v-if="projet?.droits.modifier && onglet === 'description'" #actions><button class="button button--secondary" type="button" @click="edition = !edition">{{ edition ? "Annuler" : "Modifier" }}</button></template>
    <div v-if="chargement" class="loading">Chargement du projet…</div>
    <div v-else-if="!projet" class="modal__body"><p class="form-error" role="alert">{{ erreur }}</p></div>
    <template v-else>
      <nav class="project-tabs" aria-label="Rubriques du projet">
        <button :class="{ active: onglet === 'description' }" @click="onglet = 'description'">Description</button>
        <button :class="{ active: onglet === 'membres' }" @click="onglet = 'membres'">Membres</button>
        <button :class="{ active: onglet === 'documentation' }" @click="onglet = 'documentation'">Documentation</button>
      </nav>
      <div class="modal__body project-modal-body">
        <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p><p v-if="message" class="form-success" role="status">{{ message }}</p>

        <template v-if="onglet === 'description'">
          <form v-if="edition" class="form-grid project-edit-form" @submit.prevent="saveProject">
            <label>Nom du projet<input v-model="form.nom" required /></label><label>Visibilité<select v-model="form.visibilite"><option value="public">Public</option><option value="prive">Privé</option></select></label>
            <label class="form-grid__wide">Description<textarea v-model="form.description" rows="4" required></textarea></label><label>Date de début<input v-model="form.dateDebut" type="date" /></label><label>Date de fin<input v-model="form.dateFin" type="date" /></label>
            <div class="form-actions form-grid__wide"><button class="button button--primary">Enregistrer les modifications</button></div>
          </form>
          <section v-else class="project-overview">
            <p>{{ projet.description }}</p><dl><div><dt>Responsable</dt><dd>{{ projet.responsable.identifiant }}</dd></div><div><dt>Visibilité</dt><dd>{{ projet.visibilite === 'public' ? 'Publique' : 'Privée' }}</dd></div><div><dt>Début</dt><dd>{{ formatDate(projet.dateDebut) }}</dd></div><div><dt>Fin</dt><dd>{{ formatDate(projet.dateFin) }}</dd></div></dl>
          </section>
          <section class="kanban-section">
            <div class="section-heading"><div><h2>Tableau des tâches</h2><p>Responsable facultatif parmi les membres — aucune priorité ni échéance.</p></div></div>
            <form v-if="projet.droits.modifier" class="task-create" @submit.prevent="createTask"><input v-model="nouvelleTache.titre" required placeholder="Titre de la tâche" /><textarea v-model="nouvelleTache.description" required rows="2" placeholder="Description"></textarea><select v-model="nouvelleTache.responsableId"><option value="">Sans responsable</option><option v-for="membre in projet.membres" :key="membre.id" :value="membre.id">{{ membre.identifiant }}</option></select><button class="button button--primary">Nouvelle tâche</button></form>
            <p v-if="projet.droits.modifier && projet.statut === 'actif'" class="archive-notice">Terminer la dernière tâche active archive automatiquement le projet et verrouille ses modifications.</p>
            <div class="kanban-board"><section v-for="colonne in colonnes" :key="colonne.id" class="kanban-column"><h3>{{ colonne.label }} · {{ projet.taches.filter((tache) => tache.etat === colonne.id).length }}</h3>
              <article v-for="tache in projet.taches.filter((item) => item.etat === colonne.id)" :key="tache.id" class="task-card"><input v-model="tache.titre" :disabled="!projet.droits.modifier" /><textarea v-model="tache.description" :disabled="!projet.droits.modifier" rows="2"></textarea><select :value="tache.responsable?.id || ''" :disabled="!projet.droits.modifier" @change="tache.responsable = projet.membres.find((m) => m.id === $event.target.value) || null"><option value="">Sans responsable</option><option v-for="membre in projet.membres" :key="membre.id" :value="membre.id">{{ membre.identifiant }}</option></select><select :value="tache.etat" :disabled="!projet.droits.modifier" @change="updateTask(tache, { etat: $event.target.value })"><option v-for="option in colonnes" :key="option.id" :value="option.id">{{ option.label }}</option></select><div v-if="projet.droits.modifier" class="task-card__actions"><button class="button button--small button--secondary" type="button" @click="saveTask(tache)">Enregistrer</button><button class="button button--small button--danger" type="button" @click="deleteTask(tache)">Supprimer</button></div></article>
            </section></div>
          </section>
        </template>

        <section v-else-if="onglet === 'membres'">
          <div class="section-heading"><div><h2>Membres du projet</h2><p>Le responsable est toujours membre du projet.</p></div></div>
          <form v-if="projet.droits.ajouterMembre" class="inline-form" @submit.prevent="addMember"><select v-model="nouveauMembre" required><option value="">Choisir un utilisateur</option><option v-for="user in membresAjoutables" :key="user.id" :value="user.id">{{ user.identifiant }}</option></select><button class="button button--primary">Ajouter</button></form>
          <ul class="member-list"><li v-for="membre in projet.membres" :key="membre.id"><span class="account__avatar">{{ membre.identifiant.slice(0, 2).toUpperCase() }}</span><div><strong>{{ membre.identifiant }}</strong><small>{{ membre.id === projet.responsable.id ? "Responsable" : "Membre" }}</small></div><button v-if="projet.droits.retirerMembre && membre.id !== projet.responsable.id" class="icon-button icon-button--danger" aria-label="Retirer le membre" @click="removeMember(membre)">×</button></li></ul>
        </section>

        <section v-else class="documentation-section">
          <div class="section-heading"><div><h2>Documentation Markdown</h2><p>Rédigez et prévisualisez la documentation du projet.</p></div><button class="button button--secondary" @click="exportDocumentation">Exporter en DOCX</button></div>
          <div class="documentation-grid"><div><label>Source Markdown<textarea v-model="documentation" :disabled="!projet.droits.modifier" rows="16" placeholder="# Présentation du projet"></textarea></label><button v-if="projet.droits.modifier" class="button button--primary documentation-save" @click="saveDocumentation">Enregistrer la documentation</button></div><article class="markdown-preview"><span class="context-badge">Aperçu</span><div v-if="documentation" v-html="markdownHtml"></div><p v-else class="muted">La documentation est vide.</p></article></div>
        </section>
      </div>
      <footer class="modal__footer modal__footer--between"><small>Projet {{ projet.visibilite === 'public' ? 'public' : 'privé' }} · {{ projet.membres.length }} membre{{ projet.membres.length > 1 ? 's' : '' }} · {{ projet.statut === 'actif' ? 'actif' : 'archivé' }}</small><button class="button button--secondary" @click="close">Fermer</button></footer>
    </template>
  </ModalShell>
</template>
