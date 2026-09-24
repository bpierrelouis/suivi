<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const notifications = ref([]); const nonLues = ref(0); const chargement = ref(true); const erreur = ref("");
function formatDate(value) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
async function charger() { chargement.value = true; try { const data = await api("/notifications"); notifications.value = data.notifications; nonLues.value = data.nonLues; } catch { erreur.value = "Impossible de charger vos notifications."; } finally { chargement.value = false; } }
async function lire(item) { if (item.luLe) return; try { await api(`/notifications/${item.id}/lu`, { method: "PATCH" }); item.luLe = new Date().toISOString(); nonLues.value = Math.max(0, nonLues.value - 1); window.dispatchEvent(new CustomEvent("notifications-updated", { detail: nonLues.value })); } catch { erreur.value = "La notification n’a pas pu être marquée comme lue."; } }
onMounted(charger);
</script>

<template>
  <AppLayout>
    <div class="page-heading"><div><h1>Notifications</h1><p class="muted">Les événements qui concernent vos projets et leurs réservations.</p></div><span class="context-badge">{{ nonLues }} non lue{{ nonLues > 1 ? 's' : '' }}</span></div>
    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <div v-if="chargement" class="loading">Chargement des notifications…</div>
    <section v-else-if="notifications.length" class="notification-list">
      <article v-for="item in notifications" :key="item.id" class="panel notification-card" :class="{ 'notification-card--unread': !item.luLe }">
        <div><span class="context-badge">{{ item.luLe ? 'Lue' : 'Nouvelle' }}</span><h2>{{ item.titre }}</h2><p>{{ item.message }}</p><small>{{ formatDate(item.creeLe) }}</small></div>
        <button v-if="!item.luLe" class="button button--secondary" @click="lire(item)">Marquer comme lue</button>
      </article>
    </section>
    <section v-else class="panel empty-state empty-state--large"><strong>Aucune notification</strong><p>Les changements importants liés à vos réservations apparaîtront ici.</p></section>
  </AppLayout>
</template>
