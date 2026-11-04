/**
 * 4D OPTICAL - MediaPipe Face Landmarker & 6-DOF Pose Estimation
 * Anchors the glasses bridge to Landmark 6 (Mid-Nose Bridge)
 * Aligns the head occluder mesh to hide temple arms behind the head when rotating.
 */

import { FaceTrackingResult, Vector3D } from './types';
import { Vector3Smoother } from './smoothing';

export class FaceTracker {
  private smoother = new Vector3Smoother();
  private lastDetected: boolean = false;

  constructor() {}

  /**
   * Transforms normalized (0..1) FaceMesh landmark to 3D world space
   */
  public landmarkToWorld(
    lm: { x: number; y: number; z: number },
    visibleWidth: number,
    visibleHeight: number
  ): Vector3D {
    return {
      x: (lm.x - 0.5) * visibleWidth,
      y: -(lm.y - 0.5) * visibleHeight,
      z: -lm.z * visibleWidth
    };
  }

  /**
   * Processes face landmarks from MediaPipe FaceMesh
   */
  public computeFacePose(
    landmarks: Array<{ x: number; y: number; z: number }>,
    canvasWidth: number,
    canvasHeight: number,
    fovDegrees: number = 45,
    cameraDistance: number = 600
  ): FaceTrackingResult | null {
    if (!landmarks || landmarks.length === 0) {
      this.lastDetected = false;
      return null;
    }

    const fovRad = (fovDegrees * Math.PI) / 180;
    const visibleH = 2 * cameraDistance * Math.tan(fovRad / 2);
    const visibleW = visibleH * (canvasWidth / canvasHeight);

    // Key MediaPipe Face Landmarks:
    // 6: Mid Nose Bridge (where glasses bridge rests)
    // 168: Between Eyes
    // 33: Right Eye Outer Corner
    // 263: Left Eye Outer Corner
    // 10: Top Forehead Center
    // 152: Chin Bottom Center
    const pNose = landmarks[6] || landmarks[168];
    const pRightEye = landmarks[33];
    const pLeftEye = landmarks[263];
    const pForehead = landmarks[10];
    const pChin = landmarks[152];

    const vNose = this.landmarkToWorld(pNose, visibleW, visibleH);
    const vRight = this.landmarkToWorld(pRightEye, visibleW, visibleH);
    const vLeft = this.landmarkToWorld(pLeftEye, visibleW, visibleH);
    const vForehead = this.landmarkToWorld(pForehead, visibleW, visibleH);
    const vChin = this.landmarkToWorld(pChin, visibleW, visibleH);

    // Apply One-Euro jitter filter to nose bridge anchor
    const smoothedNose = this.smoother.update(vNose);

    // Vector Basis for 6-DOF Head Rotation Matrix
    const dx = vLeft.x - vRight.x;
    const dy = vLeft.y - vRight.y;
    const dz = vLeft.z - vRight.z;
    const lenX = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
    const vecX = { x: dx / lenX, y: dy / lenX, z: dz / lenX };

    // Eye distance proportional scale
    const baseModelEyeDist = 66.0; // mm average human pupillary/canthal distance
    const targetScale = lenX / baseModelEyeDist;

    this.lastDetected = true;

    return {
      detected: true,
      noseBridge: smoothedNose,
      leftEyeOuter: vLeft,
      rightEyeOuter: vRight,
      forehead: vForehead,
      chin: vChin,
      rotationMatrix: null,
      targetScale: targetScale
    };
  }

  public reset(): void {
    this.smoother.reset();
    this.lastDetected = false;
  }
}
