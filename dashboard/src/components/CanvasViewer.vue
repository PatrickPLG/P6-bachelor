<script setup lang="ts">
import P5 from 'p5'
import {onMounted, provide, ref} from "vue";
import {Point} from "@/lib/shapes/point";
import {Circle} from "@/lib/shapes/circle";
import {Rectangle} from "@/lib/shapes/rectangle";
import type {IShape} from "@/lib/shapes/shapes";
import ShapeViewer from "@/components/ShapeViewer/ShapeViewer.vue";
import {array_move} from "@/lib/util_functions"; // Package from npm


const canvasContainer = ref<HTMLElement | null>(null);
const p5Instance = ref<P5 | null>(null);

const shapes = ref<IShape[]>([]);
const selectedShape = ref<IShape | null>(null);
const canvasWidth = ref(500);
const canvasHeight = ref(500);
const containerStyle = {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
}

provide('containerStyle', {canvasWidth, canvasHeight});

onMounted(() => {
    
    const sketch = (p: P5) => {
        p.setup = () => {
            p.createCanvas(1000 / 2, 1080 / 2);
            p.background(255);
            
            
        };
        
        p.draw = () => {
            p.background(255);
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
    
    if (canvasContainer.value)
        p5Instance.value = new P5(sketch, canvasContainer.value);
});


function onpointerdown() {
    if (!p5Instance.value) return;
    shapes.value.filter(shape => shape.dragEnabled)
        .find(shape => {
            if (shape.handleMousePressed(p5Instance.value as P5))
                selectedShape.value = shape;
        })
    
}

function onpointermove(event: PointerEvent) {
    if (!p5Instance.value) return;
    
    shapes.value.filter(shape => !shape.isDragged)
        .forEach(shape => shape.handleMouseOver(p5Instance.value as P5));
    shapes.value.filter(shape => shape.isDragged)
        .forEach(shape => {
            shape.handleMouseDragged(p5Instance.value as P5)
        });
}

function onpointerup(event: PointerEvent) {
    shapes.value.filter(shape => shape.isDragged)
        .forEach(shape => shape.handleMouseReleased());
}

function addCircle() {
    if (!p5Instance.value) return;
    const circle = new Circle(100, 100);
    circle.setSize(100);
    shapes.value.push(circle);
}

function addRectangle() {
    if (!p5Instance.value) return;
    const rect = new Rectangle(100, 100, 100, 100);
    shapes.value.push(rect);
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


function exportJson() {
    const json = shapes.value.map(shape => shape.toJSON());
    console.log(JSON.stringify(json));
}

</script>

<template>
    <section class="editor">
        
        
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
                
                
                </VaButtonDropdown>
            </div>
            
        
        </div>
        
        <va-button @click="exportJson">Export</va-button>
    
    </section>

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
        display: flex;
        gap: 10px;
        width: 100%;
        justify-content: center;
        align-items: flex-start;
        background-color: #f0f0f0;
    }
}


</style>