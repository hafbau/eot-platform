# Supabase Authentication Setup Guide

This guide will help you migrate from the mock localStorage authentication to Supabase Auth in your EOT Intelligence Platform.

## Prerequisites

1. A Supabase account (free tier is sufficient for development)
2. Basic understanding of Supabase and PostgreSQL

## Step 1: Set up Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > API to get your project URL and anon key

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

2. Update the environment variables in `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Step 3: Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the following SQL script to create the necessary tables and functions:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('director', 'project_manager', 'scheduler', 'admin')),
  avatar_url TEXT,
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Enable insert for authenticated users during signup
CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'scheduler')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Create Development Users

You can create the development users in two ways:

### Option A: Using Supabase Dashboard
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Create users with these details:

**User 1 - Director**
- Email: david.chen@company.com
- Password: password123
- User Metadata: `{"name": "David Chen", "role": "director"}`

**User 2 - Project Manager**
- Email: sarah.williams@company.com
- Password: password123
- User Metadata: `{"name": "Sarah Williams", "role": "project_manager"}`

**User 3 - Scheduler**
- Email: ahmed.hassan@company.com
- Password: password123
- User Metadata: `{"name": "Ahmed Hassan", "role": "scheduler"}`

### Option B: Using the Seed Script
1. Build the identity module:
   ```bash
   cd packages/modules/identity
   pnpm build
   ```

2. Import and run the seed function in your application:
   ```typescript
   import { seedDevelopmentUsers } from '@eot/identity';
   
   // Run this once to create development users
   await seedDevelopmentUsers();
   ```

## Step 5: Update Application Routes

The new authentication system includes:

### Updated Components
- `NewLoginPage.tsx` - Login page using Supabase Auth
- `NewRegisterPage.tsx` - Registration page using Supabase Auth
- `NewNavbar.tsx` - Navbar with auth state management
- `AuthProvider.tsx` - React context provider for auth state

### New Pages (Next.js App Router)
- `/app/login/page.tsx`
- `/app/register/page.tsx`
- `/app/dashboard/page.tsx`

### Middleware
- Automatic route protection
- Role-based access control
- Redirect handling

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`
3. You should be redirected to `/login`
4. Try logging in with one of the development users:
   - Email: david.chen@company.com
   - Password: password123

## Key Features

### Authentication Features
- ✅ Email/password authentication
- ✅ User registration with role selection
- ✅ Automatic profile creation
- ✅ Password reset functionality
- ✅ Session management

### Authorization Features
- ✅ Role-based access control (Director, Project Manager, Scheduler, Admin)
- ✅ Protected routes with middleware
- ✅ Permission-based UI components
- ✅ User metadata storage

### Developer Experience
- ✅ TypeScript support with proper types
- ✅ React hooks for auth state management
- ✅ Server-side rendering support
- ✅ Automatic redirects
- ✅ Loading states

## User Roles and Permissions

The system supports four user roles:

1. **Director** - Full access to all features including user management
2. **Project Manager** - Access to project management and claims
3. **Scheduler** - Access to scheduling and basic project features
4. **Admin** - System administration access

Role-based route restrictions are configured in the middleware.

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure `.env.local` is in the correct location (`apps/web/.env.local`)
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and anon key are correct
   - Check that your Supabase project is active

3. **Profile creation errors**
   - Ensure the database schema was created correctly
   - Check that the trigger function is working

4. **TypeScript errors**
   - Run `pnpm build` in the identity module
   - Ensure all dependencies are installed

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify your database schema matches the setup script

## Next Steps

After setting up authentication, you can:
1. Remove the old mock authentication files
2. Update other components to use the new auth hooks
3. Add additional user profile fields as needed
4. Set up email templates in Supabase for password reset
5. Configure OAuth providers if needed