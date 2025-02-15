'use client';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/admin/Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <div className="w-64 h-full bg-gray-900">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 