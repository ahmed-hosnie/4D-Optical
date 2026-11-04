/**
 * 4D OPTICAL - Virtual Try-On Engine (Engineered to Exact Visual & Functional Specifications)
 * 
 * Features:
 * 1. Three.js + GLTFLoader for loading authentic binary .glb models with fallback to procedural replica
 * 2. MediaPipe FaceMesh / Face Landmarker 6-DOF tracking anchored to Landmark 6 (Mid Nose Bridge)
 * 3. One-Euro adaptive filter for jitter-free tracking (منع الرعشة)
 * 4. Invisible Head Occluder (colorWrite: false, depthWrite: true) to naturally hide the far temple arm
 * 5. Magnetic Clip-On support with attach/detach toggle for clip models (e.g. clip-1, clip-2...)
 * 6. Laser '4D OPTICAL' branding on lens & temple hinge
 * 7. Client-side local processing & instant camera teardown on close
 * 8. High-resolution snapshot download
 */

(function () {
  'use strict';

  // ── State ──
  let isVTORunning = false;
  let activeProduct = null;
  let activeConfig = null;
  let vtoStream = null;
  let faceMeshInstance = null;
  let animFrameId = null;
  let gltfLoader = null;
  let glbCache = {};

  // ── Three.js Core Objects ──
  let scene, camera, renderer;
  let faceAnchorGroup, glassesGroup, headOccluder, clipMeshGroup;

  // ── Tracking & Smoothing ──
  const targetPos = new THREE.Vector3();
  const currentPos = new THREE.Vector3();
  const targetQuat = new THREE.Quaternion();
  const currentQuat = new THREE.Quaternion();
  let targetScale = 1.0;
  let currentScale = 1.0;
  let consecutiveLostFrames = 0;

  // ── One-Euro Filter Implementation for Jitter Elimination ──
  class OneEuroFilter {
    constructor(minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
      this.minCutoff = minCutoff;
      this.beta = beta;
      this.dCutoff = dCutoff;
      this.xPrev = null;
      this.dxPrev = 0;
      this.tPrev = null;
    }

    alpha(rate, cutoff) {
      const tau = 1.0 / (2 * Math.PI * cutoff);
      const te = 1.0 / rate;
      return 1.0 / (1.0 + tau / te);
    }

    filter(val, t = performance.now()) {
      if (this.xPrev === null) {
        this.xPrev = val;
        this.tPrev = t;
        return val;
      }
      const dt = Math.max((t - this.tPrev) / 1000.0, 0.001);
      this.tPrev = t;
      const rate = 1.0 / dt;

      const dx = (val - this.xPrev) * rate;
      const aD = this.alpha(rate, this.dCutoff);
      const dxHat = aD * dx + (1.0 - aD) * this.dxPrev;
      this.dxPrev = dxHat;

      const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
      const a = this.alpha(rate, cutoff);
      const xHat = a * val + (1.0 - a) * this.xPrev;
      this.xPrev = xHat;
      return xHat;
    }

    reset() {
      this.xPrev = null;
      this.dxPrev = 0;
      this.tPrev = null;
    }
  }

  const filterX = new OneEuroFilter(1.2, 0.008);
  const filterY = new OneEuroFilter(1.2, 0.008);
  const filterZ = new OneEuroFilter(0.8, 0.005);

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

  // ── Build or Load Glasses for Product ──
  async function buildGlassesForProduct(product) {
    if (!glassesGroup) return;

    while (glassesGroup.children.length > 0) {
      glassesGroup.remove(glassesGroup.children[0]);
    }

    const pConfig = (typeof getProduct3DConfig === 'function') 
      ? getProduct3DConfig(product) 
      : { shape3d: 'square', colorTheme: 'black_gold', colorLabel: 'Black & Gold', hasClipOn: false };
    
    activeConfig = pConfig;
    const materials = getMaterialPalette(pConfig);

    // Try loading GLB first if GLTFLoader is available
    let glbLoaded = false;
    if (typeof THREE.GLTFLoader !== 'undefined' && pConfig.glbUrl) {
      if (!gltfLoader) gltfLoader = new THREE.GLTFLoader();
      try {
        const gltf = await new Promise((resolve, reject) => {
          gltfLoader.load(pConfig.glbUrl, resolve, undefined, reject);
        });
        if (gltf && gltf.scene) {
          const model = gltf.scene;
          model.traverse(node => {
            if (node.isMesh) {
              node.renderOrder = 1;
              node.material.depthTest = true;
              node.material.depthWrite = true;
            }
          });
          glassesGroup.add(model);
          glbLoaded = true;
          console.log('[VTO] Loaded real binary GLB model:', pConfig.glbUrl);
        }
      } catch (err) {
        console.log('[VTO] Notice: Using exact procedural 3D replica for:', pConfig.shape3d);
      }
    }

    if (!glbLoaded) {
      // Build high-detail procedural replica
      let model;
      if (pConfig.shape3d === 'clubmaster') {
        model = buildClubmasterModel(pConfig, materials);
      } else if (pConfig.shape3d === 'aviator') {
        model = buildAviatorModel(pConfig, materials);
      } else if (pConfig.shape3d === 'round') {
        model = buildRoundModel(pConfig, materials);
      } else if (pConfig.shape3d === 'cateye') {
        model = buildCatEyeModel(pConfig, materials);
      } else {
        model = buildSquareModel(pConfig, materials);
      }

      model.traverse(node => {
        if (node.isMesh) {
          node.renderOrder = 1;
          node.material.depthTest = true;
          node.material.depthWrite = true;
        }
      });
      glassesGroup.add(model);
    }

    // Update UI Clip-On Toggle Button
    updateClipOnUI(pConfig);
  }

  // ── Clip-On Attach / Detach Feature ──
  function updateClipOnUI(pConfig) {
    const btn = document.getElementById('vtoClipToggleBtn');
    const textEl = document.getElementById('vtoClipToggleText');
    if (!btn || !textEl) return;

    if (pConfig && pConfig.hasClipOn) {
      btn.style.display = 'flex';
      const attached = pConfig.clipAttached !== false;
      if (attached) {
        btn.classList.remove('clip-detached');
        textEl.textContent = 'إزالة الكليب الشمسي';
      } else {
        btn.classList.add('clip-detached');
        textEl.textContent = 'تركيب الكليب الشمسي';
      }
    } else {
      btn.style.display = 'none';
    }
  }

  window.toggleVTOClip = function () {
    if (!activeConfig || !activeConfig.hasClipOn) return;

    activeConfig.clipAttached = !activeConfig.clipAttached;
    const isAttached = activeConfig.clipAttached;

    // Toggle 3D clip mesh
    if (clipMeshGroup) {
      clipMeshGroup.visible = isAttached;
    }

    updateClipOnUI(activeConfig);

    // Update label
    const labelEl = document.getElementById('vtoSideColorLabel');
    if (labelEl) {
      labelEl.textContent = isAttached 
        ? `${activeConfig.colorLabel} (+ كليب شمسي)`
        : `${activeConfig.colorLabel} (نظارة طبية)`;
    }
  };

  // ── MediaPipe FaceMesh Initialization (Lazy — Non-blocking) ──
  function initFaceMesh() {
    if (faceMeshInstance) return;

    if (typeof FaceMesh === 'undefined') {
      // Retry after a short delay — library may still be loading from CDN
      setTimeout(initFaceMesh, 500);
      return;
    }

    faceMeshInstance = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    // ⚡ Speed: use coarser tracking — faster WASM init, still accurate enough
    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,   // faster startup (saves ~200ms on mobile)
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMeshInstance.onResults(onFaceResults);
    console.log('[VTO] MediaPipe FaceMesh initialized (non-blocking)');
  }

  // ── Three.js Scene Setup ──
  function initThreeScene(canvas) {
    const width = canvas.clientWidth || 640;
    const height = canvas.clientHeight || 480;

    scene = new THREE.Scene();

    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2500);
    camera.position.set(0, 0, 600);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(150, 300, 400);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffedd5, 0.45);
    dirLight2.position.set(-200, -100, 300);
    scene.add(dirLight2);

    faceAnchorGroup = new THREE.Group();
    scene.add(faceAnchorGroup);

    // ── Head Occluder (Depth Mask) ──
    const occluderGeo = new THREE.CylinderGeometry(65, 55, 180, 32);
    occluderGeo.scale(1.0, 1.0, 1.25);

    const occluderMat = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true
    });

    headOccluder = new THREE.Mesh(occluderGeo, occluderMat);
    headOccluder.renderOrder = 0;
    headOccluder.position.set(0, -15, -75);
    faceAnchorGroup.add(headOccluder);

    glassesGroup = new THREE.Group();
    glassesGroup.renderOrder = 1;
    faceAnchorGroup.add(glassesGroup);
  }

  // ── Face Tracking Callback ──
  function onFaceResults(results) {
    // Loading overlay was already hidden when video started — nothing to do here
    const faceNotice = document.getElementById('vtoFaceLostNotice');

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      consecutiveLostFrames++;
      if (consecutiveLostFrames > 12 && faceNotice) {
        faceNotice.style.display = 'flex';
      }
      return;
    }

    consecutiveLostFrames = 0;
    if (faceNotice) faceNotice.style.display = 'none';

    const landmarks = results.multiFaceLandmarks[0];

    // Nose bridge: 6, between eyes: 168
    const pNose = landmarks[6] || landmarks[168];
    const pRightEye = landmarks[33];
    const pLeftEye = landmarks[263];
    const pForehead = landmarks[10];
    const pChin = landmarks[152];

    const canvas = document.getElementById('vtoCanvas');
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 480;

    const fovRad = (45 * Math.PI) / 180;
    const visibleH = 2 * 600 * Math.tan(fovRad / 2);
    const visibleW = visibleH * (w / h);

    function toWorld(lm) {
      return new THREE.Vector3(
        (lm.x - 0.5) * visibleW,
        -(lm.y - 0.5) * visibleH,
        -lm.z * visibleW
      );
    }

    const vNoseRaw = toWorld(pNose);
    const vRight = toWorld(pRightEye);
    const vLeft = toWorld(pLeftEye);
    const vForehead = toWorld(pForehead);
    const vChin = toWorld(pChin);

    // One-Euro Jitter Filter on Nose Anchor
    const now = performance.now();
    const vNose = new THREE.Vector3(
      filterX.filter(vNoseRaw.x, now),
      filterY.filter(vNoseRaw.y, now),
      filterZ.filter(vNoseRaw.z, now)
    );

    // 6-DOF Head Rotation Matrix
    const vecX = new THREE.Vector3().subVectors(vLeft, vRight).normalize();
    const vecYRaw = new THREE.Vector3().subVectors(vForehead, vChin).normalize();
    const vecZ = new THREE.Vector3().crossVectors(vecX, vecYRaw).normalize();
    const vecY = new THREE.Vector3().crossVectors(vecZ, vecX).normalize();

    const rotMatrix = new THREE.Matrix4();
    rotMatrix.makeBasis(vecX, vecY, vecZ);
    targetQuat.setFromRotationMatrix(rotMatrix);

    // Anchor to Nose Bridge with calibrated offset
    const anchorOff = (activeConfig && activeConfig.anchorOffset) ? activeConfig.anchorOffset : { x: 0, y: -1.5, z: 3.5 };
    const offsetVector = new THREE.Vector3(anchorOff.x, anchorOff.y, anchorOff.z).applyMatrix4(rotMatrix);
    targetPos.copy(vNose).add(offsetVector);

    // Scale proportional to eye distance
    const eyeDist = vRight.distanceTo(vLeft);
    const baseModelEyeDist = 66.0;
    targetScale = (eyeDist / baseModelEyeDist) * ((activeConfig && activeConfig.scaleMultiplier) || 1.0);
  }

  // ── Render Loop ──
  function renderLoop() {
    if (!isVTORunning) return;

    currentPos.lerp(targetPos, 0.45);
    currentQuat.slerp(targetQuat, 0.45);
    currentScale += (targetScale - currentScale) * 0.45;

    if (faceAnchorGroup) {
      faceAnchorGroup.position.copy(currentPos);
      faceAnchorGroup.quaternion.copy(currentQuat);
      faceAnchorGroup.scale.setScalar(currentScale);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }

    animFrameId = requestAnimationFrame(renderLoop);
  }

  let isSendingFrame = false;
  async function processCameraFeed() {
    if (!isVTORunning) return;

    const video = document.getElementById('vtoVideo');

    // ⚡ Wait silently until FaceMesh is ready — no errors, no blocking camera
    if (video && video.readyState >= 2 && !isSendingFrame && faceMeshInstance) {
      isSendingFrame = true;
      try {
        await faceMeshInstance.send({ image: video });
      } catch (err) {}
      isSendingFrame = false;
    }

    if (isVTORunning) {
      // ⚡ 33ms ≈ 30fps — balanced between tracking accuracy and CPU usage
      setTimeout(processCameraFeed, 33);
    }
  }

  // ── Start Camera — hides overlay as soon as first frame arrives ──
  async function startVTOCamera() {
    const video = document.getElementById('vtoVideo');
    const deniedAlert = document.getElementById('vtoCameraDeniedAlert');
    const loadingOverlay = document.getElementById('vtoLoadingOverlay');
    if (deniedAlert) deniedAlert.style.display = 'none';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (deniedAlert) deniedAlert.style.display = 'flex';
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      return false;
    }

    try {
      vtoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 480 },   // ⚡ Reduced from 640 → faster stream start
          height: { ideal: 360 },  // ⚡ Reduced from 480 → faster on mobile
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      });

      video.srcObject = vtoStream;

      // Hide overlay immediately when first frame is decoded (not waiting for FaceMesh)
      video.addEventListener('loadeddata', () => {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
      }, { once: true });

      await video.play();
      return true;
    } catch (err) {
      console.error('[VTO] Camera error:', err);
      if (deniedAlert) deniedAlert.style.display = 'flex';
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      return false;
    }
  }

  // ── Stop Camera ──
  function stopVTOCamera() {
    isVTORunning = false;

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    if (vtoStream) {
      vtoStream.getTracks().forEach(track => {
        track.stop();
        console.log('[VTO] Camera track cleanly stopped:', track.label);
      });
      vtoStream = null;
    }

    const video = document.getElementById('vtoVideo');
    if (video) video.srcObject = null;

    filterX.reset();
    filterY.reset();
    filterZ.reset();
  }

  // ── Open Virtual Try-On Modal ──
  window.openVTOModal = async function (productId) {
    const products = typeof getStoredProducts === 'function' ? getStoredProducts() : [];
    activeProduct = products.find(p => p.id === productId) || products.find(p => p.id === 'prod-7') || products[0];

    if (!activeProduct) return;

    const modal = document.getElementById('vtoModal');
    if (!modal) return;

    modal.classList.add('active');
    isVTORunning = true;

    updateSidePreviewCard(activeProduct);

    // ── STEP 1: Start camera IMMEDIATELY (no waiting) ──
    const loadingOverlay = document.getElementById('vtoLoadingOverlay');
    const captureBtn = document.querySelector('.vto-btn-capture');

    // Show a lightweight "starting camera..." indicator
    if (loadingOverlay) {
      loadingOverlay.innerHTML = `
        <div class="vto-spinner"></div>
        <p style="font-weight:800;font-size:0.9rem;margin-top:10px;color:#1E1E1E;">جاري تشغيل الكاميرا...</p>
      `;
      loadingOverlay.style.display = 'flex';
    }

    // Build 3D scene (fast, local — no network)
    const canvas = document.getElementById('vtoCanvas');
    if (!scene) initThreeScene(canvas);
    await buildGlassesForProduct(activeProduct);
    renderLoop(); // Start rendering immediately

    // ── STEP 2: Get camera stream — hide overlay as soon as video starts ──
    const cameraReady = await startVTOCamera();
    if (!cameraReady) return;

    // ── STEP 3: Enable snapshot button RIGHT AWAY ──
    if (captureBtn) captureBtn.disabled = false;

    // ── STEP 4: Init FaceMesh in background — tracking starts when it's ready ──
    initFaceMesh();
    processCameraFeed(); // Will wait internally until faceMeshInstance is ready
  };

  function updateSidePreviewCard(product) {
    const pConfig = (typeof getProduct3DConfig === 'function') ? getProduct3DConfig(product) : { colorLabel: 'Black & Gold' };

    const imgEl = document.getElementById('vtoSidePreviewImg');
    const labelEl = document.getElementById('vtoSideColorLabel');

    if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.name;
    }
    if (labelEl) {
      labelEl.textContent = pConfig.colorLabel || 'Black & Gold';
    }
  }

  window.selectVTOGlasses = async function (productId) {
    const products = typeof getStoredProducts === 'function' ? getStoredProducts() : [];
    const p = products.find(item => item.id === productId);
    if (!p) return;

    activeProduct = p;
    updateSidePreviewCard(p);
    await buildGlassesForProduct(p);

    toggleGlassesDrawer(false);
  };

  window.toggleGlassesDrawer = function (show) {
    const drawer = document.getElementById('vtoGlassesDrawer');
    if (!drawer) return;
    if (show === undefined) drawer.classList.toggle('active');
    else if (show) drawer.classList.add('active');
    else drawer.classList.remove('active');
  };

  window.closeVTOModal = function () {
    const modal = document.getElementById('vtoModal');
    if (modal) modal.classList.remove('active');
    toggleGlassesDrawer(false);
    stopVTOCamera();
  };

  // ── Snapshot Feature — works immediately, even before FaceMesh loads ──
  window.takeVTOSnapshot = function () {
    const video = document.getElementById('vtoVideo');
    const threeCanvas = document.getElementById('vtoCanvas');
    const captureBtn = document.querySelector('.vto-btn-capture');

    if (!video || video.readyState < 2) {
      // Camera not ready yet — show brief feedback
      if (captureBtn) {
        const origText = captureBtn.innerHTML;
        captureBtn.innerHTML = '<i class="fa-solid fa-clock"></i> <span>الكاميرا بتشتغل...</span>';
        setTimeout(() => { captureBtn.innerHTML = origText; }, 1200);
      }
      return;
    }

    // Visual flash feedback
    const viewport = document.querySelector('.vto-viewport-frame');
    if (viewport) {
      viewport.style.outline = '3px solid #C5A880';
      setTimeout(() => { viewport.style.outline = ''; }, 300);
    }

    const w = video.videoWidth || 480;
    const h = video.videoHeight || 360;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = w;
    snapCanvas.height = h;
    const ctx = snapCanvas.getContext('2d');

    // Draw mirrored video
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    // Overlay Three.js glasses layer (scaled to match video size)
    if (threeCanvas && threeCanvas.width > 0) {
      ctx.drawImage(threeCanvas, 0, 0, w, h);
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = `4D_Optical_TryOn_${Date.now()}.jpg`;
    link.href = snapCanvas.toDataURL('image/jpeg', 0.92);
    link.click();

    // Button feedback
    if (captureBtn) {
      const origHTML = captureBtn.innerHTML;
      captureBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>تم الحفظ!</span>';
      setTimeout(() => { captureBtn.innerHTML = origHTML; }, 1500);
    }
  };

  function populateGlassesDrawer() {
    const container = document.getElementById('vtoDrawerList');
    if (!container) return;

    const products = typeof getStoredProducts === 'function' ? getStoredProducts() : [];
    const eyewear = products.filter(p => p.category !== 'contact_lenses');

    let html = '';
    eyewear.forEach(p => {
      const pConfig = (typeof getProduct3DConfig === 'function') ? getProduct3DConfig(p) : { colorLabel: 'Black & Gold' };
      html += `
        <div onclick="selectVTOGlasses('${p.id}')" class="vto-drawer-card">
          <img src="${p.image}" alt="${p.name}" class="vto-drawer-thumb">
          <div class="vto-drawer-name">${p.name}</div>
          <div class="vto-drawer-color">${pConfig.colorLabel}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(populateGlassesDrawer, 800);

    // ⚡ Preload MediaPipe FaceMesh WASM in background while user browses
    // So by the time they click "Try On", it's already cached
    setTimeout(() => {
      if (typeof FaceMesh !== 'undefined' && !faceMeshInstance) {
        initFaceMesh();
        console.log('[VTO] MediaPipe preloaded silently in background');
      }
    }, 2500);
  });

  window.addEventListener('resize', () => {
    const canvas = document.getElementById('vtoCanvas');
    if (canvas && renderer && camera) {
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  });

})();
