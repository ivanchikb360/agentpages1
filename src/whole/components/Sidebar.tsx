'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, CreditCard, Menu, User, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const links = [
    { path: '/dashboard', icon: Home, label: 'All Pages' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { path: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  if (location.pathname.startsWith('/dashboard/page-builder')) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <button
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transform transition-transform duration-300 ease-in-out fixed lg:relative bg-gray-800 text-white w-64 lg:w-72 space-y-6 py-7 px-2 h-full z-40 ${
          isMobile ? 'mt-16' : 'mt-0'
        }`}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">AgentPages</h1>
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded transition-colors
                ${
                  isActive(link.path)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
