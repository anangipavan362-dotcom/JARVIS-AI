import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackText?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  fallbackSrc = '/images/fallback/cyber_fallback.svg',
  fallbackText = 'IMAGE TELEMETRY UNAVAILABLE',
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-black/40 ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-xs flex items-center justify-center animate-pulse z-10">
          <span className="text-[10px] font-mono text-cyan-400 tracking-wider">RESOLVING SENSOR FEED...</span>
        </div>
      )}

      {hasError ? (
        fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={alt || fallbackText}
            className={`w-full h-full object-cover ${className}`}
            {...rest}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-cyan-950/20 border border-cyan-500/20 text-center">
            <span className="text-[10px] font-hud text-cyan-400 uppercase tracking-widest">{fallbackText}</span>
            <span className="text-[9px] font-mono text-gray-500 mt-1">TELEMETRY OFFLINE</span>
          </div>
        )
      ) : (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          {...rest}
        />
      )}
    </div>
  );
};
