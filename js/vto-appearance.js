/* Photographic acetate + controlled reflections over a transparent camera canvas. */
(function (root) {
  'use strict';
  function environment(renderer) {
    // A neutral room with two softboxes gives curved lenses and polished bevels
    // a view-dependent reflection. It is deliberately not drawn as a background.
    if (!THREE.PMREMGenerator) return null;
    const faces = [];
    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#758086'); gradient.addColorStop(.5, '#343c40'); gradient.addColorStop(1, '#15181a');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256);
      if ([0, 1, 4].includes(i)) {
        const softbox = ctx.createLinearGradient(20, 0, 90, 0);
        softbox.addColorStop(0, 'rgba(239,244,242,0)'); softbox.addColorStop(.3, 'rgba(239,244,242,.8)');
        softbox.addColorStop(.7, 'rgba(239,244,242,.8)'); softbox.addColorStop(1, 'rgba(239,244,242,0)');
        ctx.fillStyle = softbox; ctx.fillRect(20, 24, 70, 165);
      }
      faces.push(canvas);
    }
    const cube = new THREE.CubeTexture(faces); cube.encoding = THREE.sRGBEncoding; cube.needsUpdate = true;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const target = pmrem.fromCubemap(cube); cube.dispose(); pmrem.dispose();
    return target;
  }
  function material(source, meshName, clone = true) {
    const m = clone ? source.clone() : source;
    if ('transmission' in m) m.transmission = 0;
    const name = (m.name + ' ' + meshName).toLowerCase();
    if (/lens/.test(name) && !/rim|wire|frame/.test(name)) {
      const sun = /sun|smoke|green|tinted|polariz|dark|amber|pink/.test(name);
      m.transparent = true; m.opacity = sun ? .73 : .08;
      // A closed double-sided lens blends twice and becomes almost opaque.
      m.side = THREE.FrontSide;
      m.roughness = sun ? .12 : .07; m.metalness = 0;
      m.envMapIntensity = sun ? .65 : .35;
      if ('clearcoat' in m) { m.clearcoat = .9; m.clearcoatRoughness = .08; }
    } else {
      m.envMapIntensity = /gold|steel|metal|hinge/.test(name) ? .9 : .45;
    }
    m.depthTest = true; m.depthWrite = !m.transparent;
    return m;
  }
  root.VTOAppearance = { environment, material };
})(typeof window !== 'undefined' ? window : globalThis);
