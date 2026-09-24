<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { api } from "../services/api.js";

const auth = useAuthStore();
const router = useRouter();
const nonLues = ref(0);
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
function updateNotificationCount(event) { nonLues.value = event.detail; }
onMounted(async () => { window.addEventListener("notifications-updated", updateNotificationCount); try { nonLues.value = (await api("/notifications")).nonLues; } catch { nonLues.value = 0; } });
onUnmounted(() => window.removeEventListener("notifications-updated", updateNotificationCount));
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
        <RouterLink to="/notifications" class="nav__link">
          <span class="nav__icon" aria-hidden="true">N</span> Notifications
          <span v-if="nonLues" class="notification-count">{{ nonLues }}</span>
        </RouterLink>
      </nav>

      <div class="account">
        <strong>{{ roleLabel }}</strong>
        <small>Session active</small>
      </div>
      <button class="logout-button" type="button" @click="logout"><span aria-hidden="true">↪</span> Déconnexion</button>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div class="topbar__context"><strong>Espace laboratoire</strong><span>Inventaire et suivi des projets</span></div>
        <div class="topbar__account">
          <RouterLink class="notification-button" to="/notifications" :aria-label="`${nonLues} notification(s) non lue(s)`">○<span v-if="nonLues">{{ nonLues }}</span></RouterLink>
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
