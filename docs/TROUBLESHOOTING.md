# Deployment Troubleshooting Guide

This guide helps resolve common deployment and runtime issues with the EOT Intelligence Platform on Vercel.

## Table of Contents

- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Environment Issues](#environment-issues)
- [Performance Issues](#performance-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Monitoring & Debugging](#monitoring--debugging)
- [Emergency Procedures](#emergency-procedures)

## Build Issues

### Turborepo Build Failures

#### Issue: "turbo: command not found"
```bash
Error: turbo: command not found during build
```

**Solution:**
```bash
# Ensure turbo is installed globally in Vercel
# Add to package.json if missing:
{
  "devDependencies": {
    "turbo": "^2.3.4"
  }
}

# Or use npx in build command
"buildCommand": "npx turbo build --filter=web"
```

#### Issue: Cache retrieval failures
```bash
Error: Failed to retrieve cache from remote
```

**Solutions:**
1. **Check Turbo credentials:**
   ```bash
   vercel env add TURBO_TOKEN
   vercel env add TURBO_TEAM
   ```

2. **Disable remote cache temporarily:**
   ```json
   // turbo.json
   {
     "remoteCache": {
       "enabled": false
     }
   }
   ```

3. **Clear and rebuild:**
   ```bash
   vercel env add TURBO_FORCE true
   vercel --prod
   ```

### Next.js Build Errors

#### Issue: Module not found errors
```bash
Error: Module not found: Can't resolve '@eot/core'
```

**Solutions:**
1. **Check workspace configuration:**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'apps/*'
     - 'packages/*'
     - 'packages/modules/*'
   ```

2. **Verify package.json dependencies:**
   ```json
   {
     "dependencies": {
       "@eot/core": "workspace:*"
     }
   }
   ```

3. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

#### Issue: TypeScript compilation errors
```bash
Error: Type 'X' is not assignable to type 'Y'
```

**Solutions:**
1. **Check TypeScript configuration:**
   ```bash
   pnpm type-check
   ```

2. **Update type definitions:**
   ```bash
   pnpm add -D @types/node@latest
   ```

3. **Verify workspace TypeScript setup:**
   ```json
   // tsconfig.json
   {
     "extends": "./packages/tsconfig.base.json"
   }
   ```

### Environment Variable Issues in Build

#### Issue: Missing environment variables during build
```bash
Error: Required environment variable NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solutions:**
1. **Add to Vercel:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Check turbo.json configuration:**
   ```json
   {
     "globalEnv": [
       "NEXT_PUBLIC_SUPABASE_URL",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY"
     ]
   }
   ```

3. **Verify environment inheritance:**
   ```bash
   vercel env ls
   ```

## Runtime Issues

### 500 Internal Server Error

#### Issue: Server-side rendering failures
```bash
Error: getServerSideProps failed
```

**Solutions:**
1. **Check function logs:**
   ```bash
   vercel logs --follow
   ```

2. **Verify Supabase connection:**
   ```typescript
   // Test connection
   import { createSupabaseServerClient } from '@eot/identity';
   
   const supabase = createSupabaseServerClient(cookies());
   const { data, error } = await supabase.auth.getSession();
   ```

3. **Check environment variables:**
   ```bash
   vercel env ls --environment production
   ```

### API Route Failures

#### Issue: API routes returning 404
```bash
Error: GET /api/health 404 Not Found
```

**Solutions:**
1. **Check file structure:**
   ```
   apps/web/
   ├── app/
   │   └── api/
   │       └── health/
   │           └── route.ts
   ```

2. **Verify route exports:**
   ```typescript
   // route.ts
   export async function GET() {
     return Response.json({ status: 'ok' });
   }
   ```

3. **Check build output:**
   ```bash
   # Look for API routes in build log
   vercel logs
   ```

### Memory and Timeout Issues

#### Issue: Function timeout (30s limit)
```bash
Error: Function execution timeout
```

**Solutions:**
1. **Optimize database queries:**
   ```typescript
   // Add query optimization
   const { data } = await supabase
     .from('table')
     .select('id, name') // Only select needed fields
     .limit(100);       // Limit results
   ```

2. **Implement pagination:**
   ```typescript
   // Use pagination instead of loading all data
   const { data } = await supabase
     .from('table')
     .select('*')
     .range(0, 49); // Load 50 items at a time
   ```

3. **Use streaming responses:**
   ```typescript
   // For large datasets
   export async function GET() {
     const stream = new ReadableStream({
       start(controller) {
         // Stream data chunks
       }
     });
     return new Response(stream);
   }
   ```

## Environment Issues

### Supabase Connection Problems

#### Issue: Supabase client initialization fails
```bash
Error: Invalid Supabase URL or key
```

**Solutions:**
1. **Verify environment variables:**
   ```bash
   # Check if variables are set
   vercel env ls | grep SUPABASE
   ```

2. **Test connection locally:**
   ```bash
   # Create test script
   node -e "
   require('dotenv').config({ path: '.env.local' });
   const { createClient } = require('@supabase/supabase-js');
   const client = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   );
   console.log('Connection test:', client.supabaseUrl);
   "
   ```

3. **Check Supabase project status:**
   - Verify project is not paused
   - Check API key permissions
   - Confirm URL format

### CORS Issues

#### Issue: CORS policy violations
```bash
Error: Access to fetch blocked by CORS policy
```

**Solutions:**
1. **Configure Supabase CORS:**
   - Go to Supabase Dashboard > Settings > API
   - Add your domain to allowed origins

2. **Check site URL configuration:**
   ```bash
   # Ensure site URL matches deployment URL
   vercel env add NEXT_PUBLIC_SITE_URL https://your-domain.com
   ```

3. **Verify auth callback URLs:**
   ```
   Supabase Dashboard > Authentication > URL Configuration
   Site URL: https://your-domain.com
   Redirect URLs: https://your-domain.com/auth/callback
   ```

## Performance Issues

### Slow Page Load Times

#### Issue: High Time to First Byte (TTFB)
```bash
Performance issue: TTFB > 2 seconds
```

**Solutions:**
1. **Implement ISR (Incremental Static Regeneration):**
   ```typescript
   // page.tsx
   export const revalidate = 3600; // Revalidate every hour
   
   export default async function Page() {
     const data = await getStaticData();
     return <Component data={data} />;
   }
   ```

2. **Optimize database queries:**
   ```typescript
   // Use indexes and optimize queries
   const { data } = await supabase
     .from('projects')
     .select(`
       id,
       name,
       organization:organizations(name)
     `)
     .eq('status', 'active');
   ```

3. **Enable caching:**
   ```typescript
   // Add cache headers
   export async function GET() {
     const data = await fetchData();
     
     return Response.json(data, {
       headers: {
         'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
       }
     });
   }
   ```

### Bundle Size Issues

#### Issue: Large bundle size affecting performance
```bash
Warning: Bundle size exceeds recommended limits
```

**Solutions:**
1. **Analyze bundle:**
   ```bash
   # Install bundle analyzer
   npm install --save-dev @next/bundle-analyzer
   
   # Analyze bundle
   ANALYZE=true npm run build
   ```

2. **Implement code splitting:**
   ```typescript
   // Use dynamic imports
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Spinner />,
     ssr: false
   });
   ```

3. **Optimize imports:**
   ```typescript
   // ❌ Imports entire library
   import { Button } from '@radix-ui/react-button';
   
   // ✅ Optimized with modularizeImports in next.config.js
   import { Button } from '@radix-ui/react-button';
   ```

## Database Issues

### Supabase Performance Problems

#### Issue: Slow database queries
```bash
Performance: Database queries taking > 1 second
```

**Solutions:**
1. **Add database indexes:**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_projects_organization_id ON projects(organization_id);
   CREATE INDEX idx_projects_status ON projects(status);
   ```

2. **Optimize RLS policies:**
   ```sql
   -- Ensure RLS policies are efficient
   CREATE POLICY "Users can read own projects" ON projects
     FOR SELECT USING (auth.uid() = user_id);
   ```

3. **Use connection pooling:**
   ```typescript
   // Configure connection pooling
   const supabase = createClient(url, key, {
     db: {
       schema: 'public',
     },
     auth: {
       autoRefreshToken: true,
       persistSession: true
     }
   });
   ```

### Connection Pool Exhaustion

#### Issue: Too many database connections
```bash
Error: remaining connection slots are reserved
```

**Solutions:**
1. **Configure connection limits:**
   ```bash
   vercel env add DATABASE_POOL_MAX 10
   vercel env add DATABASE_POOL_MIN 2
   ```

2. **Implement connection cleanup:**
   ```typescript
   // Ensure connections are properly closed
   export async function GET() {
     try {
       const { data } = await supabase.from('table').select();
       return Response.json(data);
     } finally {
       // Connection automatically cleaned up by Supabase client
     }
   }
   ```

## Authentication Issues

### OAuth Redirect Loops

#### Issue: Infinite redirect loops after login
```bash
Error: Too many redirects in authentication flow
```

**Solutions:**
1. **Check callback URL configuration:**
   ```bash
   # Ensure callback URL matches Supabase settings
   vercel env add NEXT_PUBLIC_AUTH_CALLBACK_URL https://your-domain.com/auth/callback
   ```

2. **Verify middleware configuration:**
   ```typescript
   // middleware.ts
   import { createServerClient } from '@supabase/ssr';
   
   export async function middleware(request: NextRequest) {
     // Ensure proper session handling
     const response = NextResponse.next();
     const supabase = createServerClient(/* config */);
     
     await supabase.auth.getSession();
     return response;
   }
   ```

3. **Check site URL settings:**
   ```
   Supabase Dashboard > Authentication > URL Configuration
   Site URL must match NEXT_PUBLIC_SITE_URL
   ```

### Session Management Issues

#### Issue: Users randomly logged out
```bash
Issue: Session expires unexpectedly
```

**Solutions:**
1. **Configure session persistence:**
   ```typescript
   const supabase = createBrowserClient(url, key, {
     auth: {
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: true
     }
   });
   ```

2. **Check cookie settings:**
   ```typescript
   // Ensure secure cookie configuration
   cookieStore.set({
     name: 'session',
     value: sessionToken,
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 60 * 60 * 24 * 7 // 7 days
   });
   ```

## Monitoring & Debugging

### Enable Debug Mode

```bash
# Add debug environment variables
vercel env add DEBUG true
vercel env add NEXT_PUBLIC_DEBUG_MODE true
```

### Check Function Logs

```bash
# Real-time logs
vercel logs --follow

# Filter by function
vercel logs --filter="function-name"

# Check specific deployment
vercel logs [deployment-url]
```

### Performance Monitoring

```bash
# Check Vercel Analytics
# Go to Dashboard > Analytics

# Monitor Core Web Vitals
# Dashboard > Speed Insights

# Check function performance
# Dashboard > Functions > Performance
```

### Health Checks

```bash
# Test application health
curl https://your-domain.com/api/health

# Test database connectivity
curl https://your-domain.com/api/health/database

# Test authentication
curl https://your-domain.com/api/auth/session
```

## Emergency Procedures

### Immediate Rollback

```bash
# Quick rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Emergency Environment Variable Update

```bash
# Update critical environment variable
vercel env add CRITICAL_VAR new_value production

# Force immediate redeploy
vercel --prod --force
```

### Service Outage Response

1. **Check service status:**
   - Vercel Status: https://vercel.com/status
   - Supabase Status: https://status.supabase.com

2. **Enable maintenance mode:**
   ```typescript
   // Create maintenance page
   export default function Maintenance() {
     return <div>Service temporarily unavailable</div>;
   }
   ```

3. **Communication:**
   - Update status page
   - Notify users via email/notifications
   - Post on social media if necessary

### Data Recovery

```bash
# Supabase automatic backups (24 hours)
# Go to Dashboard > Settings > Backups

# Point-in-time recovery (if enabled)
# Contact Supabase support for recovery
```

---

## Quick Diagnostic Commands

### Environment Check
```bash
vercel env ls
vercel whoami
vercel projects ls
```

### Build Check
```bash
pnpm install
pnpm build
pnpm type-check
```

### Connection Tests
```bash
# Test Supabase connection
curl -H "Authorization: Bearer [ANON_KEY]" [SUPABASE_URL]/rest/v1/

# Test application endpoints
curl https://your-domain.com/api/health
```

### Performance Tests
```bash
# Lighthouse CLI
lighthouse https://your-domain.com --only-categories=performance

# Core Web Vitals
npx @vercel/ncc build --minify performance-test.js
```

## Getting Help

### Internal Resources
1. Check deployment logs: `vercel logs`
2. Review environment variables: `vercel env ls`
3. Test locally: `pnpm dev`
4. Check documentation: `DEPLOYMENT.md`

### External Support
1. **Vercel Support**: https://vercel.com/support
2. **Supabase Support**: https://supabase.com/docs
3. **Community Forums**: https://github.com/vercel/vercel/discussions
4. **Discord/Slack**: Team communication channels

### Creating Support Tickets

Include the following information:
- Deployment URL
- Error messages/logs
- Environment (production/staging/development)
- Steps to reproduce
- Expected vs actual behavior
- Recent changes/deployments