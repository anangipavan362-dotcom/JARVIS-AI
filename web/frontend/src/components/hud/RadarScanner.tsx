import React from 'react';

export const RadarScanner: React.FC<{ size?: number }> = ({ size = 160 }) => {
  return (
    <div
      className="relative rounded-full border border-cyan-500/40 bg-cyan-950/20 overflow-hidden flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Target Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-cyan-500/20" />
        <div className="h-full w-[1px] bg-cyan-500/20 absolute" />
      </div>

      {/* Concentric Ranges */}
      <div className="w-3/4 h-3/4 rounded-full border border-cyan-500/30 border-dashed" />
      <div className="w-1/2 h-1/2 rounded-full border border-cyan-500/40 absolute" />
      <div className="w-1/4 h-1/4 rounded-full border border-cyan-500/50 absolute" />
      <div className="w-2 h-2 rounded-full bg-cyan-400 absolute animate-ping" />

      {/* Sweeping Beam */}
      <div
        className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, rgba(0, 229, 255, 0.4) 0deg, transparent 60deg, transparent 360deg)'
        }}
      />

      {/* Dynamic detected blips */}
      <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <div className="absolute bottom-10 right-8 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />

      {/* Telemetry Coordinate Label */}
      <div className="absolute bottom-1 text-[8px] font-mono text-cyan-400/70 tracking-tighter">
        RADAR 360° • SCAN ACTIVE
      </div>
    </div>
  );
};
