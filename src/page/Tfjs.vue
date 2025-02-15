
<template>
    <div id="app">
      <video
        ref="videoRef"
        :width="inputResolution.width"
        :height="inputResolution.height"
        style="position:absolute"
        autoPlay
      />
      <canvas
        ref="canvasRef"
        :width="inputResolution.width"
        :height="inputResolution.height"
        style="position: absolute"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from "vue";
  import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import { runDetector } from "../utils-tfjs/detector.js";

  const videoRef = ref(null);
  const canvasRef = ref(null);
  const isLoaded = ref(false);

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

  onMounted(() => {
    startVideo()
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
  