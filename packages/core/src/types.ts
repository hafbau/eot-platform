// Base types for the EOT Intelligence Platform
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

export interface Organization extends BaseEntity {
  name: string;
  domain: string;
  settings: OrganizationSettings;
  isActive: boolean;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  features: string[];
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  organizationId: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  assignedUsers: string[];
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueItems: number;
  upcomingDeadlines: number;
}

export interface ActionItem extends BaseEntity {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: Date;
  projectId: string;
  assignedUserId: string;
  status: ActionItemStatus;
  completedAt?: Date;
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ActionItemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface TrendData {
  month: string;
  delays: number;
  resolved: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationId?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface Session extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// Storage Types
export interface FileUpload {
  file: File;
  metadata?: Record<string, unknown>;
}

export interface StoredFile extends BaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  organizationId: string;
  uploadedBy: string;
  metadata?: Record<string, unknown>;
}

// Event Types for Analytics
export interface AnalyticsEvent extends BaseEntity {
  eventType: string;
  userId?: string;
  organizationId: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

// Audit Types
export interface AuditLog extends BaseEntity {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  organizationId: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Form Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: FormFieldError[];
  isLoading: boolean;
  isValid: boolean;
}