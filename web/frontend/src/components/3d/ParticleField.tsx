import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  radius?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 250,
  color = '#00E5FF',
  speed = 0.2,
  radius = 12
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate randomized positions and velocities in 3D sphere
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.02 * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02 * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02 * speed;
    }
    return [pos, vel];
  }, [count, radius, speed]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx] += velocities[idx] * (delta * 60);
      array[idx + 1] += velocities[idx + 1] * (delta * 60);
      array[idx + 2] += velocities[idx + 2] * (delta * 60);

      // Wrap around boundary to create perpetual floating atmosphere
      const distSq = array[idx] ** 2 + array[idx + 1] ** 2 + array[idx + 2] ** 2;
      if (distSq > radius * radius) {
        array[idx] *= -0.85;
        array[idx + 1] *= -0.85;
        array[idx + 2] *= -0.85;
      }
    }

    positionAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0008 * (delta * 60);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
