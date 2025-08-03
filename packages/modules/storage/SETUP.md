# Prisma Setup Guide for EOT Intelligence Platform

This guide walks you through setting up Prisma with PostgreSQL (via Supabase) for the EOT Intelligence Platform.

## ✅ Completed Setup

The following has been successfully implemented:

### 1. ✅ Dependencies Installed
- `@prisma/client` - Prisma client for database operations
- `prisma` - Prisma CLI for migrations and schema management
- `tsx` - TypeScript execution for running scripts
- `@types/node` - Node.js type definitions

### 2. ✅ Comprehensive Database Schema
Created a comprehensive schema at `prisma/schema.prisma` with:

#### Core Tables
- **Organizations** - Multi-tenant organization management
- **Users** - User accounts with role-based access (Director, Project Manager, Scheduler, Admin)
- **Projects** - Construction project management with contract details
- **DelayEvents** - Delay detection and tracking with cause analysis
- **Claims** - EOT claim management with workflow states
- **Evidence** - Supporting documentation and files
- **ActionItems** - Task and deadline tracking
- **Schedules** - Project schedule management

#### Supporting Tables
- **FileMetadata** - File storage metadata with S3 integration
- **StorageQuota** - Organization storage limits
- **SessionData** - User session management
- **MfaSettings** - Multi-factor authentication
- **PasswordResetToken** - Password reset functionality
- **AnalyticsEvent** - Event tracking and analytics
- **AuditLog** - Comprehensive audit trail

#### Enums
- User roles, Project status, Contract types (FIDIC, NEC)
- Delay types and statuses, Claim statuses
- Evidence types, Priority levels, and more

### 3. ✅ Database Client & Utilities
Created comprehensive database utilities in `src/`:

- **database.ts** - Prisma client configuration with connection management
- **utils.ts** - Pagination, soft deletes, search, audit logging, analytics
- **config.ts** - Configuration management for Supabase and features
- **seed.ts** - Seed data script matching mock data structure
- **database-types.ts** - TypeScript type definitions

### 4. ✅ Seed Data
Created seed data that matches the existing mock data structure:
- 1 Organization (Acme Construction Ltd)
- 3 Users (Director, Project Manager, Scheduler)
- 3 Projects (Dubai Marina, London Bridge, Singapore Metro)
- 3 Delay Events with different causes and statuses
- 2 Claims with workflow states
- 3 Evidence records linked to delays and claims
- 3 Action Items with different priorities
- Analytics events and audit logs

### 5. ✅ Configuration Files
- **.env.example** - Template for environment variables
- **.env** - Development environment variables (with placeholders)
- **package.json** - Database management scripts
- **tsup.config.ts** - Build configuration
- **README.md** - Comprehensive documentation

## 🚀 Next Steps

### 1. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > Database
3. Copy your connection string
4. Update `.env` file with your actual database URLs:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

### 2. Run Database Migrations

```bash
# Navigate to storage module
cd packages/modules/storage

# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Or create and run migrations (production)
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed

# Open Prisma Studio to view data
pnpm db:studio
```

### 3. Verify Setup

```bash
# Validate schema
pnpm db:validate

# Check migration status
pnpm db:status

# Build the module
pnpm build
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Create and run migrations |
| `pnpm db:migrate:deploy` | Deploy migrations (production) |
| `pnpm db:migrate:reset` | Reset database |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:push` | Push schema changes (development) |
| `pnpm db:format` | Format schema file |
| `pnpm db:validate` | Validate schema |
| `pnpm db:status` | Check migration status |

## 💡 Usage Examples

### Basic Database Operations

```typescript
import { db, paginate, trackEvent } from '@eot/storage';

// Get projects with pagination
const projects = await paginate(db.project, {
  page: 1,
  pageSize: 10,
  where: { organizationId: 'org-1' },
  include: { delayEvents: true, claims: true }
});

// Create a delay event
const delayEvent = await db.delayEvent.create({
  data: {
    projectId: 'project-1',
    activityName: 'Foundation Work',
    delayDays: 5,
    causeType: 'CLIENT_DELAY',
    detectedById: 'user-1',
    // ... other fields
  }
});

// Track analytics event
await trackEvent({
  eventType: 'delay_detected',
  userId: 'user-1',
  organizationId: 'org-1',
  properties: { delayDays: 5, criticalPath: true }
});
```

### Using Transactions

```typescript
import { withTransaction } from '@eot/storage';

await withTransaction(async (tx) => {
  const claim = await tx.claim.create({
    data: { /* claim data */ }
  });

  await tx.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Claim',
      entityId: claim.id,
      userId: 'user-1',
      organizationId: 'org-1'
    }
  });

  return claim;
});
```

## 🔧 Configuration Options

The module supports extensive configuration through environment variables:

- **Database**: Connection pooling, timeouts, logging
- **Supabase**: Real-time, storage, edge functions
- **Features**: Audit logs, analytics, file uploads
- **Security**: RLS, encryption, rate limiting
- **Monitoring**: Metrics, health checks, tracking

See `.env.example` for full configuration options.

## 📊 Database Schema Highlights

### Multi-tenancy
- Organization-based data isolation
- RLS-compatible design
- Cross-tenant security

### Audit Trail
- Comprehensive change tracking
- User activity logging
- Data integrity monitoring

### Performance
- Strategic indexing
- Efficient relationships
- Optimized queries

### Flexibility
- JSON metadata fields
- Extensible enums
- Soft delete support

## 🛡️ Security Features

- Row Level Security (RLS) compatible
- Multi-factor authentication support
- Audit logging for all operations
- Session management
- Password reset functionality
- Organization-based access control

## 📈 Analytics & Monitoring

- Event tracking for user actions
- Database performance metrics
- Health check endpoints
- Query logging and analysis
- Storage quota monitoring

## 🗂️ File Management

- S3-compatible storage integration
- File metadata tracking
- Organization-based file isolation
- Storage quota enforcement
- File type validation

This setup provides a robust, scalable, and secure database foundation for the EOT Intelligence Platform, ready for production use with Supabase PostgreSQL.