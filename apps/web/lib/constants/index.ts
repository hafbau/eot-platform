// Application constants

export const APP_NAME = 'EOT Intelligence Platform';
export const APP_VERSION = '1.0.0';

// API endpoints (mock)
export const API_BASE_URL = '/api';

// Navigation routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DASHBOARD: '/projects/:projectId/dashboard',
  PROJECT_SCHEDULE: '/projects/:projectId/schedule',
  PROJECT_DELAYS: '/projects/:projectId/delays',
  PROJECT_EVIDENCE: '/projects/:projectId/evidence',
  PROJECT_CLAIMS: '/projects/:projectId/claims',
  SETTINGS: '/settings',
  USER_MANAGEMENT: '/settings/users'
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#2563eb',
  SECONDARY: '#64748b',
  SUCCESS: '#16a34a',
  WARNING: '#d97706',
  DANGER: '#dc2626',
  INFO: '#0891b2'
};

// Claim value thresholds
export const CLAIM_VALUE_THRESHOLDS = {
  LOW: 50000,
  MEDIUM: 250000,
  HIGH: 1000000
};

// Notification deadlines (days)
export const NOTIFICATION_DEADLINES = {
  FIDIC: 28,
  NEC: 8,
  DEFAULT: 14
};

