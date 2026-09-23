<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const identifiant = ref("");
const motDePasse = ref("");
const erreur = ref("");
const chargement = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function submit() {
  erreur.value = "";
  chargement.value = true;
  try {
    await auth.connexion(identifiant.value, motDePasse.value);
    await router.push({ name: "dashboard" });
  } catch (error) {
    erreur.value = error.status === 401
      ? "Identifiant ou mot de passe incorrect."
      : "Le service est momentanément indisponible.";
  } finally {
    chargement.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-intro">
      <div class="brand brand--light">
        <span class="brand__mark">S</span>
        <span class="brand__text"><strong>S.U.I.V.I.</strong><small>Suivi des Usages, Inventaires, Vie des projets et IA</small></span>
      </div>
      <div>
        <h1>Une vue claire sur le matériel et les projets.</h1>
        <p>Centralisez l’inventaire du laboratoire, suivez les projets autorisés et accédez à un espace adapté à vos droits.</p>
        <div class="login-features" aria-label="Fonctionnalités principales"><span>Inventaire</span><span>Projets</span><span>Traçabilité</span></div>
      </div>
      <p class="login-intro__note">Prototype intranet — accès simulé</p>
    </section>

    <section class="login-panel">
      <form class="login-card" @submit.prevent="submit">
        <div>
          <span class="context-badge">Accès sécurisé</span>
          <h2>Connexion</h2>
          <p class="muted">Accédez à votre espace selon vos droits.</p>
        </div>

        <label>
          <span>Identifiant</span>
          <input v-model="identifiant" autocomplete="username" placeholder="Votre identifiant" required />
        </label>
        <label>
          <span>Mot de passe</span>
          <input v-model="motDePasse" type="password" autocomplete="current-password" placeholder="••••••••••••" required />
        </label>

        <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
        <button class="button button--primary" type="submit" :disabled="chargement">
          {{ chargement ? "Connexion…" : "Se connecter" }}
        </button>
        <p class="login-help">La première connexion reconnue crée automatiquement votre compte. Aucun formulaire d’inscription n’est proposé.</p>
      </form>
    </section>
  </main>
</template>
