import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh.js";
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
    requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);
    detectLoaded?.()
    console.log('detect bray', faces)
  };
  detect(detector);
};
