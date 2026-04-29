import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_API_URL } from '../../utils/api';
import { X, HardDrive, Hash, ShieldCheck, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AssetModal = ({ isOpen, onClose, companyId, refreshData, editingAsset = null }) => {
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    category: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    amcExpiryDate: '',
    avExpiryDate: '',
    status: 'Active'
  });

  // If editing, fill the form with existing data
  useEffect(() => {
    if (editingAsset) {
      setFormData({
        ...editingAsset,
        amcExpiryDate: editingAsset.amcExpiryDate ? editingAsset.amcExpiryDate.split('T')[0] : '',
        avExpiryDate: editingAsset.avExpiryDate ? editingAsset.avExpiryDate.split('T')[0] : '',
      });
    } else {
      setFormData({ category: 'Laptop', brand: '', model: '', serialNumber: '', amcExpiryDate: '', avExpiryDate: '', status: 'Active' });
    }
  }, [editingAsset, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const payload = { ...formData, companyId, lastModifiedBy: user.name };

    try {
      if (editingAsset) {
        await axios.put(`${BACKEND_API_URL}/assets/${editingAsset._id}`, payload, config);
      } else {
        await axios.post(`${BACKEND_API_URL}/assets`, payload, config);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving asset");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{editingAsset ? 'Update Asset' : 'Register New Asset'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
              <select 
                className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Server">Server</option>
                <option value="UPS">UPS</option>
                <option value="Printer">Printer</option>
                <option value="Networking">Networking (Switch/Router)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
              <input required className="w-full mt-1 p-3 border rounded-xl" placeholder="e.g. Dell" 
                value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Model</label>
              <input required className="w-full mt-1 p-3 border rounded-xl" placeholder="e.g. Latitude 5420" 
                value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Hash size={14}/> Serial Number</label>
            <input required className="w-full mt-1 p-3 border rounded-xl font-mono" placeholder="SN-XXXXX" 
              value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div>
              <label className="text-xs font-bold text-blue-900 flex items-center gap-2"><Calendar size={14}/> AMC Expiry</label>
              <input type="date" className="w-full mt-1 p-2 border border-blue-200 rounded-lg text-sm" 
                value={formData.amcExpiryDate} onChange={e => setFormData({...formData, amcExpiryDate: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-blue-900 flex items-center gap-2"><ShieldCheck size={14}/> AV Expiry</label>
              <input type="date" className="w-full mt-1 p-2 border border-blue-200 rounded-lg text-sm" 
                value={formData.avExpiryDate} onChange={e => setFormData({...formData, avExpiryDate: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
            {editingAsset ? 'Save Changes' : 'Register Asset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;