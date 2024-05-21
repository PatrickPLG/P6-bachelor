<script setup lang="ts">
import axios from 'axios'
import {defineVaDataTableColumns, useToast} from "vuestic-ui";
import {onMounted, ref} from "vue";
import {IClientTableData, UseClients} from "../composables/useClients";


const useClients = UseClients()

const tableData = ref<IClientTableData[]>([])

const getTableData = () => {

  useClients.getClientTableData().then((data) => {
    if (!data || data.length === 0) {
      console.error("No data returned")
      return
    }
    tableData.value = data
    console.log(tableData.value)
  }).catch((error) => {
    useToast().notify({
      title: error.message,
      message: 'Failed to get client data',
      color: 'danger',
    })
  })
}

const deleteClient = (clientId: string) => {
  useClients.deleteClient(clientId).then(() => {
    getTableData()
    useToast().notify({
      title: 'Success',
      message: `Client successfully deleted`,
      color: 'success',
    })
  }).catch((error) => {
    console.error(error)
    useToast().notify({
      title: error.message,
      message: `Failed to delete client ${clientId}`,
      color: 'danger',
    })
  })

}

onMounted(() => {
  getTableData()
})

const columns = defineVaDataTableColumns([
  {label: 'ID', key: 'ID', sortable: true},
  {label: 'Client ID', key: 'CLIENT_ID', sortable: true},
  {label: 'Events', key: 'events', sortable: true},
  {label: 'Active', key: 'isActive', sortable: true},
  {label: ' ', key: 'actions', align: 'right'},
])

const formatEvents = (events: string[]) => {
  return events.join(', ')
}


defineExpose({
  getTableData
})

</script>

<template>
  <VaDataTable
    :columns="columns"
    :items="tableData"
    no-data-html="No clients found"
  >
    <template #cell(ID)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.ID }}
      </div>
    </template>

    <template #cell(CLIENT_ID)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.CLIENT_ID }}
      </div>
    </template>

    <template #cell(isActive)="{ rowData }">
      <VaBadge :text="rowData.isActive ? 'active' : 'inactive'" :color="rowData.isActive ? '#00ff00' : '#f00'"/>
    </template>

    <template #cell(events)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{ formatEvents(rowData.events) }}
      </div>
    </template>


    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit user"
          @click="console.log('edit')"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete user"
          @click="deleteClient(rowData.CLIENT_ID)"
        />
      </div>
    </template>
  </VaDataTable>

  <!--
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>{{ $props.pagination.total }} results.</b>
        Results per page
        <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
      </div>

      <div v-if="totalPages > 1" class="flex">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="$props.pagination.page === 1"
          @click="$props.pagination.page&#45;&#45;"
        />
        <VaButton
          class="mr-2"
          preset="secondary"
          icon="va-arrow-right"
          aria-label="Next page"
          :disabled="$props.pagination.page === totalPages"
          @click="$props.pagination.page++"
        />
        <VaPagination
          v-model="$props.pagination.page"
          buttons-preset="secondary"
          :pages="totalPages"
          :visible-pages="5"
          :boundary-links="false"
          :direction-links="false"
        />
      </div>
    </div>
  -->
</template>

<style scoped lang="scss">

</style>
