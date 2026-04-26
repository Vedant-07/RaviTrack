import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/useAuthStore';

// Temporary components for now
const Overview = () => <h1 className="text-2xl font-bold">Welcome to the Command Center</h1>;
const CompanyList = () => <h1 className="text-2xl font-bold">Client Organizations</h1>;
const StaffManagement = () => <h1 className="text-2xl font-bold">Admin Only: Staff Management</h1>;

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      <Sidebar />
      
      <main className="grow p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/companies" element={<CompanyList />} />
          
          {/* Admin Protected Page: Even if they know the URL, we check the role */}
          {user?.role === 'admin' && (
            <Route path="/manage-staff" element={<StaffManagement />} />
          )}
          
          {/* Fallback for unauthorized access to routes */}
          <Route path="*" element={<div className="text-center mt-20 font-bold text-slate-400 text-3xl">Page Not Found or Access Denied</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;