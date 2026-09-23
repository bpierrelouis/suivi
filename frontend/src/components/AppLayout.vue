<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const router = useRouter();
const initiales = computed(() => auth.utilisateur?.identifiant.slice(0, 2).toUpperCase() || "SU");
const roleLabel = computed(() => ({
  administrateur: "Administrateur",
  gestionnaire: "Gestionnaire",
  utilisateur: "Utilisateur",
})[auth.utilisateur?.role] || "Utilisateur");

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
        <span class="brand__text">
          <strong>S.U.I.V.I.</strong>
          <small>Suivi des Usages,<br />Inventaires, Vie des projets<br />et IA</small>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="Navigation principale">
        <RouterLink to="/" class="nav__link">
          <span class="nav__icon" aria-hidden="true">A</span> Accueil
        </RouterLink>
        <RouterLink v-if="auth.utilisateur?.role !== 'gestionnaire'" to="/projets" class="nav__link">
          <span class="nav__icon" aria-hidden="true">P</span> Projets
        </RouterLink>
        <RouterLink to="/inventaire" class="nav__link">
          <span class="nav__icon" aria-hidden="true">I</span> Inventaire
        </RouterLink>
        <RouterLink v-if="auth.utilisateur?.role === 'administrateur'" to="/utilisateurs" class="nav__link">
          <span class="nav__icon" aria-hidden="true">U</span> Utilisateurs
        </RouterLink>
        <span class="nav__link nav__link--disabled" aria-disabled="true">
          <span class="nav__icon" aria-hidden="true">N</span> Notifications
        </span>
      </nav>

      <div class="account">
        <strong>{{ roleLabel }}</strong>
        <small>Session active</small>
      </div>
      <button class="logout-button" type="button" @click="logout"><span aria-hidden="true">↪</span> Déconnexion</button>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <label class="global-search">
          <span class="sr-only">Rechercher dans S.U.I.V.I.</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Rechercher dans S.U.I.V.I." disabled />
        </label>
        <div class="topbar__account">
          <button class="notification-button" type="button" aria-label="Notifications à venir" disabled>○<span></span></button>
          <span class="account__avatar">{{ initiales }}</span>
          <span><strong>{{ auth.utilisateur?.identifiant }}</strong><small>{{ roleLabel }}</small></span>
        </div>
      </header>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>
