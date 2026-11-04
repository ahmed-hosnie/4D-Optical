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
  function pose(landmarks, sourceWidth, sourceHeight, width, height, frameWidth, fit = 1) {
    if (!landmarks || landmarks.length < 468 || !sourceWidth || !sourceHeight || !width || !height) return null;
    const required = [6, 33, 263, 10, 152, 127, 356];
    if (required.some(i => !landmarks[i] || !Number.isFinite(landmarks[i].x + landmarks[i].y + landmarks[i].z))) return null;
    const points = landmarks.map(lm => point(lm, sourceWidth, sourceHeight, width, height));
    const x = unit(sub(points[263], points[33]));
    const up = unit(sub(points[10], points[152]));
    if (!x || !up) return null;
    const z = unit(cross(x, up));
    if (!z || z.z < 0.15) return null;
    const y = unit(cross(z, x));
    const faceWidth = length(sub(points[356], points[127]));
    const scale = faceWidth * fit / frameWidth;
    if (!Number.isFinite(scale) || scale <= 0) return null;
    return { points, nose: points[6], x, y, z, scale };
  }
  const api = { cover, point, pose };
  root.VTOFit = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
