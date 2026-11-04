/**
 * 4D OPTICAL - Magnetic Clip-On Manager
 * Manages attaching, detaching, and animating the polarized sun clip over optical frames.
 */

export class ClipOnManager {
  private clipMeshGroup: any = null; // THREE.Group
  private isAttached: boolean = true;
  private onStateChangeCallback: ((attached: boolean) => void) | null = null;

  constructor() {}

  public registerClipMesh(meshGroup: any, initiallyAttached: boolean = true): void {
    this.clipMeshGroup = meshGroup;
    this.isAttached = initiallyAttached;
    this.applyState();
  }

  public isClipAttached(): boolean {
    return this.isAttached;
  }

  public toggle(): boolean {
    this.isAttached = !this.isAttached;
    this.applyState();
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isAttached);
    }
    return this.isAttached;
  }

  public setAttached(attached: boolean): void {
    this.isAttached = attached;
    this.applyState();
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isAttached);
    }
  }

  private applyState(): void {
    if (!this.clipMeshGroup) return;

    // Smoothly animate or hide clip
    this.clipMeshGroup.visible = this.isAttached;
    if (this.isAttached) {
      // Snapped into place: exact offset over the base frame
      this.clipMeshGroup.position.set(0, 0, 1.8);
    } else {
      // Detached: can be displaced or invisible
      this.clipMeshGroup.position.set(0, 15, 25);
    }
  }

  public onStateChange(callback: (attached: boolean) => void): void {
    this.onStateChangeCallback = callback;
  }
}
