import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, User, Lock } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companySecretKey: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/register', { ...formData, role: 'client' });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your Secret Key.');
    }
  };

  return (
    <div className="min-h-[calc(100-128px)] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Join Your Company</h2>
        <p className="text-slate-500 text-center mb-8">Enter your details and Company Secret Key to begin.</p>

        {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input 
              required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all border-slate-200"
              placeholder="John Doe"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail size={16} /> Work Email
            </label>
            <input 
              type="email" required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all border-slate-200"
              placeholder="name@hospital.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Lock size={16} /> Create Password
            </label>
            <input 
              type="password" required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all border-slate-200"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <KeyRound size={16} /> Company Secret Key
            </label>
            <input 
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all border-blue-200 uppercase"
              placeholder="e.g. RAVI-99"
              onChange={(e) => setFormData({...formData, companySecretKey: e.target.value})}
            />
            <p className="text-xs text-blue-600 mt-2">Ask your administrator for your organization's unique key.</p>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;