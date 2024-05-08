<script lang="ts" setup>
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
    selectedRows.value = new Set();
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
}


onBeforeMount(() => {
    getUsers()
})
const columns = [
    {key: "select"},
    {key: "ID", sortable: true},
    {key: "CLIENT_ID", sortable: true},
];

const input = "";


const defaultItem = {
    ID: "",
    CLIENT_ID: "",
}


</script>

<template>
    <va-card>
        <va-card-title>
            Clients
        </va-card-title>
        
        <va-card-content>
            <VaDataTable v-if="users.length > 0"
                         :columns="columns"
                         :items="users"
                         class="table-crud"
                         striped>
                
                <template #cell(select)="{ rowIndex }">
                    <input :checked="selectedRows.has(rowIndex)"
                           type="checkbox"
                           @click.stop="toggleSelection(rowIndex)"/>
                </template>
            
            
            </VaDataTable>
        </va-card-content>
        
        <va-card-actions align="right">
            <va-button
                v-if="selectedRows.size > 0"
                color="danger"
                icon="delete_sweep"
                @click="deleteSelectedUsers">
            </va-button>
            <va-button :loading="loading" icon="refresh" @click="getUsers()"/>
        </va-card-actions>
    
    </va-card>
    
    
    <va-modal ref="modal" stateful>
        hello
    </va-modal>

</template>

<style scoped>


input[type="checkbox"] {
    transform: scale(1.4);
}


</style>