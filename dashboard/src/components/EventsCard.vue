<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";

const events = ref(null)
const error = ref(null)
const loading = ref(false)
const selectedEvent = ref(null)

const endpoint = '/get-all-available-eventTypes'

onBeforeMount(() => {
    fetchData()
})

async function fetchData() {
    error.value = events.value = null
    loading.value = true
    
    try {
        const res = await axios.get(`http://localhost:3001${endpoint}`)
        events.value = res.data
    } catch (err: any) {
        error.value = err.response.data.message.toString()
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <va-card>
        <va-card-title>
            Client Event
        </va-card-title>
        <va-card-content>
            <div v-if="loading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else-if="events">
                <VaSelect
                    v-model="selectedEvent"
                    label="Multiple select"
                    :options="events"
                    multiple
                />
            </div>
        </va-card-content>
    </va-card>
</template>

<style scoped>

</style>