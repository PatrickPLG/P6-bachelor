<script setup lang="ts">
import { watch, ref } from 'vue';
import {VaModal} from "vuestic-ui";




const addModal = ref<HTMLDialogElement | null>(null)

const openModal= () => {
  if (addModal) addModal.value?.showModal()
}


</script>

<template>
  <div>
    <va-icon name="person_add" class="add_client_icon" color="success" @click="openModal"></va-icon>
    <dialog
        ref="addModal"
        class="dialog"
    >
      <h3 class="va-h3">
        Title
      </h3>
      <p>
        Classic modal overlay which represents a dialog box or other interactive
        component, such as a dismissible alert, sub-window, etc.
      </p>
    </dialog>
  </div>




</template>



<style scoped>
/* Add any modal-specific styles here */
dialog {
  border: none;
  outline: none;
  border-radius: 5px;
}

</style>
