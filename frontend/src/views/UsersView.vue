<script setup>
import { onMounted, reactive, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import ModalShell from "../components/ModalShell.vue";
import { useAuthStore } from "../stores/auth.js";
import { api } from "../services/api.js";

const auth = useAuthStore();
const utilisateurs = ref([]);
const erreur = ref("");
const traitement = ref("");
const modal = ref("");
const edition = ref(null);
const form = reactive({ identifiant: "", motDePasse: "", role: "utilisateur" });

const messages = {
  GESTIONNAIRE_RESPONSABLE_PROJET: "Transférez d’abord les responsabilités de projet de cet utilisateur.",
  DERNIER_ADMINISTRATEUR: "Impossible : il doit rester au moins un administrateur actif.",
  AUTO_DESACTIVATION_INTERDITE: "Vous ne pouvez pas désactiver votre propre compte.",
  IDENTIFIANT_DEJA_UTILISE: "Cet identifiant est déjà utilisé par un autre compte.",
};

function messageFor(error, fallback) {
  return messages[error.message] || fallback;
}

async function charger() {
  try {
    utilisateurs.value = (await api("/utilisateurs")).utilisateurs;
  } catch {
    erreur.value = "Impossible de charger les utilisateurs.";
  }
}

function openCreate() {
  edition.value = null;
  Object.assign(form, { identifiant: "", motDePasse: "", role: "utilisateur" });
  erreur.value = "";
  modal.value = "form";
}

function openEdit(utilisateur) {
  edition.value = utilisateur;
  Object.assign(form, { identifiant: utilisateur.identifiant, motDePasse: "", role: utilisateur.role });
  erreur.value = "";
  modal.value = "form";
}

function closeModal() {
  modal.value = "";
  edition.value = null;
}

async function saveUser() {
  traitement.value = edition.value?.id || "form";
  erreur.value = "";
  try {
    if (edition.value) {
      const body = { identifiant: form.identifiant };
      if (form.motDePasse) body.motDePasse = form.motDePasse;
      await api(`/utilisateurs/${edition.value.id}`, { method: "PATCH", body: JSON.stringify(body) });
      if (form.role !== edition.value.role) {
        await api(`/utilisateurs/${edition.value.id}/role`, { method: "PATCH", body: JSON.stringify({ role: form.role }) });
      }
    } else {
      await api("/utilisateurs", { method: "POST", body: JSON.stringify(form) });
    }
    await charger();
    closeModal();
  } catch (error) {
    erreur.value = messageFor(error, "Le compte n’a pas pu être enregistré.");
  } finally {
    traitement.value = "";
  }
}

async function changerRole(utilisateur, role) {
  if (role === utilisateur.role) return;
  traitement.value = utilisateur.id;
  erreur.value = "";
  try {
    await api(`/utilisateurs/${utilisateur.id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
    await charger();
  } catch (error) {
    erreur.value = messageFor(error, "Le rôle n’a pas pu être modifié.");
    await charger();
  } finally {
    traitement.value = "";
  }
}

async function basculerActivation(utilisateur) {
  const action = utilisateur.actif ? "désactiver" : "réactiver";
  if (!window.confirm(`Confirmez-vous vouloir ${action} le compte « ${utilisateur.identifiant} » ?`)) return;
  traitement.value = utilisateur.id;
  erreur.value = "";
  try {
    const endpoint = utilisateur.actif ? `/utilisateurs/${utilisateur.id}` : `/utilisateurs/${utilisateur.id}/reactivation`;
    await api(endpoint, { method: utilisateur.actif ? "DELETE" : "POST" });
    await charger();
  } catch (error) {
    erreur.value = messageFor(error, "Le statut du compte n’a pas pu être modifié.");
  } finally {
    traitement.value = "";
  }
}

onMounted(charger);
</script>

<template>
  <AppLayout>
    <div class="page-heading">
      <div><h1>Gestion des utilisateurs</h1><p class="muted">Créez, modifiez, changez le rôle ou désactivez les comptes.</p></div>
      <div class="page-actions"><button class="button button--primary" @click="openCreate">Nouvel utilisateur</button></div>
    </div>
    <section class="info-banner"><div><strong>Un seul gestionnaire peut être actif</strong><p>Une nouvelle nomination remplace automatiquement le gestionnaire précédent. Un responsable de projet actif ne peut pas être nommé. Un compte désactivé conserve son historique mais ne peut plus se connecter.</p></div><span class="context-badge">Droits administrateur</span></section>
    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <section class="panel user-table-wrap">
      <table class="user-table">
        <thead><tr><th>Identifiant</th><th>Rôle</th><th>Statut</th><th>Dernière connexion</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="utilisateur in utilisateurs" :key="utilisateur.id">
            <td>{{ utilisateur.identifiant }}</td>
            <td>
              <select
                :value="utilisateur.role"
                :disabled="traitement === utilisateur.id || utilisateur.id === auth.utilisateur?.id"
                @change="changerRole(utilisateur, $event.target.value)"
              >
                <option value="administrateur">Administrateur</option>
                <option value="gestionnaire">Gestionnaire</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
            </td>
            <td><span class="context-badge" :class="{ 'category-chip': utilisateur.actif }">{{ utilisateur.actif ? "Actif" : "Désactivé" }}</span></td>
            <td>{{ utilisateur.derniereConnexion ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(utilisateur.derniereConnexion)) : "Jamais connecté" }}</td>
            <td class="user-table__actions">
              <button class="button button--small button--secondary" :disabled="traitement === utilisateur.id" @click="openEdit(utilisateur)">Modifier</button>
              <button
                v-if="utilisateur.id !== auth.utilisateur?.id"
                class="button button--small"
                :class="utilisateur.actif ? 'button--danger' : 'button--secondary'"
                :disabled="traitement === utilisateur.id"
                @click="basculerActivation(utilisateur)"
              >{{ utilisateur.actif ? "Désactiver" : "Réactiver" }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <ModalShell v-if="modal === 'form'" :label="edition ? 'Modification' : 'Création'" :title="edition ? 'Modifier le compte' : 'Nouveau compte'" @close="closeModal">
      <form class="modal__body form-grid" @submit.prevent="saveUser">
        <p v-if="erreur" class="form-error form-grid__wide" role="alert">{{ erreur }}</p>
        <label class="form-grid__wide">Identifiant<input v-model="form.identifiant" required maxlength="180" autofocus /></label>
        <label class="form-grid__wide">{{ edition ? "Nouveau mot de passe (facultatif)" : "Mot de passe" }}<input v-model="form.motDePasse" type="password" :required="!edition" minlength="8" maxlength="200" /></label>
        <label>Rôle<select v-model="form.role"><option value="administrateur">Administrateur</option><option value="gestionnaire">Gestionnaire</option><option value="utilisateur">Utilisateur</option></select></label>
        <div class="modal__footer form-grid__wide">
          <button class="button button--secondary" type="button" :disabled="traitement" @click="closeModal">Annuler</button>
          <button class="button button--primary" :disabled="traitement">{{ traitement ? "Enregistrement…" : "Enregistrer" }}</button>
        </div>
      </form>
    </ModalShell>
  </AppLayout>
</template>
