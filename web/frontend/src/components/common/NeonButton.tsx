import React from 'react';
import { sound } from '../../utils/sound';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'silver' | 'outline' | 'ghost' | 'cyan' | 'electric' | 'green' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'solid',
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

  // Strict Monochrome Palette
  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
      case 'cyan':
        return 'bg-white text-black font-black border border-white hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]';
      case 'silver':
      case 'electric':
        return 'bg-[#1A1A1A] text-white border border-white/20 hover:border-white/50 hover:bg-[#252525] hover:shadow-[0_0_15px_rgba(200,200,200,0.2)]';
      case 'outline':
      case 'green':
        return 'bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]';
      case 'alert':
        return 'bg-white/10 text-white border border-white/40 hover:bg-white/20 hover:border-white';
      case 'ghost':
      default:
        return 'bg-transparent text-gray-300 border border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5';
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
      className={`relative inline-flex items-center justify-center gap-2 font-hud font-semibold uppercase tracking-wider transition-all duration-300 backdrop-blur-sm rounded-xl select-none cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${
        disabled || loading ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};
export default NeonButton;
