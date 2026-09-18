import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type AIState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

interface HolographicRingsProps {
  state?: AIState;
  primaryColor?: string;
  secondaryColor?: string;
}

export const HolographicRings: React.FC<HolographicRingsProps> = ({
  state = 'IDLE',
  primaryColor = '#00E5FF',
  secondaryColor = '#008CFF'
}) => {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const diagonalRing1Ref = useRef<THREE.Group>(null);
  const diagonalRing2Ref = useRef<THREE.Group>(null);

  // Dynamic speed multipliers based on active AI state
  const speedMultipliers: Record<AIState, number> = {
    IDLE: 1.0,
    LISTENING: 1.8,
    THINKING: 2.6,
    SPEAKING: 1.6,
    ERROR: 0.8
  };

  const speed = speedMultipliers[state] || 1.0;

  useFrame((_, delta) => {
    const factor = delta * 60 * speed;
    if (outerRingRef.current) outerRingRef.current.rotation.z += 0.005 * factor;
    if (midRingRef.current) midRingRef.current.rotation.z -= 0.008 * factor;
    if (innerRingRef.current) innerRingRef.current.rotation.z += 0.012 * factor;

    if (diagonalRing1Ref.current) {
      diagonalRing1Ref.current.rotation.x += 0.007 * factor;
      diagonalRing1Ref.current.rotation.y += 0.005 * factor;
    }
    if (diagonalRing2Ref.current) {
      diagonalRing2Ref.current.rotation.y -= 0.006 * factor;
      diagonalRing2Ref.current.rotation.z += 0.004 * factor;
    }
  });

  return (
    <group>
      {/* 1. Outer Holographic Segmented Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <ringGeometry args={[2.7, 2.74, 64]} />
          <meshBasicMaterial
            color={primaryColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[2.82, 2.84, 48]} />
          <meshBasicMaterial
            color={secondaryColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Outer Ring Telemetry Markers */}
        <Html position={[2.9, 0, 0]} center distanceFactor={10}>
          <div className="text-[9px] font-mono font-bold text-cyan-300/80 bg-black/60 px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap select-none pointer-events-none">
            SYSTEM // ONLINE
          </div>
        </Html>
        <Html position={[-2.9, 0, 0]} center distanceFactor={10}>
          <div className="text-[9px] font-mono font-bold text-cyan-300/80 bg-black/60 px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap select-none pointer-events-none">
            AI CORE // ACTIVE
          </div>
        </Html>
      </group>

      {/* 2. Middle Counter-Rotating Technical Ring */}
      <group ref={midRingRef}>
        <mesh>
          <ringGeometry args={[2.2, 2.23, 64]} />
          <meshBasicMaterial
            color={secondaryColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <Html position={[0, 2.35, 0]} center distanceFactor={10}>
          <div className="text-[8px] font-mono font-bold text-blue-300/80 bg-black/60 px-1 py-0.5 rounded border border-blue-500/30 whitespace-nowrap select-none pointer-events-none">
            VOICE // READY
          </div>
        </Html>
        <Html position={[0, -2.35, 0]} center distanceFactor={10}>
          <div className="text-[8px] font-mono font-bold text-blue-300/80 bg-black/60 px-1 py-0.5 rounded border border-blue-500/30 whitespace-nowrap select-none pointer-events-none">
            NET // CONNECTED
          </div>
        </Html>
      </group>

      {/* 3. Inner Energy Ring */}
      <group ref={innerRingRef}>
        <mesh>
          <ringGeometry args={[1.75, 1.78, 64]} />
          <meshBasicMaterial
            color={primaryColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 4. Diagonal Orbital Holographic Rings */}
      <group ref={diagonalRing1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.0, 0.015, 16, 100]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <group ref={diagonalRing2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.4, 0.012, 16, 100]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};
