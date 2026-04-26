import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(devtools((set) => ({
  user: null, // This holds either the Staff object or the Company object
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null, // 'staff' or 'company'
  isAuthenticated: !!localStorage.getItem('token'),

  setAuth: (user, token, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    set({ user, token, userType: type, isAuthenticated: true });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, userType: null, isAuthenticated: false });
  },
})));