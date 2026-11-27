import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type AvatarState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'PROCESSING' | 'ERROR' | 'SLEEPING';

interface JarvisAvatarProps {
  state?: AvatarState;
  audioLevel?: number; // 0.0 to 1.0 for real-time speech lip-sync
  interactive?: boolean;
  className?: string;
}

// -------------------------------------------------------------
// Procedural Holographic Human Head Model
// -------------------------------------------------------------
const HumanHeadModel: React.FC<{ state: AvatarState; audioLevel: number }> = ({ state, audioLevel }) => {
  const headGroupRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftEyelidRef = useRef<THREE.Mesh>(null);
  const rightEyelidRef = useRef<THREE.Mesh>(null);
  const neuralCoreRef = useRef<THREE.Points>(null);
  const haloRingsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Biological Blink & Saccade State
  const blinkRef = useRef({ isBlinking: false, progress: 0, nextBlink: 2.0 });
  const saccadeRef = useRef({ targetX: 0, targetY: 0, nextSaccade: 1.5 });

  // 1. Holographic Skin & Wireframe Materials (Strict Monochrome)
  const holographicSkinMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E5E5E5'),
      roughness: 0.12,
      metalness: 0.88,
      transmission: 0.65,
      thickness: 1.4,
      ior: 1.45,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
  }, []);

  const wireframeLatticeMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFFFFF'),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
  }, []);

  const chromeTrimMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C8C8C8'),
      metalness: 0.95,
      roughness: 0.1,
    });
  }, []);

  const eyeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      emissive: new THREE.Color('#C8C8C8'),
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
  }, []);

  const pupilMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#000000'),
    });
  }, []);

  // Neural Synapse Particles inside the cranium
  const { neuralGeo, neuralMat } = useMemo(() => {
    const count = 450;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.72;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.35; // centered in upper cranium
      pos[i * 3 + 2] = r * Math.cos(phi) - 0.1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: '#FFFFFF',
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    return { neuralGeo: geo, neuralMat: mat };
  }, []);

  // Ambient Floating Hologram Particles around avatar
  const { ambientGeo, ambientMat } = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: '#C8C8C8',
      size: 0.025,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    return { ambientGeo: geo, ambientMat: mat };
  }, []);

  // Main Animation Loop
  useFrame((stateContext, delta) => {
    const t = stateContext.clock.getElapsedTime();

    if (!headGroupRef.current) return;

    // 1. Biological Idle Drift & Breathing
    const breathingAmp = state === 'SLEEPING' ? 0.025 : 0.015;
    const breathingSpeed = state === 'SLEEPING' ? 1.2 : 2.0;
    const breathing = Math.sin(t * breathingSpeed) * breathingAmp;

    let targetRotX = breathing;
    let targetRotY = Math.sin(t * 0.7) * 0.06;
    let targetRotZ = Math.cos(t * 0.5) * 0.02;

    // State Adjustments
    if (state === 'LISTENING') {
      targetRotX = 0.08; // attentive forward lean
      targetRotY = Math.sin(t * 1.5) * 0.03;
    } else if (state === 'THINKING') {
      targetRotX = -0.05; // slight upward tilt
      targetRotY = -0.12; // gazing thoughtfully to the side
    } else if (state === 'SLEEPING') {
      targetRotX = 0.18; // head resting down
      targetRotY = 0;
    }

    headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, delta * 3.5);
    headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, delta * 3.5);
    headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, targetRotZ, delta * 3.5);

    // 2. Natural Blinking Engine
    blinkRef.current.nextBlink -= delta;
    if (blinkRef.current.nextBlink <= 0 && !blinkRef.current.isBlinking && state !== 'SLEEPING') {
      blinkRef.current.isBlinking = true;
      blinkRef.current.progress = 0;
      blinkRef.current.nextBlink = 3.0 + Math.random() * 3.5; // Next blink in 3-6.5 seconds
    }

    let eyelidScaleY = 0.05; // open
    if (state === 'SLEEPING') {
      eyelidScaleY = 1.0; // closed
    } else if (blinkRef.current.isBlinking) {
      blinkRef.current.progress += delta * 12.0; // fast biological snap
      if (blinkRef.current.progress < Math.PI) {
        eyelidScaleY = Math.sin(blinkRef.current.progress);
      } else {
        blinkRef.current.isBlinking = false;
        eyelidScaleY = 0.05;
      }
    }

    if (leftEyelidRef.current && rightEyelidRef.current) {
      leftEyelidRef.current.scale.y = THREE.MathUtils.lerp(leftEyelidRef.current.scale.y, eyelidScaleY, delta * 25.0);
      rightEyelidRef.current.scale.y = THREE.MathUtils.lerp(rightEyelidRef.current.scale.y, eyelidScaleY, delta * 25.0);
    }

    // 3. Natural Eye Saccades (Micro-gaze shifts)
    saccadeRef.current.nextSaccade -= delta;
    if (saccadeRef.current.nextSaccade <= 0 && state !== 'SLEEPING') {
      saccadeRef.current.nextSaccade = 1.2 + Math.random() * 2.5;
      saccadeRef.current.targetX = (Math.random() - 0.5) * 0.12;
      saccadeRef.current.targetY = (Math.random() - 0.5) * 0.08;
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeX = state === 'SLEEPING' ? 0 : saccadeRef.current.targetX;
      const eyeY = state === 'SLEEPING' ? -0.1 : saccadeRef.current.targetY;
      leftEyeRef.current.rotation.y = THREE.MathUtils.lerp(leftEyeRef.current.rotation.y, eyeX, delta * 10.0);
      leftEyeRef.current.rotation.x = THREE.MathUtils.lerp(leftEyeRef.current.rotation.x, eyeY, delta * 10.0);
      rightEyeRef.current.rotation.y = THREE.MathUtils.lerp(rightEyeRef.current.rotation.y, eyeX, delta * 10.0);
      rightEyeRef.current.rotation.x = THREE.MathUtils.lerp(rightEyeRef.current.rotation.x, eyeY, delta * 10.0);
    }

    // 4. Speech Lip-Sync & Mouth Articulation
    if (jawRef.current) {
      let targetJawOpen = 0.0;
      if (state === 'SPEAKING') {
        // Synthesize dynamic viseme oscillation mixed with audio level
        const syntheticViseme = Math.abs(Math.sin(t * 14.0) * Math.cos(t * 8.0));
        const effectiveLevel = Math.max(audioLevel, syntheticViseme * 0.7);
        targetJawOpen = -effectiveLevel * 0.22; // jaw hinge rotates downward
      }
      jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, targetJawOpen, delta * 22.0);
    }

    // 5. Neural Core & Synaptic Pulse Animation
    if (neuralCoreRef.current) {
      const neuralPulseSpeed = state === 'THINKING' ? 4.0 : (state === 'PROCESSING' ? 6.0 : 1.5);
      neuralCoreRef.current.rotation.y += delta * 0.3 * neuralPulseSpeed;
      neuralMat.size = 0.035 + Math.sin(t * neuralPulseSpeed) * 0.01;
    }

    // 6. Halo Orbital Rings
    if (haloRingsRef.current) {
      haloRingsRef.current.rotation.z += delta * 0.2;
      haloRingsRef.current.rotation.y += delta * 0.15;
    }

    // 7. Ambient Particle Drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={headGroupRef} position={[0, -0.1, 0]}>
      {/* ----------------- UPPER HEAD & CRANIUM ----------------- */}
      <group position={[0, 0, 0]}>
        {/* Cranium Base Mesh (Smooth Translucent Silver) */}
        <mesh position={[0, 0.45, -0.05]} material={holographicSkinMat}>
          <sphereGeometry args={[0.82, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        </mesh>
        {/* Cranium Wireframe Lattice Overlay */}
        <mesh position={[0, 0.45, -0.05]} material={wireframeLatticeMat}>
          <sphereGeometry args={[0.83, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        </mesh>

        {/* Forehead & Temporal Planes */}
        <mesh position={[0, 0.35, 0.42]} rotation={[0.2, 0, 0]} material={holographicSkinMat}>
          <boxGeometry args={[0.85, 0.42, 0.45]} />
        </mesh>
        <mesh position={[0, 0.35, 0.42]} rotation={[0.2, 0, 0]} material={wireframeLatticeMat}>
          <boxGeometry args={[0.855, 0.425, 0.455]} />
        </mesh>

        {/* Cheekbones (Anatomical Zygomatic Arches) */}
        <mesh position={[-0.48, 0.02, 0.38]} rotation={[0.1, 0.3, -0.1]} material={holographicSkinMat}>
          <boxGeometry args={[0.28, 0.32, 0.38]} />
        </mesh>
        <mesh position={[0.48, 0.02, 0.38]} rotation={[0.1, -0.3, 0.1]} material={holographicSkinMat}>
          <boxGeometry args={[0.28, 0.32, 0.38]} />
        </mesh>

        {/* Nose Bridge & Septum */}
        <mesh position={[0, 0.04, 0.65]} rotation={[-0.15, 0, 0]} material={chromeTrimMat}>
          <coneGeometry args={[0.09, 0.36, 4]} />
        </mesh>
        <mesh position={[0, -0.12, 0.68]} material={chromeTrimMat}>
          <sphereGeometry args={[0.075, 12, 12]} />
        </mesh>

        {/* Upper Lip Articulator */}
        <mesh position={[0, -0.24, 0.61]} material={chromeTrimMat}>
          <boxGeometry args={[0.32, 0.055, 0.12]} />
        </mesh>

        {/* Left Eye Assembly */}
        <group position={[-0.28, 0.12, 0.52]}>
          <group ref={leftEyeRef}>
            {/* Sclera & Iris Globe */}
            <mesh material={eyeMaterial}>
              <sphereGeometry args={[0.11, 24, 24]} />
            </mesh>
            {/* Pupil */}
            <mesh position={[0, 0, 0.095]} material={pupilMaterial}>
              <circleGeometry args={[0.042, 24]} />
            </mesh>
            {/* Cornea Glow Ring */}
            <mesh position={[0, 0, 0.096]}>
              <ringGeometry args={[0.045, 0.085, 24]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} />
            </mesh>
          </group>
          {/* Anatomical Eyelid Blinker */}
          <mesh ref={leftEyelidRef} position={[0, 0.01, 0.06]} material={chromeTrimMat}>
            <sphereGeometry args={[0.122, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
          {/* Eyebrow Brow Ridge */}
          <mesh position={[0, 0.14, 0.05]} rotation={[0, 0, -0.08]} material={chromeTrimMat}>
            <boxGeometry args={[0.32, 0.035, 0.05]} />
          </mesh>
        </group>

        {/* Right Eye Assembly */}
        <group position={[0.28, 0.12, 0.52]}>
          <group ref={rightEyeRef}>
            <mesh material={eyeMaterial}>
              <sphereGeometry args={[0.11, 24, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.095]} material={pupilMaterial}>
              <circleGeometry args={[0.042, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.096]}>
              <ringGeometry args={[0.045, 0.085, 24]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} />
            </mesh>
          </group>
          <mesh ref={rightEyelidRef} position={[0, 0.01, 0.06]} material={chromeTrimMat}>
            <sphereGeometry args={[0.122, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
          <mesh position={[0, 0.14, 0.05]} rotation={[0, 0, 0.08]} material={chromeTrimMat}>
            <boxGeometry args={[0.32, 0.035, 0.05]} />
          </mesh>
        </group>

        {/* Ears (Architectural Audio Sensors) */}
        <mesh position={[-0.78, 0.05, 0.0]} rotation={[0, 0.2, 0.1]} material={chromeTrimMat}>
          <boxGeometry args={[0.06, 0.32, 0.16]} />
        </mesh>
        <mesh position={[0.78, 0.05, 0.0]} rotation={[0, -0.2, -0.1]} material={chromeTrimMat}>
          <boxGeometry args={[0.06, 0.32, 0.16]} />
        </mesh>
      </group>

      {/* ----------------- LOWER JAW & MOUTH HINGE ----------------- */}
      <group ref={jawRef} position={[0, -0.25, 0.28]}>
        {/* Chin & Mandible Base */}
        <mesh position={[0, -0.22, 0.22]} material={holographicSkinMat}>
          <boxGeometry args={[0.42, 0.26, 0.42]} />
        </mesh>
        <mesh position={[0, -0.22, 0.22]} material={wireframeLatticeMat}>
          <boxGeometry args={[0.425, 0.265, 0.425]} />
        </mesh>

        {/* Lower Lip Articulator */}
        <mesh position={[0, -0.06, 0.32]} material={chromeTrimMat}>
          <boxGeometry args={[0.3, 0.055, 0.11]} />
        </mesh>

        {/* Jawline Lateral Edges */}
        <mesh position={[-0.26, -0.15, 0.05]} rotation={[0.4, 0.4, -0.3]} material={chromeTrimMat}>
          <boxGeometry args={[0.1, 0.28, 0.38]} />
        </mesh>
        <mesh position={[0.26, -0.15, 0.05]} rotation={[0.4, -0.4, 0.3]} material={chromeTrimMat}>
          <boxGeometry args={[0.1, 0.28, 0.38]} />
        </mesh>
      </group>

      {/* ----------------- NECK & HOLOGRAPHIC COLLAR ----------------- */}
      <group position={[0, -0.72, 0.05]}>
        {/* Cervical Spine Column */}
        <mesh material={chromeTrimMat}>
          <cylinderGeometry args={[0.26, 0.35, 0.52, 16]} />
        </mesh>
        {/* Holographic Wireframe Collar */}
        <mesh position={[0, -0.2, 0]} material={wireframeLatticeMat}>
          <cylinderGeometry args={[0.62, 0.85, 0.24, 24]} />
        </mesh>
      </group>

      {/* ----------------- INTERNAL NEURAL SYNAPSE CORE ----------------- */}
      <primitive ref={neuralCoreRef} object={neuralGeo} />

      {/* ----------------- HOLOGRAPHIC ORBITAL RINGS ----------------- */}
      <group ref={haloRingsRef} position={[0, 0.2, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.35, 0.012, 16, 64]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
          <torusGeometry args={[1.5, 0.008, 16, 64]} />
          <meshBasicMaterial color="#C8C8C8" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* ----------------- AMBIENT POINT CLOUD PARTICLES ----------------- */}
      <primitive ref={particlesRef} object={ambientGeo} />
    </group>
  );
};

// -------------------------------------------------------------
// Interactive 3D Avatar Scene Canvas with Lighting
// -------------------------------------------------------------
export const JarvisAvatar: React.FC<JarvisAvatarProps> = ({
  state = 'IDLE',
  audioLevel = 0,
  interactive = true,
  className = 'w-full h-full min-h-[420px]'
}) => {
  return (
    <div className={`relative ${className} select-none overflow-hidden rounded-3xl bg-[#050505] border border-white/10 shadow-mono-glow`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0.15, 2.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#050505']} />

        {/* Studio Three-Point Monochrome Lighting */}
        <ambientLight intensity={0.45} />
        
        {/* Key Light (Pure White Top-Right) */}
        <directionalLight position={[2.5, 3.5, 2.0]} intensity={1.5} color="#FFFFFF" />
        
        {/* Fill Light (Soft Silver Left) */}
        <directionalLight position={[-2.5, 1.0, 1.5]} intensity={0.8} color="#C8C8C8" />
        
        {/* Rim / Back Light (High-Contrast Silhouette Edge) */}
        <directionalLight position={[0, -2.0, -2.5]} intensity={2.2} color="#FFFFFF" />
        
        {/* Internal Neural Light Source */}
        <pointLight position={[0, 0.35, 0]} intensity={1.8} distance={2.5} color="#FFFFFF" />

        {/* Head Model with Dynamic Float */}
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
          <HumanHeadModel state={state} audioLevel={audioLevel} />
        </Float>

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.5}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
          />
        )}
      </Canvas>

      {/* Overlay Status Pill in Top-Left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
        <span className={`w-2 h-2 rounded-full ${state === 'SPEAKING' ? 'bg-white animate-ping' : (state === 'LISTENING' ? 'bg-white animate-pulse' : 'bg-gray-400')}`} />
        <span className="text-[11px] font-mono tracking-widest text-white uppercase">
          JARVIS // {state}
        </span>
      </div>

      {/* Audio Reactive Waveform Indicator in Bottom */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-4 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {[...Array(12)].map((_, i) => {
            const height = state === 'SPEAKING' 
              ? Math.max(4, Math.sin((i + Date.now() * 0.005) * 0.8) * 16 * (audioLevel || 0.8))
              : (state === 'LISTENING' ? Math.max(3, Math.sin(i * 0.5) * 8) : 3);
            return (
              <span
                key={i}
                className="w-1 bg-white/80 rounded-full transition-all duration-75"
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>
        <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
          {state === 'SPEAKING' ? 'VOCAL SYNTHESIS ACTIVE' : (state === 'LISTENING' ? 'AURAL SENSORS OPEN' : 'NEURAL IDLE')}
        </div>
      </div>
    </div>
  );
};

export default JarvisAvatar;
