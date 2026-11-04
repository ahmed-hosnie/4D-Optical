/* Shared fit geometry. Image points and the camera feed use the same cover crop. */
(function (root) {
  'use strict';
  function cover(sourceWidth, sourceHeight, width, height) {
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    return { scale, offsetX: (sourceWidth * scale - width) / 2, offsetY: (sourceHeight * scale - height) / 2 };
  }
  function point(lm, sourceWidth, sourceHeight, width, height) {
    const crop = cover(sourceWidth, sourceHeight, width, height);
    return {
      x: lm.x * sourceWidth * crop.scale - crop.offsetX - width / 2,
      y: height / 2 - (lm.y * sourceHeight * crop.scale - crop.offsetY),
      z: -lm.z * sourceWidth * crop.scale
    };
  }
  function length(v) { return Math.hypot(v.x, v.y, v.z); }
  function sub(a, b) { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }
  function unit(v) {
    const n = length(v);
    return n > 0.00001 ? { x: v.x / n, y: v.y / n, z: v.z / n } : null;
  }
  function cross(a, b) {
    return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
  }
  function pose(landmarks, sourceWidth, sourceHeight, width, height, frameWidth, fit = 1, matrix = null) {
    if (!landmarks || landmarks.length < 468 || !sourceWidth || !sourceHeight || !width || !height) return null;
    const required = [6, 33, 263, 10, 152, 127, 356];
    if (required.some(i => !landmarks[i] || !Number.isFinite(landmarks[i].x + landmarks[i].y + landmarks[i].z))) return null;
    const points = landmarks.map(lm => point(lm, sourceWidth, sourceHeight, width, height));
    const x = unit(sub(points[263], points[33]));
    const up = unit(sub(points[10], points[152]));
    if (!x || !up) return null;
    const z = unit(cross(x, up));
    if (!z || z.z < 0.15) return null;
    let basis = { x, y: unit(cross(z, x)), z };
    // MediaPipe's full-face pose is less affected by expressions than eye corners.
    // Check matrix storage orientation against landmark axes before using it.
    if (matrix && matrix.length === 16 && matrix.every(Number.isFinite)) {
      const dot = (a, b) => a.x*b.x + a.y*b.y + a.z*b.z;
      let best = 2.3;
      for (const transpose of [false, true]) {
        const axis = column => unit({ x: matrix[transpose ? column : column*4], y: matrix[transpose ? column+4 : column*4+1], z: matrix[transpose ? column+8 : column*4+2] });
        const mx = axis(0), my = axis(1);
        if (!mx || !my) continue;
        const mz = unit(cross(mx, my));
        if (!mz || mz.z < .12) continue;
        const ry = unit(cross(mz, mx));
        const score = dot(mx, basis.x) + dot(ry, basis.y) + dot(mz, basis.z);
        if (score > best) { best = score; basis = { x: mx, y: ry, z: mz }; }
      }
    }
    const faceWidth = length(sub(points[356], points[127]));
    const scale = faceWidth * fit / frameWidth;
    if (!Number.isFinite(scale) || scale <= 0) return null;
    return { points, nose: points[6], ...basis, scale };
  }
  function templeSplay(fit, normalize, bridgeY, offset, centreX = 77, armY = 7.6) {
    // Face-landmark depth is approximate and can be asymmetric in a side view.
    // Open each spring arm around that side of the head, keeping its hinge fixed.
    const correction = {
      x: (fit.x.x*offset.x + fit.y.x*offset.y + fit.z.x*offset.z)*fit.scale,
      y: (fit.x.y*offset.x + fit.y.y*offset.y + fit.z.y*offset.z)*fit.scale,
      z: (fit.x.z*offset.x + fit.y.z*offset.y + fit.z.z*offset.z)*fit.scale
    };
    const span = { left: centreX, right: centreX };
    for (const p of fit.points.slice(0, 468)) {
      const dx = p.x-fit.nose.x-correction.x, dy = p.y-fit.nose.y-correction.y;
      const dz = p.z-fit.nose.z-.8*fit.scale-correction.z;
      const k = fit.scale*normalize;
      const x = (dx*fit.x.x + dy*fit.x.y + dz*fit.x.z)/k;
      const y = (dx*fit.y.x + dy*fit.y.y + dz*fit.y.z)/k + bridgeY;
      const t = -(dx*fit.z.x + dy*fit.z.y + dz*fit.z.z)/k;
      if (t < 25 || t > 110 || y < armY-11 || y > armY+13) continue;
      const side = x < 0 ? 'left' : 'right';
      span[side] = Math.max(span[side], Math.abs(x)+2.3);
    }
    return { left: Math.min(16, span.left-centreX), right: Math.min(16, span.right-centreX) };
  }
  const api = { cover, point, pose, templeSplay };
  root.VTOFit = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
