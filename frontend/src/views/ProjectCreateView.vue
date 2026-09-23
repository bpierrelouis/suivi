<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "../components/AppLayout.vue";
import { api } from "../services/api.js";

const router = useRouter();
const form = reactive({ nom: "", description: "", visibilite: "public", dateDebut: "", dateFin: "" });
const erreur = ref("");
const envoi = ref(false);

async function submit() {
  erreur.value = "";
  envoi.value = true;
  try {
    const projet = await api("/projets", { method: "POST", body: JSON.stringify(form) });
    await router.push({ name: "projet-detail", params: { id: projet.id } });
  } catch {
    erreur.value = "Le projet n’a pas pu être créé. Vérifiez les informations saisies.";
  } finally {
    envoi.value = false;
  }
}
</script>

<template>
  <AppLayout>
    <RouterLink class="back-link" :to="{ name: 'projets' }">← Retour aux projets</RouterLink>
    <div class="page-heading"><div><p class="eyebrow">Nouveau projet</p><h1>Créer un projet</h1></div></div>
    <form class="panel form-grid" @submit.prevent="submit">
      <label>Nom<input v-model="form.nom" required maxlength="120" /></label>
      <label>Visibilité
        <select v-model="form.visibilite"><option value="public">Public</option><option value="prive">Privé</option></select>
      </label>
      <label class="form-grid__wide">Description<textarea v-model="form.description" required maxlength="5000" rows="6"></textarea></label>
      <label>Date de début<input v-model="form.dateDebut" type="date" /></label>
      <label>Date de fin<input v-model="form.dateFin" type="date" :min="form.dateDebut || undefined" /></label>
      <p v-if="erreur" class="form-error form-grid__wide" role="alert">{{ erreur }}</p>
      <div class="form-actions form-grid__wide"><button class="button button--primary" :disabled="envoi">{{ envoi ? "Création…" : "Créer le projet" }}</button></div>
    </form>
  </AppLayout>
</template>
