import React, { useState } from 'react';
import axios from 'axios';
import { Building2, MapPin, Phone, Mail, UserCheck } from 'lucide-react';

const AddCompanyPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', isIndividual: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/companies', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Company Created! Secret Key: ${res.data.secretKey}`);
      setFormData({ name: '', email: '', phone: '', address: '', isIndividual: false });
    } catch (err) {
      alert("Error creating company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Register New Company</h1>
        <p className="text-slate-500">Add a client organization to the RaviTrack network.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Building2 size={16}/> Company Name</label>
            <input required className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              placeholder="e.g. Apex Heart Hospital" onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
          </div>
          
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={16}/> Contact Email</label>
            <input type="email" required className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              placeholder="it@apex.com" onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={16}/> Phone Number</label>
            <input required className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              placeholder="+91..." onChange={e => setFormData({...formData, phone: e.target.value})} value={formData.phone} />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16}/> Office Address</label>
          <textarea required className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            placeholder="Complete address for AMC visits..." onChange={e => setFormData({...formData, address: e.target.value})} value={formData.address} />
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <input type="checkbox" id="individual" className="w-5 h-5 accent-slate-900" 
            onChange={e => setFormData({...formData, isIndividual: e.target.checked})} checked={formData.isIndividual} />
          <label htmlFor="individual" className="text-sm font-medium text-slate-700">This is an individual client (not a company)</label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
          {loading ? 'Generating Secret Key...' : 'Create Company & Generate Key'}
        </button>
      </form>
    </div>
  );
};

export default AddCompanyPage;