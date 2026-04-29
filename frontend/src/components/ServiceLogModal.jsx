
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_API_URL } from '../utils/api';
import { X, MessageSquare, Wrench, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ServiceLogModal = ({ isOpen, onClose, assetId, refreshData, editingLog = null }) => {
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({ issueDescription: '', actionTaken: '' });
  const [loading, setLoading] = useState(false);

  // When the modal opens, check if we are editing an existing log
  useEffect(() => {
    if (editingLog) {
      setFormData({
        issueDescription: editingLog.issueDescription,
        actionTaken: editingLog.actionTaken
      });
    } else {
      setFormData({ issueDescription: '', actionTaken: '' });
    }
  }, [editingLog, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingLog) {
        // UPDATE Logic
        await axios.put(`${BACKEND_API_URL}/service-logs/${editingLog._id}`, formData, config);
      } else {
        // CREATE Logic
        await axios.post(`${BACKEND_API_URL}/service-logs`, {
          ...formData,
          assetId,
          technicianName: user.name
        }, config);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert("Error saving log entry");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">
            {editingLog ? 'Update Service Record' : 'Add Service Log'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
              <MessageSquare size={14}/> Reported Issue
            </label>
            <textarea 
              required
              rows="2"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
              value={formData.issueDescription}
              onChange={e => setFormData({...formData, issueDescription: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
              <Wrench size={14}/> Resolution / Action Taken
            </label>
            <textarea 
              required
              rows="3"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
              value={formData.actionTaken}
              onChange={e => setFormData({...formData, actionTaken: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : editingLog ? 'Update Entry' : 'Post to History'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceLogModal;