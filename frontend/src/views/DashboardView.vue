<script setup>
import { computed, onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const dashboard = ref(null);
const erreur = ref("");
const estAdmin = computed(() => dashboard.value?.utilisateur.role === "administrateur");
const estGestionnaire = computed(() => dashboard.value?.utilisateur.role === "gestionnaire");
const titre = computed(() => estAdmin.value ? "Tableau de bord administrateur" : estGestionnaire.value ? "Tableau de bord gestionnaire" : "Tableau de bord");

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
        <h1>{{ titre }}</h1>
        <p class="muted">Vue globale des projets, de l’inventaire et des accès.</p>
      </div>
      <div v-if="dashboard" class="page-actions">
        <RouterLink v-if="estAdmin" class="button button--secondary" to="/utilisateurs">Gérer les rôles</RouterLink>
        <RouterLink v-if="!estGestionnaire" class="button button--primary" to="/projets/nouveau">Nouveau projet</RouterLink>
      </div>
    </div>

    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <div v-else-if="!dashboard" class="loading">Chargement du tableau de bord…</div>

    <template v-else>
      <section class="metrics" aria-label="Indicateurs">
        <article class="metric-card">
          <span class="metric-card__icon">I</span><div><strong>{{ dashboard.indicateurs.materielsActifs }}</strong><small>Matériels actifs</small></div>
        </article>
        <article v-if="!estGestionnaire" class="metric-card">
          <span class="metric-card__icon">P</span><div><strong>{{ dashboard.indicateurs.projetsActifs }}</strong><small>Projets actifs</small></div>
        </article>
        <article v-if="dashboard.indicateurs.alertesInventaire !== null" class="metric-card">
          <span class="metric-card__icon">A</span><div><strong>{{ dashboard.indicateurs.alertesInventaire }}</strong><small>Alertes inventaire</small></div>
        </article>
      </section>

      <div class="dashboard-grid">
        <section v-if="!estGestionnaire" class="panel">
          <div class="panel__header">
            <h2>Tous les projets</h2>
            <RouterLink to="/projets">Voir les projets</RouterLink>
          </div>

          <div v-if="dashboard.projets.length" class="project-table">
            <div class="project-table__head"><span>Projet</span><span>Visibilité</span><span>Avancement</span><span>Statut</span></div>
            <div v-for="projet in dashboard.projets" :key="projet.id" class="project-table__row">
              <span><strong>{{ projet.nom }}</strong><small>{{ projet.id }}</small></span>
              <span><span class="visibility-badge" :class="`visibility-badge--${projet.visibilite}`">{{ projet.visibilite === 'public' ? 'Public' : 'Privé' }}</span></span>
              <span>{{ projet.progression }} %</span>
              <span><span class="status-badge">Actif</span></span>
            </div>
          </div>
          <div v-else class="empty-state">
            <strong>Aucun projet accessible</strong><p>Aucun projet autorisé n’est disponible.</p>
          </div>
        </section>

        <aside class="dashboard-aside">
          <section class="panel quick-actions">
            <h2>Actions rapides</h2>
            <RouterLink class="button button--soft" to="/inventaire">Gérer l’inventaire</RouterLink>
            <RouterLink v-if="!estGestionnaire" class="button button--secondary" to="/projets/nouveau">Créer un projet</RouterLink>
            <RouterLink v-if="estAdmin" class="button button--secondary" to="/utilisateurs">Attribuer le rôle gestionnaire</RouterLink>
          </section>
          <section class="panel">
          <div class="panel__header"><h2>Activité récente</h2></div>
          <div class="material-list">
            <article v-for="materiel in dashboard.materielsRecents" :key="materiel.id">
              <span class="material-icon">I</span><div><h3>{{ materiel.nom }}</h3><small>{{ materiel.id }} · {{ materiel.categorie }}</small></div>
            </article>
          </div>
          </section>
        </aside>
      </div>
    </template>
  </AppLayout>
</template>
