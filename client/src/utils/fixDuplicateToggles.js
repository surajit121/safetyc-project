// This script checks for duplicate theme toggle buttons and removes them
document.addEventListener('DOMContentLoaded', () => {
  // Function to clean up duplicate buttons
  const cleanupDuplicateButtons = () => {
    // Look for all theme toggle buttons outside the header
    const header = document.querySelector('header');
    const body = document.body;
    
    if (header) {
      // Find toggle buttons in header for reference
      const headerToggle = header.querySelector('button[aria-label*="Switch to"]');
      
      // Find ALL toggle buttons in the document
      const allButtons = Array.from(document.querySelectorAll('button[aria-label*="Switch to"]'));
      
      // Keep only one button in header and one in drawer (if opened)
      allButtons.forEach(btn => {
        const inHeader = header.contains(btn);
        const inDrawer = btn.closest('.ant-drawer');
        
        // If button is not in header and not in drawer, or it's a duplicate, remove it
        if ((!inHeader && !inDrawer) || 
            (btn.getAttribute('aria-label') === "Switch to Dark Mode" && document.documentElement.classList.contains('dark')) || 
            (btn.getAttribute('aria-label') === "Switch to Light Mode" && document.documentElement.classList.contains('light'))) {
          if (btn.parentElement) {
            btn.parentElement.removeChild(btn);
            console.log('Removed incorrect theme toggle button');
          }
        }
      });
    }
  };

  // Run on page load with a delay to ensure components are mounted
  setTimeout(cleanupDuplicateButtons, 500);
  
  // Also run whenever theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && 
          (mutation.target.classList.contains('light') || 
           mutation.target.classList.contains('dark'))) {
        setTimeout(cleanupDuplicateButtons, 100);
      }
    });
  });
  
  // Observe the HTML element for class changes (theme changes)
  observer.observe(document.documentElement, { attributes: true });
});