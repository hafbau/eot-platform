// Constants for the EOT Intelligence Platform

export const APP_NAME = 'EOT Intelligence Platform';
export const APP_VERSION = '1.0.0';

export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  ORGANIZATIONS: '/api/organizations',
  PROJECTS: '/api/projects',
  STORAGE: '/api/storage',
  ANALYTICS: '/api/analytics',
  AUDIT: '/api/audit',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'eot_access_token',
  REFRESH_TOKEN: 'eot_refresh_token',
  USER_PREFERENCES: 'eot_user_preferences',
  THEME: 'eot_theme',
} as const;