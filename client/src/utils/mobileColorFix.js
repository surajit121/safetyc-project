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
    
    // Force CTA link colors
    const ctaLinks = document.querySelectorAll('a[data-cta-link]');
    ctaLinks.forEach(link => {
      link.style.setProperty('color', '#0ea5e9', 'important');
    });
    
    // Force selected menu items to be orange
    const selectedMenuItems = document.querySelectorAll('.ant-menu-item-selected a');
    selectedMenuItems.forEach(item => {
      item.style.setProperty('color', '#e65100', 'important');
    });
  }
};

export default applyMobileColorFix;