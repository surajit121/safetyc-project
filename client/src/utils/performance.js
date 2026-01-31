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

    if (import.meta.env.MODE !== 'production') {
      console.log('Performance metrics:', {
        ttfb: `${ttfb}ms`,
        fcp: fcp ? `${fcp.startTime}ms` : 'Not available'
      });
    }
  }
};

/**
 * Debounce function - delays execution until after wait ms have elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to delay
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 250) {
  let timeoutId = null;
  
  return function (...args) {
    const context = this;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait ms
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds between allowed calls
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 100) {
  let lastTime = 0;
  let timeoutId = null;
  
  return function (...args) {
    const context = this;
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      func.apply(context, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}