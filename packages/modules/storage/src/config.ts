// Database configuration for Supabase PostgreSQL
export const databaseConfig = {
  // Database connection settings
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '10000'),
  
  // Logging configuration
  enableLogging: process.env.NODE_ENV === 'development',
  logQueries: process.env.LOG_QUERIES === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Performance settings
  enableQueryPlanCache: process.env.ENABLE_QUERY_PLAN_CACHE !== 'false',
  enablePreparedStatements: process.env.ENABLE_PREPARED_STATEMENTS !== 'false',
  
  // Row Level Security (RLS) settings for Supabase
  enableRLS: process.env.ENABLE_RLS !== 'false',
  bypassRLS: process.env.BYPASS_RLS === 'true', // Only for service role
  
  // Migration settings
  migrationsPath: './prisma/migrations',
  seedPath: './src/seed.ts',
  
  // Backup and maintenance
  enableAutoBackup: process.env.ENABLE_AUTO_BACKUP === 'true',
  backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  enableVacuum: process.env.ENABLE_VACUUM !== 'false',
  
  // Analytics and monitoring
  enableSlowQueryLog: process.env.ENABLE_SLOW_QUERY_LOG === 'true',
  slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000'),
  enableConnectionPoolMonitoring: process.env.ENABLE_POOL_MONITORING === 'true',
};

// Supabase specific configuration
export const supabaseConfig = {
  url: process.env.SUPABASE_URL!,
  anonKey: process.env.SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  
  // Real-time configuration
  enableRealtime: process.env.ENABLE_REAL_TIME !== 'false',
  realtimeHeartbeatInterval: parseInt(process.env.REALTIME_HEARTBEAT || '30000'),
  
  // Edge functions
  enableEdgeFunctions: process.env.ENABLE_EDGE_FUNCTIONS === 'true',
  edgeFunctionRegion: process.env.EDGE_FUNCTION_REGION || 'us-east-1',
  
  // Storage
  enableStorage: process.env.ENABLE_FILE_UPLOADS !== 'false',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '50485760'), // 50MB default
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate database URL format
  if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validate Supabase URL format
  if (!process.env.SUPABASE_URL?.startsWith('https://')) {
    throw new Error('SUPABASE_URL must be a valid HTTPS URL');
  }

  console.log('✓ Configuration validation passed');
}

// Feature flags
export const features = {
  auditLogs: process.env.ENABLE_AUDIT_LOGS !== 'false',
  analytics: process.env.ENABLE_ANALYTICS !== 'false',
  fileUploads: process.env.ENABLE_FILE_UPLOADS !== 'false',
  realtime: process.env.ENABLE_REAL_TIME !== 'false',
  multiTenant: process.env.ENABLE_MULTI_TENANT !== 'false',
  encryption: process.env.ENABLE_ENCRYPTION === 'true',
  rateLimit: process.env.ENABLE_RATE_LIMIT === 'true',
  caching: process.env.ENABLE_CACHING === 'true',
};

// Performance monitoring configuration
export const monitoring = {
  enableMetrics: process.env.ENABLE_METRICS === 'true',
  metricsPort: parseInt(process.env.METRICS_PORT || '9090'),
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK !== 'false',
  healthCheckPath: process.env.HEALTH_CHECK_PATH || '/health',
  enableTracking: process.env.ENABLE_TRACKING === 'true',
};

// Export combined configuration
export const config = {
  database: databaseConfig,
  supabase: supabaseConfig,
  features,
  monitoring,
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};