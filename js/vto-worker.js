importScripts('../vendor/mediapipe/vision_bundle.js');
const { FilesetResolver, FaceLandmarker } = Vision;

let landmarker;
let mode = 'VIDEO';
let lastTimestamp = -1;
self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    if (type === 'init') {
      const files = await FilesetResolver.forVisionTasks(new URL('../vendor/mediapipe/wasm', self.location.href).href);
      landmarker = await FaceLandmarker.createFromOptions(files, {
        canvas: new OffscreenCanvas(256, 256),
        baseOptions: {
          modelAssetPath: new URL('../vendor/mediapipe/face_landmarker.task', self.location.href).href,
          delegate: 'CPU'
        },
        runningMode: mode,
        numFaces: 1,
        minFaceDetectionConfidence: .55,
        minFacePresenceConfidence: .55,
        minTrackingConfidence: .55,
        outputFacialTransformationMatrixes: true
      });
      self.postMessage({ id, ready: true });
      return;
    }
    if (!landmarker) throw new Error('Face tracker is not ready');
    const nextMode = data.photo ? 'IMAGE' : 'VIDEO';
    if (mode !== nextMode) {
      await landmarker.setOptions({ runningMode: nextMode });
      mode = nextMode;
    }
    const timestamp = Math.max(lastTimestamp + 1, data.timestamp);
    lastTimestamp = timestamp;
    const result = data.photo ? landmarker.detect(data.bitmap) : landmarker.detectForVideo(data.bitmap, timestamp);
    self.postMessage({
      id,
      multiFaceLandmarks: result.faceLandmarks,
      faceMatrix: result.facialTransformationMatrixes[0]?.data || null
    });
  } catch (error) {
    self.postMessage({ id, error: error.message || String(error) });
  } finally {
    if (data.bitmap) data.bitmap.close();
  }
};
