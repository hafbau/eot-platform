'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@eot/ui';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@eot/identity';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-end space-x-2" aria-label="eot—intel">
              <span className="text-3xl font-medium tracking-tight" style={{ color: '#0066FF', letterSpacing: '-0.02em' }}>eot</span>
              <span className="text-3xl" style={{ color: '#CCCCCC' }}>—</span>
              <span className="text-3xl font-medium tracking-tight" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>intel</span>
              <span className="text-sm align-super" style={{ color: '#999999' }}>™</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm opacity-70">
            Welcome back to EOT Intelligence Platform
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid #CCE0FF' }}>
          <h3 className="text-sm font-medium mb-2" style={{ color: '#0052CC' }}>Demo Credentials</h3>
          <div className="text-xs space-y-1" style={{ color: '#0052CC' }}>
            <p><strong>Email:</strong> david.chen@company.com</p>
            <p><strong>Password:</strong> password123</p>
            <p className="text-xs text-blue-600 mt-2">
              Note: Create these users in your Supabase project first
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:outline-none"
                style={{ border: '1px solid hsl(var(--border))' }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 rounded-md shadow-sm placeholder-gray-400 focus:outline-none"
                  style={{ border: '1px solid hsl(var(--border))' }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm opacity-70">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium" style={{ color: '#0066FF' }}>
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
