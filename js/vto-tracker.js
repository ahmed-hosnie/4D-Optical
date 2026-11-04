/* CPU inference runs in a worker so tracking cannot block camera playback. */
(function () {
  'use strict';
  const workerURL = new URL('vto-worker.js?v=3', document.currentScript.src).href;
  class FaceTracker {
    constructor() {
      this.worker = new Worker(workerURL);
      this.pending = new Map();
      this.serial = 0;
      this.closed = false;
      this.userClosed = false;
      this.mainTracker = null;
      this.worker.onmessage = ({ data }) => {
        const request = this.pending.get(data.id);
        if (!request) return;
        clearTimeout(request.timer);
        this.pending.delete(data.id);
        if (data.error) request.reject(new Error(data.error));
        else request.resolve(data);
      };
      this.worker.onerror = event => this.fail(new Error(event.message || 'Tracking worker could not load'));
    }
    request(message, transfers = [], timeout = 20000) {
      if (this.closed) return Promise.reject(new Error('Tracker closed'));
      const id = ++this.serial;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => this.fail(new Error('Tracking timed out')), timeout);
        this.pending.set(id, { resolve, reject, timer });
        this.worker.postMessage({ ...message, id }, transfers);
      });
    }
    async initialize() {
      try { return await this.request({ type: 'init' }, [], 45000); }
      catch (error) {
        if (this.userClosed) throw error;
        return this.initializeMain();
      }
    }
    async initializeMain() {
      // Safari and some Android browsers expose WebGL only on the main thread.
      if (this.worker) this.worker.terminate();
      this.worker = null; this.closed = false;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!context || !window.Vision) throw new Error('Face tracking needs WebGL support');
      const files = await Vision.FilesetResolver.forVisionTasks(new URL('../vendor/mediapipe/wasm', workerURL).href);
      const tracker = await Vision.FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: new URL('../vendor/mediapipe/face_landmarker.task', workerURL).href, delegate: 'CPU' },
        canvas, runningMode: 'VIDEO', numFaces: 1, outputFacialTransformationMatrixes: true
      });
      if (this.userClosed) { tracker.close(); throw new Error('Tracker closed'); }
      this.mainTracker = tracker; this.mainMode = 'VIDEO';
    }
    async detectMain(image, photo) {
      const mode = photo ? 'IMAGE' : 'VIDEO';
      if (mode !== this.mainMode) { await this.mainTracker.setOptions({ runningMode: mode }); this.mainMode = mode; }
      const result = photo ? this.mainTracker.detect(image) : this.mainTracker.detectForVideo(image, performance.now());
      return { multiFaceLandmarks: result.faceLandmarks, faceMatrix: result.facialTransformationMatrixes[0]?.data || null };
    }
    async detect(image, photo) {
      if (this.mainTracker) return this.detectMain(image, photo);
      const width = image.videoWidth || image.naturalWidth || image.width;
      const height = image.videoHeight || image.naturalHeight || image.height;
      if (!width || !height) throw new Error('The camera has no image frames yet');
      const ratio = Math.min(1, 960 / Math.max(width, height));
      const options = { resizeWidth: Math.round(width * ratio), resizeHeight: Math.round(height * ratio) };
      let bitmap;
      try {
        bitmap = await createImageBitmap(image, options);
      } catch (error) {
        // Some Safari versions cannot snapshot a video directly.
        const canvas = document.createElement('canvas');
        canvas.width = options.resizeWidth; canvas.height = options.resizeHeight;
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        bitmap = await createImageBitmap(canvas);
      }
      if (this.closed) { bitmap.close(); throw new Error('Tracker closed'); }
      try {
        return await this.request({ type: 'frame', photo, bitmap, timestamp: performance.now() }, [bitmap]);
      } catch (error) {
        if (this.userClosed) throw error;
        await this.initializeMain();
        return this.detectMain(image, photo);
      }
    }
    fail(error) {
      for (const request of this.pending.values()) {
        clearTimeout(request.timer); request.reject(error);
      }
      this.pending.clear(); if (this.worker) this.worker.terminate(); this.closed = true;
    }
    close() { this.userClosed = true; this.fail(new Error('Tracker closed')); if (this.mainTracker) this.mainTracker.close(); }
  }
  window.VTOFaceTracker = FaceTracker;
})();
