// Removed unused imports: BaseEntity from @eot/core and User from @supabase/supabase-js

// User Roles
export enum UserRole {
  DIRECTOR = 'director',
  PROJECT_MANAGER = 'project_manager', 
  SCHEDULER = 'scheduler',
  ADMIN = 'admin'
}

// Authentication Types
export interface AuthenticationResult {
  success: boolean;
  token?: string;
  user?: AuthenticatedUser;
  error?: string;
  requiresMfa?: boolean;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  organizationId?: string;
  permissions?: string[];
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface UserMetadata {
  name: string;
  role: UserRole;
  organizationId?: string;
  avatar?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthState {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
}

// Auth provider context type
export interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<AuthenticationResult>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthenticationResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserMetadata>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

// Supabase specific types
export interface SupabaseUserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}