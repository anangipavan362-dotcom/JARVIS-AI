import React from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  active?: boolean;
  barCount?: number;
  color?: string;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  active = true,
  barCount = 18,
  color = '#00E5FF',
  className = ''
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className={`flex items-center justify-center gap-1 h-8 ${className}`}>
      {bars.map((i) => {
        // Compute pseudo-frequencies
        const delay = (i * 0.08) % 0.6;
        const initialHeight = active ? Math.sin((i / barCount) * Math.PI) * 100 : 15;

        return (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ backgroundColor: color }}
            animate={
              active
                ? {
                    height: ['15%', `${Math.max(30, initialHeight)}%`, '15%'],
                    opacity: [0.4, 0.9, 0.4]
                  }
                : { height: '15%', opacity: 0.25 }
            }
            transition={{
              duration: 0.8 + (i % 3) * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay
            }}
          />
        );
      })}
    </div>
  );
};
