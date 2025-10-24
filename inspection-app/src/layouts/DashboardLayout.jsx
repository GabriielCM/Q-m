import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from '../components/SideMenu';

const SIDEBAR_STATE_KEY = 'sidebar-collapsed';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => {
      const newState = !prevState;
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <SideMenu isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;