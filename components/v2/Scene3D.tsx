import { gsap } from "gsap";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Pose = { x: number; y: number; s: number };

/**
 * One fixed WebGL canvas behind the page (the technique from the reference sites):
 * an emerald crystal that changes pose per section as you scroll and follows the mouse.
 */
export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 900;

    // ---------- Renderer, scene, camera ----------
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // ---------- Objects ----------
    const group = new THREE.Group();
    scene.add(group);

    const gemGeo = new THREE.IcosahedronGeometry(1.25, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x14a35a,
      metalness: 0.6,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      iridescence: 0.3,
      iridescenceIOR: 1.3,
      flatShading: true,
      envMapIntensity: 1.1,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    group.add(gem);

    const shellGeo = new THREE.IcosahedronGeometry(1.75, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x3ddc84, wireframe: true, transparent: true, opacity: 0.14 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    const COUNT = mobile ? 600 : 1100;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.35 + (Math.random() - 0.5) * 0.55;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.22;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0x9be7bd,
      size: 0.022,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    ring.rotation.x = 1.15;
    ring.rotation.z = -0.35;
    group.add(ring);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x3ddc84, 40, 20);
    rim.position.set(-3, -2, -3);
    scene.add(rim);

    // ---------- Anchor slots ----------
    // The crystal lives inside empty slots on the page ([data-orb-anchor]) and scrolls with them,
    // like a normal page element, so it never floats over other sections.
    const OBJECT_DIAMETER = 5.2; // world units: particle ring diameter at scale 1
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-orb-anchor]"));
    const state: Pose = { x: 0, y: 0, s: 0 };
    const intro = { v: reduced ? 1 : 0 };
    if (!reduced) gsap.to(intro, { v: 1, duration: 1.8, delay: 1.5, ease: "elastic.out(1, 0.6)" });

    /** Places the crystal on the anchor that is most visible; returns false if none is on screen. */
    const followAnchor = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let best: DOMRect | null = null;
      let bestVisible = 0;
      anchors.forEach((a) => {
        const r = a.getBoundingClientRect();
        if (r.width === 0) return; // hidden at this breakpoint
        const visible = Math.max(0, Math.min(r.bottom, vh + r.height * 0.3) - Math.max(r.top, -r.height * 0.3));
        if (visible > bestVisible) {
          bestVisible = visible;
          best = r;
        }
      });
      if (!best) return false;
      const r = best as DOMRect;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const unitsPerPx = (halfH * 2) / vh;
      state.x = ((r.left + r.width / 2) / vw) * 2 * halfW - halfW;
      state.y = halfH - ((r.top + r.height / 2) / vh) * 2 * halfH;
      state.s = (r.width * unitsPerPx) / OBJECT_DIAMETER;
      return true;
    };

    // ---------- Mouse + scroll velocity ----------
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    let lastScroll = window.scrollY;
    let spinBoost = 0;

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- Render loop on GSAP's clock (same clock as Lenis + ScrollTrigger) ----------
    let wasVisible = true;
    const tick = (_t: number, deltaMs: number) => {
      if (document.hidden) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      const visible = followAnchor() && intro.v > 0.001;
      if (!visible) {
        if (wasVisible) {
          renderer.clear();
          wasVisible = false;
        }
        return;
      }
      wasVisible = true;

      const sy = window.scrollY;
      spinBoost += (Math.min(Math.abs(sy - lastScroll) * 0.0009, 0.08) - spinBoost) * 0.1;
      lastScroll = sy;

      if (!reduced) {
        gem.rotation.y += dt * 0.35 + spinBoost;
        gem.rotation.x += dt * 0.12;
        shell.rotation.y -= dt * 0.12;
        shell.rotation.z += dt * 0.05;
        ring.rotation.y += dt * 0.08;
        group.rotation.x += (pointer.y * 0.35 - group.rotation.x) * 0.05;
        group.rotation.y += (pointer.x * 0.5 - group.rotation.y) * 0.05;
        group.position.y = state.y + Math.sin(performance.now() * 0.0008) * 0.08;
      } else {
        group.position.y = state.y;
      }
      group.position.x = state.x;
      group.scale.setScalar(Math.max(state.s * intro.v, 0.0001));
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      [gemGeo, shellGeo, ringGeo].forEach((g) => g.dispose());
      [gemMat, shellMat, ringMat].forEach((m) => m.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="scene3d" aria-hidden="true" />;
}
