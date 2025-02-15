<template>
  <div id="app">
    <small v-if="loadingDetector">Loading detector...</small>
    <video ref="videoRef" :width="inputResolution.width" :height="inputResolution.height" autoPlay />
    <canvas ref="canvasRef" :width="inputResolution.width" :height="inputResolution.height"
      style="position: absolute" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import { runDetector } from "../utils-tfjs/detector.js";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "../utils-tfjs/drawMesh.js";


const videoRef = ref(null);
const canvasRef = ref(null);
const isLoaded = ref(false);
const loadingDetector = ref(true)
let animationId = null

const inputResolution = {
  width: 640,
  height: 480,
};

// Function to start video stream and run face detection
const startVideo = async () => {
  console.log('start video')
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  // Request access to webcam
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: inputResolution.width,
      height: inputResolution.height,
      facingMode: "user",
    },
  });

  video.srcObject = stream;
  video.play();

  // Once the video is loaded, start detection
  video.onloadedmetadata = () => {
    isLoaded.value = true;
    runDetector(video, canvas);
  };
};

export const runDetector = async (video, canvas, detectLoaded) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    const ctx = canvas.getContext("2d");
    animationId = requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);
    loadingDetector.value = false
    console.log('detect bray', faces)
  };
  detect(detector);
};


onMounted(() => {
  startVideo()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})


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