import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Briefcase, 
  Building, 
  AlertTriangle, 
  PhoneCall, 
  Clock 
} from 'lucide-react';

const DashboardOverview = () => {
  const { user, token } = useAuthStore();
  const [staffStats, setStaffStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const handleResolveCallback = async (companyId) => {
    try {
      setResolvingId(companyId);
      await axios.put(`http://localhost:3000/companies/${companyId}/resolve-callback`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove it from the local state
      setStaffStats(prev => ({
        ...prev,
        assignedCallbacks: prev.assignedCallbacks.filter(c => c._id !== companyId)
      }));
    } catch (err) {
      console.error("Error resolving callback", err);
      alert('Failed to resolve callback.');
    } finally {
      setResolvingId(null);
    }
  };

  useEffect(() => {
    if (!token || !user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Both Staff and Admin get Staff Stats
        const staffRes = await axios.get('http://localhost:3000/dashboard/staff', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStaffStats(staffRes.data);

        // Only Admin gets Admin Stats
        if (user.role === 'admin') {
          const adminRes = await axios.get('http://localhost:3000/dashboard/admin', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdminStats(adminRes.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token]);

  if (loading) return <div className="text-center p-10 text-slate-500">Loading dashboard data...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
        <p className="text-slate-500">Welcome back, {user?.name} ({user?.role})</p>
      </header>

      {/* Admin Specific Top Stats */}
      {user?.role === 'admin' && adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active AMCs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Active AMCs</p>
              <p className="text-3xl font-bold text-slate-900">{adminStats.activeAmcCount}</p>
            </div>
          </div>
          
          {/* New Companies */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
              <Building size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">New Companies (This Month)</p>
              <p className="text-3xl font-bold text-slate-900">{adminStats.newCompaniesCount}</p>
            </div>
          </div>

          {/* Critical Alerts Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Critical Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{adminStats.criticalAlerts?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Critical Alerts (Admin Only) */}
          {user?.role === 'admin' && adminStats?.criticalAlerts?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-red-700 flex items-center gap-2 mb-4">
                <AlertTriangle size={22} /> High Risk Companies
              </h2>
              <div className="space-y-4">
                {adminStats.criticalAlerts.map(alert => (
                  <div key={alert.company._id} className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{alert.company.name}</p>
                      <p className="text-sm text-slate-500">{alert.company.email} • {alert.company.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-bold">{Math.round(alert.ratio * 100)}% Inactive</p>
                      <p className="text-xs text-slate-500">{alert.expiredAssets} of {alert.totalAssets} assets</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Callbacks (Staff & Admin) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <PhoneCall size={22} className="text-blue-600" /> Callbacks Requested
            </h2>
            {staffStats?.assignedCallbacks?.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending callbacks.</p>
            ) : (
              <div className="space-y-4">
                {staffStats?.assignedCallbacks?.map(company => (
                  <div key={company._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{company.name}</p>
                      <p className="text-sm text-slate-500">{company.phone} • {company.email}</p>
                    </div>
                    <button 
                      onClick={() => handleResolveCallback(company._id)}
                      disabled={resolvingId === company._id}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 disabled:bg-slate-200 disabled:text-slate-500 transition-colors"
                    >
                      {resolvingId === company._id ? 'Resolving...' : 'Resolve'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Expiring Soon (Staff & Admin) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Clock size={22} className="text-orange-500" /> Expiring Soon (30 Days)
            </h2>
            {staffStats?.expiringSoon?.length === 0 ? (
              <p className="text-slate-500 text-sm">No assets expiring soon.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Asset</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">AMC Expiry</th>
                      <th className="px-4 py-3 rounded-tr-lg">AV Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffStats?.expiringSoon?.map(asset => (
                      <tr key={asset._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {asset.brand} {asset.model}
                          <div className="text-xs text-slate-500">{asset.serialNumber}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{asset.companyId?.name}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {asset.amcExpiryDate ? new Date(asset.amcExpiryDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {asset.avExpiryDate ? new Date(asset.avExpiryDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
