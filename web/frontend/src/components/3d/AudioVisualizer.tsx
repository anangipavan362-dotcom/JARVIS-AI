import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive?: boolean;
  mode?: 'LISTENING' | 'SPEAKING' | 'IDLE';
  size?: number;
  color?: string;
  audioStream?: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive = false,
  mode = 'IDLE',
  size = 200,
  color = '#00E5FF',
  audioStream = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // Setup Web Audio API if stream is provided
    if (audioStream && isActive) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        const source = ctx.createMediaStreamSource(audioStream);
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
      } catch {
        // Fallback to procedural animation
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioStream, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const numBars = 36;
    const center = size / 2;
    const baseRadius = size * 0.32;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      let dataArray: Uint8Array | null = null;
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray as any);
      }

      time += 0.04;

      // Draw Circular Waveform Bars
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2;
        let barHeight = 8;

        if (dataArray && dataArray.length > 0) {
          const dataIdx = i % dataArray.length;
          barHeight = (dataArray[dataIdx] / 255) * (size * 0.22) + 4;
        } else if (isActive) {
          // Procedural harmonic oscillation for listening / speaking
          const freq = mode === 'SPEAKING' ? 4 : 2.5;
          barHeight = (Math.sin(time * freq + i * 0.4) * 0.5 + 0.5) * (size * 0.18) + 6;
        } else {
          // Idle ambient resting wave
          barHeight = (Math.sin(time * 1.2 + i * 0.2) * 0.5 + 0.5) * 4 + 4;
        }

        const x1 = center + Math.cos(angle) * baseRadius;
        const y1 = center + Math.sin(angle) * baseRadius;
        const x2 = center + Math.cos(angle) * (baseRadius + barHeight);
        const y2 = center + Math.sin(angle) * (baseRadius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isActive ? 10 : 4;
        ctx.stroke();
      }

      // Center glowing base circle
      ctx.beginPath();
      ctx.arc(center, center, baseRadius - 2, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive, mode, size, color]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} width={size} height={size} className="w-full h-full" />
    </div>
  );
};
