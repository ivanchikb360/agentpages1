'use client';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserNav } from '../../components/UserNav';
import { DashboardNav } from '../../components/dashboard-nav';

export default function DashboardLayout() {
  const location = useLocation();
  const isPageBuilder = location.pathname.includes('/dashboard/page-builder');

  // Add debug logging
  console.log('Dashboard Layout:', {
    location: location.pathname,
    isPageBuilder,
  });

  return (
    <div className="min-h-screen flex">
      {/* Side Navigation - hidden in page builder */}
      {!isPageBuilder && (
        <div className="w-64 border-r bg-background">
          <DashboardNav />
        </div>
      )}

      {/* Main Content - full width in page builder */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b px-4 flex items-center justify-end">
          <UserNav />
        </header>
        <main className={`flex-1 ${!isPageBuilder ? 'p-6' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
