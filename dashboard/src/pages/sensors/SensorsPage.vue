<script setup lang="ts">

import SensorCards from "./widgets/SensorCards.vue";

</script>

<template>
  <h1 class="page-title">Sensors</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        </div>
      </div>
      <SensorCards/>

    </VaCardContent>

  </VaCard>
</template>
