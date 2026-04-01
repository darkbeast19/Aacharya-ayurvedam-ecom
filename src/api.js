// Centralized API configuration for production and development
export const API_URL = import.meta.env.VITE_API_URL || '';

// Utility function to get full API path
export const getApiPath = (path) => {
  // If API_URL is present, prepend it. Otherwise use relative path.
  if (API_URL) {
    // Ensure no double slashes
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  return path;
};
