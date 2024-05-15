<script setup lang="ts">


import {ref} from "vue";

const eventLogicalOperators = [
    '>','<','>=','<=','==','!='
];
const selectedLogicalOperator = ref('AND');

</script>

<template>
    <va-card>
        <va-card-title>
            Event Creator
        </va-card-title>
        
        <va-card-content>
            <section class="container">
                <va-input v-model="input" placeholder="Event Name"/>
                <div class="logic">
                    <va-select />
                    <va-select v-model="selectedLogicalOperator" :options="eventLogicalOperators"   style="width: 60px;"/>
                    <va-input />
                </div>
            </section>
        </va-card-content>
        
        <va-card-actions>
            <va-button>create</va-button>
        </va-card-actions>
    </va-card>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.logic {
    display: grid;
    grid-template-columns: 1fr 0fr 1fr;
}
</style>