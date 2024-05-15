<script setup lang="ts">
import P5 from 'p5'
import {onBeforeMount, onMounted, provide, ref} from "vue";
import {Text} from "@/lib/shapes/text";
import {Circle} from "@/lib/shapes/circle";
import {Rectangle} from "@/lib/shapes/rectangle";
import type {IShape} from "@/lib/shapes/shapes";
import ShapeViewer from "@/components/ShapeViewer/ShapeViewer.vue";
import {array_move} from "@/lib/util_functions";
import axios from "axios"; // Package from npm


const canvasContainer = ref<HTMLElement | null>(null);
const p5Instance = ref<P5 | null>(null);

const showSaveModal = ref(false);
const showLoadModal = ref(false);
const saveName = ref('');
const selectedSave = ref('');
const saves = ref([]);

const shapes = ref<IShape[]>([]);
const selectedShape = ref<IShape | null>(null);
const canvasWidth = ref(960);
const canvasHeight = ref(540);
const containerStyle = {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
}

provide('containerStyle', {canvasWidth, canvasHeight});
onBeforeMount(() => {
    getClients();
});
const sketch = (p: P5) => {
    
    
    p.setup = () => {
        p.createCanvas(960, 540);
    };
    
    
    p.draw = () => {
        p.background(253);
        
        
        try {
            if (shapes.value)
                shapes.value.forEach(s => {
                    if (s) s.draw(p)
                });
        } catch (e) {
            console.error(e);
        }
        
    };
};

function mountP5() {
    if (canvasContainer.value)
        p5Instance.value = new P5(sketch, canvasContainer.value);
}

onMounted(() => {
    mountP5();
    getSaveNames();
});

function getSaveNames() {
    const localSaves = localStorage.getItem('saves');
    if (localSaves) {
        const savesJson = JSON.parse(localSaves);
        saves.value = Object.keys(savesJson) as string[];
    }
    return [];
}
function saveToLocalStorage() {
    if (shapes.value.length === 0) return;
    const shapesMap = shapes.value.map(shape => shape?.toJSON());
    const shapesJson = JSON.stringify(shapesMap);
    const currentSaves = localStorage.getItem('saves');
    if (currentSaves) {
        const saves = JSON.parse(currentSaves);
        saves[saveName.value] = shapesJson;
        localStorage.setItem('saves', JSON.stringify(saves));
    } else {
        const saves = {
            [saveName.value]: shapesJson
        }
        localStorage.setItem('saves', JSON.stringify(saves));
    }
    getSaveNames();
}

function loadFromLocalStorage() {
    const saves = localStorage.getItem('saves');
    const shapesJson = saves ? JSON.parse(saves)[selectedSave.value] : null;
    if (shapesJson) {
        const shapesArray = JSON.parse(shapesJson);
        shapes.value = shapesArray.map((shape: any) => {
            console.log(shape);
            if (shape.instructionType === 'circle') {
                const circle = new Circle(shape.position.x / 2, shape.position.y / 2);
                circle.setSize(shape.size / 2);
                return circle;
            } else if (shape.instructionType === 'rectangle') {
                return new Rectangle(shape.position.x / 2, shape.position.y / 2, shape.width / 2, shape.height / 2);
            } else if (shape.instructionType === 'text') {
                return new Text(p5Instance.value as P5, shape.text, shape.position.x / 2, shape.position.y / 2);
            }
            return null;
        });
    }
    console.log(shapes.value);
}

function onpointerdown() {
    if (!shapes.value) return;
    if (!p5Instance.value) return;
    shapes.value.filter(shape => shape?.dragEnabled)
        .find(shape => {
            if (shape?.handleMousePressed(p5Instance.value as P5))
                selectedShape.value = shape;
        })
    
}

function onpointermove(event: PointerEvent) {
    if (!shapes.value) return;
    if (!p5Instance.value) return;
    
    let isHovering = false;
    shapes.value.filter(shape => !shape?.isDragged)
        .forEach(shape => {
            if (shape?.handleMouseOver(p5Instance.value as P5)) {
                isHovering = true;
            }
            
        });
    shapes.value.filter(shape => shape?.isDragged)
        .forEach(shape => {
            shape?.handleMouseDragged(p5Instance.value as P5)
        });
    
    if (isHovering) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
}

function onpointerup(event: PointerEvent) {
    if (!shapes.value) return;
    shapes.value.filter(shape => shape?.isDragged)
        .forEach(shape => shape?.handleMouseReleased());
}

function addCircle(x?: number, y?: number, size?: number) {
    if (!p5Instance.value) return;
    if (x === undefined || y === undefined || size === undefined) {
        const circle = new Circle(100, 100);
        circle.setSize(100);
        shapes.value.push(circle);
    } else {
        const circle = new Circle(x, y);
        circle.setSize(size);
        shapes.value.push(circle);
    }
}

function addRectangle(x?: number, y?: number, width?: number, height?: number) {
    if (!p5Instance.value) return;
    if (x === undefined || y === undefined || width === undefined || height === undefined) {
        const rect = new Rectangle(100, 100, 100, 100);
        shapes.value.push(rect);
    } else {
        const rect = new Rectangle(x, y, width, height);
        shapes.value.push(rect);
    }
    
}

function addText(x?: number, y?: number) {
    if (!p5Instance.value) return;
    const p = p5Instance.value;
    if (x === undefined || y === undefined) {
        x = p.width / 2;
        y = p.height / 2;
    }
    const text = new Text(p5Instance.value, "Text", x, y);
    shapes.value.push(text);
}

function enableDrag() {
    shapes.value.forEach(shape => shape.dragEnabled = true);
}


function deleteShape(shape: IShape) {
    const index = shapes.value.indexOf(shape);
    if (index !== -1) {
        shapes.value.splice(index, 1);
    }
    
    if (selectedShape.value === shape)
        selectedShape.value = null;
}

function selectShape(shape: IShape) {
    if (selectedShape.value === shape)
        selectedShape.value = null;
    else
        selectedShape.value = shape;
}

function moveBack(shape: IShape) {
    const index = shapes.value.indexOf(shape);
    array_move(shapes.value, index, index - 1);
}

function moveForward(shape: IShape) {
    const index = shapes.value.indexOf(shape);
    array_move(shapes.value, index, index + 1);
}

const getClients = async () => {
    const response = await axios.get('http://localhost:3001/get-all-users');
    clients.value = response.data;
};

const clients = ref([]);
const selectedClient = ref('');

async function sendJsonToClient() {
    const json = shapes.value.map(shape => shape.toJSON());
    const instructions = json
    
    try {
        const response = await axios.post('http://localhost:3001/send-instructions', {
            clientID: selectedClient.value,
            instructions: instructions
        });
        console.log("Instructions sent to client:", instructions);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

</script>

<template>
    
    

    <section class="editor">
        <div class="toolbar">
<!--            <select v-model="selectedClient">
                <option v-for="client in clients" :value="client.CLIENT_ID">
                    {{ client.CLIENT_ID }}
                </option>
            </select>-->
            <VaMenu
                
                :options="['Option 1', 'Option 2', 'Option 3']"
                @selected="() => console.log($event)"
            >
                <template #anchor>
                    <VaButton>Open menu</VaButton>
                </template>
            </VaMenu>
         
            <va-button v-if="selectedClient" @click="sendJsonToClient">Export to client</va-button>
            <va-button  @click="showSaveModal = !showSaveModal">Save</va-button>
            <va-button @click="showLoadModal = !showLoadModal">Load</va-button>
        </div>
        
        <div class="editorContainer">
            <ShapeViewer :shapes="shapes" :selected-shape="selectedShape"
                         @moveBackward="moveBack"
                         @moveForward="moveForward"
                         @select="selectShape"
                         @delete="deleteShape"/>
            <div ref="canvasContainer"
                 @pointerup="onpointerup"
                 @pointerdown="onpointerdown"
                 @pointermove="onpointermove"
                 :style="containerStyle"
                 class="canvasContainer">
                <VaButtonDropdown
                    preset="secondary"
                    icon="add"
                    opened-icon="add"
                    class="addButton">
                    
                    <va-button preset="secondary" block @click="addCircle">Circle</va-button>
                    <va-button preset="secondary" block @click="addRectangle">Rectangle</va-button>
                    <va-button preset="secondary" block @click="addText">Text</va-button>
                
                
                </VaButtonDropdown>
            </div>
        
        
        </div>
    
    
    </section>
    
    <VaModal
        v-model="showSaveModal"
        ok-text="Save"
        message="Would you like to save?"
        size="auto"
        @ok="saveToLocalStorage"
    >
        <va-input v-model="saveName" placeholder="name" />
    </VaModal>
    <VaModal
        v-model="showLoadModal"
        ok-text="load"
        message="Would you like to save?"
        size="auto"
        @cancel="selectedSave = ''"
        @ok="loadFromLocalStorage"
    >
        <va-select v-model="selectedSave" :options="saves" placeholder="name" />
    </VaModal>
    
</template>

<style scoped>
.canvasContainer {
    position: relative;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    overflow: hidden;
}

.addButton {
    position: absolute;
    top: 10px;
    right: 10px;
    
    
}

.editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    
    .editorContainer {
        display: flex;
        justify-items: center;
    }
    
    .toolbar {
        width: 100%;
        justify-content: center;
        align-items: flex-start;
        background-color: #dadada;
    }
}


</style>