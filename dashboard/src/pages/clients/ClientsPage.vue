<script setup lang="ts">
import {useModal, useToast} from 'vuestic-ui'
import ClientsTable from "./widgets/ClientsTable.vue";
import {UseClients} from "./composables/useClients";
import {ref} from "vue";



const useClients = UseClients()

const table = ref<InstanceType<typeof ClientsTable> | null>()

const onCreateClient = () => {
 useClients.registerClient().then(() => {
   useToast().notify({
     title: 'Success',
     message: 'Successfully created new client',
     color: 'ok',
   })
   if (table.value)
     table.value.getTableData();
 })

}

</script>

<template>
  <h1 class="page-title">Clients</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        </div>
        <VaButton icon="add" preset="secondary" plain @click="onCreateClient" />
      </div>
      <ClientsTable ref="table"/>
    </VaCardContent>
  </VaCard>


</template>
