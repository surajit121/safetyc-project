const BASE = import.meta.env.VITE_API_URL || '';

// For debugging purposes
console.log('API Base URL:', BASE);

export function apiUrl(path) {
  // Ensure path starts with /
  const p = path.startsWith('/') ? path : `/${path}`;
  
  // If no BASE is set, assume local dev environment and use /api prefix
  if (!BASE) return `/api${p}`;
  
  // Normalize base URL by removing trailing slashes
  const base = BASE.replace(/\/+$/, '');
  
  // If base already includes /api suffix, don't add it again
  if (base.endsWith('/api')) return `${base}${p}`;
  
  // Handle both API base URLs with and without protocol
  // Examples: https://api.example.com, api.example.com, etc.
  return `${base}/api${p}`;
}

// For debugging - expose the BASE URL
export const apiBaseUrl = BASE;

export default { apiUrl, apiBaseUrl };