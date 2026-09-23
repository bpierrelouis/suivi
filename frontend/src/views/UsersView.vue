<script setup>
import { onMounted, ref } from "vue";
import AppLayout from "../components/AppLayout.vue";
import RoleBadge from "../components/RoleBadge.vue";
import { api } from "../services/api.js";

const utilisateurs = ref([]);
const erreur = ref("");
const traitement = ref("");

async function charger() {
  try {
    utilisateurs.value = (await api("/utilisateurs")).utilisateurs;
  } catch {
    erreur.value = "Impossible de charger les utilisateurs.";
  }
}

async function changerRole(utilisateur) {
  traitement.value = utilisateur.id;
  erreur.value = "";
  try {
    await api(`/utilisateurs/${utilisateur.id}/gestionnaire`, {
      method: "PATCH",
      body: JSON.stringify({ gestionnaire: utilisateur.role !== "gestionnaire" }),
    });
    await charger();
  } catch (error) {
    erreur.value = error.message === "GESTIONNAIRE_RESPONSABLE_PROJET"
      ? "Transférez d’abord les responsabilités de projet de cet utilisateur."
      : "Le rôle n’a pas pu être modifié.";
  } finally {
    traitement.value = "";
  }
}

onMounted(charger);
</script>

<template>
  <AppLayout>
    <div class="page-heading"><div><p class="eyebrow">Administration</p><h1>Utilisateurs</h1><p class="muted">Un seul gestionnaire peut être actif.</p></div></div>
    <p v-if="erreur" class="form-error" role="alert">{{ erreur }}</p>
    <section class="panel user-table-wrap">
      <table class="user-table"><thead><tr><th>Identifiant</th><th>Rôle</th><th>Action</th></tr></thead>
        <tbody><tr v-for="utilisateur in utilisateurs" :key="utilisateur.id">
          <td>{{ utilisateur.identifiant }}</td><td><RoleBadge :role="utilisateur.role" /></td>
          <td><button v-if="utilisateur.role !== 'administrateur'" class="button button--secondary" :disabled="traitement === utilisateur.id" @click="changerRole(utilisateur)">
            {{ utilisateur.role === "gestionnaire" ? "Retirer le rôle" : "Nommer gestionnaire" }}
          </button></td>
        </tr></tbody>
      </table>
    </section>
  </AppLayout>
</template>
