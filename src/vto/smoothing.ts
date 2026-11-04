/**
 * 4D OPTICAL - Jitter Reduction & Motion Smoothing
 * Implements adaptive double-exponential & One-Euro filtering for 6-DOF tracking.
 * Eliminates high-frequency camera micro-tremors (رعشة) while preserving snappy responsiveness.
 */

export class LowPassFilter {
  private alpha: number;
  private s: number | null = null;

  constructor(alpha: number = 0.5) {
    this.alpha = alpha;
  }

  public filter(value: number): number {
    if (this.s === null) {
      this.s = value;
      return value;
    }
    this.s = this.alpha * value + (1.0 - this.alpha) * this.s;
    return this.s;
  }

  public setAlpha(alpha: number): void {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  public reset(): void {
    this.s = null;
  }
}

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xFilter: LowPassFilter;
  private dxFilter: LowPassFilter;
  private lastTime: number | null = null;

  constructor(minCutoff: number = 1.0, beta: number = 0.007, dCutoff: number = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xFilter = new LowPassFilter();
    this.dxFilter = new LowPassFilter();
  }

  private alpha(rate: number, cutoff: number): number {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    const te = 1.0 / rate;
    return 1.0 / (1.0 + tau / te);
  }

  public filter(val: number, timestampMs: number = performance.now()): number {
    if (this.lastTime === null) {
      this.lastTime = timestampMs;
      this.dxFilter.filter(0);
      return this.xFilter.filter(val);
    }

    const dt = Math.max((timestampMs - this.lastTime) / 1000.0, 0.001);
    this.lastTime = timestampMs;
    const rate = 1.0 / dt;

    // Estimate derivative
    const dx = (val - (this.xFilter['s'] ?? val)) * rate;
    const edx = this.dxFilter.filter(dx);
    this.dxFilter.setAlpha(this.alpha(rate, this.dCutoff));

    // Dynamic cutoff frequency
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    this.xFilter.setAlpha(this.alpha(rate, cutoff));

    return this.xFilter.filter(val);
  }

  public reset(): void {
    this.lastTime = null;
    this.xFilter.reset();
    this.dxFilter.reset();
  }
}

export class Vector3Smoother {
  private filterX = new OneEuroFilter(1.2, 0.008);
  private filterY = new OneEuroFilter(1.2, 0.008);
  private filterZ = new OneEuroFilter(0.8, 0.005);

  public update(target: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    const t = performance.now();
    return {
      x: this.filterX.filter(target.x, t),
      y: this.filterY.filter(target.y, t),
      z: this.filterZ.filter(target.z, t)
    };
  }

  public reset(): void {
    this.filterX.reset();
    this.filterY.reset();
    this.filterZ.reset();
  }
}
