<script setup lang="ts">
import type {IShape} from "../../../lib/shapes/shapes";
import {computed, type PropType, ref} from "vue";

const props = defineProps({
    shape: Object as PropType<IShape>,
    selectedShape: Object as PropType<IShape | null>
})
const emit = defineEmits(['delete', 'select', 'moveBackward', 'moveForward']);

const lockIcon = ref('lock_open');

const isSelected = computed(() => props.selectedShape === props.shape);

const onPointerEnter = () => {
    if (!props.shape) return;
    props.shape.isBeingHovered = true;
    props.shape.dragEnabled = true;
}

const onPointerLeave = () => {
    if (!props.shape) return;
    props.shape.isBeingHovered = false;
    props.shape.dragEnabled = lockIcon.value !== 'lock';
}

const toggleLock = () => {
    if (!props.shape) return;
    props.shape.dragEnabled = !props.shape.dragEnabled;
    lockIcon.value = props.shape.dragEnabled ? 'lock_open' : 'lock';
}

const getClass = computed(() => {
    return {
        'shapeViewerItem--selected': isSelected.value
    }
})

</script>

<template>
    <div v-if="shape"
         :class="getClass"
         class="shapeViewerItem"
         @pointerenter="onPointerEnter"
         @pointerleave="onPointerLeave"
         @click.prevent="emit('select',shape)">
        <div class="shapeViewerItem__actions">
            <h3>{{ shape.constructor.name }}</h3>

            <div class="shapeViewerItem__actions__container">

                <VaButton
                    :icon="lockIcon"
                    @click.prevent.stop="toggleLock"
                    size="small"
                />
                <VaButton
                    icon="delete"
                    color="warning"
                    @click.prevent.stop="emit('delete',shape)"
                    size="small"
                />
                <div class="indexActions">
                    <VaButton
                        icon="arrow_upward"
                        plain
                        @click.prevent.stop="emit('moveBackward',shape)"
                        size="small"
                    />
                    <VaButton
                        icon="arrow_downward"
                        plain
                        @click.prevent.stop="emit('moveForward',shape)"
                        size="small"
                    />

                </div>


            </div>

        </div>

    </div>

</template>

<style scoped>

.shapeViewerItem {
    user-select: none; /* Standard syntax */
    cursor: pointer;
    width: 100%;
    border-radius: 5px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e8e8e8;
    padding: 5px;

    .shapeViewerItem__actions {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .shapeViewerItem__actions__container {
            display: flex;
            justify-content: space-between;
            gap: 5px;
            align-items: center;
        }
    }


}

.indexActions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 14px;
}

h3 {
    margin: 0;
    cursor: default;
    font-size: 14px;
}

.shapeViewerItem--selected {
    outline: 2px solid #007bff;
}


</style>
