/**
 * Test data fixtures for E2E tests
 * Based on the mock data from the application
 */

// Test users for authentication
export const testUsers = {
  director: {
    id: '1',
    name: 'David Chen',
    email: 'david.chen@company.com',
    password: 'password123',
    role: 'director'
  },
  projectManager: {
    id: '2', 
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    password: 'password123',
    role: 'project_manager'
  },
  scheduler: {
    id: '3',
    name: 'Ahmed Hassan', 
    email: 'ahmed.hassan@company.com',
    password: 'password123',
    role: 'scheduler'
  }
};

// Test projects
export const testProjects = {
  dubaiTower: {
    id: '1',
    name: 'Dubai Marina Tower Complex',
    contractValue: 450000000,
    contractType: 'fidic_yellow',
    startDate: '2025-01-01',
    plannedCompletion: '2027-12-31',
    status: 'active',
    healthScore: 78,
    totalClaims: 7,
    claimsValue: 4200000,
    projectManager: 'Sarah Williams',
    location: 'Dubai, UAE',
    description: 'Construction of a 45-story mixed-use tower complex in Dubai Marina'
  },
  londonBridge: {
    id: '2',
    name: 'London Bridge Infrastructure',
    contractValue: 280000000,
    contractType: 'nec4',
    startDate: '2024-06-01',
    plannedCompletion: '2026-05-31',
    status: 'active',
    healthScore: 85,
    totalClaims: 3,
    claimsValue: 1800000,
    projectManager: 'Sarah Williams',
    location: 'London, UK',
    description: 'Major infrastructure upgrade project for London Bridge area'
  },
  singaporeMetro: {
    id: '3',
    name: 'Singapore Metro Extension',
    contractValue: 650000000,
    contractType: 'fidic_red',
    startDate: '2024-03-01',
    plannedCompletion: '2027-02-28',
    status: 'active',
    healthScore: 92,
    totalClaims: 2,
    claimsValue: 950000,
    projectManager: 'David Chen',
    location: 'Singapore',
    description: 'Extension of the Singapore Metro system with 12 new stations'
  }
};

// Test claims
export const testClaims = {
  foundationDelay: {
    id: '1',
    projectId: '1',
    referenceNumber: 'EOT-2025-001',
    title: 'Foundation Design Change Delay',
    submissionDate: '2025-03-20',
    noticeDate: '2025-03-16',
    claimAmount: 1200000,
    timeImpactDays: 15,
    status: 'under_evaluation',
    responseDueDate: '2025-04-17',
    description: 'Extension of Time claim for foundation design change delays'
  },
  mepDelay: {
    id: '2',
    projectId: '1', 
    referenceNumber: 'EOT-2025-002',
    title: 'MEP Utility Connection Delay',
    submissionDate: null,
    noticeDate: '2025-05-11',
    claimAmount: 680000,
    timeImpactDays: 12,
    status: 'draft',
    responseDueDate: null,
    description: 'Extension of Time claim for utility connection delays'
  }
};

// Test delay events
export const testDelayEvents = {
  foundationPour: {
    id: '1',
    projectId: '1',
    activityId: 'ACT-001',
    activityName: 'Foundation Pour Zone A',
    detectionDate: '2025-03-15',
    delayDays: 15,
    causeType: 'client_delay',
    probabilityScore: 85,
    evidenceStrength: 85,
    status: 'claim_submitted',
    description: 'Client design change requiring reinforcement redesign',
    estimatedCost: 1200000,
    criticalPath: true
  },
  steelErection: {
    id: '2',
    projectId: '1',
    activityId: 'ACT-002', 
    activityName: 'Steel Erection Tower B',
    detectionDate: '2025-04-02',
    delayDays: 8,
    causeType: 'weather',
    probabilityScore: 65,
    evidenceStrength: 70,
    status: 'under_review',
    description: 'Extended rainfall period affecting steel erection work',
    estimatedCost: 450000,
    criticalPath: false
  }
};

// Dashboard stats for verification
export const expectedDashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  totalClaims: 42,
  openClaims: 7,
  claimsValue: 4200000,
  approvedClaimsYTD: 23,
  approvedValueYTD: 12300000,
  successRate: 85,
  upcomingDeadlines: 3,
  newDelayAlerts: 5
};

// Expected navigation items
export const navigationItems = [
  'Dashboard',
  'Projects',
  'Settings'
];

// Project navigation tabs/sections
export const projectSections = [
  'dashboard',
  'schedule', 
  'delays',
  'evidence',
  'claims'
];

// Claim statuses for testing filters
export const claimStatuses = [
  'draft',
  'under_review',
  'submitted',
  'under_evaluation', 
  'approved',
  'rejected',
  'settled'
];

// Project statuses for testing filters
export const projectStatuses = [
  'active',
  'planning',
  'on_hold',
  'completed'
];

// Test search terms and expected results
export const searchTestCases = {
  projectSearch: {
    term: 'Dubai',
    expectedResult: 'Dubai Marina Tower Complex'
  },
  claimSearch: {
    term: 'EOT-2025-001',
    expectedResult: 'Foundation Design Change Delay'
  },
  locationSearch: {
    term: 'London',
    expectedResult: 'London Bridge Infrastructure'
  }
};

// Currency formatting test cases
export const currencyTestCases = {
  '450000000': '$450,000,000',
  '1200000': '$1,200,000',
  '4200000': '$4,200,000'
};

// Date formatting test cases  
export const dateTestCases = {
  '2025-01-01': 'Jan 1, 2025',
  '2025-03-15': 'Mar 15, 2025',
  '2027-12-31': 'Dec 31, 2027'
};

// Form validation test cases
export const validationTestCases = {
  login: {
    invalidEmail: {
      email: 'invalid@email.com',
      password: 'password123',
      expectedError: 'Invalid email or password'
    },
    invalidPassword: {
      email: 'david.chen@company.com',
      password: 'wrongpassword',
      expectedError: 'Invalid email or password'
    },
    emptyFields: {
      email: '',
      password: '',
      expectedError: 'required'
    }
  }
};

// Expected page titles and headings
export const pageElements = {
  login: {
    title: 'Sign in to your account',
    subtitle: 'Welcome back to EOT Intelligence Platform'
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: "Welcome back! Here's what's happening with your projects."
  },
  projects: {
    title: 'Projects',
    subtitle: 'Manage and monitor all your construction projects'
  },
  claims: {
    title: 'Claims Management',
    subtitle: 'Extension of Time (EOT) claims and submissions'
  }
};

// Quick actions on dashboard
export const dashboardQuickActions = [
  'Manage Projects',
  'Review Claims',
  'Check Delays'
];

// Upcoming deadlines for testing
export const upcomingDeadlines = [
  {
    projectName: 'Dubai Marina Tower Complex',
    claimReference: 'EOT-2025-001',
    type: 'Response Due',
    dueDate: '2025-07-20',
    priority: 'high'
  }
];

// Action items for testing
export const actionItems = [
  {
    title: 'Review Foundation Delay Evidence',
    assignee: 'Sarah Williams',
    dueDate: '2025-07-16',
    priority: 'high',
    status: 'pending'
  }
];