'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@eot/ui';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  AlertTriangle,
  FileText,
  Gavel,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

const NextSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params?.projectId as string;
  
  // Main navigation items
  const mainNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Building2,
      current: pathname === '/projects' || pathname.startsWith('/projects')
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: pathname === '/analytics'
    }
  ];
  
  // Project-specific navigation items (shown when viewing a specific project)
  const projectNavItems = projectId ? [
    {
      name: 'Project Dashboard',
      href: `/projects/${projectId}/dashboard`,
      icon: LayoutDashboard,
      current: pathname === `/projects/${projectId}/dashboard`
    },
    {
      name: 'Schedule',
      href: `/projects/${projectId}/schedule`,
      icon: Calendar,
      current: pathname === `/projects/${projectId}/schedule`
    },
    {
      name: 'Delays',
      href: `/projects/${projectId}/delays`,
      icon: AlertTriangle,
      current: pathname === `/projects/${projectId}/delays`
    },
    {
      name: 'Evidence',
      href: `/projects/${projectId}/evidence`,
      icon: FileText,
      current: pathname === `/projects/${projectId}/evidence`
    },
    {
      name: 'Claims',
      href: `/projects/${projectId}/claims`,
      icon: Gavel,
      current: pathname === `/projects/${projectId}/claims`
    }
  ] : [];
  
  // Settings navigation items
  const settingsNavItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings'
    },
    {
      name: 'User Management',
      href: '/settings/users',
      icon: Users,
      current: pathname === '/settings/users'
    }
  ];
  
  const NavItem = ({ item }: { item: any }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        item.current
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <item.icon className="h-5 w-5 mr-3" />
      {item.name}
    </Link>
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main
          </h3>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
        
        {/* Project Navigation - Only show when viewing a specific project */}
        {projectNavItems.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Project
            </h3>
            <nav className="space-y-1">
              {projectNavItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        )}
        
        {/* Settings Navigation */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Settings
          </h3>
          <nav className="space-y-1">
            {settingsNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>EOT Intelligence Platform</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default NextSidebar;