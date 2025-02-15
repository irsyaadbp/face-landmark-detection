<template>
  <div id="app">
    <h1>Face Detection with MediaPipe FaceMesh</h1>
    <button @click="runtimeActive = 'mediapipe'" :disabled="runtimeActive === 'mediapipe'">Mediapipe</button>
    <button @click="runtimeActive = 'tfjs'" :disabled="runtimeActive === 'tfjs'">Tfjs</button>
    <component :is="component[runtimeActive]"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageTfjs from "./page/Tfjs.vue";
import PageMediaPipe from "./page/MediaPipe.vue";

const runtimeActive = ref('mediapipe')

const component = {
  mediapipe: PageMediaPipe,
  tfjs: PageTfjs
}

</script>

<style scoped>
video {
  display: block;
  max-width: 100%;
  height: auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
