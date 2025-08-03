# @eot/storage

Storage module for the EOT Intelligence Platform, providing database access, file management, and data utilities using Prisma with PostgreSQL (Supabase).

## Features

- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Supabase Integration**: Optimized for Supabase PostgreSQL with RLS support
- **Multi-tenancy**: Organization-based data isolation
- **Audit Logging**: Comprehensive audit trail for all data changes
- **File Management**: S3-compatible file storage with metadata
- **Soft Deletes**: Non-destructive data deletion
- **Analytics**: Event tracking and reporting
- **Utilities**: Common database operations and helpers

## Database Schema

The schema includes the following main entities:

### Core Tables
- **Organizations**: Multi-tenant organization management
- **Users**: User accounts with role-based access
- **Projects**: Construction project management
- **DelayEvents**: Delay detection and tracking
- **Claims**: EOT claim management with workflow
- **Evidence**: Supporting documentation and files
- **ActionItems**: Task and deadline tracking
- **Schedules**: Project schedule management

### Supporting Tables
- **FileMetadata**: File storage metadata
- **StorageQuota**: Organization storage limits
- **SessionData**: User session management
- **MfaSettings**: Multi-factor authentication
- **PasswordResetToken**: Password reset tokens
- **AnalyticsEvent**: Event tracking
- **AuditLog**: Comprehensive audit trail

## Setup

### 1. Environment Configuration

Copy the environment template and configure your Supabase connection:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Supabase Database URLs
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

### 2. Database Migration

Generate the Prisma client and run migrations:

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (for development)
pnpm db:push

# Or create and run migrations (for production)
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed
```

### 3. Database Management Commands

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Deploy migrations (production)
pnpm db:migrate:deploy

# Reset database
pnpm db:migrate:reset

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Push schema changes (development only)
pnpm db:push

# Format schema file
pnpm db:format

# Validate schema
pnpm db:validate

# Check migration status
pnpm db:status
```

## Usage

### Basic Database Operations

```typescript
import { db, connectDatabase, checkDatabaseHealth } from '@eot/storage';

// Connect to database
await connectDatabase();

// Health check
const health = await checkDatabaseHealth();
console.log(health);

// Basic CRUD operations
const organization = await db.organization.create({
  data: {
    name: 'Acme Construction',
    domain: 'acme.com',
    settings: {
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
      features: ['delay-detection']
    }
  }
});

const projects = await db.project.findMany({
  where: { organizationId: organization.id },
  include: { delayEvents: true, claims: true }
});
```

### Using Utilities

```typescript
import { paginate, softDelete, createAuditLog, trackEvent } from '@eot/storage';

// Paginated queries
const result = await paginate(
  db.project,
  {
    page: 1,
    pageSize: 10,
    where: { organizationId: 'org-1' },
    orderBy: 'createdAt',
    orderDirection: 'desc'
  }
);

// Soft delete
await softDelete(db.project, 'project-1', 'user-1');

// Audit logging
await createAuditLog({
  action: 'DELETE',
  entityType: 'Project',
  entityId: 'project-1',
  userId: 'user-1',
  organizationId: 'org-1'
});

// Analytics tracking
await trackEvent({
  eventType: 'project_created',
  userId: 'user-1',
  organizationId: 'org-1',
  properties: { projectType: 'construction' }
});
```

### Transactions

```typescript
import { withTransaction } from '@eot/storage';

await withTransaction(async (tx) => {
  const delayEvent = await tx.delayEvent.create({
    data: { /* delay data */ }
  });

  const claim = await tx.claim.create({
    data: { 
      delayEventId: delayEvent.id,
      /* other claim data */
    }
  });

  await tx.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Claim',
      entityId: claim.id,
      /* audit data */
    }
  });

  return { delayEvent, claim };
});
```

## Row Level Security (RLS)

The schema is designed to work with Supabase's Row Level Security. Example RLS policies:

```sql
-- Organizations: Users can only access their own organization
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (id = auth.jwt() ->> 'organization_id');

-- Projects: Users can only access projects in their organization
CREATE POLICY "Users can view organization projects" ON projects
  FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id');

-- Users: Users can only access users in their organization
CREATE POLICY "Users can view organization users" ON users
  FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id');
```

## File Storage Integration

The module integrates with S3-compatible storage (like Supabase Storage):

```typescript
import { db } from '@eot/storage';

// Create file metadata record
const fileMetadata = await db.fileMetadata.create({
  data: {
    filename: 'evidence-001.pdf',
    originalName: 'Site Report March 2025.pdf',
    mimeType: 'application/pdf',
    size: BigInt(1024 * 1024), // 1MB
    path: '/evidence/2025/03/evidence-001.pdf',
    organizationId: 'org-1',
    uploadedById: 'user-1',
    tags: ['evidence', 'site-report'],
    metadata: {
      category: 'evidence',
      project: 'project-1',
      delayEvent: 'delay-1'
    }
  }
});
```

## Development

### Building

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Schema Updates

When updating the schema:

1. Modify `prisma/schema.prisma`
2. Format the schema: `pnpm db:format`
3. Validate the schema: `pnpm db:validate`
4. Generate client: `pnpm db:generate`
5. Create migration: `pnpm db:migrate`
6. Update seed data if needed: edit `src/seed.ts`

## Performance Considerations

- Use `include` sparingly and prefer `select` for specific fields
- Implement proper indexing for frequently queried fields
- Use pagination for large datasets
- Consider connection pooling for high-traffic applications
- Monitor slow queries and optimize as needed

## Security Best Practices

- Always use parameterized queries (Prisma handles this automatically)
- Validate user access at the application level
- Use RLS policies for defense in depth
- Audit all data modifications
- Encrypt sensitive data fields when necessary
- Use environment variables for all configuration

## Monitoring

The module includes built-in monitoring capabilities:

```typescript
import { getDatabaseStats } from '@eot/storage';

// Get database statistics
const stats = await getDatabaseStats();
console.log(stats);
// Output: { organizations: 5, users: 45, projects: 23, ... }
```

## Troubleshooting

### Common Issues

1. **Connection Issues**: Verify DATABASE_URL and network connectivity
2. **Migration Failures**: Check for schema conflicts and data integrity
3. **Permission Errors**: Verify Supabase service role permissions
4. **Type Errors**: Regenerate Prisma client after schema changes

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
LOG_QUERIES=true
```

This will log all SQL queries to the console for debugging.