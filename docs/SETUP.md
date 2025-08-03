# EOT Intelligence Platform - Setup Guide

This guide will walk you through setting up the EOT Intelligence Platform development environment. The platform is built as a Turborepo monorepo with Next.js 14 App Router, Supabase, and Prisma.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **pnpm** (v8.0.0 or higher)
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Required Accounts

- **Supabase Account**: [supabase.com](https://supabase.com)
- **Vercel Account** (optional): [vercel.com](https://vercel.com)
- **Turborepo Account** (optional): [turbo.build](https://turbo.build)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd eot-intelligence-app
```

### 2. Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install
```

This will install dependencies for all packages and applications in the monorepo.

### 3. Environment Configuration

Copy the environment file templates:

```bash
# Root environment file
cp .env.example .env

# Web application environment
cp apps/web/.env.local.example apps/web/.env.local
```

### 4. Configure Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Project Settings > API
4. Copy your project URL and anon key

#### Update Environment Variables

Edit `apps/web/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Database Setup

#### Initialize the Database

```bash
# Navigate to the storage package
cd packages/modules/storage

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# Seed the database with initial data
pnpm prisma db seed
```

#### Verify Database Setup

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Verify that tables have been created

### 6. Start Development

```bash
# Return to root directory
cd ../../../

# Start all applications in development mode
pnpm dev
```

The application will be available at:
- **Web App**: http://localhost:3000

## Detailed Setup

### Package Structure Overview

The monorepo contains the following packages:

```
eot-intelligence-app/
├── apps/
│   └── web/                    # Next.js application
├── packages/
│   ├── core/                   # Shared utilities and types
│   ├── ui/                     # Shared UI components
│   └── modules/
│       ├── identity/           # Authentication & sessions
│       ├── organizations/      # Multi-tenancy
│       ├── storage/            # Database (Prisma)
│       ├── integrations/       # External integrations
│       ├── analytics/          # Analytics
│       └── audit/              # Audit logging
```

### Environment Variables Reference

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | Your application URL | `http://localhost:3000` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TURBO_TOKEN` | Turborepo remote cache token | - |
| `TURBO_TEAM` | Turborepo team name | - |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug mode | `false` |

### Database Configuration

#### Prisma Schema

The database schema is defined in `packages/modules/storage/prisma/schema.prisma`. Key features:

- **User Management**: Users, roles, permissions
- **Project Management**: Projects, teams, assignments
- **Claims Management**: EOT claims, evidence, documentation
- **Audit Logging**: Activity tracking and compliance

#### Supabase Configuration

1. **Authentication**: Configure auth providers in Supabase dashboard
2. **Row Level Security**: Enable RLS policies for data isolation
3. **Storage**: Configure file upload buckets

#### Database Commands

```bash
# Generate Prisma client
cd packages/modules/storage
pnpm prisma generate

# View database schema
pnpm prisma db inspect

# Reset database (development only)
pnpm prisma db reset

# Run migrations
pnpm prisma db push

# Open database browser
pnpm prisma studio
```

### Development Workflow

#### Starting Development

```bash
# Start all apps and packages
pnpm dev

# Start only the web application
pnpm dev --filter=web

# Start with debug mode
NEXT_PUBLIC_DEBUG_MODE=true pnpm dev
```

#### Building the Application

```bash
# Build all packages
pnpm build

# Build only the web application
pnpm build --filter=web

# Build with remote caching (if configured)
TURBO_TOKEN=your-token pnpm build
```

#### Code Quality

```bash
# Lint all packages
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Type checking
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

#### Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Install Playwright browsers
pnpm test:e2e:install
```

### Package Development

#### Adding a New Package

1. Create directory in `packages/` or `packages/modules/`
2. Initialize with `package.json`
3. Add to `pnpm-workspace.yaml` if needed
4. Configure build scripts and dependencies

#### Working with Shared Packages

```bash
# Build a specific package
pnpm build --filter=@eot/ui

# Add dependency to a package
cd packages/ui
pnpm add some-package

# Add workspace dependency
pnpm add @eot/core --filter=@eot/web
```

### Troubleshooting

#### Common Issues

**Issue**: `pnpm install` fails
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue**: Prisma client not generating
```bash
# Solution: Regenerate client
cd packages/modules/storage
pnpm prisma generate
```

**Issue**: Environment variables not loading
```bash
# Solution: Check file names and paths
# Ensure .env.local exists in apps/web/
# Verify variable names have NEXT_PUBLIC_ prefix for client-side
```

**Issue**: Database connection errors
```bash
# Solution: Verify Supabase configuration
# Check SUPABASE_URL and keys are correct
# Ensure Supabase project is active
```

**Issue**: Build failures
```bash
# Solution: Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

#### Debug Commands

```bash
# Check workspace structure
pnpm list --depth=0

# Verify package dependencies
pnpm why some-package

# Check environment variables
pnpm exec cross-env | grep NEXT_PUBLIC

# Verify database connection
cd packages/modules/storage
pnpm prisma db ping
```

### IDE Setup

#### VS Code (Recommended)

Install these extensions:
- **TypeScript and JavaScript Language Features**: Built-in
- **Tailwind CSS IntelliSense**: For CSS utilities
- **Prisma**: For database schema editing
- **ESLint**: For code linting
- **Prettier**: For code formatting

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Production Deployment

#### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

#### Environment Variables for Production

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

#### Build Configuration

The project includes optimized build configuration:
- **Turborepo**: For build caching and parallel execution
- **Next.js**: With standalone output for containerization
- **TypeScript**: Strict mode enabled
- **ESLint**: Comprehensive rule set

### Getting Help

#### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

#### Support Channels
- GitHub Issues: Create an issue in this repository
- Team Chat: Join the development team channels
- Documentation: Check the `/docs` directory for detailed guides

#### Useful Resources
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)

## Next Steps

After completing the setup:

1. **Explore the Application**: Navigate through the different features
2. **Read the Architecture Guide**: Understand the system design
3. **Review the Code**: Familiarize yourself with the codebase structure
4. **Run Tests**: Ensure everything is working correctly
5. **Start Development**: Begin working on your features

For more detailed information about the architecture and development practices, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [CLAUDE.md](./CLAUDE.md) - Development guidelines
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines