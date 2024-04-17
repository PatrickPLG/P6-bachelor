<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import axios from 'axios'

const loading = ref(false)

const users = ref([])
const selectedRows = ref(new Set<number>());
const getUsers = async () => {
  loading.value = true
  const response = await axios.get('http://localhost:3001/get-all-users')
  users.value = response.data
  console.log(users.value)
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const deleteUser = async (index: number) => {
  const id = users.value[index].CLIENT_ID
  console.log(id)
  if (!id) {
    console.error("No CLIENT_ID provided")
    return
  }

  const response = await axios.get('http://localhost:3001/delete-specific-user', {
    params: {
      appId: id
    }
  })
  users.value.splice(index, 1)
}

const deleteSelectedUsers = async () => {
  const sortedIndices = [...selectedRows.value].sort((a, b) => b - a);
  for (const index of sortedIndices) {
    await deleteUser(index);
  }
};

const toggleSelection = (index: number) => {
  const newSelection = new Set(selectedRows.value);
  if (newSelection.has(index)) {
    newSelection.delete(index);
  } else {
    newSelection.add(index);
  }
  selectedRows.value = newSelection;
};

const registerClient = async () => {
  try {
    loading.value = true;

    const response = await axios.get('http://localhost:3001/credentials');
    const newClientId = response.data;
    console.log("New CLIENT_ID generated:", newClientId);

    const registerResponse = await axios.post('http://localhost:3001/register-client', {CLIENT_ID: newClientId});
    console.log("Client registered:", registerResponse.data);

  } catch (error) {
    console.error("Error in client registration process", error);
  } finally {
    loading.value = false;
  }
};


onBeforeMount(() => {
  getUsers()
})
const columns = [
  {key: "select"},
  {key: "id", sortable: true},
  {key: "CLIENT_ID", sortable: true},
  {key: "actions", width: 80},
];

const input = "";

</script>

<template>

  <va-card>


    <va-card-title>
      Clients
    </va-card-title>

    <va-card-content>
      <VaDataTable v-if="users.length > 0"
                   class="table-crud"
                   striped
                   :items="users"
                   :columns="columns"
      >
        <template #cell(select)="{ rowIndex }">
          <va-checkbox :checked="selectedRows.has(rowIndex)" @click="() => toggleSelection(rowIndex)"/>
        </template>

        <template #cell(actions)="{ rowIndex }">
          <VaButton
              preset="plain"
              icon="edit"
              disabled


          />
          <VaButton
              preset="plain"
              icon="delete"
              class="ml-3"
              @click="deleteUser(rowIndex)"

          />
        </template>
      </VaDataTable>
    </va-card-content>

    <va-card-actions align="right">
      <va-button v-if="selectedRows.size > 0" @click="deleteSelectedUsers">Delete Selected</va-button>
      <va-button icon="refresh" :loading="loading" @click="getUsers()"/>
      <va-button color="primary" @click="registerClient">Generate New Client ID</va-button> <!-- New button here -->
    </va-card-actions>

  </va-card>
</template>

<style scoped>
.tableActions {
  display: flex;
  justify-content: flex-end;
}


</style>