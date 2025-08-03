import { createSupabaseBrowserClient } from './supabase';
import { UserRole } from './auth-types';

// Development users to seed
export const developmentUsers = [
  {
    email: 'david.chen@company.com',
    password: 'password123',
    name: 'David Chen',
    role: UserRole.DIRECTOR,
  },
  {
    email: 'sarah.williams@company.com',
    password: 'password123',
    name: 'Sarah Williams',
    role: UserRole.PROJECT_MANAGER,
  },
  {
    email: 'ahmed.hassan@company.com',
    password: 'password123',
    name: 'Ahmed Hassan',
    role: UserRole.SCHEDULER,
  },
];

// Function to seed development users
export async function seedDevelopmentUsers() {
  const supabase = createSupabaseBrowserClient();
  
  console.log('Starting to seed development users...');
  
  for (const userData of developmentUsers) {
    try {
      // First check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', userData.name);
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${userData.name} already exists, skipping...`);
        continue;
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          },
        },
      });

      if (authError) {
        console.error(`Error creating user ${userData.name}:`, authError);
        continue;
      }

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: userData.name,
            role: userData.role,
          });

        if (profileError) {
          console.error(`Error creating profile for ${userData.name}:`, profileError);
        } else {
          console.log(`✅ Successfully created user: ${userData.name} (${userData.role})`);
        }
      }
    } catch (error) {
      console.error(`Error seeding user ${userData.name}:`, error);
    }
  }
  
  console.log('Finished seeding development users');
}

// SQL script for creating the profiles table (to be run in Supabase SQL editor)
export const createProfilesTableSQL = `
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
`;

// Environment variables template
export const envTemplate = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Site URL for production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

console.log('='.repeat(60));
console.log('EOT Intelligence - Supabase Auth Setup');
console.log('='.repeat(60));
console.log('');
console.log('1. Set up your Supabase project:');
console.log('   - Go to https://supabase.com');
console.log('   - Create a new project');
console.log('   - Copy your project URL and anon key');
console.log('');
console.log('2. Add environment variables to your .env.local:');
console.log(envTemplate);
console.log('3. Run the SQL script in your Supabase SQL editor:');
console.log('   - Go to SQL Editor in Supabase dashboard');
console.log('   - Copy and run the createProfilesTableSQL script');
console.log('');
console.log('4. Seed development users:');
console.log('   - Import and call seedDevelopmentUsers() from your app');
console.log('   - Or manually create users using the Supabase auth interface');
console.log('');
console.log('Development users that will be created:');
developmentUsers.forEach(user => {
  console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
});
console.log('   Password for all users: password123');
console.log('');
console.log('='.repeat(60));