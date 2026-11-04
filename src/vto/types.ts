/**
 * 4D OPTICAL - Virtual Try-On TypeScript Definitions
 * High-fidelity 3D Eyewear Augmented Reality Engine
 */

export type EyewearShape = 'clubmaster' | 'aviator' | 'square' | 'round' | 'cateye';

export type ColorTheme = 
  | 'black_gold' 
  | 'tortoise' 
  | 'crystal' 
  | 'gold' 
  | 'rose_gold' 
  | 'matte_black' 
  | 'emerald' 
  | 'navy' 
  | 'smoky';

export type LensTheme = 
  | 'sunglasses_green' 
  | 'sunglasses_dark' 
  | 'sunglasses_amber' 
  | 'sunglasses_pink' 
  | 'optical_clear' 
  | 'optical_bluecut' 
  | 'clip_polarized';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface RotationEuler {
  x: number;
  y: number;
  z: number;
}

export interface EyewearCalibration {
  frameWidthMm: number;        // e.g. 142mm
  bridgeWidthMm: number;       // e.g. 20mm
  templeLengthMm: number;      // e.g. 145mm
  lensHeightMm: number;        // e.g. 44mm
  anchorOffset: Vector3D;      // Translation relative to landmark 6 (nose bridge)
  rotationOffset: RotationEuler;
  scaleMultiplier: number;
  measurementsVerified: boolean; // true = physical measurement, false = calibrated estimation
  verificationNotes?: string;
}

export interface Product3DConfig extends EyewearCalibration {
  productId: string;
  shape3d: EyewearShape;
  colorTheme: ColorTheme;
  colorLabel: string;
  lensTheme: LensTheme;
  glbUrl: string;
  hasClipOn: boolean;
  clipAttached?: boolean;
}

export interface FaceLandmark {
  x: number; // Normalized 0..1
  y: number; // Normalized 0..1
  z: number; // Depth relative to face center
}

export interface FaceTrackingResult {
  detected: boolean;
  noseBridge: Vector3D;
  leftEyeOuter: Vector3D;
  rightEyeOuter: Vector3D;
  forehead: Vector3D;
  chin: Vector3D;
  rotationMatrix: any; // THREE.Matrix4
  targetScale: number;
}

export interface OneEuroFilterConfig {
  minCutoff: number; // Lower values = smoother at rest
  beta: number;      // Higher values = less lag during fast motion
  dCutoff: number;
}
