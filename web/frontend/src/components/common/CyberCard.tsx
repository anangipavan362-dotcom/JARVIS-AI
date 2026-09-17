import React from 'react';

interface CyberCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  alert?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  title,
  subtitle,
  badge,
  headerAction,
  children,
  className = '',
  glow = false,
  alert = false
}) => {
  return (
    <div
      className={`cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br flex flex-col relative transition-all duration-300 ${
        glow ? 'cyber-panel-glow' : ''
      } ${alert ? 'cyber-panel-alert' : ''} ${className}`}
    >
      {/* Top Header Row */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            {badge && (
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {badge}
              </span>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-hud font-bold text-cyan-200 tracking-wider uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] font-mono text-cyan-400/60 -mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      {/* Main Card Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
