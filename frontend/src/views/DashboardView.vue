<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const dashboard = ref(null);
const erreur = ref("");

onMounted(async () => {
  try {
    dashboard.value = await api("/dashboard");
  } catch {
    erreur.value = "Impossible de charger le tableau de bord.";
  }
});
</script>

<template>
  <AppLayout>
    <div class="page-heading">
      <div>
        <p class="eyebrow">Vue d’ensemble</p>
        <h1>Tableau de bord</h1>
        <p v-if="dashboard" class="muted">Bonjour {{ dashboard.utilisateur.identifiant }}.</p>
      </div>
      <RouterLink v-if="dashboard?.accesDirectInventaire" class="button button--primary" to="/inventaire">
        Gérer l’inventaire
      </RouterLink>
    </div>

    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <div v-else-if="!dashboard" class="loading">Chargement du tableau de bord…</div>

    <template v-else>
      <section class="metrics" aria-label="Indicateurs">
        <article class="metric-card">
          <span>Projets accessibles</span>
          <strong>{{ dashboard.indicateurs.projetsActifs }}</strong>
          <small>selon vos droits</small>
        </article>
        <article class="metric-card">
          <span>Matériels actifs</span>
          <strong>{{ dashboard.indicateurs.materielsActifs }}</strong>
          <small>inventaire de démonstration</small>
        </article>
        <article v-if="dashboard.indicateurs.alertesInventaire !== null" class="metric-card metric-card--accent">
          <span>Alertes inventaire</span>
          <strong>{{ dashboard.indicateurs.alertesInventaire }}</strong>
          <small>à traiter</small>
        </article>
      </section>

      <div class="dashboard-grid">
        <section class="panel">
          <div class="panel__header">
            <div><p class="eyebrow">Projets</p><h2>Activité en cours</h2></div>
            <RouterLink v-if="dashboard.utilisateur.role !== 'gestionnaire'" to="/projets">Tout afficher</RouterLink>
          </div>

          <div v-if="dashboard.projets.length" class="project-list">
            <article v-for="projet in dashboard.projets" :key="projet.id" class="project-row">
              <div>
                <span class="visibility">{{ projet.visibilite === 'public' ? 'Public' : 'Privé' }}</span>
                <h3>{{ projet.nom }}</h3>
                <small>{{ projet.id }}</small>
              </div>
              <div class="progress" :aria-label="`${projet.progression}%`">
                <span :style="{ width: `${projet.progression}%` }"></span>
              </div>
              <strong>{{ projet.progression }}%</strong>
            </article>
          </div>
          <div v-else class="empty-state">
            <strong>Aucun projet accessible</strong>
            <p>Le rôle gestionnaire n’accède à aucune donnée de projet.</p>
          </div>
        </section>

        <section class="panel">
          <div class="panel__header"><div><p class="eyebrow">Inventaire</p><h2>Ajouts récents</h2></div></div>
          <div class="material-list">
            <article v-for="materiel in dashboard.materielsRecents" :key="materiel.id">
              <span class="material-icon">□</span>
              <div><h3>{{ materiel.nom }}</h3><small>{{ materiel.id }} · {{ materiel.categorie }}</small></div>
            </article>
          </div>
        </section>
      </div>
    </template>
  </AppLayout>
</template>
