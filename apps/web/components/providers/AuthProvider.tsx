'use client';

import { AuthProvider as IdentityAuthProvider } from '@eot/identity';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <IdentityAuthProvider>
      {children}
    </IdentityAuthProvider>
  );
}