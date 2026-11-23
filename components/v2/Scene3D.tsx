import { gsap } from "gsap";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

gsap.registerPlugin(ScrollTrigger);

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

    // ---------- Poses per section (world units; x≈±5 is the screen edge on desktop) ----------
    const poses: Record<string, Pose> = mobile
      ? {
          hero: { x: 0, y: 1.5, s: 0.42 },
          about: { x: 0.9, y: 2.9, s: 0.25 },
          gone: { x: 0.9, y: 7, s: 0.2 },
          contact: { x: 0.75, y: 2.35, s: 0.28 },
        }
      : {
          hero: { x: 3, y: -0.15, s: 1.1 },
          about: { x: 4.1, y: 1.1, s: 0.6 },
          gone: { x: 4.1, y: 6.5, s: 0.45 },
          contact: { x: 3.1, y: 0, s: 0.95 },
        };

    const state: Pose = { ...poses.hero };
    const intro = { v: reduced ? 1 : 0 };
    if (!reduced) gsap.to(intro, { v: 1, duration: 1.8, delay: 1.5, ease: "elastic.out(1, 0.6)" });

    const steps: [string, Pose, Pose][] = [
      ["#about", poses.hero, poses.about],
      ["#experience", poses.about, poses.gone],
      ["#contact", poses.gone, poses.contact],
    ];
    const triggers = steps.map(([sel, from, to]) =>
      gsap.fromTo(state, { ...from }, {
        ...to,
        ease: "power2.inOut",
        immediateRender: false,
        scrollTrigger: { trigger: sel, start: "top bottom", end: "top 25%", scrub: 1 },
      }),
    );

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
      const visible = state.y < 5.5 && intro.v > 0.001;
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
      triggers.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
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
