const BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!BASE) return `/api${p}`;
  const base = BASE.replace(/\/+$/, '');
  if (base.endsWith('/api')) return `${base}${p}`;
  return `${base}/api${p}`;
}

export default { apiUrl };