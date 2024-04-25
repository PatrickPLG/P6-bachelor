<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const color = ref('#FF0000');
const posX = ref(150);
const posY = ref(200);
const size = ref(50);

const emitDrawEvent = async () => {
  const drawData = {
    instructionType: 'circle',
    color: color.value,
    position: {
      x: posX.value,
      y: posY.value
    },
    size: size.value
  };

  try {
    const response = await axios.post('http://localhost:3001/emit-draw', {
      data: drawData
    });
    console.log("Response from emit-draw:", response.data);
  } catch (error) {
    console.error("Failed to emit draw event:", error);
  }
};
</script>


<template>
  <va-card>
    <va-card-title>
      Figure Creation
    </va-card-title>

    <div>
      <label for="color">Color:</label>
      <input type="color" id="color" v-model="color">

      <label for="posX">X Position:</label>
      <input type="number" id="posX" v-model="posX">

      <label for="posY">Y Position:</label>
      <input type="number" id="posY" v-model="posY">

      <label for="size">Size:</label>
      <input type="number" id="size" v-model="size">
    </div>

    <va-button @click="emitDrawEvent()">Emit Draw Event</va-button>
  </va-card>
</template>


<style scoped>

</style>