<script setup>
import { computed } from "vue";
import AppLayout from "../components/AppLayout.vue";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const peutGerer = computed(() => ["administrateur", "gestionnaire"].includes(auth.utilisateur?.role));
const materiels = [
  { nom: "Oscilloscope MSO-4", reference: "OSC-042", mode: "Individualisé", categories: "Mesure, Électronique", disponible: true, maj: "12 min" },
  { nom: "Caméra thermique X2", reference: "CAM-117", mode: "Individualisé", categories: "Imagerie", disponible: false, maj: "48 min" },
  { nom: "Kit optique 532 nm", reference: "OPT-023", mode: "Non individualisé", categories: "Optique", disponible: true, maj: "2 h" },
  { nom: "Analyseur réseau VNA", reference: "VNA-008", mode: "Individualisé", categories: "RF, Mesure", disponible: false, maj: "Hier" },
  { nom: "Alimentation 30V / 5A", reference: "ALI-064", mode: "Non individualisé", categories: "Électronique", disponible: true, maj: "Hier" },
  { nom: "Capteur pression PX-9", reference: "CAP-191", mode: "Individualisé", categories: "Capteurs", disponible: true, maj: "3 j" },
];
</script>

<template>
  <AppLayout>
    <div class="page-heading">
      <div><h1>Inventaire du laboratoire</h1><p class="muted">Consultez le matériel actif, ses catégories et sa disponibilité.</p></div>
      <div v-if="peutGerer" class="page-actions"><button class="button button--secondary" disabled>Catégories</button><button class="button button--secondary" disabled>Exporter</button><button class="button button--primary" disabled>Nouveau matériel</button></div>
    </div>
    <section class="info-banner"><div><strong>{{ peutGerer ? "Aperçu de l’inventaire" : "Consultation de l’inventaire" }}</strong><p>Les opérations de gestion, les filtres et les fiches détaillées seront activés au Sprint 3.</p></div><span class="context-badge">Sprint 3</span></section>
    <section class="panel inventory-panel">
      <div class="inventory-filters" aria-label="Filtres à venir"><input placeholder="⌕ Rechercher un matériel…" disabled /><select disabled><option>Toutes catégories</option></select><select disabled><option>Mode de suivi</option></select><select disabled><option>Disponibilité</option></select><button class="button button--secondary" disabled>Réinitialiser</button></div>
      <div class="inventory-table-wrap"><table class="data-table"><thead><tr><th>Matériel</th><th>Référence</th><th>Mode de suivi</th><th>Catégories</th><th>Disponibilité</th><th>Mise à jour</th></tr></thead><tbody><tr v-for="materiel in materiels" :key="materiel.reference"><td><strong>{{ materiel.nom }}</strong></td><td>{{ materiel.reference }}</td><td>{{ materiel.mode }}</td><td>{{ materiel.categories }}</td><td><span class="availability-badge" :class="{ 'availability-badge--reserved': !materiel.disponible }">{{ materiel.disponible ? "Disponible" : "Réservé" }}</span></td><td>{{ materiel.maj }}</td></tr></tbody></table></div>
    </section>
  </AppLayout>
</template>
