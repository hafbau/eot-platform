// Re-export types
export * from './auth-types';

// Re-export auth service functions
export {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  isAuthenticated,
  resetPassword,
  updateProfile,
  onAuthStateChange,
  hasRole,
  hasPermission,
} from './auth-service';

// Re-export Supabase client creators
export {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
  supabase,
  authConfig,
} from './supabase';