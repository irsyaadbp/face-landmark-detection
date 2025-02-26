<template>
  <div id="app">
    <h1>Face Detection with MediaPipe FaceMesh</h1>

    <component :is="component[runtimeActive]" />
    <div>
      <button @click="runtimeActive = 'mediapipe'" :disabled="runtimeActive === 'mediapipe'">Mediapipe</button>
      <button @click="runtimeActive = 'tfjs'" :disabled="runtimeActive === 'tfjs'">Tfjs</button>
      <button @click="runtimeActive = 'normal'" :disabled="runtimeActive === 'normal'">Tfjs</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageTfjs from "./page/Tfjs.vue";
import PageMediaPipe from "./page/MediaPipe.vue";
import Normal from "./page/Normal.vue";

const runtimeActive = ref('mediapipe')

const component = {
  mediapipe: PageMediaPipe,
  tfjs: PageTfjs,
  normal: Normal
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
