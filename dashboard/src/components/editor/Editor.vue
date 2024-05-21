<script setup lang="ts">
import P5 from 'p5'
import {computed, onBeforeMount, onMounted, provide, ref, watch, watchEffect} from "vue";
import {Text} from "../../lib/shapes/text";
import {Circle} from "../../lib/shapes/circle";
import {Rectangle} from "../../lib/shapes/rectangle";
import type {IShape} from "../../lib/shapes/shapes";
import ShapeViewer from "./ShapeViewer/ShapeViewer.vue";
import {array_move} from "../../lib/util_functions";
import {useColors} from "vuestic-ui";
import axios from "axios";
import {useToast} from "vuestic-ui";
import {Image} from "../../lib/shapes/image";
import {useDisplayMedia, useFileDialog} from "@vueuse/core";

const canvasContainer = ref<HTMLElement | null>(null);
const p5Instance = ref<P5 | null>(null);

const showSaveModal = ref(false);
const showLoadModal = ref(false);
const showExportModal = ref(false);
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
const {getColors} = useColors()

provide('containerStyle', {canvasWidth, canvasHeight});
onBeforeMount(() => {
  getClients();
});
const sketch = (p: P5) => {


  p.setup = () => {
    p.createCanvas(960, 540);
  };


  p.draw = () => {
    p.background(getColors().backgroundElement);


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

const {open, onChange} = useFileDialog({
  accept: 'image/*',
  multiple: false,
  reset: true,


})
onChange((file) => {
  if (!file) return;
  addImage(file);
});

function addImage(file: FileList, x?: number, y?: number, width?: number, height?: number) {
  if (!file) return;
  const img = file[0];
  //convert to base64
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = function () {
    const base64 = reader.result;
    if (!p5Instance.value) return;
    if (x === undefined || y === undefined || width === undefined || height === undefined) {
      const image = new Image(100, 100, 100, 100, undefined, base64 as string, p5Instance.value);
      shapes.value.push(image);
    } else {
      const image = new Image(x, y, width, height, undefined, base64 as string, p5Instance.value);
      shapes.value.push(image);
    }
  }


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


const clients = ref([]);
const selectedClient = ref('');
const getClients = async () => {
  await axios.get('http://localhost:3001/get-all-users').then((res) => {
    clients.value = res.data;
  }).catch((err) => {
    console.error("Error getting clients: ", err);
    useToast().notify({
      title: err.message,
      message: 'Error getting clients',
      color: 'danger',
      duration: 1500,
    });

  });


};

async function sendJsonToClient() {
  const instructions = shapes.value.map(shape => shape.toJSON())
  await axios.post('http://localhost:3001/send-instructions', {
    clientID: selectedClient.value,
    instructions: instructions
  }).then((res) => {
    useToast().notify({
      title: 'Instructions sent to client',
      message: res.data,
      color: 'success',
      duration: 2500,
    });
  }).catch((err) => {
    useToast().notify({
      title: err.message,
      message: 'Error sending instructions',
      color: 'danger',
      duration: 2500,
    });
  });
}

const clientSelectorOptions = computed(() => {
  return clients.value.map(client => {
    return client.CLIENT_ID
  });
});


</script>

<template>
  <section class="editorCard">
    <div class="toolbar">
      <div class="leadingActions">
        <va-button preset="secondary" size="small" @click="showLoadModal = !showLoadModal">Load</va-button>
        <va-button preset="secondary" size="small" @click="showSaveModal = !showSaveModal">Save</va-button>
        <va-button preset="secondary" size="small" @click="showExportModal = !showExportModal">Export</va-button>
      </div>
      <div class="center">
        {{ selectedSave }}
      </div>
      <div class="trailingActions">
        <VaButtonDropdown
          preset="primary"
          round
          placement="bottom-left"
          icon="add"
          stick-to-edges
          opened-icon="add">
          <va-button preset="secondary" block @click="addCircle">Circle</va-button>
          <va-button preset="secondary" block @click="addRectangle">Rectangle</va-button>
          <va-button preset="secondary" block @click="addText">Text</va-button>
          <va-button preset="secondary" block @click="open">Image</va-button>
        </VaButtonDropdown>
      </div>
    </div>
    <section class="containerCanvas">
      <div ref="canvasContainer"
           @pointerup="onpointerup"
           @pointerdown="onpointerdown"
           @pointermove="onpointermove"
           :style="containerStyle"
           class="editorCanvas"/>
      <p class="canvasSize">{{ canvasWidth * 2 }} x {{ canvasHeight * 2 }}</p>

      <ShapeViewer :shapes="shapes" :selected-shape="selectedShape"
                   @moveBackward="moveBack"
                   @moveForward="moveForward"
                   @select="selectShape"
                   @delete="deleteShape"
                   class="shapeViewer"/>
    </section>

  </section>

  <VaModal
    v-model="showSaveModal"
    ok-text="Save"
    message="Would you like to save?"
    size="auto"
    @ok="saveToLocalStorage"
  >
    <va-input v-model="saveName" placeholder="name"/>
  </VaModal>
  <VaModal
    v-model="showLoadModal"
    ok-text="load"
    message="Would you like to save?"
    size="auto"
    @cancel="selectedSave = ''"
    @ok="loadFromLocalStorage"
  >
    <va-select v-model="selectedSave" :options="saves" placeholder="name"/>
  </VaModal>
  <VaModal
    v-model="showExportModal"
    ok-text="Send"
    message="How would you like to export?"
    size="auto"
    @cancel="console.log('cancel')"
    @ok="sendJsonToClient"
  >
    <va-select v-model="selectedClient" :options="clientSelectorOptions" placeholder="Select client"/>
  </VaModal>


</template>

<style scoped lang="scss">

.editorCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  margin: 0 auto;
  overflow: hidden;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 100%;
    padding: 0 15px;
    border-bottom: 1px solid var(--va-background-border);
  }

  .containerCanvas {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 0fr;
    gap: 10px;
    width: 100%;
    justify-items: center;
    overflow: scroll;


    .editorCanvas {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 960px;
      height: 540px;
      margin: 20px;
    }

    .canvasSize {
      position: absolute;
      bottom: 0;
      left: 0;
      margin-left: 10px;
      opacity: 0.3;
      font-weight: 700;
      font-size: 12px;
    }
  }
}

.clientsCard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  gap: 20px;
}
</style>
