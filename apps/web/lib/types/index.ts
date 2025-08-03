// Type definitions for the EOT Intelligence Platform

// User types
export enum UserRole {
  DIRECTOR = 'director',
  PROJECT_MANAGER = 'project_manager',
  SCHEDULER = 'scheduler',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Project types
export enum ContractType {
  FIDIC_RED = 'fidic_red',
  FIDIC_YELLOW = 'fidic_yellow',
  FIDIC_SILVER = 'fidic_silver',
  NEC3 = 'nec3',
  NEC4 = 'nec4',
  CUSTOM = 'custom'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  plannedCompletion: string;
  status: ProjectStatus;
  contractValue: number;
  contractType: ContractType;
  projectManager: string;
  healthScore: number;
  totalClaims: number;
  claimsValue: number;
  createdAt: string;
  updatedAt: string;
}

// Delay types
export enum DelayType {
  CLIENT_DELAY = 'client_delay',
  CONTRACTOR_DELAY = 'contractor_delay',
  WEATHER = 'weather',
  THIRD_PARTY = 'third_party',
  FORCE_MAJEURE = 'force_majeure'
}

export enum DelayStatus {
  DETECTED = 'detected',
  UNDER_REVIEW = 'under_review',
  CLAIM_PREPARED = 'claim_prepared',
  CLAIM_SUBMITTED = 'claim_submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Delay {
  id: string;
  projectId: string;
  type: DelayType;
  status: DelayStatus;
  description: string;
  startDate: string;
  duration: number;
  impact: number;
  responsible: string;
  createdAt: string;
  updatedAt: string;
}

// Claim types
export enum ClaimStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  SUBMITTED = 'submitted',
  UNDER_EVALUATION = 'under_evaluation',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SETTLED = 'settled'
}

export interface Claim {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ClaimStatus;
  amount: number;
  dateSubmitted?: string;
  dateResolved?: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

// Evidence types
export enum EvidenceType {
  EMAIL = 'email',
  DOCUMENT = 'document',
  PHOTO = 'photo',
  MEETING_MINUTES = 'meeting_minutes',
  SITE_REPORT = 'site_report',
  WEATHER_DATA = 'weather_data',
  SCHEDULE = 'schedule',
  RFI = 'rfi',
  CHANGE_ORDER = 'change_order'
}

export interface Evidence {
  id: string;
  projectId: string;
  type: EvidenceType;
  title: string;
  description: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Schedule types
export const ScheduleFormat = {
  PRIMAVERA_P6: 'primavera_p6',
  MS_PROJECT: 'ms_project',
  ASTA: 'asta',
  CSV: 'csv',
  EXCEL: 'excel'
};

// Export format types
export const ExportFormat = {
  PDF: 'pdf',
  WORD: 'word',
  HTML: 'html',
  EXCEL: 'excel'
};

