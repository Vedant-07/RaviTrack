import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, UserPlus, HardDrive, ShieldAlert,Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore(); // Access the logged-in user object

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'staff'] },
    { name: 'Companies', path: '/dashboard/companies', icon: <Building2 size={20} />, roles: ['admin', 'staff'] },
    { name: 'All Assets', path: '/dashboard/assets', icon: <HardDrive size={20} />, roles: ['admin', 'staff'] },
    // ADMIN ONLY ITEMS
    { name: 'Manage Staff', path: '/dashboard/manage-staff', icon: <UserPlus size={20} />, roles: ['admin'] },
    // Add this item to your menuItems array
    { name: 'Manage Companies', path: '/dashboard/manage-companies', icon: <Settings size={20} />, roles: ['admin'] },
    // { name: 'Audit Logs', path: '/dashboard/audit', icon: <ShieldAlert size={20} />, roles: ['admin'] },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 space-y-2">
        {menuItems.map((item) => (
          // Only show item if the user's role is in the roles array
          item.roles.includes(user?.role) && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        ))}
      </div>
      
      <div className="mt-auto p-6">
        <div className="bg-slate-100 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
          <p className="text-sm font-bold text-slate-900">{user?.name}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-white text-[10px] font-bold text-blue-600 rounded border border-blue-200 uppercase">
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
