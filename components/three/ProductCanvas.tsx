'use client';

import { Canvas, useFrame, useThree, useLoader, type ThreeElements } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Variant = 'battery' | 'inverter' | 'sodium' | 'cells';
export type SceneProps = {
  variant: Variant;
  /** 0..1 scroll progress for the exploded view (battery) or camera dolly (cells). */
  progress?: MutableRefObject<number>;
  /** Scale for capacity switching (battery). */
  size?: number;
  particles?: boolean;
  interactive?: boolean;
  active: boolean;
};

const WHITE = '#f3f5fa';
const NAVY = '#08153f';

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useLogo(white = false) {
  const tex = useLoader(THREE.TextureLoader, white ? '/brand/logo-white-tex.png' : '/brand/logo-tex.png');
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Brand double chevron as a flat shape with a green to blue vertical gradient. */
function Chevrons({ scale = 1, ...props }: { scale?: number } & ThreeElements['group']) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const one = (dx: number) => {
      const sh = new THREE.Shape();
      sh.moveTo(dx + 0, 0.5); sh.lineTo(dx + 0.22, 0.5); sh.lineTo(dx + 0.55, 0); sh.lineTo(dx + 0.22, -0.5); sh.lineTo(dx + 0, -0.5); sh.lineTo(dx + 0.33, 0); sh.closePath();
      return sh;
    };
    void s;
    const g = new THREE.ShapeGeometry([one(0), one(0.38)]);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const top = new THREE.Color('#8dd818'), mid = new THREE.Color('#01bec4'), bot = new THREE.Color('#0076fe');
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) + 0.5);
      const c = t > 0.5 ? mid.clone().lerp(top, (t - 0.5) * 2) : bot.clone().lerp(mid, t * 2);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  return (
    <group {...props} scale={scale}>
      <mesh geometry={geo}><meshBasicMaterial vertexColors toneMapped={false} /></mesh>
    </group>
  );
}

function Screen({ y = 0.42 }: { y?: number }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ring.current) (ring.current.material as THREE.MeshBasicMaterial).color.setHSL(0.48 + Math.sin(s.clock.elapsedTime * 0.8) * 0.04, 0.95, 0.5);
  });
  return (
    <group position={[0, y, 0.001]}>
      <mesh><circleGeometry args={[0.15, 48]} /><meshStandardMaterial color="#0b1430" roughness={0.15} metalness={0.4} /></mesh>
      <mesh ref={ring} position={[0, 0, 0.002]}><ringGeometry args={[0.105, 0.118, 64, 1, Math.PI * 0.6, Math.PI * 1.8]} /><meshBasicMaterial color="#01bec4" toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color="#8dd818" toneMapped={false} /></mesh>
    </group>
  );
}

function Battery({ progress, size = 1 }: { progress?: MutableRefObject<number>; size?: number }) {
  const logo = useLogo();
  const cover = useRef<THREE.Group>(null);
  const cells = useRef<THREE.InstancedMesh>(null);
  const bms = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const W = 1, H = 1.6, D = 0.36, T = 0.03;
  const grid = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out.push([c, r]);
    return out;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    const p = progress?.current ?? 0;
    const e = THREE.MathUtils.smoothstep(p, 0.05, 0.85);
    if (root.current) {
      const s = THREE.MathUtils.damp(root.current.scale.x, size, 6, dt);
      root.current.scale.setScalar(s);
    }
    if (cover.current) {
      cover.current.position.set(e * 1.05, e * 0.1, D / 2 + e * 0.55);
      cover.current.rotation.y = -e * 0.9;
    }
    if (cells.current) {
      grid.forEach(([c, r], i) => {
        const x = (c - 1.5) * 0.205, y = (r - 1.5) * 0.3 - 0.12;
        const spread = 1 + e * 0.35;
        dummy.position.set(x * spread, y * spread, e * (0.35 + (r + c) * 0.04));
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        cells.current!.setMatrixAt(i, dummy.matrix);
      });
      cells.current.instanceMatrix.needsUpdate = true;
    }
    if (bms.current) {
      bms.current.position.set(0, 0.62 + e * 0.5, e * 0.5);
      bms.current.rotation.x = -e * 0.5;
    }
  });

  return (
    <group ref={root}>
      {/* open cabinet body */}
      <mesh position={[0, 0, -D / 2 + T / 2]}><boxGeometry args={[W, H, T]} /><meshStandardMaterial color={WHITE} roughness={0.4} /></mesh>
      <mesh position={[-W / 2 + T / 2, 0, 0]}><boxGeometry args={[T, H, D]} /><meshStandardMaterial color={WHITE} roughness={0.4} /></mesh>
      <mesh position={[W / 2 - T / 2, 0, 0]}><boxGeometry args={[T, H, D]} /><meshStandardMaterial color={WHITE} roughness={0.4} /></mesh>
      <mesh position={[0, H / 2 - T / 2, 0]}><boxGeometry args={[W, T, D]} /><meshStandardMaterial color={WHITE} roughness={0.4} /></mesh>
      <mesh position={[0, -H / 2 + T / 2, 0]}><boxGeometry args={[W, T, D]} /><meshStandardMaterial color={WHITE} roughness={0.4} /></mesh>
      {/* LFP cells */}
      <instancedMesh ref={cells} args={[undefined, undefined, 16]}>
        <boxGeometry args={[0.19, 0.28, 0.24]} />
        <meshStandardMaterial color="#1b3a9e" metalness={0.55} roughness={0.28} />
      </instancedMesh>
      {/* BMS board */}
      <group ref={bms}>
        <mesh><boxGeometry args={[0.78, 0.02, 0.26]} /><meshStandardMaterial color="#0f5a3c" roughness={0.6} /></mesh>
        {[-0.25, -0.05, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.025, 0]}><boxGeometry args={[0.12, 0.03, 0.12]} /><meshStandardMaterial color="#111" emissive="#01bec4" emissiveIntensity={0.25} /></mesh>
        ))}
      </group>
      {/* front cover */}
      <group ref={cover} position={[0, 0, D / 2]}>
        <RoundedBox args={[W + 0.02, H + 0.02, 0.04]} radius={0.02} smoothness={3}>
          <meshPhysicalMaterial color="#ffffff" roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.25} />
        </RoundedBox>
        <group position={[0, 0, 0.021]}>
          <Screen y={0.48} />
          <mesh position={[0, 0.05, 0.001]}><planeGeometry args={[0.46, 0.21]} /><meshBasicMaterial map={logo} transparent toneMapped={false} /></mesh>
          <mesh position={[-0.36, -0.18, 0.001]}><planeGeometry args={[0.02, 0.62]} /><meshBasicMaterial color="#0b1430" /></mesh>
          <Chevrons scale={0.42} position={[0.08, -0.56, 0.002]} />
        </group>
      </group>
    </group>
  );
}

function Inverter() {
  const logo = useLogo();
  return (
    <group>
      <RoundedBox args={[1.1, 1.3, 0.26]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={0.5} />
      </RoundedBox>
      <group position={[0, 0, 0.131]}>
        <mesh position={[0, 0.32, 0]}><planeGeometry args={[0.5, 0.23]} /><meshBasicMaterial map={logo} transparent toneMapped={false} /></mesh>
        <RoundedBox args={[0.36, 0.11, 0.01]} radius={0.02} position={[0, -0.12, 0]}><meshStandardMaterial color="#0b1430" roughness={0.15} /></RoundedBox>
        {[-0.1, -0.035, 0.03, 0.095].map((x, i) => (
          <mesh key={x} position={[x, -0.12, 0.007]}><planeGeometry args={[0.04, 0.03]} /><meshBasicMaterial color={i === 0 ? '#8dd818' : '#01bec4'} toneMapped={false} /></mesh>
        ))}
        <Chevrons scale={0.28} position={[0.28, -0.46, 0.001]} />
      </group>
      <mesh position={[0, -0.69, -0.02]}><boxGeometry args={[0.8, 0.08, 0.18]} /><meshStandardMaterial color="#d7dce8" roughness={0.6} /></mesh>
    </group>
  );
}

function Sodium() {
  const logo = useLogo(true);
  return (
    <group rotation={[0, -0.35, 0]}>
      {[0, 1, 2].map((k) => (
        <group key={k} position={[0, (k - 1) * 0.42, 0]}>
          <RoundedBox args={[1.3, 0.38, 0.8]} radius={0.04} smoothness={3}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.32} clearcoat={0.4} />
          </RoundedBox>
          <mesh position={[0, 0, 0.401]}><planeGeometry args={[1.22, 0.3]} /><meshStandardMaterial color={NAVY} roughness={0.35} metalness={0.2} /></mesh>
          <mesh position={[-0.3, 0, 0.403]}><planeGeometry args={[0.36, 0.165]} /><meshBasicMaterial map={logo} transparent toneMapped={false} /></mesh>
          <mesh position={[0.33, 0, 0.403]}><planeGeometry args={[0.24, 0.02]} /><meshBasicMaterial color="#6181ea" toneMapped={false} /></mesh>
          <Chevrons scale={0.16} position={[0.5, 0, 0.404]} />
        </group>
      ))}
    </group>
  );
}

function Cells({ progress }: { progress?: MutableRefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const caps = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const N = 16;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    for (let i = 0; i < N; i++) {
      const c = i % 8, r = Math.floor(i / 8);
      dummy.position.set((c - 3.5) * 0.34, 0, (r - 0.5) * 0.62);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      for (const s of [-1, 1]) {
        dummy.position.set((c - 3.5) * 0.34 + s * 0.08, 0.53, (r - 0.5) * 0.62);
        dummy.updateMatrix();
        caps.current!.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), dummy.matrix);
      }
    }
    mesh.current!.instanceMatrix.needsUpdate = true;
    caps.current!.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    const target = new THREE.Vector3(0.25 - p * 0.25, 0.8 + p * 2.2, 1.5 + p * 4.4);
    camera.position.lerp(target, 1 - Math.exp(-4 * dt));
    camera.lookAt(0, 0.15, 0);
    void s;
  });
  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, N]}>
        <boxGeometry args={[0.3, 1, 0.56]} />
        <meshPhysicalMaterial color="#1a3fae" metalness={0.5} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
      </instancedMesh>
      <instancedMesh ref={caps} args={[undefined, undefined, N * 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.06, 20]} />
        <meshStandardMaterial color="#c9d3e6" metalness={0.9} roughness={0.25} emissive="#01bec4" emissiveIntensity={0.15} />
      </instancedMesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.501, 0]}><planeGeometry args={[12, 8]} /><meshStandardMaterial color="#050d2a" roughness={0.95} /></mesh>
    </group>
  );
}

/** Gradient light particles flowing from upper left into the product. */
function Flow({ count = 160 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3), seeds = new Float32Array(count);
    const a = new THREE.Color('#8dd818'), b = new THREE.Color('#01bec4'), c = new THREE.Color('#0076fe');
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      const t = Math.random();
      const col = t < 0.5 ? a.clone().lerp(b, t * 2) : b.clone().lerp(c, (t - 0.5) * 2);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors, seeds };
  }, [count]);
  const curve = useMemo(() => new THREE.CubicBezierCurve3(new THREE.Vector3(-2.6, 1.9, -0.6), new THREE.Vector3(-1.6, 1.4, 0.8), new THREE.Vector3(-1.2, 0.2, 0.6), new THREE.Vector3(0, 0.1, 0.2)), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((s) => {
    const t0 = s.clock.elapsedTime * 0.12;
    for (let i = 0; i < count; i++) {
      const t = (seeds[i] + t0) % 1;
      curve.getPoint(t, v);
      const j = (seeds[i] - 0.5) * 0.5 * (1 - t);
      positions[i * 3] = v.x + j;
      positions[i * 3 + 1] = v.y + Math.sin(seeds[i] * 40 + t0 * 6) * 0.08 * (1 - t);
      positions[i * 3 + 2] = v.z + j * 0.6;
    }
    pts.current!.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

/** Soft radial glow under the product (canvas texture, no lights or shadows). */
function FloorGlow({ y }: { y: number }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(1,190,196,0.55)');
    r.addColorStop(0.5, 'rgba(0,118,254,0.18)');
    r.addColorStop(1, 'rgba(0,118,254,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[1.8, 1.8]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Stage({ variant, progress, size, particles, interactive }: Omit<SceneProps, 'active'>) {
  const g = useRef<THREE.Group>(null);
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches, []);
  const drag = useRef({ on: false, x: 0, rot: 0 });
  const { gl } = useThree();
  useEffect(() => {
    if (!interactive) return;
    const el = gl.domElement;
    const down = (e: PointerEvent) => { if (e.pointerType === 'mouse') { drag.current.on = true; drag.current.x = e.clientX; el.style.cursor = 'grabbing'; } };
    const move = (e: PointerEvent) => { if (drag.current.on) { drag.current.rot += (e.clientX - drag.current.x) * 0.01; drag.current.x = e.clientX; } };
    const up = () => { drag.current.on = false; el.style.cursor = 'grab'; };
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [gl, interactive]);
  useFrame((s, dt) => {
    if (!g.current || variant === 'cells') return;
    const base = variant === 'sodium' ? 0 : -0.45;
    const auto = fine ? 0 : Math.sin(s.clock.elapsedTime * 0.35) * 0.35;
    const ty = base + drag.current.rot + auto + (fine ? s.pointer.x * 0.25 : 0);
    const tx = fine ? -s.pointer.y * 0.08 : 0;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, ty, 4, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, tx, 4, dt);
    g.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.025;
  });
  return (
    <>
      <Env />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 3, 3]} intensity={1.6} />
      <directionalLight position={[-3, 1, -2]} intensity={0.9} color="#01bec4" />
      <pointLight position={[-1.5, -1, 1.5]} intensity={2} color="#8dd818" distance={5} />
      <group ref={g}>
        {variant === 'battery' && <Battery progress={progress} size={size} />}
        {variant === 'inverter' && <Inverter />}
        {variant === 'sodium' && <Sodium />}
      </group>
      {variant === 'cells' && <Cells progress={progress} />}
      {particles && <Flow />}
      {variant !== 'cells' && <FloorGlow y={variant === 'sodium' ? -0.68 : variant === 'inverter' ? -0.8 : -0.86} />}
    </>
  );
}

export default function ProductCanvas({ active, variant, ...rest }: SceneProps) {
  const cam = variant === 'cells' ? { position: [0.25, 0.75, 1.25] as [number, number, number], fov: 40 } : { position: [0, 0.05, variant === 'sodium' ? 3.9 : variant === 'inverter' ? 3.5 : 3.8] as [number, number, number], fov: 38 };
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={cam}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
      aria-hidden="true"
    >
      <Stage variant={variant} {...rest} />
    </Canvas>
  );
}
