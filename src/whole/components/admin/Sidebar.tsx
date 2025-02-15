import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Mail, Activity, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const links = [
    { path: '/admin/waitlist', icon: Mail, label: 'Waitlist' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: Activity, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-full p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded transition-colors
              ${location.pathname === link.path 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 