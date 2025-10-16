import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check local storage first, then prefer system preference if no stored value
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme) {
      return storedTheme;
    }
    
    // Check user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      
      // Remove any floating theme toggles that might be duplicates
      setTimeout(() => {
        // Remove any incorrect theme toggle buttons 
        // (e.g. "Switch to Dark Mode" buttons when we're in dark mode)
        const currentTheme = newTheme;
        const incorrectButtons = document.querySelectorAll(
          currentTheme === "dark" 
            ? 'button[aria-label="Switch to Dark Mode"]' 
            : 'button[aria-label="Switch to Light Mode"]'
        );
        
        incorrectButtons.forEach(el => {
          if (el && el.parentElement && !el.closest('.ant-drawer')) {
            console.log('Removing incorrect theme toggle button:', el.getAttribute('aria-label'));
            el.parentElement.removeChild(el);
          }
        });
      }, 50);
      
      return newTheme;
    });
  };

  useEffect(() => {
    // Apply theme to the HTML root element
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#1f1f1f" : "#ffffff");
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}