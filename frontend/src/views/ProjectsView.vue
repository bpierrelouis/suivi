<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const projets = ref([]);
const chargement = ref(true);
const erreur = ref("");

onMounted(async () => {
  try {
    const data = await api("/projets");
    projets.value = data.projets;
  } catch {
    erreur.value = "Impossible de charger les projets.";
  } finally {
    chargement.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <div class="page-heading">
      <div>
        <p class="eyebrow">Collaboration</p>
        <h1>Projets</h1>
        <p class="muted">Les projets publics et les projets privés dont vous êtes membre.</p>
      </div>
      <RouterLink class="button button--primary" :to="{ name: 'projet-nouveau' }">Créer un projet</RouterLink>
    </div>

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
          <span class="visibility">{{ projet.visibilite === "public" ? "Public" : "Privé" }}</span>
          <span class="status-badge">{{ projet.statut === "actif" ? "Actif" : "Archivé" }}</span>
        </div>
        <h2>{{ projet.nom }}</h2>
        <p>{{ projet.description }}</p>
        <div class="project-card__footer">
          <span>Responsable : {{ projet.responsable.identifiant }}</span>
          <span>{{ projet.nombreMembres }} membre{{ projet.nombreMembres > 1 ? "s" : "" }}</span>
        </div>
      </RouterLink>
    </section>

    <section v-else class="panel empty-state empty-state--large">
      <strong>Aucun projet accessible</strong>
      <p>Vous ne participez encore à aucun projet privé et aucun projet public n’est disponible.</p>
    </section>
  </AppLayout>
</template>
