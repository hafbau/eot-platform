'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { Layout } from '@eot/ui';
import Link from 'next/link';
import { getCurrentUser, logout } from '../../lib/api/auth';

// Note: This metadata export will be moved to a page.tsx file in the parent directory
// export const metadata: Metadata = {
//   title: 'EOT Intelligence Platform - Dashboard',
//   description: 'Manage your construction projects and claims',
// };

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const LinkComponent = ({ to, children, className, onClick }: { 
    to: string; 
    children: React.ReactNode; 
    className?: string; 
    onClick?: () => void;
  }) => (
    <Link href={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );

  return (
    <Layout
      currentPath={pathname}
      projectId={params?.projectId as string}
      currentUser={{
        name: currentUser?.name || 'Hafiz Suara',
        email: currentUser?.email || 'hafiz@eotintel.ai',
      }}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      LinkComponent={LinkComponent}
    >
      {children}
    </Layout>
  );
}