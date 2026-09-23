<script setup>
import { computed, onMounted, provide, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const projets = ref([]);
const chargement = ref(true);
const erreur = ref("");
const nombreVisible = computed(() => `${projets.value.length} projet${projets.value.length > 1 ? "s" : ""} visible${projets.value.length > 1 ? "s" : ""}`);

function relationLabel(projet) {
  return ({ responsable: "Créateur", membre: "Membre", lecteur: "Lecture seule", administrateur: "Administrateur" })[projet.relation]
    || (projet.visibilite === "public" ? "Lecture seule" : "Membre");
}

async function charger() {
  chargement.value = true;
  try {
    const data = await api("/projets");
    projets.value = data.projets;
  } catch {
    erreur.value = "Impossible de charger les projets.";
  } finally {
    chargement.value = false;
  }
}

provide("rafraichirProjets", charger);
onMounted(charger);
</script>

<template>
  <AppLayout>
    <div class="page-heading">
      <div>
        <h1>Projets</h1>
        <p class="muted">Vos projets et les projets publics auxquels vous avez accès.</p>
      </div>
      <RouterLink class="button button--primary" :to="{ name: 'projet-nouveau' }">Nouveau projet</RouterLink>
    </div>

    <section class="info-banner"><div><strong>Vos droits dépendent de chaque projet</strong><p>Créateur, membre ou simple lecteur : les actions disponibles s’adaptent automatiquement.</p></div><span class="context-badge">{{ nombreVisible }}</span></section>

    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <div v-else-if="chargement" class="loading">Chargement des projets…</div>

    <section v-else-if="projets.length" class="project-cards" aria-label="Projets accessibles">
      <RouterLink
        v-for="projet in projets"
        :key="projet.id"
        class="project-card"
        :to="{ name: 'projet-detail', params: { id: projet.id } }"
      >
        <div class="project-card__header">
          <div><h2>{{ projet.nom }}</h2><p>{{ projet.description }}</p></div>
          <span class="visibility-badge visibility-badge--large" :class="`visibility-badge--${projet.visibilite}`">{{ projet.visibilite === "public" ? "Public" : "Privé" }}</span>
        </div>
        <div class="project-card__meta">
          <strong>{{ relationLabel(projet) }}</strong><span>{{ projet.nombreMembres }} membre{{ projet.nombreMembres > 1 ? "s" : "" }}</span><span>{{ projet.statut === "actif" ? "Actif" : "Archivé" }}</span>
        </div>
        <span class="relation-badge" :class="`relation-badge--${projet.relation || 'lecteur'}`">{{ relationLabel(projet) }}</span>
      </RouterLink>
    </section>

    <section v-else class="panel empty-state empty-state--large">
      <strong>Aucun projet accessible</strong>
      <p>Vous ne participez encore à aucun projet privé et aucun projet public n’est disponible.</p>
    </section>
    <RouterView />
  </AppLayout>
</template>
