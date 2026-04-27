
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        await axios.put(`http://localhost:3000/service-logs/${editingLog._id}`, formData, config);
      } else {
        // CREATE Logic
        await axios.post('http://localhost:3000/service-logs', {
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

// import React, { useState } from 'react';
// import axios from 'axios';
// import { X, MessageSquare,Wrench } from 'lucide-react';
// import { useAuthStore } from '../store/useAuthStore';

// const AddLogModal = ({ isOpen, onClose, assetId, refreshData }) => {
//   const { user, token } = useAuthStore();
//   const [formData, setFormData] = useState({ issueDescription: '', actionTaken: '' });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post('http://localhost:3000/service-logs', {
//         ...formData,
//         assetId,
//         technicianName: user.name // Automatically credit the logged-in staff
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       refreshData();
//       onClose();
//       setFormData({ issueDescription: '', actionTaken: '' });
//     } catch (err) {
//       alert("Error saving log");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//           <h2 className="text-xl font-bold text-slate-900">Add Service Log</h2>
//           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-5">
//           <div>
//             <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
//               <MessageSquare size={14}/> Reported Issue
//             </label>
//             <textarea 
//               required
//               rows="2"
//               className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
//               placeholder="e.g. System crashing during heavy use..."
//               onChange={e => setFormData({...formData, issueDescription: e.target.value})}
//             />
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
//               <Wrench size={14}/> Resolution / Action Taken
//             </label>
//             <textarea 
//               required
//               rows="3"
//               className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
//               placeholder="e.g. Cleaned dust from CPU fan and replaced thermal paste..."
//               onChange={e => setFormData({...formData, actionTaken: e.target.value})}
//             />
//           </div>

//           <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
//              <User size={14} /> <span className="text-[10px] font-bold uppercase">Log signed by: {user.name}</span>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
//           >
//             {loading ? 'Saving Entry...' : 'Post to History'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddLogModal;