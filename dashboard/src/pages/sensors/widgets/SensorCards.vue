<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ISensorTableData, UseSensors} from "../composables/useSensors";
import {defineVaDataTableColumns} from "vuestic-ui";


const sensorsData = ref<ISensorTableData[]>([])
const loading = ref(true)


const useSensors = UseSensors()

onMounted(() => {
  getSensorData()
})

const getSensorData = () => {
  useSensors.getSensorTableData().then((data) => {
    sensorsData.value = data
    console.log(sensorsData.value)
  }).catch((error) => {
    console.error(error)
  })
}


</script>

<template>
  <VaInnerLoading
    v-if="sensorsData.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
  >
    <VaCard
      v-for="sensor in sensorsData"
      :key="sensor.sensorData"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="text-[var(--va-secondary)]">Updated: {{ sensor.timestamp }}</div>
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ sensor.sensorType }}
          </h4>

          <div class="va-table-responsive">
            <table class="va-table va-table--striped">
              <thead>
              <tr>
                <th class="va-table-cell">Key</th>
                <th class="va-table-cell">Value</th>
              </tr>
              </thead>
              <tr v-for="data in sensor.sensorData">
                <td class="va-table-cell">{{data.key}}</td>
                <td class="va-table-cell">{{ data.value }}</td>
              </tr>
            </table>
          </div>



        </div>
<!--        <div class="flex justify-between">
          <VaButton preset="secondary" icon="mso-edit" color="secondary"/>
          <VaButton preset="secondary" icon="mso-delete" color="danger"/>
        </div>-->
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No sensor data</div>
</template>

<style scoped lang="scss">

</style>
