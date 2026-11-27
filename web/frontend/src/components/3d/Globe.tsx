import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlobeProps {
  size?: number | string;
  status?: string;
  networkLatency?: number;
}

const GlobeScene: React.FC<{ status: string }> = ({ status }) => {
  const globeRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate holographic surface points using Fibonacci sphere algorithm
  const [pointPositions] = useMemo(() => {
    const numPoints = 650;
    const positions = new Float32Array(numPoints * 3);
    const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius * 1.8;
      const z = Math.sin(theta) * radius * 1.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y * 1.8;
      positions[i * 3 + 2] = z;
    }
    return [positions];
  }, []);

  useFrame((_, delta) => {
    const factor = delta * 60;
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.004 * factor;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.006 * factor;
    }
  });

  const primaryColor = '#FFFFFF';
  const secondaryColor = '#C8C8C8';

  return (
    <group ref={globeRef}>
      {/* Inner Transparent Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[1.75, 24, 24]} />
        <meshBasicMaterial
          color={secondaryColor}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Fibonacci Point Matrix Sphere */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color={primaryColor}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbital Equator Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 64]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Telemetry Meridian Marker Node */}
      <mesh position={[1.8, 0.2, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};

export const Globe: React.FC<GlobeProps> = ({
  size = 220,
  status = 'ONLINE',
  networkLatency = 24,
}) => {
  return (
    <div
      className="relative flex items-center justify-center select-none overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <GlobeScene status={status} />
      </Canvas>

      {/* Overlay Status Pill in Center Bottom */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
            SAT-NET // {networkLatency}MS
          </span>
        </div>
      </div>
    </div>
  );
};
export default Globe;
