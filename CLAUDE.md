# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **EOT Intelligence Platform** - an AI-powered construction claims management system for managing Extension of Time (EOT) claims. The platform helps contractors identify delays, collect evidence, and generate comprehensive claim submissions.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, ShadCN/UI components, Supabase/Prisma, Turborepo Monorepo

## Development Commands

```bash
# Development server (all apps)
pnpm dev                # Starts all applications in development mode

# Development server (web app only)
pnpm dev --filter=web   # Starts Next.js app on port 3000

# Production build
pnpm build             # Builds all packages and applications

# Build specific app
pnpm build --filter=web # Builds only the web application

# Linting
pnpm lint              # Runs ESLint on all packages
pnpm lint:fix          # Runs ESLint with auto-fix

# Type checking
pnpm type-check        # TypeScript type checking across all packages

# Testing
pnpm test              # Runs all tests
pnpm test:e2e          # Runs E2E tests with Playwright
```

## Architecture & Structure

### Monorepo Architecture
- **Build System:** Turborepo for monorepo management and caching
- **Frontend Framework:** Next.js 14 with App Router
- **Language:** TypeScript with strict mode enabled
- **Routing:** Next.js App Router with layouts and middleware
- **Authentication:** Supabase Auth with session management
- **Database:** Supabase (PostgreSQL) with Prisma ORM
- **Styling:** Tailwind CSS with ShadCN/UI component library
- **State Management:** React Context/hooks with Supabase client

### Key Architectural Patterns
- **Monorepo Structure:** Apps and packages organized in separate directories
- **Module Federation:** Shared packages for UI, core utilities, and business modules
- **Authentication Middleware:** Next.js middleware for route protection
- **Layout System:** App Router layouts with nested routing
- **Component Architecture:** Feature-based organization with shared UI packages
- **Database Layer:** Prisma client with type-safe database operations

### Core Features
1. **Dashboard** - Project overview, claims funnel, delay trends
2. **Projects** - Project listing and individual project management
3. **Claims Management** - EOT claim creation, tracking, and submission
4. **Evidence Collection** - Document management and timeline building
5. **Schedule Monitoring** - Integration points for Primavera P6/MS Project
6. **User Management** - Role-based access control

### Monorepo Structure
```
eot-intelligence-app/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages and layouts
│       │   ├── (auth)/         # Auth route group
│       │   ├── (dashboard)/    # Dashboard route group
│       │   ├── globals.css     # Global styles
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Home page
│       ├── components/         # Application-specific components
│       ├── lib/                # Application utilities
│       ├── middleware.ts       # Auth middleware
│       └── next.config.mjs     # Next.js configuration
├── packages/
│   ├── core/                   # Shared types and utilities
│   ├── ui/                     # Shared UI components (ShadCN/UI)
│   └── modules/
│       ├── identity/           # Authentication & session management
│       ├── organizations/      # Multi-tenancy management
│       ├── storage/            # Database & file storage (Prisma)
│       ├── integrations/       # External systems integration
│       ├── analytics/          # Data analytics and reporting
│       └── audit/              # Compliance logging and audit trails
├── tests/                      # E2E tests with Playwright
├── turbo.json                  # Turborepo configuration
└── pnpm-workspace.yaml         # PNPM workspace configuration
```

### Authentication System
- Supabase Auth with email/password and OAuth providers
- Session management with automatic token refresh
- Three user roles: Director, Project Manager, Scheduler
- Next.js middleware protects authenticated routes
- Row Level Security (RLS) policies in Supabase

### Database System
- Supabase PostgreSQL database with real-time capabilities
- Prisma ORM for type-safe database operations
- Database migrations managed through Prisma
- Row Level Security for multi-tenant data isolation
- Includes projects, claims, delays, evidence, and user management

### UI Components
- Built on ShadCN/UI component library with Radix UI primitives
- Consistent design system with Tailwind CSS
- Shared UI package (`packages/ui/`) for cross-app components
- TypeScript components with proper typing
- Custom components follow established design patterns

### Integration Points
The application is designed for future integration with:
- **Primavera P6** - Schedule import/sync
- **Microsoft Project** - Alternative schedule source  
- **Document Management Systems** - Evidence collection
- **Email Systems** - Communication parsing
- **Contract Management** - FIDIC/NEC clause analysis

## Development Guidelines

### Adding New Features
1. Create feature-specific components in the appropriate app or shared package
2. Use Prisma schema and Supabase for new data requirements
3. Follow Next.js App Router patterns for new pages and routes
4. Maintain consistent UI patterns using shared UI package components
5. Consider which package the feature belongs in (app-specific vs shared)

### Working with Database
- Use Prisma client for all database operations
- Follow the established schema patterns in `packages/storage/prisma/schema.prisma`
- Implement proper TypeScript types generated from Prisma
- Use Supabase Row Level Security for data access control
- Follow database migration best practices

### Component Development
- Use shared UI components from `packages/ui/`
- Follow React functional component patterns with TypeScript
- Implement proper error boundaries for production readiness
- Use Next.js App Router navigation and hooks
- Consider component reusability across different apps

### Package Development
- Add new shared functionality to appropriate packages (`core`, `ui`, modules)
- Use proper TypeScript exports and imports
- Follow the established build patterns with tsup
- Maintain package dependencies carefully
- Document package APIs clearly

### Styling Guidelines
- Use Tailwind utility classes consistently
- Follow the design system established in the UI package
- Use ShadCN/UI components for complex UI elements
- Maintain responsive design principles
- Use CSS modules or styled-components when needed

### Testing Considerations
- E2E tests configured with Playwright
- Use the established test patterns in `tests/` directory
- Focus on integration tests for user workflows
- Test across the full application stack
- Mock external services appropriately