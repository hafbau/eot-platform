// Mock Authentication API
// This file contains mock authentication functions that can be easily replaced with real API calls

import { mockUsers } from './mockData';
import { UserRole } from '../../lib/types';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: null;
  createdAt: string;
  lastLogin: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Mock authentication state
let isAuthenticated = false;
let currentUser: MockUser | null = null;

// Login function
export const login = async (email: string, password: string) => {
  await delay(1000); // Simulate API call delay
  
  // Mock validation - in real app, this would be handled by backend
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'password123') { // Mock password
    isAuthenticated = true;
    currentUser = user;
    
    // Store in localStorage for persistence
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Set authentication cookie for middleware
    document.cookie = `auth-token=mock-jwt-token-${user.id}; path=/; max-age=86400`;
    
    return {
      success: true,
      user: user,
      token: 'mock-jwt-token-' + user.id
    };
  } else {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }
};

// Register function
export const register = async (userData: { name: string; email: string; role?: string; password?: string }) => {
  await delay(1000); // Simulate API call delay
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return {
      success: false,
      error: 'User with this email already exists'
    };
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
  role: (userData.role as UserRole) || UserRole.SCHEDULER,
    avatar: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  // Add to mock users array
  mockUsers.push(newUser);
  
  // Auto-login after registration
  isAuthenticated = true;
  currentUser = newUser;
  
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return {
    success: true,
    user: newUser,
    token: 'mock-jwt-token-' + newUser.id
  };
};

// Logout function
export const logout = async () => {
  await delay(500); // Simulate API call delay
  
  isAuthenticated = false;
  currentUser = null;
  
  // Clear localStorage
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  
  // Clear authentication cookie
  document.cookie = 'auth-token=; path=/; max-age=0';
  
  return { success: true };
};

// Get current user
export const getCurrentUser = () => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return null; // Return null on server-side
  }
  
  // Check localStorage first
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedAuth === 'true' && storedUser) {
    isAuthenticated = true;
    currentUser = JSON.parse(storedUser);
    
    // Ensure auth cookie is set (for page refreshes)
  document.cookie = `auth-token=mock-jwt-token-${currentUser!.id}; path=/; max-age=86400`;
    
    return currentUser;
  }
  
  return currentUser;
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  return storedAuth === 'true' || isAuthenticated;
};

// Update user profile
export const updateProfile = async (userData: Partial<Pick<MockUser, 'name' | 'email' | 'role'>>) => {
  await delay(800); // Simulate API call delay
  
  if (!isAuthenticated || !currentUser) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }
  
  // Update current user
  const updatedUser: MockUser = { ...currentUser, ...userData, role: (userData.role as UserRole) || currentUser.role } as MockUser;
  currentUser = updatedUser;
  
  // Update in localStorage
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
  // Update in mock users array
  if (currentUser) {
    const userIndex = mockUsers.findIndex(u => u.id === currentUser!.id);
    if (userIndex !== -1) {
  mockUsers[userIndex] = { ...updatedUser, role: (updatedUser.role as UserRole) };
    }
  }
  
  return {
    success: true,
    user: updatedUser
  };
};

// Change password - accepts current and new password (newPassword currently unused in mock)
export const changePassword = async (currentPassword: string, newPassword?: string) => {
  await delay(800); // Simulate API call delay
  
  if (!isAuthenticated || !currentUser) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }
  
  // Mock password validation
  if (currentPassword !== 'password123') {
    return {
      success: false,
      error: 'Current password is incorrect'
    };
  }
  
  // In a real app, validate newPassword strength & update persistence layer
  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      error: 'New password must be at least 6 characters'
    };
  }

  return { success: true, message: 'Password changed successfully' };
};

