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
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

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

  const primaryColor = status === 'OFFLINE' ? '#FF2A55' : '#00E5FF';

  return (
    <group ref={globeRef}>
      {/* Inner Transparent Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[1.75, 24, 24]} />
        <meshBasicMaterial
          color="#008CFF"
          wireframe
          transparent
          opacity={0.12}
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
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbital Equator Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 64]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.6}
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
  networkLatency = 24
}) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <GlobeScene status={status} />
      </Canvas>

      {/* HUD Telemetry Tag */}
      <div className="absolute bottom-1 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span>NETWORK MONITOR // {networkLatency}ms</span>
      </div>
    </div>
  );
};
