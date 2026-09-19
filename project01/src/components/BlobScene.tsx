import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { gl } = useThree();

  const { geometry, base, normals } = useMemo(() => {
    let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1.05, 28);
    g = mergeVertices(g, 1e-4) as THREE.BufferGeometry;
    g.computeVertexNormals();
    const pos = g.attributes.position as THREE.BufferAttribute;
    const basePos = new Float32Array(pos.array as Float32Array);
    const nrm = (g.attributes.normal as THREE.BufferAttribute).array as Float32Array;
    return { geometry: g, base: basePos, normals: nrm };
  }, []);

  const st = useRef({
    vel: new THREE.Vector2(),
    spin: new THREE.Vector2(),
    time: Math.random() * 100,
  });

  useEffect(() => {
    const s = st.current;
    const onMove = (e: PointerEvent) => {
      const dx = e.movementX ?? 0;
      const dy = e.movementY ?? 0;
      s.vel.x += dx * 0.0022;
      s.vel.y += dy * 0.0022;
      s.spin.x += dx * 0.0016;
      s.spin.y += dy * 0.0016;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    const s = st.current;
    const t = (s.time += delta * 0.6);
    s.vel.multiplyScalar(0.90);
    s.spin.multiplyScalar(0.94);

    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.x += 0.0016 + s.spin.y;
    mesh.rotation.y += 0.0024 + s.spin.x;

    const v = Math.min(s.vel.length(), 0.9);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const ox = base[ix];
      const oy = base[ix + 1];
      const oz = base[ix + 2];

      let d =
        0.14 * Math.sin(ox * 2.2 + t * 1.4) * Math.sin(oy * 1.8 + t * 1.1) +
        0.09 * Math.sin(oz * 2.6 - t * 1.6) +
        0.07 * Math.sin((ox + oy) * 3.1 + t * 2.0);

      if (v > 0.001) {
        const ripple = Math.sin(ox * 5 + t * 7) * Math.sin(oy * 4 - t * 6) * Math.sin(oz * 6 + t * 5);
        d += v * 0.55 * ripple;
      }

      const nx = normals[ix];
      const ny = normals[ix + 1];
      const nz = normals[ix + 2];
      arr[ix] = ox + nx * d;
      arr[ix + 1] = oy + ny * d;
      arr[ix + 2] = oz + nz * d;
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#f4f1ea"
        metalness={1}
        roughness={0.12}
        envMapIntensity={1.5}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

export default function BlobScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <Blob />
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#fff7ec" />
        <Lightformer intensity={2.2} position={[-5, 0, -1]} rotation-y={Math.PI / 2} scale={[5, 9, 1]} color="#f3d9c8" />
        <Lightformer intensity={2.6} position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[5, 9, 1]} color="#7c1f1f" />
        <Lightformer intensity={1.4} position={[0, 0, 6]} scale={[7, 7, 1]} color="#efe9df" />
      </Environment>
    </Canvas>
  );
}
