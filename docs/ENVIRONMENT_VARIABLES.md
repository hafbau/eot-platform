# Environment Variables Reference

This document provides a comprehensive reference for all environment variables used in the EOT Intelligence Platform.

## Table of Contents

- [Quick Setup](#quick-setup)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Environment-Specific Configuration](#environment-specific-configuration)
- [Vercel Configuration](#vercel-configuration)
- [Security Best Practices](#security-best-practices)
- [Validation & Testing](#validation--testing)

## Quick Setup

### 1. Copy Environment Files

```bash
# Root level
cp .env.example .env

# Web application
cp apps/web/.env.local.example apps/web/.env.local
```

### 2. Required Variables (Minimum Setup)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Required Variables

### Supabase Configuration

| Variable | Description | Format | Example |
|----------|-------------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | `https://abcdefghijklmnop.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | JWT token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | JWT token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**How to Get These Values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and API keys

### Application Configuration

| Variable | Description | Format | Example |
|----------|-------------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL of your application | URL | `https://eot-intelligence.com` |
| `NODE_ENV` | Environment mode | `development\|staging\|production` | `production` |

## Optional Variables

### Authentication & Security

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `NEXTAUTH_SECRET` | JWT secret for NextAuth | Generated | Production |
| `NEXT_PUBLIC_AUTH_CALLBACK_URL` | Auth callback URL | `${SITE_URL}/auth/callback` | OAuth providers |
| `NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT` | Post-login redirect | `/dashboard` | Custom redirects |
| `NEXT_PUBLIC_AUTH_ERROR_REDIRECT` | Auth error redirect | `/login` | Error handling |

### Database Configuration

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | Direct database connection | Supabase URL | Direct DB access |
| `DATABASE_POOL_MIN` | Minimum connection pool size | `2` | Performance tuning |
| `DATABASE_POOL_MAX` | Maximum connection pool size | `10` | Performance tuning |

### Storage Configuration

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `AWS_REGION` | AWS S3 region | `us-east-1` | S3 storage |
| `AWS_ACCESS_KEY_ID` | AWS access key | - | S3 storage |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - | S3 storage |
| `AWS_S3_BUCKET` | S3 bucket name | - | S3 storage |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Supabase storage bucket | `documents` | File uploads |

### External Integrations

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | - | Payments |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | Payments |
| `EMAIL_API_KEY` | Email service API key | - | Email notifications |
| `EMAIL_FROM_ADDRESS` | From email address | - | Email notifications |

### Monitoring & Analytics

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking | - | Error tracking |
| `SENTRY_AUTH_TOKEN` | Sentry auth token | - | Release tracking |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | - | Analytics |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key | - | Product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | `https://app.posthog.com` | Product analytics |

### Performance & Optimization

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `TURBO_TOKEN` | Turborepo remote cache token | - | Build caching |
| `TURBO_TEAM` | Turborepo team name | - | Build caching |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | Privacy |
| `CACHE_TTL` | Default cache TTL (seconds) | `3600` | Performance |
| `STATIC_CACHE_TTL` | Static cache TTL (seconds) | `86400` | Performance |

### Feature Flags

| Variable | Description | Default | Purpose |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics tracking | `false` | Analytics control |
| `NEXT_PUBLIC_ENABLE_TELEMETRY` | Enable telemetry | `false` | Telemetry control |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug mode | `false` | Development |
| `NEXT_PUBLIC_DEV_TOOLS` | Enable dev tools | `false` | Development |
| `NEXT_PUBLIC_FEATURE_NEW_DASHBOARD` | Enable new dashboard | `false` | Feature rollout |
| `NEXT_PUBLIC_FEATURE_ADVANCED_ANALYTICS` | Enable advanced analytics | `false` | Feature rollout |
| `NEXT_PUBLIC_FEATURE_BETA_FEATURES` | Enable beta features | `false` | Feature rollout |

## Environment-Specific Configuration

### Development Environment

```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_DEV_TOOLS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_TELEMETRY_DISABLED=1
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=staging
NEXT_PUBLIC_SITE_URL=https://staging.eot-intelligence.com
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_DEV_TOOLS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_BETA_FEATURES=true
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://eot-intelligence.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_DEV_TOOLS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_BETA_FEATURES=false
```

## Vercel Configuration

### Setting Environment Variables in Vercel

#### Via CLI
```bash
# Add variable to all environments
vercel env add VARIABLE_NAME

# Add variable to specific environment
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview
vercel env add VARIABLE_NAME development
```

#### Via Dashboard
1. Go to Vercel dashboard
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add variables for each environment

### Environment Variable Inheritance

Vercel environments inherit variables in this order:
1. Environment-specific variables (highest priority)
2. All environments variables
3. System variables (lowest priority)

### Vercel System Variables

These are automatically available in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `VERCEL_URL` | Deployment URL | `app-abc123.vercel.app` |
| `VERCEL_ENV` | Deployment environment | `production` |
| `VERCEL_GIT_COMMIT_SHA` | Git commit SHA | `abc123...` |
| `VERCEL_GIT_COMMIT_REF` | Git branch/tag | `main` |

## Security Best Practices

### Public vs Private Variables

**Public Variables (NEXT_PUBLIC_*):**
- Exposed to the browser
- Should not contain secrets
- Used for configuration that needs to be accessible client-side

**Private Variables:**
- Only available server-side
- Should contain sensitive information
- Never exposed to the browser

### Variable Naming Conventions

```bash
# ✅ Good
NEXT_PUBLIC_SUPABASE_URL=https://...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...

# ❌ Bad
SUPABASE_URL=https://...  # Should be NEXT_PUBLIC_ if needed client-side
NEXT_PUBLIC_SECRET_KEY=sk_...  # Secrets should not be public
```

### Security Checklist

- [ ] No secrets in public variables
- [ ] All production secrets are unique
- [ ] Regular rotation of API keys
- [ ] Environment variables are encrypted at rest
- [ ] No hardcoded values in code
- [ ] Proper CORS configuration

## Validation & Testing

### Environment Validation

Create a validation script to check required variables:

```typescript
// scripts/validate-env.ts
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

### Testing Different Environments

```bash
# Test with development environment
NODE_ENV=development npm run build

# Test with staging environment
NODE_ENV=staging npm run build

# Test with production environment
NODE_ENV=production npm run build
```

### Environment Variable Templates

Use environment variable templates for consistency:

```bash
# Template for new developers
cp .env.template .env.local
# Fill in the required values
```

### Common Issues & Solutions

#### Issue: Variable not loading
```bash
# Check variable is set
echo $VARIABLE_NAME

# Check in Vercel
vercel env ls

# Ensure proper naming (NEXT_PUBLIC_ prefix for client-side)
```

#### Issue: Different values in different environments
```bash
# Check environment-specific variables
vercel env ls --environment production
vercel env ls --environment preview
vercel env ls --environment development
```

#### Issue: Build fails due to missing variables
```bash
# Add missing variables
vercel env add MISSING_VARIABLE

# Redeploy
vercel --prod
```

## Environment Variable Migration

### When Adding New Variables

1. **Update all environment files**:
   - `.env.example`
   - `.env.local.example`
   - `.env.staging.example`
   - `.env.production.example`

2. **Update Vercel configuration**:
   ```bash
   vercel env add NEW_VARIABLE development
   vercel env add NEW_VARIABLE preview
   vercel env add NEW_VARIABLE production
   ```

3. **Update documentation**:
   - Add to this reference guide
   - Update deployment guide
   - Notify team members

### When Removing Variables

1. **Remove from code first**
2. **Remove from environment files**
3. **Remove from Vercel**:
   ```bash
   vercel env rm OLD_VARIABLE
   ```
4. **Update documentation**

---

## Quick Reference Card

### Minimum Required Setup
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production Checklist
- [ ] All required variables set
- [ ] No secrets in public variables
- [ ] Environment-specific URLs configured
- [ ] Monitoring variables configured
- [ ] Feature flags set appropriately
- [ ] Cache settings optimized

### Emergency Access
```bash
# View all variables
vercel env ls

# Add urgent variable
vercel env add URGENT_VAR production

# Force redeploy
vercel --prod --force
```