<script setup>
import { inject, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ModalShell from "../components/ModalShell.vue";
import { api } from "../services/api.js";

const router = useRouter();
const form = reactive({ nom: "", description: "", visibilite: "public", dateDebut: "", dateFin: "" });
const erreur = ref("");
const envoi = ref(false);
const rafraichirProjets = inject("rafraichirProjets", async () => {});

function close() { router.push({ name: "projets" }); }

async function submit() {
  erreur.value = "";
  envoi.value = true;
  try {
    const projet = await api("/projets", { method: "POST", body: JSON.stringify(form) });
    await rafraichirProjets();
    await router.push({ name: "projet-detail", params: { id: projet.id } });
  } catch {
    erreur.value = "Le projet n’a pas pu être créé. Vérifiez les informations saisies.";
  } finally {
    envoi.value = false;
  }
}
</script>

<template>
  <ModalShell label="Nouveau projet" title="Créer un projet" @close="close">
    <form class="modal__body form-grid" @submit.prevent="submit">
      <label class="form-grid__wide">Nom du projet<input v-model="form.nom" required maxlength="120" placeholder="Nom du projet" /></label>
      <label class="form-grid__wide">Description<textarea v-model="form.description" required maxlength="5000" rows="4" placeholder="Décrivez les objectifs du projet"></textarea></label>
      <label>Visibilité<select v-model="form.visibilite"><option value="public">Public</option><option value="prive">Privé</option></select></label>
      <span></span>
      <label>Date de début<input v-model="form.dateDebut" type="date" /></label>
      <label>Date de fin<input v-model="form.dateFin" type="date" :min="form.dateDebut || undefined" /></label>
      <p v-if="erreur" class="form-error form-grid__wide" role="alert">{{ erreur }}</p>
      <footer class="modal__footer form-grid__wide"><button class="button button--secondary" type="button" @click="close">Annuler</button><button class="button button--primary" :disabled="envoi">{{ envoi ? "Création…" : "Créer le projet" }}</button></footer>
    </form>
  </ModalShell>
</template>
