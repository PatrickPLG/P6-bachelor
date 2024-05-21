<script setup lang="ts">

import {onMounted, PropType, ref, watch} from "vue";
import {UseClients} from "../composables/useClients";
import {useToast} from "vuestic-ui";

interface IClientData {
  events: string[],
  ID: number,
  CLIENT_ID: string,
  isActive: boolean
}
const emit = defineEmits(['update'])
const useClients = UseClients()
const props = defineProps({
  selectedClient: {
    type: Object as PropType<IClientData | null>,
  }
})
const currentClientEvents = ref<String[] | null>(null)
const events = ref<String[] | null>(null)

const getData = () => {
  if (props.selectedClient) {
    currentClientEvents.value = props.selectedClient.events
    useClients.getAllEvents().then((res) => {
      events.value = res
      console.log(res)
    })
  }
}
watch(() => props.selectedClient, () => {
  getData()
})

onMounted(() => {
  getData()
})

const onSave = () => {
  if (props.selectedClient && currentClientEvents.value) {
    const events = currentClientEvents.value.map((event) => {
      return {EventName: event}
    })
    console.log(events)
    UseClients().updateSubscribedEvents(props.selectedClient?.CLIENT_ID, currentClientEvents.value).then(() => {
      useToast().notify({
        title:'Success',
        message: 'Client events updated',
        color: 'ok',
      })
      emit('update')
    }).catch((error) => {
      console.error(error)
      useToast().notify({
        title: error.message,
        message: 'Failed to update client events',
        color: 'danger',
      })
    })
  }
}

</script>

<template>
  <va-modal v-bind="$attrs" ok-text="save" @ok="onSave">

    <va-select v-if="events && currentClientEvents" :options="events" multiple
               v-model="currentClientEvents"></va-select>

  </va-modal>
</template>

<style scoped lang="scss">

</style>
