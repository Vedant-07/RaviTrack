import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, HardDrive, MapPin, Phone } from 'lucide-react';
import AssetTable from '../../components/asset/AssetTable'; // Reuse your component!
import AssetModal from '../../components/asset/AssetModal';

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const { token } = useAuthStore();

  const handleDelete = async (assetId) => {
    if (!window.confirm("Delete this hardware from records?")) return;
    try {
      await axios.delete(`http://localhost:3000/assets/${assetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Reload the list
    } catch (err) { alert("Delete failed"); }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
      try {
        const [compRes, assetRes] = await Promise.all([
          axios.get(`http://localhost:3000/companies/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:3000/assets/company/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCompany(compRes.data);
        setAssets(assetRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchData();
  }, [id, token]);

  if (loading) return <div className="p-10 text-center">Loading Company Profile...</div>;

  return (
    <div className="space-y-8">
      {/* Company Header Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900">{company?.name}</h1>
            {/* <p className="text-slate-500 font-medium">Customer ID: {company?._id.slice(-6).toUpperCase()}</p> */}
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400" /> {company?.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" /> {company?.phone}
            </div>
          </div>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800"
        >
          <Plus size={20} /> Add New Asset
        </button>
        
      </div>

      {/* Asset List Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <HardDrive size={20} className="text-slate-400" />
          <h2 className="text-xl font-bold text-slate-800">Inventory List</h2>
          <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
            {assets.length} items
          </span>
        </div>
        
        {/* <AssetTable assets={assets} loading={loading} /> */}

        <AssetTable 
        assets={assets} 
        loading={loading} 
        isStaffView={true} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        companyId={id} 
        refreshData={fetchData} 
        editingAsset={editingAsset}
      />

      </div>
    </div>
  );
};

export default CompanyDetail;