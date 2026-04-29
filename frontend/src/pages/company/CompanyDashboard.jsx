import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import { BACKEND_API_URL } from '../../utils/api';
import { 
  LayoutDashboard, 
  HardDrive, 
  Settings, 
} from 'lucide-react';
import { OverviewStats } from '@/components/company/OverviewStats';

import AssetTable from '@/components/asset/AssetTable';
import CompanySettings from '@/components/company/CompanySettings';

const CompanyDashboard = () => {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only this company's assets
  useEffect(() => {

    if (!user || !user._id || !token) {
    return;
  }

    const fetchMyAssets = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/assets/company/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssets(res.data);
      } catch (err) {
        console.error("Error fetching assets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAssets();
  }, [user,token]);//token

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <LayoutDashboard size={20} /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'assets' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <HardDrive size={20} /> My Assets
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Settings size={20} /> Settings
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="grow p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500">Managing assets for {user?.name}</p>
          </div>
        </header>

        {activeTab === 'overview' && <OverviewStats assets={assets} />}
        {activeTab === 'assets' && <AssetTable assets={assets} loading={loading} />}
        {activeTab === 'settings' && <CompanySettings />}
      </main>
    </div>
  );
};

export default CompanyDashboard;