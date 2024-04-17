<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <VaButton @click="openModal">
    Show modal with close icon
  </VaButton>
  <VaModal
      v-model="showModal"
      ok-text="Apply"
      close-button
      @close="closeModal"
  >
    <h3 class="va-h3">
      Title
    </h3>
    <p>
      Classic modal overlay which represents a dialog box or other interactive
      component, such as a dismissible alert, sub-window, etc.
    </p>
  </VaModal>
</template>
