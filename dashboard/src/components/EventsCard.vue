<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, onMounted, ref} from "vue";

const events = ref(null)
const error = ref<string | null>(null)
const loading = ref(false)
const selectedEvent = ref(null)
const selectedClientId = ref(null)
const clients = ref(null)


onBeforeMount(() => {
    fetchClients()
})

async function fetchClients() {
    error.value = clients.value = null
    loading.value = true
    
    try {
        const response = await axios.get('http://localhost:3001/get-all-users')
        //res: {data: {CLIENT_ID: string, CLIENT_NAME: string}[]}
        clients.value = response.data.map((client) => {
            return client.CLIENT_ID
        })
        console.log(clients.value)
    } catch (err: any) {
        error.value = err
    } finally {
        loading.value = false
    }
    
}

async function fetchEvents() {
    if (!selectedClientId.value) {
        error.value = "Please select a client"
        return
    }
    
    error.value = events.value = null
    loading.value = true
    
    try {
        const allEvents = await axios.get(`http://localhost:3001/get-all-available-eventTypes`)
        const subscribedEvents = await axios.get(`http://localhost:3001/get-client-subscribed-events`, {
            params: {
                clientId: selectedClientId.value
            }
        })
        events.value = allEvents.data
        selectedEvent.value = subscribedEvents.data.map((event) => {
            return event.EventName
        })
    } catch (err: any) {
        error.value = err
    } finally {
        loading.value = false
    }
}

async function updateSubbedEvents() {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 3000)
}
</script>

<template>
    <va-card>
        <va-card-title>
            Client Event
        </va-card-title>
        <va-card-content>
            <div v-if="error">{{ error }}</div>
            <div v-else class="eventSelector">
                <VaSelect
                    v-model="selectedClientId"
                    label="Select Client"
                    :options="clients ?? []"
                    :disabled="loading || !clients"
                    placeholder="Select a client"
                    width="200px"
                    no-options-text="No clients available"
                    
                    @update:modelValue="fetchEvents"/>
                <VaSelect
                    v-model="selectedEvent"
                    placeholder="Select Events"
                    label="Subscribed Events"
                    :options="events ?? []"
                    :disabled="!selectedClientId"
                    no-options-text="No events available"
                    
                    multiple
                    :loading="loading"
                    @update:modelValue="updateSubbedEvents"
                />
            </div>
        </va-card-content>
    </va-card>
</template>

<style scoped>
.eventSelector {
    display: flex;
    gap: 20px;
    flex-direction: column;
}
</style>