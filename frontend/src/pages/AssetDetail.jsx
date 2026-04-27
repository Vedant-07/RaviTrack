import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Wrench, Calendar, User, ClipboardList, Plus,Edit3,Trash2 } from 'lucide-react';
import ServiceLogModal from '@/components/ServiceLogModal';

const AssetDetail = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const fetchAssetData = async () => {
    try {
      const [assetRes, logsRes] = await Promise.all([
        axios.get(`http://localhost:3000/assets/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3000/service-logs/asset/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAsset(assetRes.data);
      setLogs(logsRes.data);
      console.log("----------------");
      
      console.log(logsRes.data)
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  

const handleDeleteLog = async (logId) => {
  if (!window.confirm("Delete this service record permanently?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/service-logs/${logId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAssetData(); // Refresh the list
  } catch (err) {
    alert("Failed to delete log");
  }
};

const handleEditLog = (log) => {
  setEditingLog(log);
  setIsLogModalOpen(true);
};

const openAddLogModal = () => {
  setEditingLog(null);
  setIsLogModalOpen(true);
};


  useEffect(() => {
    fetchAssetData();
  }, [id, token]);

  if (loading) return <div className="p-20 text-center">Loading History...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Asset Summary Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
        <div>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-full border border-blue-500/30">
            {asset?.category}
          </span>
          <h1 className="text-3xl font-black mt-2">{asset?.brand} {asset?.model}</h1>
          <p className="text-slate-400 font-mono text-sm mt-1">S/N: {asset?.serialNumber}</p>
        </div>
        <button 
          onClick={() => openAddLogModal()}//setIsLogModalOpen(true)
          className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all"
        >
          <Wrench size={20} /> Add Service Entry
        </button>
      </div>

      {/* Service Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
          <ClipboardList size={22} className="text-slate-400" /> Maintenance History
        </h2>

        {logs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 italic">
            No service records found for this asset.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8">
            {logs.map((log) => (
  <div key={log._id} className="relative">
    {/* 1. Corrected positioning for the Timeline Dot */}
    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
    
    {/* 2. Added 'group' class here so icons show on hover */}
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-lg">{log.issueDescription}</h4>
          <div className="flex gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={14} /> {new Date(log.logDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <User size={14} /> {log.technicianName}
            </span>
          </div>
        </div>

        {/* Action Icons: Now triggers correctly because of the 'group' class above */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => handleEditLog(log)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Log"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteLog(log._id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Log"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Action Taken</p>
        <p className="text-slate-700 leading-relaxed">{log.actionTaken}</p>
      </div>
    </div>
  </div>
))}
          </div>
        )}
      </div>

      {/* <AddLogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        assetId={id} 
        refreshData={fetchAssetData} 
      /> */}

      <ServiceLogModal 
  isOpen={isLogModalOpen} 
  onClose={() => setIsLogModalOpen(false)} 
  assetId={id} 
  refreshData={fetchAssetData} 
  editingLog={editingLog} 
/>
    </div>
  );
};

export default AssetDetail;