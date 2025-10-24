// Image optimization helper
export const getOptimizedImageUrl = (url, width = 640) => {
  if (!url) return '';
  
  // If it's already an optimized URL, return as is
  if (url.includes('/optimized/')) return url;
  
  // For local images in the assets folder
  if (url.startsWith('/assets/')) {
    return `/assets/optimized${url.substring(7)}`;
  }
  
  return url;
};

// Lazy loading helper for components
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(() => {
    return new Promise((resolve) => {
      // Add a small delay to prevent loading flash on fast connections
      Promise.all([
        importFunc(),
        new Promise(resolve => setTimeout(resolve, 100))
      ]).then(([moduleExports]) => resolve(moduleExports));
    });
  });
};

// Mobile detection helper
export const isMobileDevice = () => {
  return (
    typeof window !== 'undefined' && 
    (window.innerWidth < 640 || 
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  );
};

// Performance monitoring
export const monitorPageSpeed = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Time to First Byte
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const ttfb = navigationTiming ? navigationTiming.responseStart : 0;

    // First Contentful Paint
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

    console.log('Performance metrics:', {
      ttfb: `${ttfb}ms`,
      fcp: fcp ? `${fcp.startTime}ms` : 'Not available'
    });
  }
};