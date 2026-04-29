import React from 'react';
import { Monitor, Cpu, ShieldAlert, CheckCircle2, Clock,Edit3,Trash2,MoreVertical,Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssetTable = ({ assets, loading, isStaffView, onEdit, onDelete }) => {

  const navigate = useNavigate();
  
  // Helper to determine status and badge color
  const getStatus = (expiryDate) => {
    if (!expiryDate) return { label: 'N/A', color: 'bg-slate-100 text-slate-500' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'bg-red-100 text-red-600', icon: <ShieldAlert size={14} /> };
    if (diffDays <= 30) return { label: 'Expiring Soon', color: 'bg-orange-100 text-orange-600', icon: <Clock size={14} /> };
    return { label: 'Active', color: 'bg-green-100 text-green-600', icon: <CheckCircle2 size={14} /> };
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Loading your hardware inventory...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Asset Details</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Serial Number</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">AMC Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Antivirus</th>
            {isStaffView && (
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            )}
            
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {assets.map((asset) => {
            const amc = getStatus(asset.amcExpiryDate);
            const av = getStatus(asset.avExpiryDate);

            return (
              <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      {asset.category === 'Server' ? <Cpu size={20} /> : <Monitor size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{asset.brand} {asset.model}</p>
                      <p className="text-xs text-slate-500">{asset.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">
                  {asset.serialNumber}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${amc.color}`}>
                    {amc.icon} {amc.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${av.color}`}>
                    {av.icon} {av.label}
                  </span>
                </td>

                {/* --- CONSOLIDATED ACTIONS CELL --- */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    

                    {/* 2. Staff Actions (Edit/Delete) - Grouped next to it */}
                    {isStaffView && (
                      <>
                        <button 
                          onClick={() => onEdit(asset)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Asset"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(asset._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Asset"
                        >
                          <Trash2 size={18} />
                        </button>

                        <button 
                      onClick={() => navigate(`/dashboard/assets/${asset._id}`)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Wrench size={18} />
                    </button>

                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {assets.length === 0 && (
        <div className="p-12 text-center text-slate-500 italic">No assets registered under your company yet.</div>
      )}
    </div>
  );
};

export default AssetTable;
