import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '../../lib/utils';

type User = {
  name: string;
  email: string;
};

type LayoutProps = {
  children: React.ReactNode;
  currentPath?: string;
  projectId?: string;
  currentUser?: User | null;
  showSidebar?: boolean;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
  LinkComponent?: React.ComponentType<{ to: string; children: React.ReactNode; className?: string; onClick?: () => void }>;
};

const Layout = ({ 
  children,
  currentPath = '',
  projectId,
  currentUser = null,
  showSidebar = true,
  onLogout = () => {},
  onNavigate = () => {},
  LinkComponent
}: LayoutProps) => {
  
  // Check if current route should show sidebar (avoid sidebar on auth pages)
  const isAuthPage = ['/', '/login', '/register'].includes(currentPath);
  const shouldShowSidebar = showSidebar && !isAuthPage;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentUser={currentUser}
        isAuthPage={isAuthPage}
        onLogout={onLogout}
        onNavigate={onNavigate}
        LinkComponent={LinkComponent}
      />
      
      <div className="flex">
        {shouldShowSidebar && (
          <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <Sidebar 
              currentPath={currentPath}
              projectId={projectId}
              onNavigate={onNavigate}
              LinkComponent={LinkComponent}
            />
          </div>
        )}
        
        <main className={cn(
          "flex-1 p-6",
          shouldShowSidebar ? "ml-0" : "ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;