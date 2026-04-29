import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { UserPlus, Shield, Mail, Edit3, Trash2, Phone } from 'lucide-react';
import UserModal from '../../components/UserModal';

const ManageStaff = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { token, user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return alert("You cannot delete yourself!");
    if (!window.confirm("Remove this member from Ravi Infotech?")) return;
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) { alert("Delete failed"); }
  };

  const openAddModal = () => { setEditingUser(null); setIsModalOpen(true); };
  const openEditModal = (user) => { setEditingUser(user); setIsModalOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <button 
          onClick={openAddModal} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined On</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/50 group transition-colors">
                {/* Enhanced Member Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Modern Avatar */}
                    <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info Block */}
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        {u.name} 
                        {u._id === currentUser?._id && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">You</span>
                        )}
                      </p>
                      
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={12} className="text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        
                        {u.phone && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={12} className="text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role Column */}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role}
                  </span>
                </td>

                {/* Joined Date Column */}
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(u)} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(u._id)} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshData={fetchUsers} 
        editingUser={editingUser} 
      />
    </div>
  );
};

export default ManageStaff;