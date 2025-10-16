import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on every route change
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an in-page hash, let the browser handle it after a tick
    if (hash) {
      // Next tick to ensure element exists
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    // Default: jump to top
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
