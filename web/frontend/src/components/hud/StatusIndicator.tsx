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
  pulse = true,
}) => {
  const isAlert = status === 'ALERT' || status === 'OFFLINE';

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
      <span
        className={`w-2 h-2 rounded-full ${
          isAlert ? 'bg-gray-400' : 'bg-white'
        } ${pulse ? 'animate-pulse' : ''}`}
      />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-gray-300 tracking-wider uppercase">
          {label}
        </span>
        {sublabel && (
          <span className="text-[8px] font-mono text-gray-500 -mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
      <span className="text-[10px] font-hud font-bold tracking-wider ml-auto text-white">
        ● {status}
      </span>
    </div>
  );
};
export default StatusIndicator;
