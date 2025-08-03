// Mock data for the EOT Intelligence Platform
// This file contains all mock data that can be easily removed later

import { UserRole, ContractType, ProjectStatus, DelayType, DelayStatus, ClaimStatus, EvidenceType } from '../types/index';

// Mock users
export const mockUsers = [
  {
    id: '1',
    name: 'David Chen',
    email: 'david.chen@company.com',
    role: UserRole.DIRECTOR,
    avatar: null,
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2025-07-14T09:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    role: UserRole.PROJECT_MANAGER,
    avatar: null,
    createdAt: '2024-02-01T08:00:00Z',
    lastLogin: '2025-07-14T08:15:00Z'
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@company.com',
    role: UserRole.SCHEDULER,
    avatar: null,
    createdAt: '2024-02-15T08:00:00Z',
    lastLogin: '2025-07-14T07:45:00Z'
  }
];

// Mock projects
export const mockProjects = [
  {
    id: '1',
    name: 'Dubai Marina Tower Complex',
    contractValue: 450000000,
    contractType: ContractType.FIDIC_YELLOW,
    startDate: '2025-01-01',
    plannedCompletion: '2027-12-31',
    currentCompletion: '2025-07-14',
    status: ProjectStatus.ACTIVE,
    healthScore: 78,
    totalClaims: 7,
    claimsValue: 4200000,
    approvedClaims: 23,
    approvedValue: 12300000,
    projectManager: 'Sarah Williams',
    location: 'Dubai, UAE',
    description: 'Construction of a 45-story mixed-use tower complex in Dubai Marina',
    createdAt: '2024-12-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'London Bridge Infrastructure',
    contractValue: 280000000,
    contractType: ContractType.NEC4,
    startDate: '2024-06-01',
    plannedCompletion: '2026-05-31',
    currentCompletion: '2025-07-14',
    status: ProjectStatus.ACTIVE,
    healthScore: 85,
    totalClaims: 3,
    claimsValue: 1800000,
    approvedClaims: 15,
    approvedValue: 8500000,
    projectManager: 'Sarah Williams',
    location: 'London, UK',
    description: 'Major infrastructure upgrade project for London Bridge area',
    createdAt: '2024-05-01T08:00:00Z'
  },
  {
    id: '3',
    name: 'Singapore Metro Extension',
    contractValue: 650000000,
    contractType: ContractType.FIDIC_RED,
    startDate: '2024-03-01',
    plannedCompletion: '2027-02-28',
    currentCompletion: '2025-07-14',
    status: ProjectStatus.ACTIVE,
    healthScore: 92,
    totalClaims: 2,
    claimsValue: 950000,
    approvedClaims: 8,
    approvedValue: 5200000,
    projectManager: 'David Chen',
    location: 'Singapore',
    description: 'Extension of the Singapore Metro system with 12 new stations',
    createdAt: '2024-02-01T08:00:00Z'
  }
];

// Mock delay events
export const mockDelayEvents = [
  {
    id: '1',
    projectId: '1',
    activityId: 'ACT-001',
    activityName: 'Foundation Pour Zone A',
    detectionDate: '2025-03-15',
    delayDays: 15,
    causeType: DelayType.CLIENT_DELAY,
    probabilityScore: 85,
    evidenceStrength: 85,
    status: DelayStatus.CLAIM_SUBMITTED,
    description: 'Client design change requiring reinforcement redesign',
    estimatedCost: 1200000,
    criticalPath: true,
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    projectId: '1',
    activityId: 'ACT-002',
    activityName: 'Steel Erection Tower B',
    detectionDate: '2025-04-02',
    delayDays: 8,
    causeType: DelayType.WEATHER,
    probabilityScore: 65,
    evidenceStrength: 70,
    status: DelayStatus.UNDER_REVIEW,
    description: 'Extended rainfall period affecting steel erection work',
    estimatedCost: 450000,
    criticalPath: false,
    createdAt: '2025-04-02T14:15:00Z'
  },
  {
    id: '3',
    projectId: '1',
    activityId: 'ACT-003',
    activityName: 'MEP Rough-in Level 5',
    detectionDate: '2025-05-10',
    delayDays: 12,
    causeType: DelayType.THIRD_PARTY,
    probabilityScore: 78,
    evidenceStrength: 82,
    status: DelayStatus.CLAIM_PREPARED,
    description: 'Utility company delay in power connection approval',
    estimatedCost: 680000,
    criticalPath: true,
    createdAt: '2025-05-10T09:20:00Z'
  }
];

// Mock claims
export const mockClaims = [
  {
    id: '1',
    projectId: '1',
    referenceNumber: 'EOT-2025-001',
    title: 'Foundation Design Change Delay',
    submissionDate: '2025-03-20',
    noticeDate: '2025-03-16',
    claimAmount: 1200000,
    timeImpactDays: 15,
    status: ClaimStatus.UNDER_EVALUATION,
    responseDueDate: '2025-04-17',
    delayEventId: '1',
    description: 'Extension of Time claim for foundation design change delays',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    projectId: '1',
    referenceNumber: 'EOT-2025-002',
    title: 'MEP Utility Connection Delay',
    submissionDate: null,
    noticeDate: '2025-05-11',
    claimAmount: 680000,
    timeImpactDays: 12,
    status: ClaimStatus.DRAFT,
    responseDueDate: null,
    delayEventId: '3',
    description: 'Extension of Time claim for utility connection delays',
    createdAt: '2025-05-10T09:20:00Z'
  }
];

// Mock evidence
export const mockEvidence = [
  {
    id: '1',
    delayEventId: '1',
    type: EvidenceType.EMAIL,
    title: 'Client Design Change Request',
    description: 'Email from client PM requesting foundation design review',
    sourceSystem: 'Email',
    filePath: '/evidence/email_001.pdf',
    relevanceScore: 95,
    extractedText: 'Please hold foundation work pending design review...',
    metadata: {
      from: 'client.pm@client.com',
      to: 'sarah.williams@company.com',
      date: '2025-03-15T14:30:00Z',
      subject: 'Foundation Design Review Required'
    },
    createdAt: '2025-03-15T14:30:00Z'
  },
  {
    id: '2',
    delayEventId: '1',
    type: EvidenceType.RFI,
    title: 'RFI-234 Reinforcement Clarification',
    description: 'Request for Information regarding reinforcement details',
    sourceSystem: 'Project Management System',
    filePath: '/evidence/rfi_234.pdf',
    relevanceScore: 90,
    extractedText: 'Clarification required on reinforcement specifications...',
    metadata: {
      rfiNumber: 'RFI-234',
      submittedBy: 'Ahmed Hassan',
      submittedDate: '2025-03-16T09:00:00Z',
      status: 'Answered'
    },
    createdAt: '2025-03-16T09:00:00Z'
  },
  {
    id: '3',
    delayEventId: '1',
    type: EvidenceType.CHANGE_ORDER,
    title: 'Design Change Notice DCN-089',
    description: 'Official design change notice for foundation modifications',
    sourceSystem: 'Document Management',
    filePath: '/evidence/dcn_089.pdf',
    relevanceScore: 98,
    extractedText: 'Design change notice for foundation reinforcement modifications...',
    metadata: {
      changeOrderNumber: 'DCN-089',
      approvedBy: 'Client Engineer',
      approvedDate: '2025-03-18T16:00:00Z',
      costImpact: 1200000
    },
    createdAt: '2025-03-18T16:00:00Z'
  }
];

// Mock dashboard statistics
export const mockDashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  totalClaims: 42,
  openClaims: 7,
  claimsValue: 4200000,
  approvedClaimsYTD: 23,
  approvedValueYTD: 12300000,
  successRate: 85,
  avgClaimValue: 183000,
  upcomingDeadlines: 3,
  newDelayAlerts: 5
};

// Mock claims funnel data
export const mockClaimsFunnel = [
  { stage: 'Identified', count: 15, value: 8500000 },
  { stage: 'In Preparation', count: 4, value: 2100000 },
  { stage: 'Submitted', count: 7, value: 4200000 },
  { stage: 'Approved YTD', count: 23, value: 12300000 }
];

// Mock delay trend data (last 6 months)
export const mockDelayTrend = [
  { month: 'Jan', delays: 8, claims: 5 },
  { month: 'Feb', delays: 12, claims: 7 },
  { month: 'Mar', delays: 15, claims: 9 },
  { month: 'Apr', delays: 10, claims: 6 },
  { month: 'May', delays: 7, claims: 4 },
  { month: 'Jun', delays: 5, claims: 3 }
];

// Mock upcoming deadlines
export const mockUpcomingDeadlines = [
  {
    id: '1',
    projectName: 'Dubai Marina Tower Complex',
    claimReference: 'EOT-2025-001',
    type: 'Response Due',
    dueDate: '2025-07-20',
    daysRemaining: 6,
    priority: 'high'
  },
  {
    id: '2',
    projectName: 'London Bridge Infrastructure',
    claimReference: 'EOT-2025-003',
    type: 'Notice Period',
    dueDate: '2025-07-25',
    daysRemaining: 11,
    priority: 'medium'
  },
  {
    id: '3',
    projectName: 'Singapore Metro Extension',
    claimReference: 'EOT-2025-004',
    type: 'Submission Due',
    dueDate: '2025-08-01',
    daysRemaining: 18,
    priority: 'low'
  }
];

// Mock action items
export const mockActionItems = [
  {
    id: '1',
    title: 'Review Foundation Delay Evidence',
    description: 'Review and approve evidence collection for foundation delay claim',
    assignee: 'Sarah Williams',
    dueDate: '2025-07-16',
    priority: 'high' as const,
    projectId: '1',
    status: 'pending' as const
  },
  {
    id: '2',
    title: 'Prepare MEP Delay Claim',
    description: 'Prepare claim documentation for MEP utility connection delay',
    assignee: 'David Chen',
    dueDate: '2025-07-18',
    priority: 'medium' as const,
    projectId: '1',
    status: 'in_progress' as const
  },
  {
    id: '3',
    title: 'Schedule Client Meeting',
    description: 'Schedule meeting with client to discuss major claim settlement',
    assignee: 'Sarah Williams',
    dueDate: '2025-07-20',
    priority: 'medium' as const,
    projectId: '2',
    status: 'pending' as const
  }
];

// Current user (for authentication)
export const mockCurrentUser = mockUsers[0]; // David Chen as default user

