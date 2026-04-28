import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Mail, Shield, Lock,Phone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const UserModal = ({ isOpen, onClose, refreshData, editingUser = null }) => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff',phone:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({ name: editingUser.name, email: editingUser.email, role: editingUser.role, password: '',phone:editingUser.phone||'' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'staff' ,phone:''});
    }
  }, [editingUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingUser) {
        // If password is empty, don't send it to backend
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await axios.put(`http://localhost:3000/users/${editingUser._id}`, updateData, config);
      } else {
        await axios.post('http://localhost:3000/users/register', formData, config);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{editingUser ? 'Edit Team Member' : 'Add New Staff'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><User size={14}/> Full Name</label>
            <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Mail size={14}/> Email Address</label>
            <input type="email" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1">
              <Lock size={14}/> {editingUser ? 'New Password (Optional)' : 'Password'}
            </label>
            <input type="password" required={!editingUser} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Phone size={14}/> Phone</label>
              <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1"><Shield size={14}/> System Role</label>
            <select className="w-full p-3 border rounded-xl bg-slate-50 outline-none" value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="staff">Staff (Service Engineer)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50">
            {loading ? 'Saving...' : editingUser ? 'Update Member' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;