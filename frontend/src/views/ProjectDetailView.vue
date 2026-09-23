<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "../components/AppLayout.vue";
import { api, apiBlob } from "../services/api.js";
import { renderMarkdown } from "../utils/markdown.js";

const route = useRoute();
const projet = ref(null);
const utilisateurs = ref([]);
const chargement = ref(true);
const erreur = ref("");
const message = ref("");
const form = reactive({ nom: "", description: "", visibilite: "public", dateDebut: "", dateFin: "" });
const nouveauMembre = ref("");
const nouvelleTache = reactive({ titre: "", description: "", responsableId: "" });
const documentation = ref("");

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

function dateInput(value) { return value ? value.slice(0, 10) : ""; }
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
  } catch (error) {
    erreur.value = error.message === "PROJET_ARCHIVE_VERROUILLE"
      ? "Le projet est archivé et ne peut plus être modifié."
      : "L’opération n’a pas pu être effectuée.";
  }
}

function saveProject() {
  return action(() => api(`/projets/${projet.value.id}`, { method: "PATCH", body: JSON.stringify(form) }), "Informations enregistrées.");
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
  <AppLayout>
    <RouterLink class="back-link" :to="{ name: 'projets' }">← Retour aux projets</RouterLink>
    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <p v-if="message" class="form-success" role="status">{{ message }}</p>
    <div v-if="chargement" class="loading">Chargement du projet…</div>

    <template v-else-if="projet">
      <div class="page-heading project-heading">
        <div><div class="project-heading__badges"><span class="visibility">{{ projet.visibilite === "public" ? "Public" : "Privé" }}</span><span class="status-badge">{{ projet.statut === "actif" ? "Actif" : "Archivé" }}</span></div>
          <h1>{{ projet.nom }}</h1><p class="muted">Responsable : {{ projet.responsable.identifiant }}</p></div>
      </div>

      <section class="panel project-section">
        <div class="panel__header"><div><p class="eyebrow">Projet</p><h2>Informations générales</h2></div></div>
        <form class="form-grid" @submit.prevent="saveProject">
          <label>Nom<input v-model="form.nom" :disabled="!projet.droits.modifier" required /></label>
          <label>Visibilité<select v-model="form.visibilite" :disabled="!projet.droits.modifier"><option value="public">Public</option><option value="prive">Privé</option></select></label>
          <label class="form-grid__wide">Description<textarea v-model="form.description" :disabled="!projet.droits.modifier" rows="5" required></textarea></label>
          <label>Date de début<input v-model="form.dateDebut" :disabled="!projet.droits.modifier" type="date" /></label>
          <label>Date de fin<input v-model="form.dateFin" :disabled="!projet.droits.modifier" type="date" /></label>
          <div v-if="projet.droits.modifier" class="form-actions form-grid__wide"><button class="button button--primary">Enregistrer</button></div>
        </form>
      </section>

      <section class="panel project-section">
        <div class="panel__header"><div><p class="eyebrow">Équipe</p><h2>Membres</h2></div></div>
        <form v-if="projet.droits.ajouterMembre" class="inline-form" @submit.prevent="addMember"><select v-model="nouveauMembre" required><option value="">Choisir un utilisateur</option><option v-for="user in membresAjoutables" :key="user.id" :value="user.id">{{ user.identifiant }}</option></select><button class="button button--secondary">Ajouter</button></form>
        <ul class="member-list"><li v-for="membre in projet.membres" :key="membre.id"><span class="account__avatar">{{ membre.identifiant.slice(0, 2).toUpperCase() }}</span><div><strong>{{ membre.identifiant }}</strong><small>{{ membre.id === projet.responsable.id ? "Responsable" : "Membre" }}</small></div><button v-if="projet.droits.retirerMembre && membre.id !== projet.responsable.id" class="icon-button icon-button--danger" aria-label="Retirer le membre" @click="removeMember(membre)">×</button></li></ul>
      </section>

      <section class="panel project-section">
        <div class="panel__header"><div><p class="eyebrow">Suivi</p><h2>Kanban</h2></div></div>
        <form v-if="projet.droits.modifier" class="task-create" @submit.prevent="createTask"><input v-model="nouvelleTache.titre" required placeholder="Titre de la tâche" /><textarea v-model="nouvelleTache.description" required rows="2" placeholder="Description"></textarea><select v-model="nouvelleTache.responsableId"><option value="">Sans responsable</option><option v-for="membre in projet.membres" :key="membre.id" :value="membre.id">{{ membre.identifiant }}</option></select><button class="button button--primary">Ajouter la tâche</button></form>
        <div class="kanban-board"><section v-for="colonne in colonnes" :key="colonne.id" class="kanban-column"><h3>{{ colonne.label }} <span>{{ projet.taches.filter((tache) => tache.etat === colonne.id).length }}</span></h3>
          <article v-for="tache in projet.taches.filter((item) => item.etat === colonne.id)" :key="tache.id" class="task-card"><input v-model="tache.titre" :disabled="!projet.droits.modifier" /><textarea v-model="tache.description" :disabled="!projet.droits.modifier" rows="3"></textarea><select :value="tache.responsable?.id || ''" :disabled="!projet.droits.modifier" @change="tache.responsable = projet.membres.find((m) => m.id === $event.target.value) || null"><option value="">Sans responsable</option><option v-for="membre in projet.membres" :key="membre.id" :value="membre.id">{{ membre.identifiant }}</option></select><select :value="tache.etat" :disabled="!projet.droits.modifier" @change="updateTask(tache, { etat: $event.target.value })"><option v-for="option in colonnes" :key="option.id" :value="option.id">{{ option.label }}</option></select><div v-if="projet.droits.modifier" class="task-card__actions"><button class="button button--small button--secondary" @click="saveTask(tache)">Enregistrer</button><button class="button button--small button--danger" @click="deleteTask(tache)">Supprimer</button></div></article>
        </section></div>
      </section>

      <section class="panel project-section">
        <div class="panel__header"><div><p class="eyebrow">README</p><h2>Documentation Markdown</h2></div><button class="button button--secondary" @click="exportDocumentation">Exporter en DOCX</button></div>
        <div class="documentation-grid"><div><label>Source Markdown<textarea v-model="documentation" :disabled="!projet.droits.modifier" rows="18" placeholder="# Présentation du projet"></textarea></label><button v-if="projet.droits.modifier" class="button button--primary documentation-save" @click="saveDocumentation">Enregistrer la documentation</button></div><article class="markdown-preview"><p class="eyebrow">Aperçu</p><div v-if="documentation" v-html="markdownHtml"></div><p v-else class="muted">La documentation est vide.</p></article></div>
      </section>
    </template>
  </AppLayout>
</template>
