// Mock Dashboard API
// This file contains mock dashboard-related functions that can be easily replaced with real API calls

import { 
  mockDashboardStats, 
  mockClaimsFunnel, 
  mockDelayTrend, 
  mockUpcomingDeadlines, 
  mockActionItems,
  mockProjects,
  mockDelayEvents,
  mockClaims
} from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get dashboard overview statistics
export const getDashboardStats = async () => {
  await delay(600); // Simulate API call delay
  
  return {
    success: true,
    data: mockDashboardStats
  };
};

// Get claims funnel data
export const getClaimsFunnel = async () => {
  await delay(500); // Simulate API call delay
  
  return {
    success: true,
    data: mockClaimsFunnel
  };
};

// Get delay trend data
export const getDelayTrend = async () => {
  await delay(600); // Simulate API call delay
  
  // In a real app, this would filter based on the period parameter
  return {
    success: true,
    data: mockDelayTrend
  };
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (limit = 10) => {
  await delay(400); // Simulate API call delay
  
  const deadlines = mockUpcomingDeadlines.slice(0, limit);
  
  return {
    success: true,
    data: deadlines
  };
};

// Get action items
export const getActionItems = async (filters = {}) => {
  await delay(500); // Simulate API call delay
  
  let filteredItems = [...mockActionItems];
  
  // Apply filters
  if (filters.status) {
    filteredItems = filteredItems.filter(item => item.status === filters.status);
  }
  
  if (filters.assignee) {
    filteredItems = filteredItems.filter(item => item.assignee === filters.assignee);
  }
  
  if (filters.priority) {
    filteredItems = filteredItems.filter(item => item.priority === filters.priority);
  }
  
  return {
    success: true,
    data: filteredItems
  };
};

// Get portfolio overview
export const getPortfolioOverview = async () => {
  await delay(800); // Simulate API call delay
  
  // Calculate portfolio statistics
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalContractValue = mockProjects.reduce((sum, p) => sum + p.contractValue, 0);
  const totalDelays = mockDelayEvents.length;
  const totalClaims = mockClaims.length;
  const totalClaimsValue = mockClaims.reduce((sum, c) => sum + c.claimAmount, 0);
  
  // Project health distribution
  const healthDistribution = {
    excellent: mockProjects.filter(p => p.healthScore >= 90).length,
    good: mockProjects.filter(p => p.healthScore >= 70 && p.healthScore < 90).length,
    fair: mockProjects.filter(p => p.healthScore >= 50 && p.healthScore < 70).length,
    poor: mockProjects.filter(p => p.healthScore < 50).length
  };
  
  // Recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'claim_submitted',
      description: 'EOT-2025-001 submitted for Dubai Marina Tower Complex',
      timestamp: '2025-07-14T09:30:00Z',
      projectName: 'Dubai Marina Tower Complex'
    },
    {
      id: '2',
      type: 'delay_detected',
      description: 'New delay detected in London Bridge Infrastructure',
      timestamp: '2025-07-14T08:15:00Z',
      projectName: 'London Bridge Infrastructure'
    },
    {
      id: '3',
      type: 'claim_approved',
      description: 'EOT-2025-003 approved for Singapore Metro Extension',
      timestamp: '2025-07-13T16:45:00Z',
      projectName: 'Singapore Metro Extension'
    }
  ];
  
  return {
    success: true,
    data: {
      overview: {
        totalProjects,
        activeProjects,
        totalContractValue,
        totalDelays,
        totalClaims,
        totalClaimsValue
      },
      healthDistribution,
      recentActivity,
      topProjects: mockProjects.slice(0, 5) // Top 5 projects by value
    }
  };
};

// Update action item
export const updateActionItem = async (itemId, updates) => {
  await delay(400); // Simulate API call delay
  
  const itemIndex = mockActionItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return {
      success: false,
      error: 'Action item not found'
    };
  }
  
  mockActionItems[itemIndex] = { ...mockActionItems[itemIndex], ...updates };
  
  return {
    success: true,
    data: mockActionItems[itemIndex]
  };
};

// Create new action item
export const createActionItem = async (itemData) => {
  await delay(500); // Simulate API call delay
  
  const newItem = {
    id: Date.now().toString(),
    ...itemData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockActionItems.push(newItem);
  
  return {
    success: true,
    data: newItem
  };
};

// Delete action item
export const deleteActionItem = async (itemId) => {
  await delay(300); // Simulate API call delay
  
  const itemIndex = mockActionItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return {
      success: false,
      error: 'Action item not found'
    };
  }
  
  mockActionItems.splice(itemIndex, 1);
  
  return {
    success: true,
    message: 'Action item deleted successfully'
  };
};

