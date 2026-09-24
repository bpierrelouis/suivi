<script setup>
defineProps({
  label: { type: String, default: "" },
  title: { type: String, required: true },
  wide: { type: Boolean, default: false },
  stable: { type: Boolean, default: false },
});

defineEmits(["close"]);
</script>

<template>
  <div class="modal-backdrop" role="presentation">
    <section class="modal" :class="{ 'modal--wide': wide, 'modal--stable': stable }" role="dialog" aria-modal="true" :aria-labelledby="$attrs['aria-labelledby'] || 'modal-title'" @keydown.esc="$emit('close')">
      <header class="modal__header">
        <div>
          <span v-if="label" class="context-badge">{{ label }}</span>
          <h1 id="modal-title">{{ title }}</h1>
        </div>
        <div class="modal__header-actions"><slot name="actions" /><button class="close-button" type="button" aria-label="Fermer" @click="$emit('close')">×</button></div>
      </header>
      <slot />
    </section>
  </div>
</template>
