import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserCog, Lock, Mail } from 'lucide-react';
import axios from 'axios';

const StaffLoginPage = () => {
  const [email, setEmail] = useState('admin@raviinfotech.com');
  const [password, setPassword] = useState('123');
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // // Auto-redirect if already logged in
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(user?.role === 'client' ? '/client-dashboard' : '/admin-dashboard');
  //   }
  // }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users/login', { email, password });
      console.log(res.data)

      setAuth(res.data, res.data.token,"staff");

      navigate('/dashboard');
    } catch (err) {
      alert("Invalid Staff Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6 text-slate-900">
          <UserCog size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800">Staff Portal</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Internal Access Only</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><Mail size={16}/> Email</label>
            <input type="email" required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-900" 
              onChange={e => setEmail(e.target.value)}  value={email}/>
          </div>
          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><Lock size={16}/> Password</label>
            <input type="password" required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-900" 
              onChange={e => setPassword(e.target.value)} value={password}/>
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all">
            Login to Console
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLoginPage;