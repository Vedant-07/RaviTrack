import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Building2, Plus, Edit3, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import CompanyModal from '@/components/company/CompanyModal';


const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuthStore();

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:3000/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL: Deleting a company will remove ALL associated assets and service logs. Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) { alert("Delete failed"); }
  };

  const openAddModal = () => { setEditingCompany(null); setIsModalOpen(true); };
  const openEditModal = (company) => { setEditingCompany(company); setIsModalOpen(true); };

  const filtered = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Companies</h1>
          <p className="text-slate-500 text-sm">Create, edit, or remove client organizations.</p>
        </div>
        <button onClick={openAddModal} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md">
          <Plus size={18} /> Add Company
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Filter by name..." 
          className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => (
          <div key={company._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(company)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(company._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{company.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Key: <span className="text-blue-600 font-mono tracking-normal">{company.secretKey}</span>
            </div>

            <div className="space-y-2 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-300" /> {company.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-300" /> {company.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-300" /> 
                <span className="truncate">{company.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshData={fetchCompanies} editingCompany={editingCompany} />
    </div>
  );
};

export default ManageCompanies;