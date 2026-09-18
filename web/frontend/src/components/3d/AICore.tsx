import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HolographicRings, AIState } from './HolographicRings';
import { ParticleField } from './ParticleField';
import { sound } from '../../utils/sound';

interface AICoreProps {
  state?: AIState;
  size?: number | string;
  interactive?: boolean;
  onClick?: () => void;
  showParticles?: boolean;
  subtext?: string;
  reducedMotion?: boolean;
}

// Inner Core Scene Object
const CoreMesh: React.FC<{
  state: AIState;
  primaryColor: string;
  secondaryColor: string;
  interactive: boolean;
  onClick?: () => void;
  reducedMotion?: boolean;
}> = ({ state, primaryColor, secondaryColor, interactive, onClick, reducedMotion = false }) => {
  const coreGroupRef = useRef<THREE.Group>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);
  const sparkParticlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Mouse parallax target coordinates
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 0.45;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.45;
      targetRotation.current = { x: y, y: x };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Orbiting spark particles
  const [sparkPositions] = React.useMemo(() => {
    const count = 75;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.35 + (Math.random() - 0.5) * 0.35;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return [pos];
  }, []);

  useFrame((stateObj, delta) => {
    const t = stateObj.clock.getElapsedTime();
    const factor = delta * 60;

    // Smooth parallax lerp
    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.x += (targetRotation.current.x - coreGroupRef.current.rotation.x) * 0.05 * factor;
      coreGroupRef.current.rotation.y += (targetRotation.current.y - coreGroupRef.current.rotation.y) * 0.05 * factor;
    }

    // Inner pulsating sphere
    if (innerSphereRef.current) {
      const pulseSpeed = state === 'THINKING' ? 8 : (state === 'SPEAKING' ? 6 : (state === 'LISTENING' ? 4.5 : 2.5));
      const scale = 1.0 + Math.sin(t * pulseSpeed) * (state === 'SPEAKING' ? 0.12 : 0.06);
      innerSphereRef.current.scale.set(scale, scale, scale);
    }

    // Inner geometric wireframe rotation
    if (octahedronRef.current) {
      octahedronRef.current.rotation.x += 0.015 * factor;
      octahedronRef.current.rotation.y += 0.02 * factor;
    }

    // Orbiting sparks rotation
    if (sparkParticlesRef.current) {
      sparkParticlesRef.current.rotation.y += (state === 'THINKING' ? 0.03 : 0.012) * factor;
    }

    // Pulsing point light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 2.0 + Math.sin(t * 3.5) * 0.8;
    }
  });

  return (
    <group
      ref={coreGroupRef}
      onClick={() => {
        if (interactive) {
          sound.playClick();
          onClick?.();
        }
      }}
    >
      {/* Dynamic Point Light */}
      <pointLight ref={lightRef} color={primaryColor} intensity={2.5} distance={15} />

      {/* 1. Luminous Energy Core Sphere */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 2. Geometric Core Wireframe Structure */}
      <mesh ref={octahedronRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 3. Orbiting Energy Sparks */}
      <points ref={sparkParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color={primaryColor}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 4. Multi-Layer Concentric Holographic Rings */}
      <HolographicRings
        state={state}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    </group>
  );
};

export const AICore: React.FC<AICoreProps> = ({
  state = 'IDLE',
  size = '100%',
  interactive = true,
  onClick,
  showParticles = true,
  subtext = 'AI CORE ACTIVE',
  reducedMotion = false
}) => {
  // Theme configuration per state
  const stateThemes: Record<AIState, { primary: string; secondary: string; glow: string }> = {
    IDLE: { primary: '#00E5FF', secondary: '#008CFF', glow: 'rgba(0, 229, 255, 0.25)' },
    LISTENING: { primary: '#00FF88', secondary: '#00E5FF', glow: 'rgba(0, 255, 136, 0.35)' },
    THINKING: { primary: '#9D4EDD', secondary: '#7928CA', glow: 'rgba(157, 78, 221, 0.4)' },
    SPEAKING: { primary: '#FF9900', secondary: '#FF3366', glow: 'rgba(255, 153, 0, 0.35)' },
    ERROR: { primary: '#FF2A55', secondary: '#FF6B00', glow: 'rgba(255, 42, 85, 0.45)' },
  };

  const theme = stateThemes[state] || stateThemes.IDLE;

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${
        interactive ? 'cursor-pointer' : ''
      }`}
      style={{ width: size, height: typeof size === 'number' ? size : '380px' }}
    >
      {/* Atmospheric Radial Ambient Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="relative z-10"
      >
        <ambientLight intensity={0.4} />
        <CoreMesh
          state={state}
          primaryColor={theme.primary}
          secondaryColor={theme.secondary}
          interactive={interactive}
          onClick={onClick}
          reducedMotion={reducedMotion}
        />
        {showParticles && !reducedMotion && (
          <ParticleField count={180} color={theme.primary} radius={10} speed={0.15} />
        )}
      </Canvas>

      {/* Sci-Fi HUD Center Text Overlay */}
      <div className="absolute bottom-2 inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/60 border border-cyan-500/30 backdrop-blur-sm">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-200 uppercase">
            {state}
          </span>
        </div>
        {subtext && (
          <span className="text-[8px] font-mono text-cyan-400/60 uppercase tracking-wider mt-1">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
