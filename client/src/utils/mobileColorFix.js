/**
 * This utility helps fix color rendering issues on mobile devices
 * by forcing important color styles to be applied
 */

export const applyMobileColorFix = () => {
  // Check if we're on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Force orange color on the "C" in SAFETYC
    const logoC = document.querySelector('.text-orange-600');
    if (logoC) {
      logoC.style.setProperty('color', '#e65100', 'important');
    }
    
    // Force CTA link colors and styling
    const ctaLinks = document.querySelectorAll('a[data-cta-link]');
    ctaLinks.forEach(link => {
      // Set text color
      link.style.setProperty('color', '#0ea5e9', 'important');
      
      // Ensure proper background color
      link.style.setProperty('background-color', '#ffffff', 'important');
      
      // Fix button appearance
      link.style.setProperty('display', 'inline-block', 'important');
      link.style.setProperty('padding', '12px 20px', 'important');
      link.style.setProperty('border-radius', '8px', 'important');
      link.style.setProperty('text-decoration', 'none', 'important');
      link.style.setProperty('box-shadow', '0 1px 2px rgba(0,0,0,0.05)', 'important');
      link.style.setProperty('border', '1px solid rgba(2, 132, 199, 0.15)', 'important');
    });
    
    // Force selected menu items to be orange
    const selectedMenuItems = document.querySelectorAll('.ant-menu-item-selected a');
    selectedMenuItems.forEach(item => {
      item.style.setProperty('color', '#e65100', 'important');
    });
    
    // Fix for active menu items in mobile drawer
    const mobileActiveLinks = document.querySelectorAll('.ant-drawer .ant-menu-item a.text-orange-600');
    mobileActiveLinks.forEach(item => {
      item.style.setProperty('color', '#e65100', 'important');
      item.style.setProperty('font-weight', '500', 'important');
    });
  }
};

export default applyMobileColorFix;