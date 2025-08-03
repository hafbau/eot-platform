// Database types - exported separately to avoid build issues with Prisma client

// Re-export all Prisma generated types
export type {
  Organization,
  User,
  Project,
  DelayEvent,
  Claim,
  Evidence,
  FileMetadata,
  ActionItem,
  Schedule,
  StorageQuota,
  SessionData,
  MfaSettings,
  PasswordResetToken,
  AnalyticsEvent,
  AuditLog,
  UserRole,
  ProjectStatus,
  ContractType,
  DelayType,
  DelayStatus,
  ClaimStatus,
  EvidenceType,
  ScheduleFormat,
  ExportFormat,
  Priority,
  ActionItemStatus,
  MfaMethod,
  Prisma,
} from './generated/client';

// Utility types for database operations
export interface DatabaseConfig {
  maxConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  enableLogging: boolean;
  logQueries: boolean;
  logLevel: string;
}

export interface DatabaseHealth {
  healthy: boolean;
  message: string;
}

export interface BulkOperationResult {
  count: number;
  success: boolean;
  errors?: string[];
}

export interface DatabaseStats {
  organizations: number;
  users: number;
  projects: number;
  delayEvents: number;
  claims: number;
  evidence: number;
  files: number;
}

// Common filter types
export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface SearchFilter {
  searchTerm?: string;
  searchFields?: string[];
}

export interface OrganizationFilter {
  organizationId: string;
}

export interface UserAccessFilter {
  userId: string;
  userRole: string;
}

// Combined filter type
export interface DatabaseFilter extends 
  Partial<DateRangeFilter>, 
  Partial<SearchFilter>, 
  Partial<OrganizationFilter>,
  Partial<UserAccessFilter> {
  [key: string]: unknown;
}