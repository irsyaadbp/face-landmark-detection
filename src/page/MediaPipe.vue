<template>
    <div id="app">
      <video ref="videoElement" id="video" autoplay playsinline webkit-playsinline muted="false"></video>
      <canvas ref="canvasElement" id="canvas"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from "vue";
  import "@tensorflow/tfjs-backend-webgl";
  import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
  import * as tf from "@tensorflow/tfjs-core";
  import * as faceMesh from '@mediapipe/face_mesh';
  
  import { drawResults } from "../utils/shared/util";
  
  const videoElement = ref(null);
  const canvasElement = ref(null);
  let faceModel: any = null;
  let animationId = null
  
  onMounted(async () => {
    console.log(tf.getBackend())
    await initDetector(); // Initialize model
    await startVideo();   // Start video streaming
  });
  
  async function initDetector() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: 'mediapipe', // Use MediaPipe runtime
      refineLandmarks: true,
       solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${
                faceMesh.VERSION}`
    };
  
    // Create and assign the detector to faceModel
    faceModel = await faceLandmarksDetection.createDetector(model, detectorConfig);
  }
  
  async function startVideo() {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    const ctx = canvas.getContext("2d");
  
    // Request access to the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  
    video.onloadedmetadata = () => {
      video.play();
      detectFace(); // Start face detection after video starts
    };
  
    // Set canvas size to match video
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
  
    // Detect face in video stream
    const detectFace = async () => {
      if (!faceModel) return;
  
      // Draw the current video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      console.log(video)
  
      const faces = await faceModel.estimateFaces(video); // Estimate faces from video
  
      // Clear previous canvas drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      console.log(faces)
      // If faces are detected
      if (faces.length > 0) {
        drawResults(ctx, faces, true, true)
      }
  
      // Continue detecting faces in next frame
      animationId = requestAnimationFrame(detectFace);
    };
  }

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
  