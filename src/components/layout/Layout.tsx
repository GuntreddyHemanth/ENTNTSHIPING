import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../Notifications/NotificationCenter';
import { Menu, X, LogOut, Gauge, Anchor, PenTool as Tool, Calendar, LayoutDashboard, ChevronDown, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Gauge, current: location.pathname === '/dashboard' },
    { name: 'Ships', href: '/ships', icon: Anchor, current: location.pathname.startsWith('/ships') },
    { name: 'Components', href: '/components', icon: Tool, current: location.pathname.startsWith('/components') },
    { name: 'Jobs', href: '/jobs', icon: LayoutDashboard, current: location.pathname === '/jobs' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, current: location.pathname === '/calendar' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={closeSidebar}></div>
        <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-800">
          <div className="absolute top-0 right-0 pt-2 -mr-12">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <Anchor size={24} />
              </div>
              <span className="text-xl font-bold text-white">ENTNT</span>
            </div>
          </div>
          <div className="flex-1 h-0 mt-5 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={closeSidebar}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <Anchor size={24} />
              </div>
              <span className="text-xl font-bold text-white">ENTNT</span>
            </div>
          </div>
          <div className="flex flex-col flex-1 mt-5">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <NotificationCenter className="mx-2" />

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <span className="ml-2 text-gray-700 hidden md:flex items-center">
                      {user?.email.split('@')[0]}
                      <span className="ml-1 text-xs text-gray-500 border border-gray-300 rounded px-1">
                        {user?.role}
                      </span>
                      <ChevronDown size={16} className="ml-1 text-gray-500" />
                    </span>
                  </button>
                </div>
                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Role: <span className="font-medium">{user?.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;