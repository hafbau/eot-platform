// Mock Projects API
// This file contains mock project-related functions that can be easily replaced with real API calls

import { mockProjects, mockDelayEvents, mockClaims, mockEvidence } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all projects
export const getProjects = async (filters = {}) => {
  await delay(800); // Simulate API call delay
  
  let filteredProjects = [...mockProjects];
  
  // Apply filters
  if (filters.status) {
    filteredProjects = filteredProjects.filter(p => p.status === filters.status);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.location.toLowerCase().includes(searchTerm)
    );
  }
  
  return {
    success: true,
    data: filteredProjects,
    total: filteredProjects.length
  };
};

// Get project by ID
export const getProject = async (projectId) => {
  await delay(600); // Simulate API call delay
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    return {
      success: false,
      error: 'Project not found'
    };
  }
  
  return {
    success: true,
    data: project
  };
};

// Create new project
export const createProject = async (projectData) => {
  await delay(1000); // Simulate API call delay
  
  const newProject = {
    id: Date.now().toString(),
    ...projectData,
    healthScore: 100, // Default health score
    totalClaims: 0,
    claimsValue: 0,
    approvedClaims: 0,
    approvedValue: 0,
    createdAt: new Date().toISOString()
  };
  
  mockProjects.push(newProject);
  
  return {
    success: true,
    data: newProject
  };
};

// Update project
export const updateProject = async (projectId, projectData) => {
  await delay(800); // Simulate API call delay
  
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return {
      success: false,
      error: 'Project not found'
    };
  }
  
  const updatedProject = { ...mockProjects[projectIndex], ...projectData };
  mockProjects[projectIndex] = updatedProject;
  
  return {
    success: true,
    data: updatedProject
  };
};

// Delete project
export const deleteProject = async (projectId) => {
  await delay(600); // Simulate API call delay
  
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return {
      success: false,
      error: 'Project not found'
    };
  }
  
  mockProjects.splice(projectIndex, 1);
  
  return {
    success: true,
    message: 'Project deleted successfully'
  };
};

// Get project delays
export const getProjectDelays = async (projectId) => {
  await delay(600); // Simulate API call delay
  
  const delays = mockDelayEvents.filter(d => d.projectId === projectId);
  
  return {
    success: true,
    data: delays
  };
};

// Get project claims
export const getProjectClaims = async (projectId) => {
  await delay(600); // Simulate API call delay
  
  const claims = mockClaims.filter(c => c.projectId === projectId);
  
  return {
    success: true,
    data: claims
  };
};

// Get project evidence
export const getProjectEvidence = async (projectId) => {
  await delay(600); // Simulate API call delay
  
  // Get all delay events for the project
  const projectDelays = mockDelayEvents.filter(d => d.projectId === projectId);
  const delayEventIds = projectDelays.map(d => d.id);
  
  // Get evidence for all delay events
  const evidence = mockEvidence.filter(e => delayEventIds.includes(e.delayEventId));
  
  return {
    success: true,
    data: evidence
  };
};

// Import project schedule
export const importSchedule = async (projectId) => {
  await delay(2000); // Simulate longer processing time
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    return {
      success: false,
      error: 'Project not found'
    };
  }
  
  // Mock schedule import result
  return {
    success: true,
    data: {
      activitiesImported: 3847,
      baselinesDetected: 3,
      criticalPathActivities: 156,
      importDate: new Date().toISOString()
    }
  };
};

// Get project dashboard data
export const getProjectDashboard = async (projectId) => {
  await delay(800); // Simulate API call delay
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    return {
      success: false,
      error: 'Project not found'
    };
  }
  
  const delays = mockDelayEvents.filter(d => d.projectId === projectId);
  const claims = mockClaims.filter(c => c.projectId === projectId);
  
  return {
    success: true,
    data: {
      project,
      delays,
      claims,
      stats: {
        totalDelays: delays.length,
        criticalDelays: delays.filter(d => d.criticalPath).length,
        totalClaims: claims.length,
        claimsValue: claims.reduce((sum, c) => sum + c.claimAmount, 0),
        avgDelayDays: delays.length > 0 ? Math.round(delays.reduce((sum, d) => sum + d.delayDays, 0) / delays.length) : 0
      }
    }
  };
};

