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
      <div class="brand brand--light"><span class="brand__mark">S</span><span>SUIVI</span></div>
      <div>
        <p class="eyebrow">Laboratoire · Espace sécurisé</p>
        <h1>Les projets et les équipements, enfin réunis.</h1>
        <p>Suivez l’activité du laboratoire dans un espace adapté à votre rôle.</p>
      </div>
      <p class="login-intro__note">Sprint 1 · Authentification simulée</p>
    </section>

    <section class="login-panel">
      <form class="login-card" @submit.prevent="submit">
        <div>
          <p class="eyebrow">Bienvenue</p>
          <h2>Connexion à SUIVI</h2>
          <p class="muted">Utilisez votre identifiant de démonstration.</p>
        </div>

        <label>
          <span>Identifiant</span>
          <input v-model="identifiant" autocomplete="username" placeholder="prenom.nom@demo.local" required />
        </label>
        <label>
          <span>Mot de passe</span>
          <input v-model="motDePasse" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
        <button class="button button--primary" type="submit" :disabled="chargement">
          {{ chargement ? "Connexion…" : "Se connecter" }}
        </button>
      </form>
    </section>
  </main>
</template>
