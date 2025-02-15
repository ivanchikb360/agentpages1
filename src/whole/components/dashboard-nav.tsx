import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  User,
  CreditCard,
  Plus 
} from 'lucide-react';

export function DashboardNav() {
  return (
    <nav className="p-4 space-y-2">
      <NavLink 
        to="/dashboard" 
        end
        className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`
        }
      >
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink 
        to="/dashboard/profile"
        className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`
        }
      >
        <User className="h-4 w-4" />
        <span>Profile</span>
      </NavLink>

      <NavLink 
        to="/dashboard/settings"
        className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`
        }
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </NavLink>

      <NavLink 
        to="/dashboard/billing"
        className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`
        }
      >
        <CreditCard className="h-4 w-4" />
        <span>Billing</span>
      </NavLink>
    </nav>
  );
}

