import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompanyLoginPage from './pages/company/CompanyLoginPage';
import PublicRoute from './components/PublicRoute';
import StaffLoginPage from './pages/staff/StaffLoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import CompanyDashboard from './pages/company/CompanyDashboard';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import { useAuthStore } from './store/useAuthStore';
import axios from 'axios';
import { BACKEND_API_URL } from './utils/api';

function App() {

  const { setAuth, logout } = useAuthStore();
  useEffect(() => {
    const verifySession = async () => {
      let token=localStorage.getItem("token")
      let userType=localStorage.getItem("userType")

      if (token && userType) {
        try {
          let res=null

          if(userType==='staff'){
            
            res = await axios.get(`${BACKEND_API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          }
          else if(userType==='company'){
            
            res = await axios.get(`${BACKEND_API_URL}/companies/portal/me`, {
            headers: { Authorization: `Bearer ${token}` }
            })
          }
          // Update the store with fresh data
          //const userType = localStorage.getItem('userType');
          //TODO:check when the token becomes invalid
          
          setAuth(res.data, token, userType);
        } catch (err) {
          // If token is expired or invalid, kick them out
          console.error("Session expired");
          logout();
        }
      }
    };
    verifySession();
  }, []); // Run once on startup

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="grow">
          <Routes>
  {/* Public Paths */}
  <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
  <Route path="/staff-login" element={<PublicRoute><StaffLoginPage /></PublicRoute>} />
  <Route path="/company-login" element={<PublicRoute><CompanyLoginPage /></PublicRoute>} />

  {/* Company Specific Dashboard */}
  <Route path="/company-dashboard" element={
    <ProtectedRoute allowedType="company">
      <CompanyDashboard />
    </ProtectedRoute>
  } />


  {/* Internal Team Dashboard (Admin & Staff) */}
  <Route path="/dashboard/*" element={
    <ProtectedRoute allowedType="staff">
      <DashboardLayout />
    </ProtectedRoute>
  } />
  

</Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App