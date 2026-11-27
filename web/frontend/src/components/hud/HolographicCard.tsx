import React, { useState, useRef } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'white' | 'silver' | 'graphite' | 'cyan' | 'blue' | 'purple' | 'green' | 'red';
  title?: string;
  badge?: string;
  index?: string;
  interactive3D?: boolean;
  onClick?: () => void;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  glowColor = 'white',
  title,
  badge,
  index,
  interactive3D = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Strict Monochrome Palette: White / Silver / Graphite with deep black depth
  const glowStyles: Record<string, string> = {
    white: 'border-white/10 hover:border-white/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_45px_rgba(255,255,255,0.12)]',
    silver: 'border-white/10 hover:border-[#C8C8C8]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_45px_rgba(200,200,200,0.1)]',
    graphite: 'border-white/5 hover:border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)]',
    // Fallback aliases for backward compatibility mapped directly to monochrome
    cyan: 'border-white/10 hover:border-white/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_45px_rgba(255,255,255,0.12)]',
    blue: 'border-white/10 hover:border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)]',
    purple: 'border-white/10 hover:border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)]',
    green: 'border-white/10 hover:border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)]',
    red: 'border-white/10 hover:border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;
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
        transform:
          interactive3D && isHovered
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.006, 1.006, 1.006)`
            : 'none',
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.4s ease-out, box-shadow 0.3s ease',
      }}
      className={`relative rounded-3xl bg-[#080808]/90 backdrop-blur-2xl border transition-all duration-300 overflow-hidden ${
        glowStyles[glowColor] || glowStyles.white
      } ${className}`}
    >
      {/* Top Card Header if provided */}
      {(title || badge || index) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {index && (
              <span className="text-[11px] font-mono text-white/50 font-bold">
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
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-white/80 font-bold uppercase tracking-wider">
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
export default HolographicCard;
