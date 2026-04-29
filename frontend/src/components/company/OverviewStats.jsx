import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { 
  LayoutDashboard, 
  HardDrive, 
  Settings, 
  PhoneCall, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

export const OverviewStats = ({ assets }) => {
  const [callbackLoading, setCallbackLoading] = useState(false);
  const { user, token } = useAuthStore();
  
  const expiringAMC = assets.filter(a => {
    if (!a.amcExpiryDate) return false;
    const days = (new Date(a.amcExpiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days > 0 && days < 30;
  }).length;

  const handleRequestCallback = async () => {
    setCallbackLoading(true);
    try {
      await axios.post(`http://localhost:3000/companies/${user._id}/request-callback`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Callback requested successfully. Our team will contact you soon.');
    } catch (err) {
      console.error("Error requesting callback", err);
      alert('Failed to request callback. Please try again later.');
    } finally {
      setCallbackLoading(false);
      window.location.reload()
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Assets</p>
        <h3 className="text-4xl font-black text-slate-900 mt-2">{assets.length}</h3>
      </div>
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex justify-between items-start text-orange-600">
          <p className="text-sm font-bold uppercase tracking-wider">AMC Expiring Soon</p>
          <AlertCircle size={20} />
        </div>
        <h3 className="text-4xl font-black text-orange-700 mt-2">{expiringAMC}</h3>
      </div>
      <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 flex flex-col justify-center">
        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Need Support?</p>
        <button className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
        onClick={handleRequestCallback} disabled={callbackLoading || (user?.callbackRequested)}>

          {
            user?.callbackRequested ? ("Replying shortly") : ( <div className='flex gap-0.5 items-center justify-center '>
              <PhoneCall size={18} />{callbackLoading ? 'Requesting...' : 'Request Callback'}
            </div> )
          }
          
        </button>
      </div>
    </div>
  );
};