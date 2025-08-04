// Mock data for demo purposes
export const mockProjects = [
  {
    id: '1',
    name: 'Dubai Marina Tower Complex',
    contractValue: 450000000,
    currency: 'USD',
    contractType: 'FIDIC Yellow Book',
    startDate: '2025-01-01',
    plannedDuration: 36,
    actualProgress: 18.5,
    plannedProgress: 22.3,
    status: 'active',
    healthScore: 78,
    openClaims: 3,
    claimsValue: 4200000,
    approvedClaims: 2,
    approvedValue: 1850000,
    potentialDelays: 5,
    criticalPathImpact: true,
    lastScheduleUpdate: '2024-08-01',
    baselineName: 'Baseline 2 - Client Approved',
    totalActivities: 3847,
    criticalActivities: 247,
    completedActivities: 712
  },
  {
    id: '2',
    name: 'Singapore MRT Extension Line 6',
    contractValue: 820000000,
    currency: 'SGD',
    contractType: 'FIDIC Red Book',
    startDate: '2024-06-15',
    plannedDuration: 48,
    actualProgress: 31.2,
    plannedProgress: 33.5,
    status: 'active',
    healthScore: 85,
    openClaims: 2,
    claimsValue: 3100000,
    approvedClaims: 5,
    approvedValue: 8200000,
    potentialDelays: 2,
    criticalPathImpact: false,
    lastScheduleUpdate: '2024-08-02',
    baselineName: 'Rev 3 - Approved',
    totalActivities: 5234,
    criticalActivities: 423,
    completedActivities: 1632
  },
  {
    id: '3',
    name: 'London Bridge Station Redevelopment',
    contractValue: 325000000,
    currency: 'GBP',
    contractType: 'NEC4 Option C',
    startDate: '2024-09-01',
    plannedDuration: 30,
    actualProgress: 12.1,
    plannedProgress: 11.8,
    status: 'active',
    healthScore: 92,
    openClaims: 0,
    claimsValue: 0,
    approvedClaims: 1,
    approvedValue: 450000,
    potentialDelays: 1,
    criticalPathImpact: false,
    lastScheduleUpdate: '2024-08-03',
    baselineName: 'Contract Baseline',
    totalActivities: 2156,
    criticalActivities: 178,
    completedActivities: 261
  }
];

export const mockDelayAlerts = [
  {
    id: 'd1',
    projectId: '1',
    projectName: 'Dubai Marina Tower Complex',
    activityName: 'Foundation Pour Zone A',
    activityId: 'A1034',
    delayDays: 15,
    originalFinish: '2025-03-15',
    forecastFinish: '2025-03-30',
    criticalPath: true,
    causationType: 'Client Change',
    confidenceScore: 85,
    estimatedCostImpact: 1200000,
    status: 'pending_review',
    detectedDate: '2024-08-01',
    evidenceCount: 23,
    keyEvidence: {
      emails: 12,
      rfis: 3,
      sitePhotos: 5,
      drawings: 3
    },
    aiAnalysis: 'Design change to foundation reinforcement requested by client structural engineer. RFI-234 issued on March 10 requesting clarification on rebar configuration. Work stopped pending resolution.',
    recommendedAction: 'Prepare Extension of Time claim under Sub-Clause 20.1'
  },
  {
    id: 'd2',
    projectId: '1',
    projectName: 'Dubai Marina Tower Complex',
    activityName: 'Steel Erection Tower B',
    activityId: 'A2156',
    delayDays: 8,
    originalFinish: '2025-04-22',
    forecastFinish: '2025-04-30',
    criticalPath: true,
    causationType: 'Weather',
    confidenceScore: 92,
    estimatedCostImpact: 450000,
    status: 'in_preparation',
    detectedDate: '2024-07-28',
    evidenceCount: 18,
    keyEvidence: {
      emails: 5,
      weatherReports: 8,
      sitePhotos: 3,
      safetyReports: 2
    },
    aiAnalysis: 'Exceptional weather event with wind speeds exceeding 65 km/h for 5 consecutive days. Site safety protocols required crane operations to cease. Weather data confirms force majeure conditions.',
    recommendedAction: 'Submit force majeure notice under Sub-Clause 19.2'
  },
  {
    id: 'd3',
    projectId: '2',
    projectName: 'Singapore MRT Extension Line 6',
    activityName: 'TBM Launch Chamber Excavation',
    activityId: 'TBM-001',
    delayDays: 12,
    originalFinish: '2024-08-20',
    forecastFinish: '2024-09-01',
    criticalPath: true,
    causationType: 'Unforeseen Conditions',
    confidenceScore: 78,
    estimatedCostImpact: 2100000,
    status: 'pending_review',
    detectedDate: '2024-07-30',
    evidenceCount: 31,
    keyEvidence: {
      emails: 8,
      geotechnicalReports: 4,
      sitePhotos: 12,
      drawings: 7
    },
    aiAnalysis: 'Encountered unexpected rock formation not indicated in geotechnical baseline report. Additional rock breaking equipment mobilized. Site investigation confirms differing site conditions.',
    recommendedAction: 'Claim for differing site conditions under Sub-Clause 4.12'
  }
];

export const mockClaims = [
  {
    id: 'c1',
    projectId: '1',
    claimNumber: 'EOT-DUB-2024-001',
    title: 'Design Change - Foundation Zone A',
    delayDays: 15,
    submittedDate: '2024-04-15',
    status: 'submitted',
    claimedAmount: 1200000,
    approvedAmount: null,
    responseDeadline: '2024-05-13',
    daysUntilDeadline: 12,
    contractClause: 'Sub-Clause 20.1',
    evidencePackages: 23,
    totalPages: 134,
    engineerResponse: null,
    internalScore: 85
  },
  {
    id: 'c2',
    projectId: '1',
    claimNumber: 'EOT-DUB-2024-002',
    title: 'COVID-19 Site Closure',
    delayDays: 21,
    submittedDate: '2024-02-10',
    status: 'approved',
    claimedAmount: 1850000,
    approvedAmount: 1850000,
    responseDeadline: '2024-03-10',
    daysUntilDeadline: 0,
    contractClause: 'Sub-Clause 19.2',
    evidencePackages: 15,
    totalPages: 89,
    engineerResponse: 'Approved in full',
    internalScore: 95
  },
  {
    id: 'c3',
    projectId: '2',
    claimNumber: 'EOT-SIN-2024-003',
    title: 'Utility Relocation Delays',
    delayDays: 18,
    submittedDate: '2024-06-20',
    status: 'under_review',
    claimedAmount: 3100000,
    approvedAmount: null,
    responseDeadline: '2024-07-18',
    daysUntilDeadline: -15,
    contractClause: 'Sub-Clause 2.1',
    evidencePackages: 28,
    totalPages: 156,
    engineerResponse: 'Requested additional information',
    internalScore: 72
  }
];

export const mockClaimsFunnel = {
  identified: {
    count: 15,
    value: 8500000,
    items: [
      { name: 'Mechanical Equipment Delays', value: 2100000, days: 14 },
      { name: 'Permit Approval Delays', value: 1800000, days: 10 },
      { name: 'Material Shortage - Steel', value: 1500000, days: 8 },
      { name: 'Design Clarifications Backlog', value: 3100000, days: 22 }
    ]
  },
  inPreparation: {
    count: 4,
    value: 2100000,
    items: [
      { name: 'Weather Delays - Tower B', value: 450000, days: 8 },
      { name: 'Rock Conditions - TBM', value: 1650000, days: 12 }
    ]
  },
  submitted: {
    count: 7,
    value: 4200000,
    items: mockClaims.filter(c => c.status === 'submitted' || c.status === 'under_review')
  },
  approved: {
    count: 23,
    value: 12300000,
    yearToDate: true
  }
};

export const mockScheduleHealth = {
  criticalPathStatus: {
    totalFloat: -12,
    criticalActivities: 247,
    nearCritical: 89,
    trending: 'deteriorating'
  },
  milestones: [
    {
      name: 'Foundation Complete',
      plannedDate: '2025-04-30',
      forecastDate: '2025-05-15',
      variance: -15,
      status: 'at_risk'
    },
    {
      name: 'Structure Topping Out',
      plannedDate: '2025-12-15',
      forecastDate: '2025-12-22',
      variance: -7,
      status: 'monitor'
    },
    {
      name: 'MEP Rough-in Complete',
      plannedDate: '2026-03-30',
      forecastDate: '2026-04-12',
      variance: -13,
      status: 'at_risk'
    }
  ],
  slippageTrend: [
    { month: 'Mar', planned: 15.2, actual: 14.8 },
    { month: 'Apr', planned: 17.5, actual: 16.9 },
    { month: 'May', planned: 19.8, actual: 18.7 },
    { month: 'Jun', planned: 22.3, actual: 20.5 },
    { month: 'Jul', planned: 24.8, actual: 22.1 },
    { month: 'Aug', planned: 27.3, actual: 23.5 }
  ]
};

export const mockEvidenceTimeline = [
  {
    date: '2025-03-08',
    type: 'email',
    from: 'Client PM',
    subject: 'Foundation Design Review Required',
    preview: 'Please hold all foundation work in Zone A pending structural review...',
    impact: 'high',
    tagged: true
  },
  {
    date: '2025-03-10',
    type: 'rfi',
    number: 'RFI-234',
    title: 'Reinforcement Configuration Clarification',
    status: 'open',
    impact: 'high',
    tagged: true
  },
  {
    date: '2025-03-11',
    type: 'site_diary',
    entry: 'Foundation work stopped as per client instruction. Crew relocated to Zone B.',
    weather: 'Clear, 28°C',
    manpower: 45,
    impact: 'high',
    tagged: true
  },
  {
    date: '2025-03-12',
    type: 'photo',
    description: 'Incomplete rebar installation in Zone A foundation',
    location: 'Zone A - Grid 15-17',
    count: 5,
    impact: 'medium',
    tagged: true
  },
  {
    date: '2025-03-15',
    type: 'email',
    from: 'Structural Engineer',
    subject: 'RE: Foundation Design Review',
    preview: 'Attached revised drawings for Zone A foundation. Please proceed with new design...',
    attachments: 3,
    impact: 'high',
    tagged: true
  },
  {
    date: '2025-03-16',
    type: 'drawing',
    number: 'STR-FDN-001 Rev C',
    title: 'Zone A Foundation Reinforcement Details',
    changes: 'Increased rebar from 25mm to 32mm dia.',
    impact: 'high',
    tagged: true
  }
];

export const mockContractClauses = [
  {
    clause: '20.1',
    title: "Contractor's Claims",
    type: 'FIDIC Yellow Book',
    summary: 'Notice within 28 days of awareness',
    configured: true,
    noticePeriod: 28,
    customAmendments: 0
  },
  {
    clause: '8.4',
    title: 'Extension of Time for Completion',
    type: 'FIDIC Yellow Book',
    summary: 'Detailed particulars within 42 days',
    configured: true,
    noticePeriod: 42,
    customAmendments: 1
  },
  {
    clause: '19.2',
    title: 'Notice of Force Majeure',
    type: 'FIDIC Yellow Book',
    summary: 'Notice within 14 days of awareness',
    configured: true,
    noticePeriod: 14,
    customAmendments: 0
  },
  {
    clause: '4.12',
    title: 'Unforeseeable Physical Conditions',
    type: 'FIDIC Yellow Book',
    summary: 'Notice as soon as practicable',
    configured: false,
    noticePeriod: null,
    customAmendments: 0
  }
];

export const mockTeamMembers = [
  {
    id: 't1',
    name: 'David Chen',
    role: 'Director of Project Controls',
    email: 'david.chen@construction.com',
    permissions: 'admin',
    avatar: 'DC',
    status: 'active',
    lastActive: '2 hours ago'
  },
  {
    id: 't2',
    name: 'Sarah Williams',
    role: 'Project Manager',
    email: 'sarah.williams@construction.com',
    permissions: 'approve',
    avatar: 'SW',
    status: 'active',
    lastActive: '5 mins ago'
  },
  {
    id: 't3',
    name: 'Ahmed Hassan',
    role: 'Senior Scheduler',
    email: 'ahmed.hassan@construction.com',
    permissions: 'edit',
    avatar: 'AH',
    status: 'active',
    lastActive: '1 hour ago'
  },
  {
    id: 't4',
    name: 'Mark Johnson',
    role: 'Quantity Surveyor',
    email: 'mark.johnson@construction.com',
    permissions: 'view',
    avatar: 'MJ',
    status: 'active',
    lastActive: '3 hours ago'
  }
];

export const mockAIAnalysis = {
  delayAnalysis: {
    primaryCause: 'Client-Instructed Design Change',
    confidenceScore: 85,
    supportingEvidence: [
      'Email from client PM explicitly requesting work stoppage',
      'RFI-234 requesting design clarification',
      'Revised drawings issued 5 days after work stopped',
      'Site diary confirms work suspension'
    ],
    impactAssessment: {
      scheduleDays: 15,
      costImpact: 1200000,
      criticalPathAffected: true,
      downstreamActivities: 12
    },
    contractualPosition: {
      applicableClauses: ['20.1', '8.4'],
      noticeDeadline: '2025-04-05',
      strengthOfClaim: 'Strong',
      recommendations: [
        'Submit notice immediately under Sub-Clause 20.1',
        'Compile all email correspondence chronologically',
        'Prepare fragnet showing 15-day insertion',
        'Document mitigation efforts to minimize delay'
      ]
    }
  },
  generatedNarrative: `On 8 March 2025, the Contractor received written instruction from the Employer's Project Manager to suspend foundation work in Zone A pending a structural design review. This instruction was issued following concerns raised by the Employer's structural engineer regarding the reinforcement configuration.

The Contractor immediately complied with this instruction and relocated the foundation crew to alternative work areas to mitigate the impact. RFI-234 was submitted on 10 March 2025 requesting clarification on the reinforcement requirements.

Revised structural drawings (STR-FDN-001 Rev C) were not received until 16 March 2025, resulting in a critical delay of 15 calendar days to Activity A1034 "Foundation Pour Zone A". This activity lies on the critical path, directly impacting the project completion date.

The Contractor maintains that this delay was solely caused by the Employer's design change and late provision of revised drawings, constituting a compensable delay event under Sub-Clause 20.1 of the Contract.`
};

// Helper function to generate random data points
export function generateTimeSeriesData(months: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const value = baseValue + (Math.random() - 0.5) * variance;
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      value: Math.round(value * 100) / 100
    });
  }
  
  return data;
}

// Demo scenarios for presentation
export const demoScenarios = {
  scenario1: {
    title: 'New Delay Detection',
    description: 'AI detects foundation delay from email and schedule update',
    duration: '2 minutes',
    steps: [
      'System receives P6 schedule update',
      'AI identifies 15-day delay on critical path',
      'Searches emails and finds client instruction',
      'Generates delay alert with 85% confidence',
      'Recommends EOT claim preparation'
    ]
  },
  scenario2: {
    title: 'Claim Preparation',
    description: 'Convert delay alert into submission-ready claim',
    duration: '5 minutes',
    steps: [
      'Review AI-generated claim summary',
      'Verify evidence timeline',
      'Edit claim narrative',
      'Review time impact analysis',
      'Generate and submit claim package'
    ]
  },
  scenario3: {
    title: 'Portfolio Analytics',
    description: 'Executive dashboard for multi-project oversight',
    duration: '1 minute',
    steps: [
      'View portfolio health scores',
      'Review claims pipeline value',
      'Check approaching deadlines',
      'Drill into project details',
      'Export monthly report'
    ]
  }
};