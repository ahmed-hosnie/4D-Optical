/**
 * 4D OPTICAL - Model Loader & Engraving Texture Engine
 * Loads binary GLB models with GLTFLoader, applies '4D OPTICAL' laser engraving,
 * and maintains procedural fallback to ensure 100% uptime.
 */

import { Product3DConfig } from './types';

export class ModelLoader {
  private gltfLoader: any = null; // THREE.GLTFLoader
  private glbCache: Map<string, any> = new Map();

  constructor() {
    if (typeof (window as any).THREE !== 'undefined' && (window as any).THREE.GLTFLoader) {
      this.gltfLoader = new (window as any).THREE.GLTFLoader();
    }
  }

  /**
   * Generates a dynamic high-resolution texture with '4D OPTICAL' engraved in gold or white
   */
  public createBrandEngravingTexture(isGold: boolean = true): any {
    const THREE = (window as any).THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 36px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillStyle = isGold ? '#E5C07B' : '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.fillText('4D OPTICAL', 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Loads a GLB model with automatic procedural fallback
   */
  public async loadModel(
    config: Product3DConfig,
    proceduralFallbackFn: (config: Product3DConfig) => any
  ): Promise<any> {
    const glbUrl = config.glbUrl;

    if (this.glbCache.has(glbUrl)) {
      return this.glbCache.get(glbUrl).clone();
    }

    if (!this.gltfLoader) {
      console.warn('[ModelLoader] GLTFLoader not initialized. Using procedural replica.');
      return proceduralFallbackFn(config);
    }

    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        this.gltfLoader.load(
          glbUrl,
          (result: any) => resolve(result),
          undefined,
          (err: any) => reject(err)
        );
      });

      if (gltf && gltf.scene) {
        this.glbCache.set(glbUrl, gltf.scene);
        console.log('[ModelLoader] Successfully loaded GLB:', glbUrl);
        return gltf.scene.clone();
      }
    } catch (err) {
      console.warn(`[ModelLoader] GLB not found or error loading ${glbUrl}. Using exact procedural replica:`, err);
    }

    // Graceful procedural fallback
    return proceduralFallbackFn(config);
  }
}
