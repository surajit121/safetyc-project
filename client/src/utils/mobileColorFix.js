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
      logoC.style.setProperty('color', '#f97316', 'important');
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
    
    // Reset all menu items first to ensure no lingering active states
    const allMobileMenuItems = document.querySelectorAll('.mobile-menu .ant-menu-item a');
    allMobileMenuItems.forEach(item => {
      if (item.getAttribute('data-active') !== 'true') {
        item.style.setProperty('color', '', ''); // Remove any previously set colors
        item.style.setProperty('font-weight', '', '');
      }
    });
    
    // Force selected menu items to be orange - only for desktop menu
    const selectedDesktopItems = document.querySelectorAll('.hidden.md\\:flex .ant-menu-item-selected a');
    selectedDesktopItems.forEach(item => {
      item.style.setProperty('color', '#f97316', 'important');
    });
    
    // Fix for active menu items in mobile drawer - use data-active attribute for reliability
    const mobileActiveLinks = document.querySelectorAll('.ant-drawer .ant-menu-item a[data-active="true"]');
    mobileActiveLinks.forEach(item => {
      item.style.setProperty('color', '#f97316', 'important');
      item.style.setProperty('font-weight', '600', 'important');
      // Ensure parent menu item has no background
      const parentMenuItem = item.closest('.ant-menu-item');
      if (parentMenuItem) {
        parentMenuItem.style.setProperty('background-color', 'transparent', 'important');
      }
    });
    
    // Remove any background color from mobile menu items
    const allMenuItems = document.querySelectorAll('.mobile-menu .ant-menu-item');
    allMenuItems.forEach(item => {
      item.style.setProperty('background-color', 'transparent', 'important');
      item.style.setProperty('background', 'none', 'important');
      
      // Remove any hover backgrounds from Ant Design
      item.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.setProperty('background-color', 'transparent', 'important');
        e.currentTarget.style.setProperty('background', 'none', 'important');
      });
    });
  }
};

export default applyMobileColorFix;