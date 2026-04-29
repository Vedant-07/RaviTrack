import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/useAuthStore';
import CompanyList from './CompanyList';
import CompanyDetail from './CompanyDetail';
import AssetDetail from './AssetDetail';
import ManageStaff from './ManageStaff';
import ManageCompanies from './company/ManageCompanies';

import DashboardOverview from './DashboardOverview';

// Temporary components for now
// const CompanyList = () => <h1 className="text-2xl font-bold">Client Organizations</h1>;
// const StaffManagement = () => <h1 className="text-2xl font-bold">Admin Only: Staff Management</h1>;

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      <Sidebar />
      
      <main className="grow p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          
          {/* Admin Protected Page: Even if they know the URL, we check the role */}
          // Add the route inside the admin check
{user?.role === 'admin' && (
  <>
    <Route path="/manage-staff" element={<ManageStaff />} />
    <Route path="/manage-companies" element={<ManageCompanies />} />
  </>
)}
          
          {/* Fallback for unauthorized access to routes */}
          <Route path="*" element={<div className="text-center mt-20 font-bold text-slate-400 text-3xl">Asset Inventory Management - in Progress</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;