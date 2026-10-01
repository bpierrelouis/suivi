<script setup>
import { reactive, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { useAuthStore } from "../stores/auth.js";
import { useThemeStore } from "../stores/theme.js";
import { api } from "../services/api.js";

const auth = useAuthStore();
const theme = useThemeStore();

const roleLabel = { administrateur: "Administrateur", gestionnaire: "Gestionnaire", utilisateur: "Utilisateur" };

const form = reactive({ motDePasseActuel: "", nouveauMotDePasse: "", confirmation: "" });
const erreur = ref("");
const message = ref("");
const traitement = ref(false);

function resetForm() {
  Object.assign(form, { motDePasseActuel: "", nouveauMotDePasse: "", confirmation: "" });
}

async function changerMotDePasse() {
  erreur.value = "";
  message.value = "";
  if (form.nouveauMotDePasse !== form.confirmation) {
    erreur.value = "La confirmation ne correspond pas au nouveau mot de passe.";
    return;
  }
  traitement.value = true;
  try {
    await api("/auth/mot-de-passe", {
      method: "PATCH",
      body: JSON.stringify({ motDePasseActuel: form.motDePasseActuel, nouveauMotDePasse: form.nouveauMotDePasse }),
    });
    resetForm();
    message.value = "Mot de passe mis à jour.";
  } catch (error) {
    erreur.value = error.message === "MOT_DE_PASSE_ACTUEL_INVALIDE"
      ? "Le mot de passe actuel est incorrect."
      : "Le mot de passe n’a pas pu être modifié.";
  } finally {
    traitement.value = false;
  }
}
</script>

<template>
  <AppLayout>
    <div class="page-heading"><div><h1>Paramètres</h1><p class="muted">Préférences et sécurité de votre compte.</p></div></div>

    <section class="panel settings-panel">
      <div class="settings-row">
        <div><h2>Thème</h2><p class="muted">Choisissez l’apparence claire ou sombre de l’application.</p></div>
        <div class="segmented-control" role="radiogroup" aria-label="Thème de l’application">
          <button type="button" role="radio" :aria-checked="!theme.sombre" :class="{ active: !theme.sombre }" @click="theme.sombre && theme.basculer()">☀ Clair</button>
          <button type="button" role="radio" :aria-checked="theme.sombre" :class="{ active: theme.sombre }" @click="!theme.sombre && theme.basculer()">☾ Sombre</button>
        </div>
      </div>
    </section>

    <section class="panel settings-panel">
      <h2>Mon compte</h2>
      <dl class="material-facts">
        <div><dt>Identifiant</dt><dd>{{ auth.utilisateur?.identifiant }}</dd></div>
        <div><dt>Rôle</dt><dd>{{ roleLabel[auth.utilisateur?.role] || auth.utilisateur?.role }}</dd></div>
      </dl>
    </section>

    <section class="panel settings-panel">
      <h2>Changer le mot de passe</h2>
      <p class="muted">Le mot de passe actuel est requis pour confirmer le changement.</p>
      <form class="form-grid" @submit.prevent="changerMotDePasse">
        <p v-if="erreur" class="form-error form-grid__wide" role="alert">{{ erreur }}</p>
        <p v-if="message" class="form-success form-grid__wide" role="status">{{ message }}</p>
        <label class="form-grid__wide">Mot de passe actuel<input v-model="form.motDePasseActuel" type="password" required maxlength="256" autocomplete="current-password" /></label>
        <label>Nouveau mot de passe<input v-model="form.nouveauMotDePasse" type="password" required minlength="8" maxlength="200" autocomplete="new-password" /></label>
        <label>Confirmation<input v-model="form.confirmation" type="password" required minlength="8" maxlength="200" autocomplete="new-password" /></label>
        <div class="form-actions form-grid__wide"><button class="button button--primary" :disabled="traitement">{{ traitement ? "Enregistrement…" : "Mettre à jour le mot de passe" }}</button></div>
      </form>
    </section>
  </AppLayout>
</template>
