import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Building2, KeyRound, Mail } from 'lucide-react';
import axios from 'axios';

const CompanyLoginPage = () => {
  const [email, setEmail] = useState('bankers@gmail.com');
  const [secretKey, setSecretKey] = useState('ZZ52TY');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Endpoint to login directly as a Company entity

      const res = await axios.post('http://localhost:3000/companies/portal-login', { email, secretKey });
      setAuth(res.data, res.data.token, 'company');
      navigate('/company-dashboard');
    } catch (err) {
      alert("Invalid Company Credentials or Secret Key");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl">
        <div className="flex justify-center mb-4 text-blue-600"><Building2 size={48} /></div>
        <h2 className="text-2xl font-bold text-center text-slate-800">Company Portal</h2>
        <p className="text-center text-slate-500 mb-8">Access your organization's assets</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={16}/> Registered Email</label>
            <input type="email" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="it@apex-hospital.com" onChange={e => setEmail(e.target.value)}  value={email}/>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><KeyRound size={16}/> Secret Access Key</label>
            <input type="text" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest" 
              placeholder="RAVI-XXXX" onChange={e => setSecretKey(e.target.value.toUpperCase())} value={secretKey}/>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
            View Assets
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyLoginPage;