<script setup lang="ts">
import {useModal, useToast} from 'vuestic-ui'
import ClientsTable from "./widgets/ClientsTable.vue";






const {init: notify} = useToast()





</script>

<template>
  <h1 class="page-title">Clients</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          />
          <VaInput  placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small"/>
            </template>
          </VaInput>
        </div>
        <VaButton >Add User</VaButton>
      </div>

      <ClientsTable/>
    </VaCardContent>
  </VaCard>


</template>
