<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';

let instructions = ref('');
let selectedClient = ref('');
let clients = ref([]);

const getClients = async () => {
  const response = await axios.get('http://localhost:3001/get-all-users');
  clients.value = response.data;
};

const sendInstructions = async () => {
  try {
    const response = await axios.post('http://localhost:3001/send-instructions', {
      clientID: selectedClient.value,
      instructions: instructions.value
    });
    console.log("Instructions sent to client:", instructions.value);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

onBeforeMount(getClients);
</script>

<template>
  <va-card>
    <va-card-title>
      Instruction Sender
    </va-card-title>
    <va-card-content>
      <div style="display: flex;flex-direction: column">
        <select v-model="selectedClient">
          <option v-for="client in clients" :value="client.CLIENT_ID">
            {{ client.CLIENT_ID }}
          </option>
        </select>
        <textarea v-model="instructions" placeholder="Enter instructions"></textarea>
        <button @click="sendInstructions">Send Instructions</button>
      </div>
    </va-card-content>
  </va-card>
</template>



<style scoped>
/* Add your styles here */
</style>