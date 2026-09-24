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
const materiels = ref([]);
const reservations = ref([]);
const reservationForm = reactive({ materielId: "", debut: "", fin: "" });
const reservationEditee = ref("");
const ajoutTacheOuvert = ref(false);
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
function formatDateTime(value) { return value ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—"; }
function localInput(value) { if (!value) return ""; const date = new Date(value); const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16); }
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
    reservations.value = data.reservations || [];
    if (data.droits.gererReservations) {
      const [inventory, bookingData] = await Promise.all([api("/materiels?modeSuivi=individualise"), api(`/projets/${data.id}/reservations`)]);
      materiels.value = inventory.materiels;
      reservations.value = bookingData.reservations;
    }
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
    erreur.value = ({ PROJET_ARCHIVE_VERROUILLE: "Le projet est archivé et ne peut plus être modifié.", CRENEAU_INDISPONIBLE: "Ce matériel est déjà réservé sur tout ou partie de ce créneau.", CRENEAU_DEMI_HEURE_REQUIS: "Les horaires doivent se terminer par 00 ou 30.", INTERVALLE_RESERVATION_INVALIDE: "L’heure de fin doit être postérieure à l’heure de début.", MATERIEL_NON_RESERVABLE: "Ce matériel n’est pas réservable individuellement." })[error.message] || "L’opération n’a pas pu être effectuée.";
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
    ajoutTacheOuvert.value = false;
  }, "Tâche créée.");
}
function cancelTaskCreation() {
  Object.assign(nouvelleTache, { titre: "", description: "", responsableId: "" });
  ajoutTacheOuvert.value = false;
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
function resetReservation() { Object.assign(reservationForm, { materielId: "", debut: "", fin: "" }); reservationEditee.value = ""; }
function editReservation(item) { reservationEditee.value = item.id; Object.assign(reservationForm, { materielId: item.materiel.id, debut: localInput(item.debut), fin: localInput(item.fin) }); onglet.value = "reservations"; }
function saveReservation() {
  return action(async () => {
    const payload = { debut: new Date(reservationForm.debut).toISOString(), fin: new Date(reservationForm.fin).toISOString() };
    if (reservationEditee.value) await api(`/projets/${projet.value.id}/reservations/${reservationEditee.value}`, { method: "PATCH", body: JSON.stringify(payload) });
    else await api(`/projets/${projet.value.id}/reservations`, { method: "POST", body: JSON.stringify({ ...payload, materielId: reservationForm.materielId }) });
    resetReservation();
  }, reservationEditee.value ? "Réservation modifiée." : "Réservation créée.");
}
function cancelReservation(item) { if (!window.confirm("Annuler cette réservation et libérer le créneau ?")) return; return action(() => api(`/projets/${projet.value.id}/reservations/${item.id}/annulation`, { method: "POST" }), "Réservation annulée."); }
function archiveProject() { if (!window.confirm("Archiver définitivement ce projet ? Ses réservations en cours et futures seront libérées.")) return; return action(() => api(`/projets/${projet.value.id}/archivage`, { method: "POST" }), "Projet archivé."); }
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
  <ModalShell :label="projet ? relationLabel : ''" :title="projet?.nom || 'Projet'" wide stable @close="close">
    <template v-if="projet && onglet === 'description' && (projet.droits.modifier || projet.droits.archiver)" #actions><button v-if="projet.droits.modifier" class="button button--secondary" type="button" @click="edition = !edition">{{ edition ? "Annuler" : "Modifier" }}</button><button v-if="projet.droits.archiver" class="button button--danger" type="button" @click="archiveProject">Archiver</button></template>
    <div v-if="chargement" class="loading">Chargement du projet…</div>
    <div v-else-if="!projet" class="modal__body"><p class="form-error" role="alert">{{ erreur }}</p></div>
    <template v-else>
      <nav class="project-tabs" aria-label="Rubriques du projet">
        <button :class="{ active: onglet === 'description' }" @click="onglet = 'description'">Description</button>
        <button :class="{ active: onglet === 'membres' }" @click="onglet = 'membres'">Membres</button>
        <button v-if="projet.droits.voirReservations" :class="{ active: onglet === 'reservations' }" @click="onglet = 'reservations'">Réservations</button>
        <button :class="{ active: onglet === 'documentation' }" @click="onglet = 'documentation'">Documentation</button>
        <button :class="{ active: onglet === 'historique' }" @click="onglet = 'historique'">Historique</button>
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
            <div class="section-heading"><div><h2>Tableau des tâches</h2><p>Organisez le travail en trois étapes, avec un responsable facultatif.</p></div><button v-if="projet.droits.modifier && !ajoutTacheOuvert" class="button button--primary" type="button" @click="ajoutTacheOuvert = true">Ajouter une tâche</button></div>
            <form v-if="projet.droits.modifier && ajoutTacheOuvert" class="task-composer" @submit.prevent="createTask">
              <div class="task-composer__heading"><div><strong>Nouvelle tâche</strong><small>Elle sera ajoutée dans la colonne « À faire ».</small></div></div>
              <div class="task-composer__fields"><label class="task-composer__title">Titre<input v-model="nouvelleTache.titre" required maxlength="180" autofocus placeholder="Ex. Préparer le protocole de mesure" /></label><label>Responsable<select v-model="nouvelleTache.responsableId"><option value="">Sans responsable</option><option v-for="membre in projet.membres" :key="membre.id" :value="membre.id">{{ membre.identifiant }}</option></select></label><label class="task-composer__description">Description<textarea v-model="nouvelleTache.description" required maxlength="2000" rows="3" placeholder="Décrivez le résultat attendu et les informations utiles."></textarea></label></div>
              <div class="task-composer__actions"><button class="button button--secondary" type="button" @click="cancelTaskCreation">Annuler</button><button class="button button--primary">Créer la tâche</button></div>
            </form>
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

        <section v-else-if="onglet === 'reservations'" class="reservation-section">
          <div class="section-heading"><div><h2>Réservations de matériel</h2><p>Créneaux semi-ouverts, sans chevauchement. Les heures doivent finir par 00 ou 30.</p></div></div>
          <form v-if="projet.droits.gererReservations" class="form-grid reservation-form" @submit.prevent="saveReservation">
            <label class="form-grid__wide">Matériel individualisé<select v-model="reservationForm.materielId" required :disabled="Boolean(reservationEditee)"><option value="">Choisir un matériel</option><option v-for="item in materiels" :key="item.id" :value="item.id">{{ item.nom }}</option></select></label>
            <label>Début<input v-model="reservationForm.debut" type="datetime-local" step="1800" required /></label><label>Fin<input v-model="reservationForm.fin" type="datetime-local" step="1800" required /></label>
            <div class="form-actions form-grid__wide"><button v-if="reservationEditee" type="button" class="button button--secondary" @click="resetReservation">Annuler la modification</button><button class="button button--primary">{{ reservationEditee ? 'Enregistrer le créneau' : 'Réserver' }}</button></div>
          </form>
          <div v-if="reservations.length" class="reservation-list"><article v-for="item in reservations" :key="item.id" class="reservation-card"><div><strong>{{ item.materiel.nom }}</strong><p>{{ formatDateTime(item.debut) }} → {{ formatDateTime(item.fin) }}</p><small>Créée par {{ item.reservePar.identifiant }} · {{ ({ active: 'Active', annulee: 'Annulée', liberee: 'Libérée' })[item.statut] }}</small></div><div v-if="item.statut === 'active' && projet.statut === 'actif'" class="page-actions"><button class="button button--small button--secondary" @click="editReservation(item)">Modifier</button><button class="button button--small button--danger" @click="cancelReservation(item)">Annuler</button></div></article></div>
          <p v-else class="muted">Aucune réservation pour ce projet.</p>
        </section>

        <section v-else-if="onglet === 'documentation'" class="documentation-section">
          <div class="section-heading"><div><h2>Documentation Markdown</h2><p>Rédigez et prévisualisez la documentation du projet.</p></div><div class="section-heading__actions"><button v-if="projet.droits.modifier" class="button button--primary" type="button" @click="saveDocumentation">Enregistrer</button><button class="button button--secondary" type="button" @click="exportDocumentation">Exporter en DOCX</button></div></div>
          <div class="documentation-grid"><label class="documentation-pane documentation-source"><span class="context-badge">Source Markdown</span><textarea v-model="documentation" :disabled="!projet.droits.modifier" placeholder="# Présentation du projet"></textarea></label><article class="documentation-pane markdown-preview"><span class="context-badge">Aperçu</span><div v-if="documentation" class="documentation-preview-content" v-html="markdownHtml"></div><p v-else class="muted">La documentation est vide.</p></article></div>
        </section>

        <section v-else class="history-section"><div class="section-heading"><div><h2>Historique du projet</h2><p>Les évolutions du projet restent consultables après son archivage.</p></div></div><ul v-if="projet.historique.length" class="history-list"><li v-for="event in projet.historique" :key="event.id"><strong>{{ ({ creation: 'Création', modification: 'Informations modifiées', ajout_membre: 'Membre ajouté', retrait_membre: 'Membre retiré', creation_tache: 'Tâche créée', modification_tache: 'Tâche modifiée', suppression_tache: 'Tâche supprimée', archivage: 'Projet archivé' })[event.type] }}</strong><span>{{ formatDateTime(event.creeLe) }} · {{ event.auteur?.identifiant || 'Système' }}</span></li></ul><p v-else class="muted">Aucun événement enregistré.</p></section>
      </div>
      <footer class="modal__footer modal__footer--between"><small>Projet {{ projet.visibilite === 'public' ? 'public' : 'privé' }} · {{ projet.membres.length }} membre{{ projet.membres.length > 1 ? 's' : '' }} · {{ projet.statut === 'actif' ? 'actif' : 'archivé' }}</small></footer>
    </template>
  </ModalShell>
</template>
