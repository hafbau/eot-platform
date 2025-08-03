/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: This file needs proper TypeScript typing for Prisma models
// Currently using 'any' types extensively - should be refactored for type safety
import { db } from './database';

// ================================
// PAGINATION UTILITIES
// ================================

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export async function paginate<T>(
  model: any,
  options: PaginationOptions & { where?: any; include?: any },
  countModel?: any
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 10));
  const skip = (page - 1) * pageSize;

  const where = { ...options.where, isDeleted: false };

  // Build orderBy clause
  const orderBy: any = {};
  if (options.orderBy) {
    orderBy[options.orderBy] = options.orderDirection || 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  // Execute queries in parallel
  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include: options.include,
      orderBy,
      skip,
      take: pageSize,
    }),
    (countModel || model).count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

// ================================
// SOFT DELETE UTILITIES
// ================================

export async function softDelete(model: any, id: string, _userId: string) {
  return model.update({
    where: { id },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}

export async function softDeleteMany(model: any, ids: string[], _userId: string) {
  return model.updateMany({
    where: { id: { in: ids } },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}

export async function restore(model: any, id: string) {
  return model.update({
    where: { id },
    data: {
      isDeleted: false,
      updatedAt: new Date(),
    },
  });
}

// ================================
// AUDIT UTILITIES
// ================================

export async function createAuditLog(data: {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  organizationId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}) {
  return db.auditLog.create({ data });
}

export async function logEntityChange(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entityType: string,
  entityId: string,
  userId: string,
  organizationId: string,
  oldData?: any,
  newData?: any,
  metadata?: Record<string, any>
) {
  const changes: Record<string, any> = {};

  if (action === 'CREATE' && newData) {
    changes.created = newData;
  } else if (action === 'UPDATE' && oldData && newData) {
    // Calculate differences
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes[key] = { from: oldData[key], to: newData[key] };
      }
    }
  } else if (action === 'DELETE' && oldData) {
    changes.deleted = oldData;
  }

  return createAuditLog({
    action,
    entityType,
    entityId,
    userId,
    organizationId,
    changes: Object.keys(changes).length > 0 ? changes : undefined,
    metadata,
  });
}

// ================================
// SEARCH UTILITIES
// ================================

export function buildSearchWhere(searchTerm: string, searchFields: string[]) {
  if (!searchTerm) return {};

  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
    })),
  };
}

export function buildDateRangeWhere(
  field: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = {};

  if (startDate || endDate) {
    where[field] = {};
    if (startDate) where[field].gte = startDate;
    if (endDate) where[field].lte = endDate;
  }

  return where;
}

// ================================
// VALIDATION UTILITIES
// ================================

export function validateOrganizationAccess(
  record: { organizationId: string },
  userOrganizationId: string
) {
  if (record.organizationId !== userOrganizationId) {
    throw new Error('Access denied: Organization mismatch');
  }
}

export function validateUserAccess(
  record: { userId?: string; assignedToId?: string; uploadedById?: string },
  userId: string,
  userRole: string
) {
  const isAdmin = ['ADMIN', 'DIRECTOR'].includes(userRole);
  const isOwner = 
    record.userId === userId || 
    record.assignedToId === userId || 
    record.uploadedById === userId;

  if (!isAdmin && !isOwner) {
    throw new Error('Access denied: Insufficient permissions');
  }
}

// ================================
// ANALYTICS UTILITIES
// ================================

export async function trackEvent(data: {
  eventType: string;
  userId?: string;
  organizationId: string;
  properties?: Record<string, any>;
}) {
  return db.analyticsEvent.create({
    data: {
      ...data,
      properties: data.properties || {},
      timestamp: new Date(),
    },
  });
}

// ================================
// BULK OPERATIONS
// ================================

export async function bulkCreate<T>(
  model: any,
  data: T[],
  options?: { skipDuplicates?: boolean }
) {
  return model.createMany({
    data,
    skipDuplicates: options?.skipDuplicates || false,
  });
}

export async function bulkUpdate<T>(
  model: any,
  updates: Array<{ where: any; data: Partial<T> }>
) {
  const operations = updates.map(({ where, data }) =>
    model.update({ where, data })
  );

  return Promise.all(operations);
}

// ================================
// CACHE UTILITIES
// ================================

export async function invalidateCache(pattern: string) {
  // This would integrate with Redis or another cache layer
  console.log(`Cache invalidated for pattern: ${pattern}`);
}

// ================================
// DATABASE MAINTENANCE
// ================================

export async function cleanupSoftDeleted(
  model: any,
  olderThanDays: number = 30
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  return model.deleteMany({
    where: {
      isDeleted: true,
      updatedAt: {
        lt: cutoffDate,
      },
    },
  });
}

export async function getDatabaseStats() {
  const [
    organizationCount,
    userCount,
    projectCount,
    delayEventCount,
    claimCount,
    evidenceCount,
    fileCount,
  ] = await Promise.all([
    db.organization.count({ where: { isActive: true } }),
    db.user.count({ where: { isActive: true } }),
    db.project.count({ where: { isDeleted: false } }),
    db.delayEvent.count({ where: { isDeleted: false } }),
    db.claim.count({ where: { isDeleted: false } }),
    db.evidence.count({ where: { isDeleted: false } }),
    db.fileMetadata.count({ where: { isDeleted: false } }),
  ]);

  return {
    organizations: organizationCount,
    users: userCount,
    projects: projectCount,
    delayEvents: delayEventCount,
    claims: claimCount,
    evidence: evidenceCount,
    files: fileCount,
  };
}

// ================================
// EXPORT UTILITIES
// ================================

export { Prisma } from './generated/client';
export type { 
  Organization,
  User,
  Project,
  DelayEvent,
  Claim,
  Evidence,
  FileMetadata,
  ActionItem,
  Schedule,
  StorageQuota,
  SessionData,
  MfaSettings,
  PasswordResetToken,
  AnalyticsEvent,
  AuditLog,
  UserRole,
  ProjectStatus,
  ContractType,
  DelayType,
  DelayStatus,
  ClaimStatus,
  EvidenceType,
  ScheduleFormat,
  ExportFormat,
  Priority,
  ActionItemStatus,
  MfaMethod,
} from './generated/client';