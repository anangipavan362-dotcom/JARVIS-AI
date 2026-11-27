import React, { useState, useRef } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'blue' | 'purple' | 'green' | 'red';
  title?: string;
  badge?: string;
  index?: string;
  interactive3D?: boolean;
  onClick?: () => void;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  title,
  badge,
  index,
  interactive3D = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: 'border-white/10 hover:border-cyan-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(0,229,255,0.18)]',
    blue: 'border-white/10 hover:border-blue-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(0,140,255,0.18)]',
    purple: 'border-white/10 hover:border-purple-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(157,78,221,0.18)]',
    green: 'border-white/10 hover:border-emerald-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(0,255,136,0.18)]',
    red: 'border-white/10 hover:border-rose-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(255,42,85,0.18)]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: interactive3D && isHovered ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.008, 1.008, 1.008)` : 'none',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out, box-shadow 0.3s ease',
      }}
      className={`relative rounded-3xl glass-fusion backdrop-blur-2xl border transition-all duration-300 overflow-hidden ${glowStyles[glowColor]} ${className}`}
    >
      {/* Top Card Header if provided */}
      {(title || badge || index) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {index && (
              <span className="text-[11px] font-mono text-cyan-400/70 font-bold">
                {index}
              </span>
            )}
            {title && (
              <h3 className="text-xs font-hud font-bold tracking-wider text-white uppercase">
                {title}
              </h3>
            )}
          </div>
          {badge && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-bold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-5">{children}</div>
    </div>
  );
};
