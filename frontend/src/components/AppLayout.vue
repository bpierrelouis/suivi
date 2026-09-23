<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import RoleBadge from "./RoleBadge.vue";

const auth = useAuthStore();
const router = useRouter();

async function logout() {
  await auth.deconnexion();
  await router.push({ name: "connexion" });
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/" aria-label="Accueil SUIVI">
        <span class="brand__mark">S</span>
        <span>SUIVI</span>
      </RouterLink>

      <nav class="nav" aria-label="Navigation principale">
        <RouterLink to="/" class="nav__link">
          <span aria-hidden="true">⌂</span> Tableau de bord
        </RouterLink>
        <RouterLink v-if="auth.utilisateur?.role !== 'gestionnaire'" to="/projets" class="nav__link">
          <span aria-hidden="true">▦</span> Projets
        </RouterLink>
        <RouterLink to="/inventaire" class="nav__link">
          <span aria-hidden="true">□</span> Inventaire
        </RouterLink>
      </nav>

      <div class="account">
        <div class="account__avatar">{{ auth.utilisateur?.identifiant.slice(0, 2).toUpperCase() }}</div>
        <div class="account__body">
          <strong>{{ auth.utilisateur?.identifiant }}</strong>
          <RoleBadge :role="auth.utilisateur?.role" />
        </div>
        <button class="icon-button" type="button" title="Se déconnecter" aria-label="Se déconnecter" @click="logout">↪</button>
      </div>
    </aside>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>
