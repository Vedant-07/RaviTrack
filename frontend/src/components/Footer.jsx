import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Ravi Infotech Technical Services. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;