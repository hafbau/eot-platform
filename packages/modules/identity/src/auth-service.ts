import { supabase, createSupabaseBrowserClient } from './supabase';
import type { 
  AuthenticationResult, 
  AuthenticatedUser, 
  SignInCredentials, 
  SignUpCredentials, 
  UserMetadata 
} from './auth-types';
import { UserRole } from './auth-types';

// Helper function to transform Supabase user to our AuthenticatedUser format
const transformUser = async (user: unknown, profile?: unknown): Promise<AuthenticatedUser | null> => {
  if (!user) return null;

  let userProfile = profile;
  
  // If no profile provided, fetch it
  if (!userProfile) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    userProfile = data;
  }

  return {
    id: user.id,
    email: user.email,
    name: userProfile?.name || user.user_metadata?.name || '',
    role: userProfile?.role || user.user_metadata?.role || UserRole.SCHEDULER,
    avatar: userProfile?.avatar_url || user.user_metadata?.avatar_url || null,
    organizationId: userProfile?.organization_id || user.user_metadata?.organization_id,
    createdAt: new Date(user.created_at),
    lastLoginAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : undefined,
  };
};

// Sign in with email and password
export const signIn = async (credentials: SignInCredentials): Promise<AuthenticationResult> => {
  try {
    const client = createSupabaseBrowserClient();
    
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const user = await transformUser(data.user);
    
    return {
      success: true,
      user: user || undefined,
      token: data.session?.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Sign up with email, password, and user metadata
export const signUp = async (credentials: SignUpCredentials): Promise<AuthenticationResult> => {
  try {
    const client = createSupabaseBrowserClient();
    
    const { data, error } = await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          role: credentials.role || UserRole.SCHEDULER,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Create profile record if user was created successfully
    if (data.user && !error) {
      const { error: profileError } = await client
        .from('profiles')
        .insert({
          id: data.user.id,
          name: credentials.name,
          role: credentials.role || UserRole.SCHEDULER,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    const user = await transformUser(data.user);
    
    return {
      success: true,
      user: user || undefined,
      token: data.session?.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Sign out
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createSupabaseBrowserClient();
    const { error } = await client.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Get current authenticated user
export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  try {
    const client = createSupabaseBrowserClient();
    const { data: { user } } = await client.auth.getUser();
    
    return await transformUser(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const client = createSupabaseBrowserClient();
    const { data: { session } } = await client.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createSupabaseBrowserClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Update user profile
export const updateProfile = async (data: Partial<UserMetadata>): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = createSupabaseBrowserClient();
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    // Update profile in database
    const { error: profileError } = await client
      .from('profiles')
      .update({
        name: data.name,
        role: data.role,
        avatar_url: data.avatar,
        organization_id: data.organizationId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
      };
    }

    // Update user metadata
    const { error: authError } = await client.auth.updateUser({
      data: {
        name: data.name,
        role: data.role,
        avatar_url: data.avatar,
        organization_id: data.organizationId,
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AuthenticatedUser | null) => void) => {
  const client = createSupabaseBrowserClient();
  
  return client.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await transformUser(session.user);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Role-based access control helper
export const hasRole = (user: AuthenticatedUser | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false;
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
};

// Permission-based access control helper
export const hasPermission = (user: AuthenticatedUser | null, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};