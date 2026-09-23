<script setup>
defineProps({
  role: { type: String, required: true },
});

const labels = {
  administrateur: "Administrateur",
  gestionnaire: "Gestionnaire",
  utilisateur: "Utilisateur",
};
</script>

<template>
  <span class="role-badge" :class="`role-badge--${role}`">{{ labels[role] || role }}</span>
</template>
