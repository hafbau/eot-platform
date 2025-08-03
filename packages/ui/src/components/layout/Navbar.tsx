import React, { useState } from 'react';
import { Button } from '../button';
import { 
  Building2, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { getInitials } from '../../lib/utils';

type User = {
  name: string;
  email: string;
};

type NavbarProps = {
  currentUser?: User | null;
  isAuthPage?: boolean;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
  LinkComponent?: React.ComponentType<{ to: string; children: React.ReactNode; className?: string; onClick?: () => void }>;
};

const Navbar = ({ 
  currentUser = null, 
  isAuthPage = false, 
  onLogout = () => {}, 
  onNavigate = () => {}, 
  LinkComponent = ({ to, children, className, onClick }) => (
    <button onClick={() => { onClick?.(); onNavigate(to); }} className={className}>
      {children}
    </button>
  )
}: NavbarProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <LinkComponent to="/dashboard" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              EOT Intelligence
            </span>
          </LinkComponent>
        </div>
        
        {/* Search Bar - Only show when authenticated */}
        {!isAuthPage && currentUser && (
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, claims, or delays..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {!isAuthPage && currentUser ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {currentUser.name}
                  </span>
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    
                    <LinkComponent
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </LinkComponent>
                    
                    <LinkComponent
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </LinkComponent>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Auth page buttons
            !isAuthPage && (
              <div className="flex items-center space-x-2">
                <LinkComponent to="/login">
                  <Button variant="ghost">Sign In</Button>
                </LinkComponent>
                <LinkComponent to="/register">
                  <Button>Get Started</Button>
                </LinkComponent>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;