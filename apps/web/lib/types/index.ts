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
  PRIMAVERA_P6: "primavera_p6",
  MS_PROJECT: "ms_project", 
  ASTA: "asta",
  CSV: "csv",
  EXCEL: "excel"
} as const;

export type ScheduleFormatType = typeof ScheduleFormat[keyof typeof ScheduleFormat];

export interface ScheduleActivity {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  predecessors: string[];
  successors: string[];
  resources: string[];
  critical: boolean;
  createdAt: string;
  updatedAt: string;
}

// Export format types
export const ExportFormat = {
  PDF: "pdf",
  WORD: "word",
  HTML: "html",
  EXCEL: "excel"
} as const;

export type ExportFormatType = typeof ExportFormat[keyof typeof ExportFormat];

// Dashboard types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalClaims: number;
  claimsValue: number;
  avgHealthScore: number;
  totalDelays: number;
}

export interface ClaimsFunnelData {
  stage: string;
  count: number;
  value: number;
}

export interface DelayTrendData {
  date: string;
  count: number;
  type: DelayType;
}

// Alternative interface for chart data that has different structure
export interface DelayTrendChartData {
  month: string;
  delays: number;
  claims: number;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  date: string;
  type: "claim" | "milestone" | "deadline";
  priority: "low" | "medium" | "high";
  projectName: string;
}

// Alternative interface for deadline data from API
export interface DeadlineFromAPI {
  id: string;
  projectName: string;
  claimReference: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  priority: string;
}

// Chart types for Recharts
export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

// Navigation types
export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: NavItem[];
}
