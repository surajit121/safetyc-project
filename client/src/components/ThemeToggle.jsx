import { useTheme } from "../context/ThemeContext.jsx";
import { Button, Tooltip } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";

export default function ThemeToggle({ className = "", variant = "default" }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle click event with preventive measures
  const handleToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove any duplicate or incorrect buttons before toggling
    const allButtons = document.querySelectorAll('button[aria-label*="Switch to"]');
    const currentTheme = theme;
    const incorrectLabel = currentTheme === "light" 
      ? "Switch to Light Mode" 
      : "Switch to Dark Mode";
      
    allButtons.forEach(btn => {
      if (btn.getAttribute('aria-label') === incorrectLabel && !btn.closest('.ant-drawer')) {
        if (btn.parentElement) {
          btn.parentElement.removeChild(btn);
        }
      }
    });
    
    // Then toggle the theme
    toggleTheme();
  };
  
  // Ensure component only renders after mounting to avoid SSR mismatches
  if (!mounted) {
    return null;
  }
  
  // Compact style for navbar
  const compactStyle = {
    backgroundColor: theme === 'dark' ? '#333' : 'transparent',
    color: theme === 'dark' ? '#fff' : '#333',
    minWidth: 'auto',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  };
  
  // Only show text in dropdown menu or when specified
  if (variant === "text" || variant === "drawer") {
    return (
      <Button 
        type="text" 
        onClick={handleToggleClick}
        className={`${className} transition-all duration-300 theme-toggle-button`}
        data-theme-state={theme}
        aria-label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === 'dark' ? (
          <>
            <BulbFilled style={{ color: '#fadb14', marginRight: '4px' }} /> Switch to Light Mode
          </>
        ) : (
          <>
            <BulbOutlined style={{ marginRight: '4px' }} /> Switch to Dark Mode
          </>
        )}
      </Button>
    );
  }
  
  // Default icon-only style for navbar
  return (
    <Tooltip title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"} placement="bottom">
      <Button 
        type="text" 
        size="small"
        onClick={handleToggleClick}
        className={`${className} flex items-center justify-center transition-all duration-300 border-none theme-toggle-button`}
        data-theme-state={theme}
        aria-label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        style={compactStyle}
        icon={theme === 'light' 
          ? <BulbOutlined className="transition-transform duration-500" /> 
          : <BulbFilled className="transition-transform duration-500" style={{ color: '#fadb14' }} />
        }
      />
    </Tooltip>
  );
}