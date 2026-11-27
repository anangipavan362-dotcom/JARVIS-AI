import React, { useState } from 'react';
import { JarvisAvatar, AvatarState } from './JarvisAvatar';
import { sound } from '../../utils/sound';

export type AIState = AvatarState;

interface AICoreProps {
  state?: AvatarState;
  audioLevel?: number;
  size?: number | string;
  interactive?: boolean;
  onClick?: () => void;
  showParticles?: boolean;
  subtext?: string;
  reducedMotion?: boolean;
  className?: string;
}

export const AICore: React.FC<AICoreProps> = ({
  state = 'IDLE',
  audioLevel = 0,
  size = '100%',
  interactive = true,
  onClick,
  subtext = 'HUMAN-LIKE DIGITAL INTELLIGENCE',
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none overflow-hidden ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size, height: typeof size === 'number' ? size : '380px' }}
      onClick={() => {
        if (interactive) {
          sound.playClick();
          onClick?.();
        }
      }}
    >
      {/* 3D Holographic Human-Like Digital Avatar */}
      <JarvisAvatar
        state={state}
        audioLevel={audioLevel}
        interactive={interactive}
        className="w-full h-full"
      />

      {/* Subtext description if provided */}
      {subtext && (
        <div className="absolute bottom-1 inset-x-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};

export default AICore;
