'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { 
  AuthState, 
  AuthContextType, 
  AuthenticatedUser,
  SignInCredentials,
  SignUpCredentials,
  UserMetadata 
} from './auth-types';
import {
  signIn as signInService,
  signUp as signUpService,
  signOut as signOutService,
  getCurrentUser,
  resetPassword as resetPasswordService,
  updateProfile as updateProfileService,
  onAuthStateChange,
} from './auth-service';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false,
  });

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (mounted) {
          setState(prev => ({
            ...prev,
            user,
            loading: false,
            initialized: true,
          }));
        }
      } catch {
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: { message: 'Failed to initialize authentication' },
            loading: false,
            initialized: true,
          }));
        }
      }
    };

    initAuth();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          user,
          loading: false,
          error: null,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await signInService(credentials);
    
    setState(prev => ({
      ...prev,
      loading: false,
      error: result.success ? null : { message: result.error || 'Sign in failed' },
    }));
    
    return result;
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await signUpService(credentials);
    
    setState(prev => ({
      ...prev,
      loading: false,
      error: result.success ? null : { message: result.error || 'Sign up failed' },
    }));
    
    return result;
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await signOutService();
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: { message: 'Sign out failed' },
      }));
    }
  };

  const resetPassword = async (email: string) => {
    return await resetPasswordService(email);
  };

  const updateProfile = async (data: Partial<UserMetadata>) => {
    const result = await updateProfileService(data);
    
    if (result.success && state.user) {
      // Update local state
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
    }
    
    return result;
  };

  const refreshUser = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const user = await getCurrentUser();
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: { message: 'Failed to refresh user' },
      }));
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// useRequireAuth Hook - redirects to login if not authenticated
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (auth.initialized && !auth.user && !auth.loading) {
      // In a real app, you might want to redirect to login
      // For now, we'll just log this
      console.warn('User not authenticated');
    }
  }, [auth.initialized, auth.user, auth.loading]);
  
  return auth;
}

// useUser Hook - returns current user or null
export function useUser(): AuthenticatedUser | null {
  const { user } = useAuth();
  return user;
}

// useRole Hook - checks if user has specific role
export function useRole(requiredRole: string | string[]): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

// usePermission Hook - checks if user has specific permission
export function usePermission(permission: string): boolean {
  const { user } = useAuth();
  
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}