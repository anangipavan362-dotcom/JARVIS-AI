import React, { useState, useRef } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'blue' | 'purple' | 'green' | 'red';
  title?: string;
  badge?: string;
  interactive3D?: boolean;
  onClick?: () => void;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  title,
  badge,
  interactive3D = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]',
    blue: 'border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,140,255,0.25)]',
    purple: 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(157,78,221,0.25)]',
    green: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(0,255,136,0.25)]',
    red: 'border-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(255,42,85,0.25)]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
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
        transform: interactive3D && isHovered ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.01, 1.01, 1.01)` : 'none',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out, box-shadow 0.3s ease',
      }}
      className={`relative rounded-lg bg-black/55 backdrop-blur-xl border transition-all duration-300 tech-corner-tl tech-corner-br ${glowStyles[glowColor]} ${className}`}
    >
      {/* Top Card Header if provided */}
      {(title || badge) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/20 bg-cyan-950/20">
          {title && (
            <h3 className="text-xs font-hud font-bold tracking-wider text-cyan-200 uppercase">
              {title}
            </h3>
          )}
          {badge && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-widest">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4">{children}</div>
    </div>
  );
};
