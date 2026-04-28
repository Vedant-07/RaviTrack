import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const CompanyModal = ({ isOpen, onClose, refreshData, editingCompany = null }) => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', isIndividual: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCompany) {
      setFormData(editingCompany);
    } else {
      setFormData({ name: '', email: '', phone: '', address: '', isIndividual: false });
    }
  }, [editingCompany, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingCompany) {
        await axios.put(`http://localhost:3000/companies/${editingCompany._id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/companies', formData, config);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert("Error saving company data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{editingCompany ? 'Update Company' : 'Register New Company'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Building2 size={14}/> Company Name</label>
            <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Mail size={14}/> Email</label>
              <input type="email" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Phone size={14}/> Phone</label>
              <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><MapPin size={14}/> Address</label>
            <textarea required rows="2" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <input type="checkbox" id="isInd" className="w-4 h-4 accent-slate-900" checked={formData.isIndividual}
              onChange={e => setFormData({...formData, isIndividual: e.target.checked})} />
            <label htmlFor="isInd" className="text-sm font-medium text-slate-600">This is an individual client</label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50">
            {loading ? 'Processing...' : editingCompany ? 'Update Company' : 'Create Company'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;