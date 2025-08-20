import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Environment validation and configuration
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Supabase configuration missing. Please check your environment variables:\n' +
        '- NEXT_PUBLIC_SUPABASE_URL\n' +
        '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
        'Copy .env.local.example to .env.local and fill in your values.'
      );
      return {
        url: 'https://your-project.supabase.co',
        anonKey: 'your-anon-key',
      };
    } else {
      throw new Error(
        'Missing required Supabase environment variables in production. ' +
        'Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }
  }
  
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
};

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();

// Browser client for client-side operations
export const createSupabaseBrowserClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': '@eot/identity',
      },
    },
  });
};

// Server client for server-side operations (SSR)
export const createSupabaseServerClient = (cookieStore: { get: (name: string) => { value: string } | undefined; set: (options: { name: string; value: string; [key: string]: unknown }) => void }) => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ 
            name, 
            value, 
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ 
            name, 
            value: '', 
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
          });
        },
      },
      global: {
        headers: {
          'X-Client-Info': '@eot/identity',
        },
      },
    }
  );
};

// Basic client for non-SSR operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      'X-Client-Info': '@eot/identity',
    },
  },
});

// Environment-aware auth configuration
export const authConfig = {
  redirectTo: getRedirectUrl(),
  flowType: 'pkce' as const,
  providers: {
    google: {
      enabled: true,
      redirectTo: getRedirectUrl(),
    },
    github: {
      enabled: process.env.NODE_ENV !== 'production',
      redirectTo: getRedirectUrl(),
    },
  },
};

function getRedirectUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Widen NODE_ENV typing to allow custom extensions like 'staging' without TS union mismatch
  const nodeEnv = (process.env.NODE_ENV ?? 'development') as string;
  
  // Vercel deployment URLs
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/auth/callback`;
  }
  
  // Custom site URL
  if (siteUrl) {
    return `${siteUrl}/auth/callback`;
  }
  
  // Environment-specific defaults (supports custom staging env)
  switch (nodeEnv) {
    case 'production':
      return 'https://eot-intelligence.com/auth/callback';
    case 'staging':
      return 'https://staging.eot-intelligence.com/auth/callback';
    default:
      return 'http://localhost:3000/auth/callback';
  }
}

// Configuration for different environments
export const getEnvironmentConfig = () => {
  // Treat NODE_ENV as loose string to allow custom values like 'staging'
  const env = (process.env.NODE_ENV || 'development') as string;
  const vercelEnv = process.env.VERCEL_ENV;
  
  return {
    environment: vercelEnv || env,
    isDevelopment: env === 'development',
  isStaging: vercelEnv === 'preview' || env === 'staging',
    isProduction: vercelEnv === 'production' || env === 'production',
    supabaseUrl,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  };
};