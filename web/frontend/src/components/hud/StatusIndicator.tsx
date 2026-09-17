import React from 'react';

interface StatusIndicatorProps {
  label: string;
  status: 'ONLINE' | 'ACTIVE' | 'READY' | 'STANDBY' | 'DEMO' | 'ALERT' | 'OFFLINE';
  sublabel?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status,
  sublabel,
  pulse = true
}) => {
  const getColors = () => {
    switch (status) {
      case 'ONLINE':
      case 'ACTIVE':
      case 'READY':
        return { dot: 'bg-green-400', glow: 'shadow-[0_0_8px_#00FF66]', text: 'text-green-400' };
      case 'DEMO':
      case 'STANDBY':
        return { dot: 'bg-amber-400', glow: 'shadow-[0_0_8px_#FFB800]', text: 'text-amber-400' };
      case 'ALERT':
        return { dot: 'bg-red-500', glow: 'shadow-[0_0_8px_#FF3030]', text: 'text-red-400' };
      default:
        return { dot: 'bg-gray-400', glow: 'shadow-none', text: 'text-gray-400' };
    }
  };

  const { dot, glow, text } = getColors();

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-cyan-950/60 tech-corner-tl">
      <span className={`w-2 h-2 rounded-full ${dot} ${glow} ${pulse ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-cyan-200/70 tracking-wider uppercase">
          {label}
        </span>
        {sublabel && (
          <span className="text-[8px] font-mono text-gray-400 -mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
      <span className={`text-[10px] font-hud font-bold tracking-wider ml-auto ${text}`}>
        ● {status}
      </span>
    </div>
  );
};
