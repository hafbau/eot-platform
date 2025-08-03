import { BaseEntity } from '@eot/core';

export interface AuditEntry extends BaseEntity {
  action: AuditAction;
  entityType: string;
  entityId: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: FieldChange[];
  metadata?: Record<string, unknown>;
  severity: AuditSeverity;
  category: AuditCategory;
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  LOGIN = 'login',
  LOGOUT = 'logout',
  APPROVE = 'approve',
  REJECT = 'reject',
}

export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AuditCategory {
  AUTH = 'authentication',
  DATA = 'data',
  ADMIN = 'administration',
  SECURITY = 'security',
  INTEGRATION = 'integration',
  SYSTEM = 'system',
}

export interface FieldChange {
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
  dataType: string;
}

export interface ComplianceReport extends BaseEntity {
  organizationId: string;
  reportType: ComplianceType;
  periodStart: Date;
  periodEnd: Date;
  findings: ComplianceFinding[];
  status: ComplianceStatus;
  generatedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export enum ComplianceType {
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  SOC2 = 'soc2',
  ISO27001 = 'iso27001',
  CUSTOM = 'custom',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIAL = 'partial',
  PENDING_REVIEW = 'pending_review',
}

export interface ComplianceFinding {
  requirement: string;
  description: string;
  status: ComplianceStatus;
  evidence?: string[];
  remediation?: string;
  riskLevel: RiskLevel;
  dueDate?: Date;
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface RetentionPolicy extends BaseEntity {
  organizationId: string;
  entityType: string;
  retentionPeriod: number; // in days
  archiveAfter?: number; // in days
  isActive: boolean;
  autoDelete: boolean;
  lastAppliedAt?: Date;
}

export interface DataExport extends BaseEntity {
  organizationId: string;
  requestedBy: string;
  entityTypes: string[];
  filters: Record<string, unknown>;
  format: ExportFormat;
  status: ExportStatus;
  downloadUrl?: string;
  expiresAt?: Date;
  fileSize?: number;
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
  XML = 'xml',
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}