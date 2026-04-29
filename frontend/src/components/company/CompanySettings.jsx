import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { RefreshCw, ShieldCheck, KeyRound } from 'lucide-react';

const CompanySettings = () => {
  const { user, token, setAuth } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleResetKey = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will change your company's Secret Access Key immediately. You will need the NEW key for future logins."
    );

    if (!confirmed) return;

    setIsUpdating(true);
    try {
      // API call to the reset-key route
      const res = await axios.put('http://localhost:3000/companies/reset-key', {
        "email":user?.email,
        "currentSecretKey":user?.secretKey
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the user state with the new key so it shows on UI
      const updatedUser = { ...user, secretKey: res.data.newSecretKey };
      setAuth(updatedUser, token, 'company');
      
      alert(`Success! Your new Secret Key is: ${res.data.newSecretKey}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset key. Please contact Ravi Infotech.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Access Key Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <KeyRound className="text-blue-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Security Credentials</h2>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Encrypted</span>
        </div>

        <div className="p-8">
          <p className="text-sm text-slate-500 mb-6">
            The Secret Key is your organization's primary access credential. If you suspect it has been compromised, reset it immediately.
          </p>

          <div className="flex items-center gap-6 p-6 bg-slate-900 rounded-2xl text-white mb-8">
            <div className="grow">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Secret Key</p>
              <p className="text-3xl font-mono font-black tracking-[0.2em]">{user?.secretKey}</p>
            </div>
            <button 
              onClick={handleResetKey}
              disabled={isUpdating}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
              title="Reset Key"
            >
              <RefreshCw className={isUpdating ? 'animate-spin' : ''} size={24} />
            </button>
          </div>

          <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Security Tip:</strong> Avoid sharing this key over insecure channels like WhatsApp,Telegram or plain email. Treat it like a password.
            </p>
          </div>
        </div>
      </div>
      
      {/* Support Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center">
        <div>
          <p className="font-bold text-slate-800">Need to update company details?</p>
          <p className="text-sm text-slate-500">Address or contact changes must be requested through Ravi Infotech.</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:underline">Contact Admin</button>
      </div>
    </div>
  );
};

export default CompanySettings;