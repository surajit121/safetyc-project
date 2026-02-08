import React, { useState, useEffect } from 'react';

/**
 * A wrapper around <img> to provide better performance defaults
 * and a smooth transition during loading.
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  style = {}, 
  width, 
  height,
  priority = false, // If true, disables lazy loading (for LCP images)
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    // Basic pre-loading for smoother reveal
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      setCurrentSrc(src);
    };
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        ...style,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : 'auto'
      }}
    >
      {/* Placeholder / Blur effect if needed */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse" 
          aria-hidden="true"
        />
      )}

      <img
        src={currentSrc || src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
