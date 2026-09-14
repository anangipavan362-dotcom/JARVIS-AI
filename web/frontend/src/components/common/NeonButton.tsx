import React from 'react';
import { sound } from '../../utils/sound';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'electric' | 'green' | 'alert' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  loading = false,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      sound.playClick();
      onClick?.(e);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'border-cyan-400 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]';
      case 'electric':
        return 'border-blue-500 text-blue-300 bg-blue-950/40 hover:bg-blue-600/25 hover:text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,140,255,0.4)]';
      case 'green':
        return 'border-green-500 text-green-300 bg-green-950/40 hover:bg-green-500/20 hover:text-white hover:border-green-400 hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]';
      case 'alert':
        return 'border-red-500 text-red-300 bg-red-950/40 hover:bg-red-500/20 hover:text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(255,48,48,0.4)]';
      case 'ghost':
        return 'border-cyan-500/30 text-cyan-400/80 bg-transparent hover:bg-cyan-950/30 hover:text-cyan-200 hover:border-cyan-400/60';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-5 py-2 text-sm';
      case 'lg':
        return 'px-7 py-3 text-base';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 font-hud font-semibold uppercase tracking-wider transition-all duration-300 border backdrop-blur-sm tech-corner-tl tech-corner-br select-none ${getVariantStyles()} ${getSizeStyles()} ${
        disabled || loading ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};
