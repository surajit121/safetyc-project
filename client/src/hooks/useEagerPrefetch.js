import { useEffect } from 'react';
import { prefetchRoute } from '../routes.js';

/**
 * Hook to eagerly prefetch critical routes after the initial page load.
 * This ensures that common navigation paths are ready before the user clicks,
 * significantly speeding up navigation on both desktop (where hover might be missed)
 * and mobile (where hover doesn't exist).
 */
export const useEagerPrefetch = () => {
  useEffect(() => {
    // List of high-priority routes to prefetch
    const criticalRoutes = [
      '/services',
      '/projects',
      '/contact',
      '/about',
      '/clients'
    ];

    // Wait for the main thread to be idle, or fallback to a timeout
    const prefetch = () => {
      // Small stagger to prevent network congestion
      criticalRoutes.forEach((path, index) => {
        setTimeout(() => {
          prefetchRoute(path);
        }, index * 1000); // 1s delay between each prefetch
      });
    };

    // Use requestIdleCallback if available, otherwise just use a timeout
    // to ensure we don't block the initial render/interactive time
    if ('requestIdleCallback' in window) {
      // Wait a bit before checking for idle time to allow initial animations to start
      const timeoutId = setTimeout(() => {
        window.requestIdleCallback(() => {
          prefetch();
        }, { timeout: 5000 });
      }, 3500);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(prefetch, 4000);
      return () => clearTimeout(timeoutId);
    }
  }, []);
};
