/* 4D Optical virtual try-on. Coordinates are unmirrored image pixels.
 * The video and renderer are mirrored together only for the front camera. */
(function () {
  'use strict';
  let scene, camera, renderer, faceAnchorGroup, glassesGroup, headOccluder, clipMeshGroup;
  let activeProduct, activeConfig, activeModel;
  let isVTORunning = false;
  let session = 0, modelRequest = 0, frameId, feedTimer, resizeObserver;
  let vtoStream, faceMeshInstance, trackerPromise, trackerTimer;
  let sourceMode = 'camera', photoUrl, photoImage;
  let isSendingFrame = false, sendingSession = -1;
  let lastLandmarks, lastFaceMatrix, lastFaceAt = 0, firstPose = true;
  const glbCache = new Map();
  const targetPos = new THREE.Vector3(), currentPos = new THREE.Vector3();
  const targetQuat = new THREE.Quaternion(), currentQuat = new THREE.Quaternion();
  let targetScale = 1, currentScale = 1;
  let environmentTarget;
  const el = id => document.getElementById(id);
  const isEnglish = () => document.documentElement.lang === 'en' || document.body.classList.contains('lang-en');
  const words = (ar, en) => isEnglish() ? en : ar;
  function status(message, error = false) {
    const node = el('vtoStatus');
    if (node) { node.textContent = message; node.classList.toggle('is-error', error); }
  }
  function loading(show) {
    if (el('vtoLoadingOverlay')) el('vtoLoadingOverlay').style.display = show ? 'flex' : 'none';
  }
  function captureReady(ready) {
    const button = document.querySelector('.vto-btn-capture');
    if (button) button.disabled = !ready;
  }
  function showFaceNotice(show) {
    if (el('vtoFaceLostNotice')) el('vtoFaceLostNotice').style.display = show ? 'flex' : 'none';
  }
  // ── Dynamic '4D OPTICAL' Brand Laser Engraving ──
  function createBrandTexture(isGold = true) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 36px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillStyle = isGold ? '#DFB35C' : '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '5px';
    ctx.fillText('4D OPTICAL', 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // ── Materials Factory ──
  function getMaterialPalette(pConfig) {
    const theme = pConfig.colorTheme || 'black_gold';
    const lensTheme = pConfig.lensTheme || 'sunglasses_green';

    const isGold = ['black_gold', 'gold', 'rose_gold', 'tortoise'].includes(theme);
    const metalColor = theme === 'rose_gold' ? 0xD4836A : (isGold ? 0xDCB35C : 0xCBD5E1);

    const metalMat = new THREE.MeshStandardMaterial({
      color: metalColor,
      metalness: 0.95,
      roughness: 0.16,
      depthTest: true,
      depthWrite: true
    });

    let frameMat;
    if (theme === 'black_gold' || theme === 'matte_black') {
      frameMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: theme === 'matte_black' ? 0.75 : 0.18,
        metalness: 0.12,
        depthTest: true,
        depthWrite: true
      });
    } else if (theme === 'tortoise') {
      frameMat = new THREE.MeshStandardMaterial({
        color: 0x5C2E0B,
        roughness: 0.22,
        metalness: 0.1,
        depthTest: true,
        depthWrite: true
      });
    } else if (theme === 'crystal') {
      frameMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.82,
        transmission: 0.88,
        roughness: 0.08,
        ior: 1.52,
        depthTest: true,
        depthWrite: true
      });
    } else if (theme === 'smoky') {
      frameMat = new THREE.MeshPhysicalMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.85,
        roughness: 0.12,
        depthTest: true,
        depthWrite: true
      });
    } else if (theme === 'emerald') {
      frameMat = new THREE.MeshStandardMaterial({
        color: 0x064E3B,
        roughness: 0.2,
        metalness: 0.15,
        depthTest: true,
        depthWrite: true
      });
    } else if (theme === 'navy') {
      frameMat = new THREE.MeshStandardMaterial({
        color: 0x1E3A8A,
        roughness: 0.2,
        metalness: 0.18,
        depthTest: true,
        depthWrite: true
      });
    } else {
      frameMat = metalMat;
    }

    let lensMat;
    if (lensTheme === 'sunglasses_green') {
      lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x1A3826,
        transparent: true,
        opacity: 0.86,
        roughness: 0.05,
        metalness: 0.15,
        transmission: 0.25,
        reflectivity: 0.7,
        depthTest: true,
        depthWrite: true
      });
    } else if (lensTheme === 'sunglasses_dark' || lensTheme === 'clip_polarized') {
      lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x0B0F19,
        transparent: true,
        opacity: 0.88,
        roughness: 0.05,
        metalness: 0.2,
        transmission: 0.2,
        reflectivity: 0.75,
        depthTest: true,
        depthWrite: true
      });
    } else if (lensTheme === 'sunglasses_amber') {
      lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x78350F,
        transparent: true,
        opacity: 0.82,
        roughness: 0.06,
        transmission: 0.3,
        reflectivity: 0.65,
        depthTest: true,
        depthWrite: true
      });
    } else if (lensTheme === 'sunglasses_pink') {
      lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x831843,
        transparent: true,
        opacity: 0.8,
        roughness: 0.06,
        transmission: 0.35,
        reflectivity: 0.6,
        depthTest: true,
        depthWrite: true
      });
    } else {
      // Clear Optical Lenses
      lensMat = new THREE.MeshPhysicalMaterial({
        color: 0xDDF2FD,
        transparent: true,
        opacity: 0.22,
        roughness: 0.02,
        transmission: 0.94,
        ior: 1.5,
        reflectivity: 0.8,
        depthTest: true,
        depthWrite: true
      });
    }

    return { frameMat, secondaryMat: metalMat, templeMat: frameMat, metalMat, lensMat };
  }

  // ── Procedural Models (Identical Replicas) ──
  function buildClubmasterModel(pConfig, materials) {
    const root = new THREE.Group();
    const { frameMat, metalMat, templeMat, lensMat } = materials;

    function createBrowline(sign) {
      const g = new THREE.Group();
      const browCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 10, 10, 0),
        new THREE.Vector3(sign * 22, 16, 1),
        new THREE.Vector3(sign * 42, 16, 0),
        new THREE.Vector3(sign * 56, 12, -2),
        new THREE.Vector3(sign * 58, 6, -3)
      ]);
      const browMesh = new THREE.Mesh(new THREE.TubeGeometry(browCurve, 24, 3.8, 10, false), frameMat);
      g.add(browMesh);

      // Gold Rivet
      const rivetGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 8);
      rivetGeo.rotateX(Math.PI / 2);
      const rivet = new THREE.Mesh(rivetGeo, metalMat);
      rivet.position.set(sign * 54, 11, 2.8);
      g.add(rivet);
      return g;
    }

    function createWireRim(xCenter, sign) {
      const g = new THREE.Group();
      const w = 44, h = 36, r = 10;
      const shape = new THREE.Shape();
      shape.moveTo(-w/2 + r, -h/2);
      shape.lineTo(w/2 - r, -h/2);
      shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
      shape.lineTo(w/2, h/2 - r);
      shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
      shape.lineTo(-w/2 + r, h/2);
      shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
      shape.lineTo(-w/2, -h/2 + r);
      shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

      const pts = shape.getPoints(36).map(p => new THREE.Vector3(p.x, p.y, 0));
      const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 36, 0.9, 8, true), metalMat);
      rim.position.set(xCenter, -2, 0);
      g.add(rim);

      const lens = new THREE.Mesh(new THREE.ShapeGeometry(shape), lensMat);
      lens.position.set(xCenter, -2, 0);
      g.add(lens);

      // '4D OPTICAL' laser logo on left lens corner (matching reference image)
      if (sign === 1) {
        const logoPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 2.5),
          new THREE.MeshBasicMaterial({ map: createBrandTexture(false), transparent: true, opacity: 0.85 })
        );
        logoPlane.position.set(xCenter + 12, 11, 0.2);
        g.add(logoPlane);
      }

      return g;
    }

    root.add(createWireRim(33, 1));
    root.add(createWireRim(-33, -1));
    root.add(createBrowline(1));
    root.add(createBrowline(-1));

    // Metallic Gold Bridge
    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(10, 6, 0),
      new THREE.Vector3(5, 8.5, 1.5),
      new THREE.Vector3(0, 9, 2),
      new THREE.Vector3(-5, 8.5, 1.5),
      new THREE.Vector3(-10, 6, 0)
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 20, 1.3, 8, false), metalMat));

    // Nose pads
    const padMat = new THREE.MeshPhysicalMaterial({ color: 0xFDFBF7, transparent: true, opacity: 0.75, roughness: 0.2 });
    [-1, 1].forEach(sign => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5.5, 1.2), padMat);
      pad.position.set(sign * 7.5, 2, -6);
      pad.rotation.set(0.1, -sign * 0.35, sign * 0.2);
      root.add(pad);
    });

    // Temples with '4D OPTICAL' Gold Accent
    [-1, 1].forEach(sign => {
      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 56, 7, -2),
        new THREE.Vector3(sign * 60, 8, -25),
        new THREE.Vector3(sign * 62, 7, -75),
        new THREE.Vector3(sign * 63, 6, -115),
        new THREE.Vector3(sign * 62, -2, -135),
        new THREE.Vector3(sign * 60, -18, -145)
      ]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 32, 1.6, 8, false), templeMat));

      // Gold Hinge Accent with 4D Optical Laser Marking
      const hinge = new THREE.Mesh(new THREE.BoxGeometry(2, 3.5, 4), metalMat);
      hinge.position.set(sign * 57, 7, -6);
      root.add(hinge);

      const brandSign = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 3),
        new THREE.MeshBasicMaterial({ map: createBrandTexture(true), transparent: true })
      );
      brandSign.position.set(sign * 60.5, 7.5, -20);
      brandSign.rotation.y = (sign === 1 ? -Math.PI / 2 : Math.PI / 2);
      root.add(brandSign);
    });

    return root;
  }

  function buildAviatorModel(pConfig, materials) {
    const root = new THREE.Group();
    const { metalMat, lensMat } = materials;

    function createTeardropRim(xCenter) {
      const g = new THREE.Group();
      const shape = new THREE.Shape();
      shape.moveTo(-22, 10);
      shape.quadraticCurveTo(0, 16, 22, 10);
      shape.quadraticCurveTo(24, -10, 16, -22);
      shape.quadraticCurveTo(0, -25, -16, -22);
      shape.quadraticCurveTo(-24, -10, -22, 10);

      const pts = shape.getPoints(36).map(p => new THREE.Vector3(p.x, p.y, 0));
      const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 36, 0.95, 8, true), metalMat);
      rim.position.set(xCenter, 0, 0);
      g.add(rim);

      const lens = new THREE.Mesh(new THREE.ShapeGeometry(shape), lensMat);
      lens.position.set(xCenter, 0, 0);
      g.add(lens);
      return g;
    }

    root.add(createTeardropRim(32));
    root.add(createTeardropRim(-32));

    const topBarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(26, 14, 0),
      new THREE.Vector3(0, 15, 1),
      new THREE.Vector3(-26, 14, 0)
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(topBarCurve, 16, 0.9, 8, false), metalMat));

    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(10, 6, 0),
      new THREE.Vector3(0, 8, 2),
      new THREE.Vector3(-10, 6, 0)
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 16, 1.0, 8, false), metalMat));

    [-1, 1].forEach(sign => {
      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 54, 8, 0),
        new THREE.Vector3(sign * 58, 8, -30),
        new THREE.Vector3(sign * 60, 6, -80),
        new THREE.Vector3(sign * 61, 5, -120),
        new THREE.Vector3(sign * 59, -15, -145)
      ]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 28, 0.9, 8, false), metalMat));
    });

    return root;
  }

  function buildSquareModel(pConfig, materials) {
    const root = new THREE.Group();
    const { frameMat, templeMat, lensMat, metalMat } = materials;

    function createSquareRim(xCenter) {
      const g = new THREE.Group();
      const w = 48, h = 38, r = 8, th = 3.2;

      const shape = new THREE.Shape();
      shape.moveTo(-w/2 + r, -h/2);
      shape.lineTo(w/2 - r, -h/2);
      shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
      shape.lineTo(w/2, h/2 - r);
      shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
      shape.lineTo(-w/2 + r, h/2);
      shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
      shape.lineTo(-w/2, -h/2 + r);
      shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

      const hole = new THREE.Path();
      const iw = w - th * 2, ih = h - th * 2, ir = Math.max(2, r - th);
      hole.moveTo(-iw/2 + ir, -ih/2);
      hole.lineTo(iw/2 - ir, -ih/2);
      hole.quadraticCurveTo(iw/2, -ih/2, iw/2, -ih/2 + ir);
      hole.lineTo(iw/2, ih/2 - ir);
      hole.quadraticCurveTo(iw/2, ih/2, iw/2 - ir, ih/2);
      hole.lineTo(-iw/2 + ir, ih/2);
      hole.quadraticCurveTo(-iw/2, ih/2, -iw/2, ih/2 - ir);
      hole.lineTo(-iw/2, -ih/2 + ir);
      hole.quadraticCurveTo(-iw/2, -ih/2, -iw/2 + ir, -ih/2);
      shape.holes.push(hole);

      const extrude = { depth: 3.8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.8, bevelThickness: 0.8 };
      const rim = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrude), frameMat);
      rim.position.set(xCenter, 0, -2);
      g.add(rim);

      const lens = new THREE.Mesh(new THREE.ShapeGeometry(shape.holes[0]), lensMat);
      lens.position.set(xCenter, 0, 0);
      g.add(lens);
      return g;
    }

    root.add(createSquareRim(34));
    root.add(createSquareRim(-34));

    // Keyhole bridge
    const bridgeGeo = new THREE.CylinderGeometry(2.4, 2.4, 18, 12);
    bridgeGeo.rotateZ(Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, frameMat);
    bridge.position.set(0, 7, 0);
    root.add(bridge);

    [-1, 1].forEach(sign => {
      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 58, 8, -2),
        new THREE.Vector3(sign * 62, 8, -25),
        new THREE.Vector3(sign * 64, 7, -80),
        new THREE.Vector3(sign * 64, 5, -120),
        new THREE.Vector3(sign * 62, -15, -145)
      ]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 28, 2.2, 8, false), templeMat));
    });

    // Detachable Magnetic Clip Mesh for Clip-On models
    if (pConfig.hasClipOn) {
      clipMeshGroup = new THREE.Group();
      clipMeshGroup.name = "clipMeshGroup";

      const clipMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.85, roughness: 0.3 });
      const clipLensMat = new THREE.MeshPhysicalMaterial({
        color: 0x0A0F1D,
        transparent: true,
        opacity: 0.9,
        roughness: 0.05,
        transmission: 0.15
      });

      [-1, 1].forEach(sign => {
        const cRim = new THREE.Mesh(new THREE.TorusGeometry(18, 1.0, 8, 24), clipMat);
        cRim.position.set(sign * 34, 0, 2.8);
        clipMeshGroup.add(cRim);

        const cLens = new THREE.Mesh(new THREE.CircleGeometry(17.5, 24), clipLensMat);
        cLens.position.set(sign * 34, 0, 2.8);
        clipMeshGroup.add(cLens);
      });

      // Magnetic bridge clasp
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 2.5), clipMat);
      clasp.position.set(0, 8, 3.2);
      clipMeshGroup.add(clasp);

      clipMeshGroup.visible = pConfig.clipAttached !== false;
      root.add(clipMeshGroup);
    }

    return root;
  }

  function buildRoundModel(pConfig, materials) {
    const root = new THREE.Group();
    const { metalMat, lensMat } = materials;

    function createRoundRim(xCenter) {
      const g = new THREE.Group();
      const rim = new THREE.Mesh(new THREE.TorusGeometry(19, 1.0, 10, 36), metalMat);
      rim.position.set(xCenter, 0, 0);
      g.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(18.5, 36), lensMat);
      lens.position.set(xCenter, 0, 0);
      g.add(lens);
      return g;
    }

    root.add(createRoundRim(33));
    root.add(createRoundRim(-33));

    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(14, 5, 0),
      new THREE.Vector3(0, 9, 2),
      new THREE.Vector3(-14, 5, 0)
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 16, 1.0, 8, false), metalMat));

    [-1, 1].forEach(sign => {
      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 52, 5, 0),
        new THREE.Vector3(sign * 56, 6, -30),
        new THREE.Vector3(sign * 58, 5, -80),
        new THREE.Vector3(sign * 59, 4, -120),
        new THREE.Vector3(sign * 57, -15, -145)
      ]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 28, 0.9, 8, false), metalMat));
    });

    return root;
  }

  function buildCatEyeModel(pConfig, materials) {
    const root = new THREE.Group();
    const { frameMat, templeMat, lensMat } = materials;

    function createCatRim(xCenter, sign) {
      const g = new THREE.Group();
      const shape = new THREE.Shape();
      shape.moveTo(-20, -10);
      shape.quadraticCurveTo(-18, 12, 0, 14);
      shape.quadraticCurveTo(sign * 26, 22, sign * 26, 8);
      shape.quadraticCurveTo(20, -12, 0, -16);
      shape.quadraticCurveTo(-18, -16, -20, -10);

      const pts = shape.getPoints(36).map(p => new THREE.Vector3(p.x, p.y, 0));
      const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 36, 1.4, 8, true), frameMat);
      rim.position.set(xCenter, 0, 0);
      g.add(rim);

      const lens = new THREE.Mesh(new THREE.ShapeGeometry(shape), lensMat);
      lens.position.set(xCenter, 0, 0);
      g.add(lens);
      return g;
    }

    root.add(createCatRim(33, 1));
    root.add(createCatRim(-33, -1));

    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 16, 8), frameMat);
    bridge.rotateZ(Math.PI / 2);
    bridge.position.set(0, 6, 0);
    root.add(bridge);

    [-1, 1].forEach(sign => {
      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 59, 12, 0),
        new THREE.Vector3(sign * 62, 11, -30),
        new THREE.Vector3(sign * 63, 9, -80),
        new THREE.Vector3(sign * 63, 6, -120),
        new THREE.Vector3(sign * 61, -12, -145)
      ]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 28, 1.4, 8, false), templeMat));
    });

    return root;
  }

  const MODEL_ASSETS = {
    'real_clipon_tortoise.jpg': ['4D-Optical-Brown-Clip.glb', 9],
    'real_clipon_square_clear.jpg': ['4D-Optical-Clear-Clip.glb', 9],
    'optical_aviator_gold.jpg': ['4D-Optical-Gold-DoubleBridge.glb', 9],
    'kids_optical_2.jpg': ['4D-Optical-Kids-Navy-Orange.glb', 7],
    'clubmaster.jpg': ['4D-Optical-Clubmaster-Black-Gold.glb', 9],
    'kids_sunglasses.jpg': ['4D-Optical-Kids-Turquoise.glb', 9]
  };
  function disposeCurrentModel() {
    if (!activeModel) return;
    glassesGroup.remove(activeModel);
    activeModel.traverse(node => {
      if (!node.isMesh) return;
      if (!activeModel.userData.cachedGeometry || node.userData.deformedGeometry) node.geometry.dispose();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach(material => {
        if (!activeModel.userData.cachedGeometry && material.map) material.map.dispose();
        material.dispose();
      });
    });
    activeModel = null;
    clipMeshGroup = null;
  }
  function trimModelCache(keepURL) {
    for (const [url, promise] of glbCache) {
      if (glbCache.size <= 3) break;
      if (!promise.asset || url === keepURL || url === activeModel?.userData.modelURL) continue;
      const geometries = new Set(), materials = new Set(), textures = new Set();
      promise.asset.scene.traverse(node => {
        if (!node.isMesh) return;
        geometries.add(node.geometry);
        (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => {
          materials.add(material);
          Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
        });
      });
      geometries.forEach(value => value.dispose());
      materials.forEach(value => value.dispose());
      textures.forEach(value => value.dispose());
      glbCache.delete(url);
    }
  }
  function loadGLB(url) {
    if (!glbCache.has(url)) {
      const promise = new Promise((resolve, reject) => {
        if (!THREE.GLTFLoader) { reject(new Error('GLTFLoader unavailable')); return; }
        new THREE.GLTFLoader().load(url, resolve, undefined, reject);
      }).then(asset => {
        promise.asset = asset;
        trimModelCache(url);
        return asset;
      }).catch(error => { glbCache.delete(url); throw error; });
      glbCache.set(url, promise);
    }
    return glbCache.get(url);
  }
  async function buildGlassesForProduct(product) {
    const request = ++modelRequest;
    faceAnchorGroup.visible = false;
    disposeCurrentModel();
    activeConfig = getProduct3DConfig(product);
    const imageName = (product.image || '').split('/').pop();
    const asset = (window.VTO_MODEL_ASSETS || {})[imageName] || MODEL_ASSETS[imageName];
    let model;
    if (asset) {
      status(words('جاري تحميل نظارة المنتج…', 'Loading this frame…'));
      try {
        const modelURL = 'models/' + asset[0] + '?v=5';
        const gltf = await loadGLB(modelURL);
        if (request !== modelRequest || !isVTORunning) return;
        model = gltf.scene.clone(true);
        model.userData.cachedGeometry = true;
        model.userData.modelURL = modelURL;
        model.scale.setScalar(1000); // GLB uses metres, fit configuration uses millimetres.
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const width = box.max.x - box.min.x;
        if (!Number.isFinite(width) || width <= 0) throw new Error('Invalid frame geometry');
        const anchor = model.getObjectByName('NoseBridgeAnchor');
        const meta = anchor ? anchor.userData : {};
        const normalize = activeConfig.frameWidthMm / (meta.frontWidthMm || width);
        model.userData.fitNormalize = normalize;
        model.userData.templeFit = meta.templeFit || { centreX: 77, armY: 7.6 };
        model.userData.bridgeY = meta.bridgeAnchorMm ?? asset[1];
        model.userData.templeMeshes = [];
        model.traverse(node => {
          if (!node.isMesh || !/Splayed full acetate arm|Fitted temple/.test(node.name)) return;
          node.geometry = node.geometry.clone(); node.userData.deformedGeometry = true;
          node.userData.templeBase = new Float32Array(node.geometry.attributes.position.array);
          node.userData.templeSide = /-1$/.test(node.name) ? -1 : 1;
          model.userData.templeMeshes.push(node);
        });
        model.scale.multiplyScalar(normalize);
        model.position.set(-(box.max.x + box.min.x) * normalize / 2, -model.userData.bridgeY * normalize, 0);
        model.traverse(node => {
          if (/SunClip_Removable|Sun_Clip|clipMeshGroup/i.test(node.name)) clipMeshGroup = node;
        });
      } catch (error) {
        if (request !== modelRequest || !isVTORunning) return;
        status(words('تعذّر تحميل موديل المنتج. جرّب اختيار النظارة مرة أخرى.', 'Frame could not load. Please select it again.'), true);
        console.error('[VTO] Model load failed', error);
        return;
      }
    } else {
      const materials = getMaterialPalette(activeConfig);
      const builders = { clubmaster: buildClubmasterModel, aviator: buildAviatorModel, round: buildRoundModel, cateye: buildCatEyeModel };
      model = (builders[activeConfig.shape3d] || buildSquareModel)(activeConfig, materials);
      model.position.y = -(activeConfig.shape3d === 'square' ? 7 : 9);
      // These styles are approximations until a product-specific asset is supplied.
      status(words('معاينة تقريبية لشكل الفريم', 'Approximate frame preview'));
    }
    model.rotation.set(activeConfig.rotationOffset.x || 0, activeConfig.rotationOffset.y || 0, activeConfig.rotationOffset.z || 0);
    model.traverse(node => {
      if (!node.isMesh) return;
      const original = Array.isArray(node.material) ? node.material : [node.material];
      const materials = original.map(source => {
        return VTOAppearance.material(source, node.name, !!asset);
      });
      node.material = Array.isArray(node.material) ? materials : materials[0];
      node.renderOrder = 1;
    });
    activeModel = model;
    trimModelCache(model.userData.modelURL);
    glassesGroup.add(model);
    if (clipMeshGroup) clipMeshGroup.visible = activeConfig.clipAttached !== false;
    updateClipOnUI();
    if (asset) status(words('حرّك رأسك بهدوء لتجربة الفريم', 'Move your head gently to try the frame'));
    if (lastLandmarks) applyLandmarks(lastLandmarks, true, lastFaceMatrix);
  }
  function updateClipOnUI() {
    const button = el('vtoClipToggleBtn');
    if (!button) return;
    const available = !!(activeConfig && activeConfig.hasClipOn && clipMeshGroup);
    button.style.display = available ? 'flex' : 'none';
    if (available) {
      const attached = activeConfig.clipAttached !== false;
      button.classList.toggle('clip-detached', !attached);
      el('vtoClipToggleText').textContent = attached ? words('إزالة الكليب الشمسي', 'Remove sun clip') : words('تركيب الكليب الشمسي', 'Attach sun clip');
    }
  }
  window.toggleVTOClip = function () {
    if (!clipMeshGroup) return;
    activeConfig.clipAttached = activeConfig.clipAttached === false;
    clipMeshGroup.visible = activeConfig.clipAttached;
    updateClipOnUI();
  };
  function handleFaceResults(results, ticket) {
    if (!isVTORunning || ticket !== session) return;
    const landmarks = results.multiFaceLandmarks && results.multiFaceLandmarks[0];
    if (landmarks) {
      lastLandmarks = landmarks; lastFaceMatrix = results.faceMatrix; lastFaceAt = performance.now();
      applyLandmarks(landmarks, sourceMode === 'photo', results.faceMatrix);
      showFaceNotice(false); captureReady(!!activeModel && faceAnchorGroup.visible);
    } else {
      lastLandmarks = null; faceAnchorGroup.visible = false; headOccluder.visible = false;
      captureReady(false); showFaceNotice(true);
    }
    loading(false);
  }
  async function initFaceMesh() {
    if (faceMeshInstance && !faceMeshInstance.closed && trackerPromise) return trackerPromise;
    const tracker = new VTOFaceTracker();
    faceMeshInstance = tracker;
    trackerPromise = tracker.initialize().then(() => tracker).catch(error => {
      tracker.close();
      if (faceMeshInstance === tracker) { faceMeshInstance = null; trackerPromise = null; }
      throw error;
    });
    return trackerPromise;
  }
  function initThreeScene() {
    const canvas = el('vtoCanvas');
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-320, 320, 240, -240, .1, 5000);
    camera.position.z = 2000;
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    environmentTarget = VTOAppearance.environment(renderer);
    if (environmentTarget) scene.environment = environmentTarget.texture;
    // Total light was ~2x the colour of the product photo (blacks looked grey, amber/turquoise looked pale).
    // LIGHT_SCALE keeps the frame texture close to the real photo colour; raise it for a brighter look.
    const LIGHT_SCALE = .55;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x88847d, .8 * LIGHT_SCALE));
    const key = new THREE.DirectionalLight(0xffffff, .75 * LIGHT_SCALE);
    key.position.set(-150, 200, 500); scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, .45 * LIGHT_SCALE);
    fill.position.set(200, -60, 300); scene.add(fill);
    faceAnchorGroup = new THREE.Group();
    glassesGroup = new THREE.Group();
    faceAnchorGroup.add(glassesGroup); scene.add(faceAnchorGroup);
    faceAnchorGroup.visible = false;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(468 * 3), 3));
    geometry.setIndex(window.VTO_FACE_TRIANGLES);
    headOccluder = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      colorWrite: false, depthWrite: true, depthTest: true, side: THREE.DoubleSide
    }));
    headOccluder.frustumCulled = false;
    headOccluder.visible = false;
    headOccluder.renderOrder = -1; scene.add(headOccluder);
    resizeObserver = new ResizeObserver(resizeViewport);
    resizeObserver.observe(canvas.parentElement);
    resizeViewport();
  }
  function resizeViewport() {
    if (!renderer) return;
    const canvas = el('vtoCanvas');
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    camera.left = -width / 2; camera.right = width / 2;
    camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    if (lastLandmarks && isVTORunning) applyLandmarks(lastLandmarks, true, lastFaceMatrix);
  }
  function sourceDimensions() {
    if (sourceMode === 'photo') return [photoImage && photoImage.naturalWidth, photoImage && photoImage.naturalHeight];
    const video = el('vtoVideo');
    return [video.videoWidth, video.videoHeight];
  }
  function applyLandmarks(landmarks, snap = false, faceMatrix = lastFaceMatrix) {
    if (!activeConfig || !activeModel) return;
    const canvas = el('vtoCanvas'), [sourceWidth, sourceHeight] = sourceDimensions();
    const fit = VTOFit.pose(landmarks, sourceWidth, sourceHeight, canvas.clientWidth, canvas.clientHeight,
      activeConfig.frameWidthMm, .98 * (activeConfig.scaleMultiplier || 1), faceMatrix);
    if (!fit) {
      faceAnchorGroup.visible = false; headOccluder.visible = false; captureReady(false); return;
    }
    const basis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(fit.x.x, fit.x.y, fit.x.z), new THREE.Vector3(fit.y.x, fit.y.y, fit.y.z), new THREE.Vector3(fit.z.x, fit.z.y, fit.z.z));
    targetQuat.setFromRotationMatrix(basis);
    targetScale = fit.scale;
    const offset = activeConfig.anchorOffset || { x: 0, y: -1.5, z: 3.5 };
    const correction = new THREE.Vector3(offset.x || 0, offset.y || 0, offset.z || 3.5)
      .applyQuaternion(targetQuat).multiplyScalar(targetScale);
    targetPos.set(fit.nose.x, fit.nose.y, 0).add(correction);
    if (firstPose || snap) {
      currentPos.copy(targetPos); currentQuat.copy(targetQuat); currentScale = targetScale;
      firstPose = false;
    }
    if (activeModel.userData.templeMeshes?.length) {
      const splay = VTOFit.templeSplay(fit, activeModel.userData.fitNormalize, activeModel.userData.bridgeY,
        { x: offset.x || 0, y: offset.y || 0, z: offset.z ?? 3.5 },
        activeModel.userData.templeFit.centreX, activeModel.userData.templeFit.armY);
      for (const mesh of activeModel.userData.templeMeshes) {
        const amount = splay[mesh.userData.templeSide < 0 ? 'left' : 'right'];
        if (Math.abs(amount-(mesh.userData.lastSplay ?? -100)) < .15) continue;
        const attr = mesh.geometry.attributes.position, base = mesh.userData.templeBase;
        for (let i = 0; i < attr.count; i++) {
          const t = -base[i*3+2]*1000;
          const u = Math.max(0, Math.min(1, (t-12)/48));
          attr.setX(i, base[i*3] + mesh.userData.templeSide*amount*.001*u*u*(3-2*u));
        }
        attr.needsUpdate = true; mesh.geometry.computeVertexNormals();
        mesh.geometry.computeBoundingSphere(); mesh.userData.lastSplay = amount;
      }
    }
    const positions = headOccluder.geometry.attributes.position;
    fit.points.slice(0, 468).forEach((point, i) => positions.setXYZ(i, point.x, point.y, point.z - fit.nose.z - .8 * fit.scale));
    positions.needsUpdate = true;
    headOccluder.visible = true; faceAnchorGroup.visible = true;
    updateTransform();
    captureReady(true);
  }
  function updateTransform() {
    faceAnchorGroup.position.copy(currentPos);
    faceAnchorGroup.quaternion.copy(currentQuat);
    faceAnchorGroup.scale.setScalar(currentScale);
  }
  function renderLoop() {
    if (!isVTORunning) return;
    if (sourceMode === 'camera' && lastFaceAt && performance.now() - lastFaceAt > 700) {
      faceAnchorGroup.visible = false; headOccluder.visible = false; captureReady(false); showFaceNotice(true);
    }
    if (sourceMode === 'camera' && !firstPose) {
      currentPos.lerp(targetPos, .55); currentQuat.slerp(targetQuat, .5);
      currentScale += (targetScale - currentScale) * .5; updateTransform();
    }
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(renderLoop);
  }
  async function sendImage(image, ticket) {
    if (!faceMeshInstance || isSendingFrame || ticket !== session) return false;
    isSendingFrame = true; sendingSession = ticket;
    try {
      const result = await faceMeshInstance.detect(image, sourceMode === 'photo');
      handleFaceResults(result, ticket);
      return true;
    } finally { isSendingFrame = false; }
  }
  async function processCameraFeed(ticket) {
    if (!isVTORunning || ticket !== session || sourceMode !== 'camera') return;
    const video = el('vtoVideo');
    try {
      if (video.readyState >= 2) await sendImage(video, ticket);
    } catch (error) {
      status(words('تعذّر تتبّع الوش. جرّب فتح التجربة مرة أخرى.', 'Tracking failed. Please reopen the try-on.'), true);
      faceAnchorGroup.visible = false; loading(false);
      return;
    }
    if (isVTORunning && ticket === session) feedTimer = setTimeout(() => processCameraFeed(ticket), 33);
  }
  function stopMedia() {
    clearTimeout(feedTimer);
    if (vtoStream) vtoStream.getTracks().forEach(track => track.stop());
    vtoStream = null;
    const video = el('vtoVideo'); video.pause(); video.srcObject = null;
  }
  function resetTracking() {
    lastLandmarks = null; lastFaceMatrix = null; lastFaceAt = 0; firstPose = true; showFaceNotice(false);
    if (faceAnchorGroup) faceAnchorGroup.visible = false;
    if (headOccluder) headOccluder.visible = false;
    captureReady(false);
  }
  function cameraError(error) {
    const name = error && error.name;
    if (name === 'NotAllowedError' || name === 'SecurityError') return words('اسمح للموقع باستخدام الكاميرا من علامة القفل بجوار الرابط، ثم اضغط إعادة تشغيل الكاميرا.', 'Allow camera access in site permissions, then restart the camera.');
    if (name === 'NotFoundError') return words('لم يتم العثور على كاميرا. وصّل الكاميرا أو ارفع صورة.', 'No camera was found. Connect a camera or upload a photo.');
    if (name === 'NotReadableError' || name === 'AbortError') return words('الكاميرا مشغولة أو تعذّر تشغيلها. اقفل البرامج الأخرى التي تستخدمها ثم أعد المحاولة.', 'The camera is busy or unavailable. Close other camera apps and retry.');
    return error.message || words('تعذّر تشغيل الكاميرا. يمكنك رفع صورة.', 'Unable to start the camera. You can upload a photo.');
  }
  async function waitForVideo(video, ticket) {
    const deadline = performance.now() + 10000;
    const playPromise = video.play();
    playPromise.catch(() => {}); // Readiness below also handles a pending play promise.
    while (ticket === session && isVTORunning) {
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) return;
      if (performance.now() >= deadline) throw new Error(words('الكاميرا اتفتحت لكن لم تصل صورة. أعد تشغيلها أو جرّب كاميرا أخرى.', 'Camera opened but no image frames arrived. Restart it or try another camera.'));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw new Error('Camera session cancelled');
  }
  async function startCamera() {
    if (!isVTORunning || !renderer) return;
    const ticket = ++session; stopMedia(); resetTracking();
    sourceMode = 'camera'; loading(true);
    status(words('اسمح بالكاميرا لبدء التجربة…', 'Allow camera access to start…'));
    el('vtoCameraDeniedAlert').style.display = 'none';
    el('vtoPhoto').hidden = true; el('vtoVideo').hidden = false;
    el('vtoViewport').classList.add('is-mirrored');
    let timeout, expired = false;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error(words('الكاميرا تحتاج رابط HTTPS أو localhost.', 'Camera requires HTTPS or localhost.'));
      const permission = navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } }, audio: false
      }).then(stream => {
        if (expired || ticket !== session || !isVTORunning) {
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        return stream;
      });
      const stream = await Promise.race([permission, new Promise((_, reject) => {
        timeout = setTimeout(() => { expired = true; reject(new Error(words('طلب الكاميرا ما زال منتظرًا. اسمح باستخدامها ثم اضغط إعادة تشغيل الكاميرا.', 'Camera permission is still pending. Allow access and restart the camera.'))); }, 20000);
      })]);
      clearTimeout(timeout);
      if (!stream || ticket !== session || !isVTORunning) return;
      vtoStream = stream;
      const video = el('vtoVideo'); video.controls = false; video.muted = true;
      video.srcObject = stream;
      await waitForVideo(video, ticket);
      if (ticket !== session) return;
      loading(false); resizeViewport();
    } catch (error) {
      clearTimeout(timeout);
      if (ticket !== session) return;
      stopMedia(); loading(false);
      el('vtoCameraDeniedAlert').style.display = 'flex';
      el('vtoCameraErrorText').textContent = cameraError(error);
      status(words('يمكنك أيضًا تجربة النظارة برفع صورة.', 'You can also try the frame by uploading a photo.'), true);
      return;
    }
    status(words('جاري تجهيز التتبّع التلقائي لأول مرة…', 'Preparing automatic tracking…'));
    try {
      await initFaceMesh();
      if (ticket !== session) return;
      status(words('حرّك رأسك. النظارة تتبع الحركة تلقائيًا.', 'Move your head. The frame follows automatically.'));
      processCameraFeed(ticket);
    } catch (error) {
      if (ticket !== session) return;
      loading(false);
      status(words('صورة الكاميرا تعمل، لكن تعذّر تجهيز التتبّع. اضغط إعادة تشغيل الكاميرا للمحاولة.', 'Camera preview is working, but tracking could not initialize. Restart the camera to retry.'), true);
      console.error('[VTO] Tracker initialization', error);
    }
  }
  window.useVTOCamera = startCamera;
  window.useVTOPhoto = async function (file) {
    if (!file || !isVTORunning || !renderer) return;
    if (!/^image\//.test(file.type)) { status(words('اختار ملف صورة', 'Choose an image file'), true); return; }
    const ticket = ++session; stopMedia(); resetTracking(); sourceMode = 'photo'; loading(true);
    el('vtoCameraDeniedAlert').style.display = 'none'; el('vtoViewport').classList.remove('is-mirrored');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (ticket !== session || !isVTORunning) { URL.revokeObjectURL(url); return; }
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photoUrl = url; photoImage = image;
      el('vtoPhoto').src = url; el('vtoPhoto').hidden = false; el('vtoVideo').hidden = true;
      resizeViewport(); await initFaceMesh();
      while (isSendingFrame && ticket === session) await new Promise(resolve => setTimeout(resolve, 20));
      if (ticket !== session) return;
      await sendImage(image, ticket);
      if (ticket === session) {
        loading(false);
        status(lastLandmarks ? words('تم ضبط النظارة تلقائيًا على صورتك.', 'Frame fitted automatically to your photo.') : words('الوش مش واضح. اختار صورة أمامية أوضح.', 'Face not found. Choose a clearer front-facing photo.'));
      }
    } catch (error) {
      URL.revokeObjectURL(url);
      if (ticket === session) { loading(false); status(words('تعذّر فتح الصورة أو تشغيل التتبّع', 'Unable to open photo or start tracking'), true); }
      console.error('[VTO] Photo preview', error);
    }
  };
  function resetFit() { firstPose = true; }
  function updateSidePreviewCard(product) {
    el('vtoSidePreviewImg').src = product.image;
    el('vtoSidePreviewImg').alt = product.name;
    el('vtoSideColorLabel').textContent = product.name;
  }
  window.openVTOModal = async function (productId) {
    const product = getStoredProducts().find(p => p.id === productId);
    if (!product || product.category === 'contact_lenses') return;
    if (isVTORunning) { await window.selectVTOGlasses(productId); return; }
    isVTORunning = true; activeProduct = product;
    el('vtoModal').classList.add('active');
    try {
      if (!renderer) initThreeScene();
    } catch (error) {
      isVTORunning = false;
      loading(false);
      status(words('المتصفح لا يدعم عرض 3D. جرّب Chrome أو Safari مع تفعيل تسريع الرسوميات.', '3D rendering is unavailable. Try Chrome or Safari with graphics acceleration enabled.'), true);
      captureReady(false);
      console.error('[VTO] WebGL unavailable', error);
      return;
    }
    resetFit(); resetTracking(); resizeViewport(); updateSidePreviewCard(product); populateGlassesDrawer();
    const modelPromise = buildGlassesForProduct(product);
    renderLoop();
    await Promise.all([modelPromise, startCamera()]);
  };
  window.selectVTOGlasses = async function (productId) {
    const product = getStoredProducts().find(p => p.id === productId);
    if (!product || !isVTORunning) return;
    activeProduct = product; resetFit(); firstPose = true;
    updateSidePreviewCard(product); window.toggleGlassesDrawer(false);
    await buildGlassesForProduct(product);
  };
  window.toggleGlassesDrawer = function (show) {
    const drawer = el('vtoGlassesDrawer');
    drawer.classList.toggle('active', show === undefined ? !drawer.classList.contains('active') : show);
  };
  window.closeVTOModal = function () {
    isVTORunning = false; ++session; ++modelRequest;
    cancelAnimationFrame(frameId); clearTimeout(trackerTimer); stopMedia(); resetTracking(); disposeCurrentModel();
    if (faceMeshInstance) faceMeshInstance.close();
    faceMeshInstance = null; trackerPromise = null;
    window.toggleGlassesDrawer(false); el('vtoModal').classList.remove('active');
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = null; photoImage = null; el('vtoPhoto').removeAttribute('src');
    el('vtoPhotoInput').value = '';
  };
  window.takeVTOSnapshot = function () {
    if (!isVTORunning || !faceAnchorGroup.visible || !activeModel) return;
    const [sw, sh] = sourceDimensions();
    if (!sw || !sh) return;
    renderer.render(scene, camera);
    const canvas = el('vtoCanvas'), width = canvas.clientWidth, height = canvas.clientHeight;
    const output = document.createElement('canvas');
    const ratio = Math.min(2, Math.max(1, sw / width));
    output.width = Math.round(width * ratio); output.height = Math.round(height * ratio);
    const ctx = output.getContext('2d'), crop = VTOFit.cover(sw, sh, width, height);
    ctx.scale(ratio, ratio);
    if (sourceMode === 'camera') { ctx.translate(width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(sourceMode === 'photo' ? photoImage : el('vtoVideo'), -crop.offsetX, -crop.offsetY, sw * crop.scale, sh * crop.scale);
    ctx.drawImage(canvas, 0, 0, width, height);
    output.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.download = '4D-Optical-' + activeProduct.id + '.png'; link.href = url; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };
  function populateGlassesDrawer() {
    const container = el('vtoDrawerList'); container.replaceChildren();
    getStoredProducts().filter(product => product.category !== 'contact_lenses').forEach(product => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'vto-drawer-card';
      button.addEventListener('click', () => window.selectVTOGlasses(product.id));
      const image = document.createElement('img'); image.src = product.image; image.alt = ''; image.className = 'vto-drawer-thumb';
      const label = document.createElement('div'); label.className = 'vto-drawer-name'; label.textContent = product.name;
      button.append(image, label); container.append(button);
    });
  }
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && isVTORunning) window.closeVTOModal(); });
  window.addEventListener('pagehide', () => { if (isVTORunning) window.closeVTOModal(); });
  window.addEventListener('resize', resizeViewport);
})();
