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
  alert = false,
}) => {
  return (
    <div
      className={`bg-[#080808]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col relative transition-all duration-300 ${
        glow ? 'border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.1)]' : ''
      } ${alert ? 'border-white/50' : ''} ${className}`}
    >
      {/* Top Header Row */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {badge && (
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase rounded-full bg-white/10 border border-white/20 text-white font-bold">
                {badge}
              </span>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-hud font-bold text-white tracking-wider uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] font-mono text-gray-400 -mt-0.5">
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
export default CyberCard;
