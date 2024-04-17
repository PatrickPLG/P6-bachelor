<script lang="ts" setup>


import axios from "axios";
import {computed, ref} from "vue";
import {socket} from "@/socket";
socket.on("update", async (...args) => {
    /*const response = await axios.get('http://localhost:3001/get-all-sensor-data')


    //parse sensor data to JSON
    sensors.value = response.data.map((sensor: any) => {
        return {
            SensorType: sensor.SensorType,
            Timestamp: sensor.Timestamp,
            SensorData: JSON.parse(sensor.SensorData)
        }
    })*/
});

const loading = ref(false)
const sensors = ref([])

const getSensors = async () => {
    selectedSensor.value = null
    loading.value = true
    const response = await axios.get('http://localhost:3001/get-all-sensor-data')


    //parse sensor data to JSON
    sensors.value = response.data.map((sensor: any) => {
        return {
            SensorType: sensor.SensorType,
            Timestamp: sensor.Timestamp,
            SensorData: JSON.parse(sensor.SensorData)
        }
    })
    console.log(sensors.value)
    setTimeout(() => {
        loading.value = false
    }, 1000)
}


const columns = [
    {key: "SensorType", sortable: true},
    {key: "Timestamp", sortable: true},
];


function onSelection(event) {

    console.log(event.currentSelectedItems.length)
    if (event.currentSelectedItems.length === 0) {
        selectedSensor.value = null
        return
    } else {
        selectedSensor.value = event.currentSelectedItems[0]
    }

}

const selectedSensor = ref(null)
const currentSelectedSensorData = computed(() => {
    if (selectedSensor.value) {
        return selectedSensor.value['SensorData']
    }
    return null
})

</script>

<template>
    <va-card>
        <va-card-title>
            Sensors
        </va-card-title>

        <va-card-content>
            <va-split vertical>
                <template #end  v-if="selectedSensor">
                    <va-alert>
                        <div v-for="(key,value) in selectedSensor['SensorData']">
                            <va-list>
                                <va-list-item>
                                    <va-list-item-section>
                                        {{ value }}
                                    </va-list-item-section>
                                    <va-list-item-section>
                                        {{ key }}
                                    </va-list-item-section>
                                </va-list-item>
                            </va-list>
                        </div>
                    </va-alert>
                </template>
                <template #start>
                    <VaDataTable v-if="sensors.length > 0"
                                 :columns="columns"
                                 :items="sensors"
                                 class="table-crud"
                                 select-mode="single"
                                 selectable
                                 striped
                                 @selectionChange="onSelection">

                    </VaDataTable>
                </template>
            </va-split>


        </va-card-content>

        <va-card-actions align="right">
            <va-button :loading="loading" icon="refresh" @click="getSensors()"/>
        </va-card-actions>

    </va-card>
</template>

<style scoped>

</style>