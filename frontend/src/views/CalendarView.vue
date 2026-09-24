<script setup>
import { computed, onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

function monday(value = new Date()) { const date = new Date(value); date.setHours(0, 0, 0, 0); const day = date.getDay() || 7; date.setDate(date.getDate() - day + 1); return date; }
function addDays(value, amount) { const date = new Date(value); date.setDate(date.getDate() + amount); return date; }
const semaine = ref(monday()); const materiels = ref([]); const filtreMateriel = ref(""); const chargement = ref(true); const erreur = ref("");
const jours = computed(() => Array.from({ length: 7 }, (_, index) => addDays(semaine.value, index)));
const titreSemaine = computed(() => `Du ${formatDay(jours.value[0])} au ${formatDay(jours.value[6])}`);
function formatDay(value) { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(value); }
function dayName(value) { return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(value); }
function time(value) { return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
function eventsForDay(item, day) { const end = addDays(day, 1); return item.reservations.filter((event) => new Date(event.debut) < end && new Date(event.fin) > day); }
function eventTime(event, day) { const start = new Date(event.debut); const end = new Date(event.fin); const dayEnd = addDays(day, 1); return `${start <= day ? "00:00" : time(start)}–${end >= dayEnd ? "24:00" : time(end)}`; }
async function charger() { chargement.value = true; erreur.value = ""; try { const debut = semaine.value.toISOString(); const fin = addDays(semaine.value, 7).toISOString(); const params = new URLSearchParams({ debut, fin }); if (filtreMateriel.value) params.set("materielIds", filtreMateriel.value); materiels.value = (await api(`/materiels/calendrier?${params}`)).materiels; } catch { erreur.value = "Impossible de charger les disponibilités."; } finally { chargement.value = false; } }
function moveWeek(amount) { semaine.value = addDays(semaine.value, amount * 7); charger(); }
function currentWeek() { semaine.value = monday(); charger(); }
onMounted(charger);
</script>

<template>
  <AppLayout>
    <div class="page-heading"><div><h1>Calendrier de disponibilité</h1><p class="muted">Matériel individualisé · vue hebdomadaire en heure locale.</p></div><RouterLink class="button button--secondary" to="/inventaire">Retour à l’inventaire</RouterLink></div>
    <section class="info-banner"><div><strong>{{ titreSemaine }}</strong><p>Les projets auxquels vous n’avez pas accès sont affichés sous la mention « Réservé ».</p></div><div class="calendar-nav"><button class="button button--secondary" aria-label="Semaine précédente" @click="moveWeek(-1)">←</button><button class="button button--secondary" @click="currentWeek">Aujourd’hui</button><button class="button button--secondary" aria-label="Semaine suivante" @click="moveWeek(1)">→</button></div></section>
    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <div v-if="chargement" class="loading">Chargement du calendrier…</div>
    <section v-else-if="materiels.length" class="panel calendar-panel">
      <div class="calendar-grid calendar-grid--header"><strong>Matériel</strong><strong v-for="jour in jours" :key="jour.toISOString()">{{ dayName(jour) }}</strong></div>
      <div v-for="item in materiels" :key="item.id" class="calendar-grid calendar-grid--row"><div class="calendar-material"><strong>{{ item.nom }}</strong><small>{{ item.numeroInventaire || item.numeroSerie || 'Sans référence' }}</small></div><div v-for="jour in jours" :key="jour.toISOString()" class="calendar-day"><template v-if="eventsForDay(item, jour).length"><article v-for="event in eventsForDay(item, jour)" :key="event.id" class="calendar-event"><strong>{{ eventTime(event, jour) }}</strong><RouterLink v-if="event.projet.id" :to="{ name: 'projet-detail', params: { id: event.projet.id } }">{{ event.projet.nom }}</RouterLink><span v-else>{{ event.projet.nom }}</span></article></template><span v-else class="calendar-available">Disponible</span></div></div>
    </section>
    <section v-else class="panel empty-state empty-state--large"><strong>Aucun matériel individualisé</strong><p>Le calendrier affichera ici les équipements réservables et leurs créneaux.</p></section>
    <p class="calendar-note">Cette vue est informative. La création ou la modification d’une réservation s’effectue depuis un projet autorisé.</p>
  </AppLayout>
</template>
