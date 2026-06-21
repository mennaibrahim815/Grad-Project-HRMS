
import React from 'react';

const LegalAppTab = () => {
  return (
    <div 
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} 
      className="space-y-6 border rounded-2xl p-6 shadow-sm"
    >
      <div>
        <h3 style={{ color: 'var(--text-main)' }} className="text-base font-bold mb-5">
          App Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              App Name
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">Staffly HRMS Dashboard</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Version
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">1.0.0 (Build 2026)</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Platform
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">Dashboard & Admin Panel</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Release Date
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">20 October, 2026</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-main)' }} className="my-6 opacity-50" />

      <div>
        <h3 style={{ color: 'var(--text-main)' }} className="text-base font-bold mb-3">
          Privacy Policy
        </h3>
        <p style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed mb-6 font-medium">
          Welcome to Staffly Dashboard App. Your enterprise security is highly important to us, and this policy outlines how we handle, process, and protect your cloud database assets.
        </p>
        
        <h4 style={{ color: 'var(--text-main)' }} className="text-xs font-bold mb-3 uppercase tracking-widest">
          Information We Collect
        </h4>
        <ul style={{ color: 'var(--text-muted)' }} className="list-disc list-inside text-xs space-y-2 font-medium">
          <li>Corporate credentials and legal enterprise registry contact profiles.</li>
          <li>Hardware IoT identities (RFID, ESP32 attendance tracking logs).</li>
          <li>Employee biometric metrics, shift check-ins, and geo-location hashes.</li>
        </ul>
      </div>
    </div>
  );
};

export default LegalAppTab;