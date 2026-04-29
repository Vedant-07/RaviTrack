import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, UserCog, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4 text-blue-600">
          <ShieldCheck size={64} />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Ravi<span className="text-blue-600">Track</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-lg mx-auto">
          The Asset Management & AMC tracking platform for Ravi Infotech and its partners.
        </p>
      </div>

      {/* Choice Grid */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Option 1: Company/Client */}
        <div 
          onClick={() => navigate('/company-login') } 
          className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300"
        >
          <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Building2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">For Companies</h2>
          <p className="text-slate-500 mb-6">
            View your hardware inventory, check AMC status, and request service callbacks.
          </p>
          <div className="flex items-center text-blue-600 font-semibold">
            Client Portal <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 2: Ravi Infotech Staff */}
        <div 
          onClick={() => navigate('/staff-login')}
          className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all duration-300"
        >
          <div className="bg-slate-100 w-14 h-14 rounded-lg flex items-center justify-center text-slate-800 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <UserCog size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Staff & Admin</h2>
          <p className="text-slate-500 mb-6">
            Manage client assets, generate secret keys, and track service logs for the entire network.
          </p>
          <div className="flex items-center text-slate-900 font-semibold">
            Internal Access <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      <footer className="mt-20 text-slate-400 text-sm italic">
        Powered by Ravi Infotech Technical Services
      </footer>
    </div>
  );
};

export default Landing;
