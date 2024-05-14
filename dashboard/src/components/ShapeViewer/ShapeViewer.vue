<script setup lang="ts">

import {computed, inject, onMounted, type PropType, reactive, type Ref, ref, watch} from "vue";
import {Circle, type IShape, Rectangle} from "@/lib/shapes/shapes";
import ShapeViewerItem from "@/components/ShapeViewer/ShapeViewerItem.vue";

const props = defineProps({
    shapes: Array as PropType<IShape[]>,
    selectedShape: Object as PropType<IShape | null>
})
const emit = defineEmits(['delete', 'select', 'moveBackward', 'moveForward']);

const containerStyle = inject('containerStyle') as { canvasWidth: Ref<number>, canvasHeight: Ref<number> };

const settingsState = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: '',
    size: 0,
    roundness: 0
})

watch(() => props.selectedShape, (newVal) => {
    if (!newVal) return;
    settingsState.x = newVal.x;
    settingsState.y = newVal.y;
    settingsState.width = newVal.width;
    settingsState.height = newVal.height;
    settingsState.color = newVal.color;
    settingsState.size = newVal.width;
    
    if (newVal instanceof Rectangle)
        settingsState.roundness = newVal.roundness;
    
})

function setWidth() {
    if (!props.selectedShape) return;
    if (props.selectedShape instanceof Rectangle)
        props.selectedShape.setWidth(settingsState.width)
}

function setY() {
    if (!props.selectedShape) return;
    props.selectedShape.setY(settingsState.y)
}

function setX() {
    if (!props.selectedShape) return;
    props.selectedShape.setX(settingsState.x)
}

function setSize() {
    if (!props.selectedShape) return;
    if (props.selectedShape instanceof Circle)
        props.selectedShape.setSize(settingsState.size)
}

function setRoundness() {
    if (!props.selectedShape) return;
    if (props.selectedShape instanceof Rectangle)
        props.selectedShape.setRoundness(settingsState.roundness)
}

function setHeight() {
    if (!props.selectedShape) return;
    if (props.selectedShape instanceof Rectangle)
        props.selectedShape.setHeight(settingsState.height)
}

function onMoveBackward() {
    emit('moveBackward', props.selectedShape)
}

function onMoveForward() {
    emit('moveForward', props.selectedShape)
}

function centerShape() {
    if (!props.selectedShape) return;
    props.selectedShape.centerShape(containerStyle.canvasWidth.value, containerStyle.canvasHeight.value)
}

function alignVerticalCenter() {
    if (!props.selectedShape) return;
    props.selectedShape.alignVerticalCenter(containerStyle.canvasHeight.value)
}

function alignHorizontalCenter() {
    if (!props.selectedShape) return;
    props.selectedShape.alignHorizontalCenter(containerStyle.canvasWidth.value)
}

</script>

<template>
    <div class="shapeViewer">
        <div class="shapeViewer__items" :class="{'showSetting':selectedShape}">
            <ShapeViewerItem v-for="shape in shapes" :shape="shape" @move-backward="onMoveBackward"
                             @moveForward="onMoveForward" @delete="emit('delete',shape)"
                             @select="emit('select', shape);" :selected-shape="selectedShape"/>
        </div>
        <div class="selectedSettings" v-if="selectedShape">
            <div class="header">
                <h3>{{ selectedShape.constructor.name }}</h3>
                
                <VaButton plain icon="center_focus_strong" @click="centerShape" size="small"/>
                <VaButton plain icon="align_vertical_center" @click="alignVerticalCenter" size="small"/>
                <VaButton plain icon="align_horizontal_center" @click="alignHorizontalCenter" size="small"/>
            </div>
            
            <div v-if="selectedShape.constructor.name === 'Text'">
<!--                <va-button-toggle
                    plain
                    v-model="selectedShape.x_align"
                    :options="[{
                    value:'right',
                    icon:'format_align_left'
                },
                {
                    value:'center',
                    icon:'format_align_center'
                },
                {
                    value:'left',
                    icon:'format_align_right'
                }]"
                />
                <va-button-toggle
                    plain
                    v-model="selectedShape.y_align"
                    :options="[{
                    value:'bottom',
                    icon:'vertical_align_top'
                },
                {
                    value:'center',
                    icon:'vertical_align_center'
                },
                {
                    value:'top',
                    icon:'vertical_align_bottom'
                }]" />-->
                <va-input v-model="selectedShape.text" label="Text"/>
            </div>
            
            <va-color-input indicator="square" label="fill color" v-model="selectedShape._color"/>
            <VaInput v-if="selectedShape.hasOwnProperty('roundness')"
                     v-model="settingsState.roundness"
                     class="mb-6 input"
                     inner-label
                     @input="setRoundness"
                     label="roundness"
            />
            <VaInput v-if="selectedShape instanceof Circle"
                     v-model="settingsState.size"
                     class="mb-6 input"
                     label="Size"
                     inner-label
                     @input="setSize"
            />
            <div class="options">
                
                
                <VaInput v-if="selectedShape.constructor.name === 'Rectangle'"
                         v-model="settingsState.width"
                         class="mb-6 input"
                         label="Width"
                         inner-label
                         @input="setWidth"
                />
                <VaInput v-if="selectedShape.constructor.name === 'Rectangle'"
                         v-model="settingsState.height"
                         class="mb-6 input"
                         inner-label
                         label="Height"
                         @input="setHeight"
                />
                
                <VaInput
                    v-model="settingsState.x"
                    class="mb-6 input"
                    inner-label
                    label="x"
                    @input="setX"
                />
                
                <VaInput
                    v-model="settingsState.y"
                    class="mb-6 input"
                    inner-label
                    label="y"
                    @input="setY"/>
            
            </div>
        
        
        </div>
    </div>
</template>

<style scoped>
.shapeViewer {
    display: grid;
    grid-template-rows: 1fr 0fr;
    height: 540px;
    width: 200px;
    background-color: white;
    border-right: 1px solid #e8e8e8;
    overflow: hidden;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    
    .shapeViewer__items {
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .selectedSettings {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 300px;
        gap: 10px;
        width: 200px;
        padding: 10px;
        border-top: 1px solid #e8e8e8;
        
        h3 {
            cursor: default;
        }
        
        .options {
            width: 180px;
            display: grid;
            gap: 10px;
            grid-template-columns: 77px 77px;
        }
    }
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>