import React from 'react';
import { motion } from 'framer-motion';

export type ReactorState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ALERT' | 'OFFLINE';

interface ArcReactorProps {
  state?: ReactorState;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
  subtext?: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  state = 'IDLE',
  size = 280,
  interactive = false,
  onClick,
  subtext = 'AI CORE ACTIVE'
}) => {
  // State color mapping
  const colorMap = {
    IDLE: {
      primary: '#00E5FF',
      glow: 'rgba(0, 229, 255, 0.4)',
      secondary: '#008CFF',
      core: '#E8FFFF',
      speed1: 22,
      speed2: -18,
    },
    LISTENING: {
      primary: '#00FF66',
      glow: 'rgba(0, 255, 102, 0.5)',
      secondary: '#00E5FF',
      core: '#E8FFFF',
      speed1: 12,
      speed2: -10,
    },
    THINKING: {
      primary: '#9D4EDD',
      glow: 'rgba(157, 78, 221, 0.6)',
      secondary: '#00E5FF',
      core: '#F3E8FF',
      speed1: 6,
      speed2: -5,
    },
    SPEAKING: {
      primary: '#FF9900',
      glow: 'rgba(255, 153, 0, 0.5)',
      secondary: '#FF3030',
      core: '#FFFBEB',
      speed1: 10,
      speed2: -12,
    },
    ALERT: {
      primary: '#FF3030',
      glow: 'rgba(255, 48, 48, 0.6)',
      secondary: '#FF9900',
      core: '#FFE4E4',
      speed1: 8,
      speed2: -8,
    },
    OFFLINE: {
      primary: '#4B5563',
      glow: 'rgba(75, 85, 99, 0.2)',
      secondary: '#374151',
      core: '#9CA3AF',
      speed1: 60,
      speed2: -60,
    }
  };

  const current = colorMap[state] || colorMap.IDLE;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700"
        style={{ background: current.glow, opacity: 0.5 }}
      />

      {/* SVG Multi-Ring Reactor */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10"
      >
        <defs>
          <radialGradient id={`core-grad-${state}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={current.core} stopOpacity="1" />
            <stop offset="40%" stopColor={current.primary} stopOpacity="0.8" />
            <stop offset="85%" stopColor={current.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Static background coordinate ring */}
        <circle
          cx="200"
          cy="200"
          r="185"
          fill="none"
          stroke={current.primary}
          strokeWidth="1"
          strokeOpacity="0.2"
          strokeDasharray="4 6"
        />

        {/* Outer Ring with technical ticks */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: Math.abs(current.speed1), repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke={current.primary}
            strokeWidth="3"
            strokeDasharray="20 12 4 12"
            strokeOpacity="0.85"
            filter="url(#glow-filter)"
          />
          {/* Segment marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="25"
              x2="200"
              y2="40"
              stroke={current.primary}
              strokeWidth="2.5"
              transform={`rotate(${deg} 200 200)`}
              strokeOpacity="0.75"
            />
          ))}
        </motion.g>

        {/* Middle Ring Counter-Rotating with Triangular Spoke Arrays */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: Math.abs(current.speed2), repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle
            cx="200"
            cy="200"
            r="135"
            fill="none"
            stroke={current.secondary}
            strokeWidth="2"
            strokeDasharray="45 15"
            strokeOpacity="0.7"
          />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <polygon
              key={deg}
              points="196,65 204,65 200,80"
              fill={current.primary}
              opacity="0.8"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </motion.g>

        {/* Inner Reactor High-Energy Geometric Core Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle
            cx="200"
            cy="200"
            r="95"
            fill="none"
            stroke={current.primary}
            strokeWidth="3"
            strokeDasharray="12 8"
            strokeOpacity="0.9"
          />
          {/* 10 Optical emitter nodes */}
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
            <circle
              key={deg}
              cx="200"
              cy="105"
              r="4"
              fill={current.core}
              filter="url(#glow-filter)"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </motion.g>

        {/* Central Luminous Plasma Node */}
        <motion.circle
          cx="200"
          cy="200"
          r="65"
          fill={`url(#core-grad-${state})`}
          animate={{
            r: state === 'THINKING' ? [60, 72, 60] : (state === 'SPEAKING' ? [62, 75, 62] : [62, 68, 62]),
            opacity: [0.85, 1, 0.85]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Center Point Energy Singularity */}
        <circle
          cx="200"
          cy="200"
          r="22"
          fill={current.core}
          filter="url(#glow-filter)"
        />
        <circle
          cx="200"
          cy="200"
          r="10"
          fill="#FFFFFF"
        />
      </svg>

      {/* Futuristic Center Text Overlay for large displays */}
      {size >= 240 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none mt-2">
          <span className="text-[10px] font-mono tracking-widest text-cyan-200/75 uppercase">
            J.A.R.V.I.S.
          </span>
          <span
            className="text-[11px] font-hud font-bold tracking-wider uppercase transition-colors duration-300"
            style={{ color: current.primary }}
          >
            {state}
          </span>
          {subtext && (
            <span className="text-[8px] font-mono text-cyan-400/60 uppercase tracking-tighter">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
