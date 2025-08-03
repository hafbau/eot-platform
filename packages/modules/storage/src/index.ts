// Storage module - File and data storage management
// Legacy types (maintaining backward compatibility)
export * from './types';

// Database exports
export { 
  db as database,
  db,
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
  withTransaction,
} from './database';

// Database utilities and helpers
export {
  // Pagination
  paginate,
  type PaginationOptions,
  type PaginatedResult,
  
  // Soft deletes
  softDelete,
  softDeleteMany,
  restore,
  
  // Audit logging
  createAuditLog,
  logEntityChange,
  
  // Search utilities
  buildSearchWhere,
  buildDateRangeWhere,
  
  // Validation
  validateOrganizationAccess,
  validateUserAccess,
  
  // Analytics
  trackEvent,
  
  // Bulk operations
  bulkCreate,
  bulkUpdate,
  
  // Cache utilities
  invalidateCache,
  
  // Database maintenance
  cleanupSoftDeleted,
  getDatabaseStats,
} from './utils';

// Configuration
export {
  config,
  databaseConfig,
  supabaseConfig,
  features,
  monitoring,
  validateConfig,
} from './config';

// Seed data
export { seedDatabase } from './seed';

// Database types (exported separately to avoid build issues)
export * from './database-types';

// Re-export Prisma client type
export type { PrismaClient } from '@prisma/client';