# EOT Intelligence Platform - Deployment Guide

This guide covers deploying the EOT Intelligence Platform monorepo to Vercel with optimal configuration for production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Configuration](#vercel-configuration)
- [Deployment Process](#deployment-process)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

## Prerequisites

Before deploying, ensure you have:

- [Node.js](https://nodejs.org/) 18+ installed
- [pnpm](https://pnpm.io/) 8+ package manager
- [Vercel CLI](https://vercel.com/cli) installed globally
- [Turborepo](https://turbo.build/) account for remote caching
- [Supabase](https://supabase.com/) project configured
- Access to your Vercel team/organization

### Required Accounts & Services

1. **Vercel Account**: For hosting and deployment
2. **Supabase Project**: For database and authentication
3. **Turborepo Account**: For remote caching (optional but recommended)
4. **Domain Provider**: For custom domain (optional)

## Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd eot-intelligence-app
pnpm install
```

### 2. Environment Variables

Copy the example environment files and configure them:

```bash
# Root level
cp .env.example .env

# Web application
cp apps/web/.env.local.example apps/web/.env.local
cp apps/web/.env.staging.example apps/web/.env.staging
cp apps/web/.env.production.example apps/web/.env.production
```

### 3. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Configure the environment variables in your `.env` files
4. Set up authentication providers in Supabase Auth settings

## Vercel Configuration

### 1. Project Setup

```bash
# Login to Vercel
vercel login

# Link your project
vercel link

# Configure the project settings
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### 2. Monorepo Configuration

The project includes a `vercel.json` file configured for monorepo deployment:

- **Build Command**: `turbo build --filter=web`
- **Output Directory**: `apps/web/.next`
- **Framework**: Next.js
- **Node Version**: 18.x

### 3. Environment-Specific Deployments

#### Production
```bash
vercel --prod
```

#### Staging (Preview)
```bash
vercel
```

#### Development
```bash
pnpm dev
```

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to Git**: Vercel automatically deploys on git push
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Monitor Deployment**: Check the Vercel dashboard for build status

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific environment
vercel --target staging
```

### Advanced Deployment Options

#### With Build Cache
```bash
# Enable Turborepo remote caching
vercel env add TURBO_TOKEN
vercel env add TURBO_TEAM

# Deploy with cache
vercel --prod
```

#### Custom Domain
```bash
# Add custom domain
vercel domains add eot-intelligence.com
vercel domains add www.eot-intelligence.com
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | Application URL | `https://eot-intelligence.com` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TURBO_TOKEN` | Turborepo remote cache token | - |
| `TURBO_TEAM` | Turborepo team name | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `SENTRY_DSN` | Sentry error tracking | - |

### Setting Environment Variables

#### Via Vercel CLI
```bash
vercel env add VARIABLE_NAME
```

#### Via Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add variables for each environment (Development, Preview, Production)

#### Environment-Specific Configuration

- **Development**: `.env.local`
- **Staging/Preview**: `.env.staging` or Vercel preview environment
- **Production**: `.env.production` or Vercel production environment

## CI/CD Setup

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel Git Integration

Vercel automatically deploys when:
- Pushing to `main` branch → Production deployment
- Creating PR → Preview deployment
- Pushing to other branches → Development deployment

## Performance Optimization

### Build Optimization

1. **Turborepo Caching**: Configured for remote caching
2. **Next.js Optimization**: Standalone output, image optimization
3. **Bundle Splitting**: Modular imports configured
4. **Compression**: Enabled in Next.js config

### Runtime Optimization

1. **CDN**: Vercel's global CDN
2. **Edge Functions**: Configured for auth callbacks
3. **ISR**: Incremental Static Regeneration for static pages
4. **Image Optimization**: Automatic WebP/AVIF conversion

### Monitoring Performance

- **Vercel Analytics**: Built-in performance monitoring
- **Core Web Vitals**: Tracked automatically
- **Bundle Analysis**: Available in build logs

## Monitoring & Analytics

### Built-in Monitoring

- **Vercel Functions**: Automatic function monitoring
- **Real User Monitoring**: Performance tracking
- **Error Tracking**: Build and runtime errors

### External Monitoring (Optional)

#### Sentry Integration
```bash
vercel env add NEXT_PUBLIC_SENTRY_DSN
vercel env add SENTRY_AUTH_TOKEN
```

#### Analytics Integration
```bash
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
vercel env add NEXT_PUBLIC_POSTHOG_KEY
```

### Health Checks

The application includes health check endpoints:
- `/api/health` - Basic health check
- `/api/health/detailed` - Detailed system status

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with missing environment variables
```
Solution: Ensure all required environment variables are set in Vercel
```

**Issue**: Turborepo build errors
```bash
# Clear cache and rebuild
vercel env add TURBO_FORCE true
vercel --prod
```

**Issue**: Package resolution errors
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Runtime Issues

**Issue**: Supabase connection errors
```
1. Check environment variables
2. Verify Supabase project settings
3. Check network connectivity
```

**Issue**: Authentication redirect loops
```
1. Verify NEXT_PUBLIC_SITE_URL
2. Check Supabase auth settings
3. Ensure callback URLs match
```

#### Performance Issues

**Issue**: Slow page loads
```
1. Check Vercel function logs
2. Analyze bundle size
3. Review database queries
4. Check CDN caching
```

### Debug Commands

```bash
# Check build locally
pnpm build

# Analyze bundle
pnpm build && npx @next/bundle-analyzer

# Test production build
pnpm build && pnpm start

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

### Getting Help

1. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
2. **Supabase Support**: [supabase.com/docs](https://supabase.com/docs)
3. **GitHub Issues**: Create an issue in the repository
4. **Discord/Slack**: Join the team communication channels

## Rollback Procedures

### Quick Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Git-based Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Revert to specific commit
git revert [commit-hash]
git push origin main
```

### Database Rollback

For database schema changes:

1. **Supabase**: Use migration rollback features
2. **Manual**: Restore from backup if needed

### Environment Variable Rollback

```bash
# Remove problematic environment variable
vercel env rm VARIABLE_NAME

# Update environment variable
vercel env add VARIABLE_NAME
```

## Best Practices

### Security
- Never commit sensitive environment variables
- Use Vercel's environment variable encryption
- Regularly rotate API keys and secrets
- Enable Supabase RLS (Row Level Security)

### Performance
- Use Vercel's edge functions for auth
- Implement proper caching strategies
- Optimize images and assets
- Monitor Core Web Vitals

### Monitoring
- Set up error tracking with Sentry
- Monitor deployment notifications
- Track performance metrics
- Set up uptime monitoring

### Development
- Use preview deployments for testing
- Test all environment configurations
- Validate environment variables before deployment
- Use feature flags for gradual rollouts

---

## Quick Reference

### Essential Commands
```bash
# Development
pnpm dev

# Build
pnpm build

# Deploy preview
vercel

# Deploy production
vercel --prod

# Check logs
vercel logs

# Environment variables
vercel env ls
vercel env add VARIABLE_NAME
```

### Important Files
- `vercel.json` - Vercel configuration
- `turbo.json` - Turborepo configuration
- `next.config.mjs` - Next.js configuration
- `.env.example` - Environment variable template

### Support Links
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/docs)
- [Supabase Documentation](https://supabase.com/docs)