

import React, { useState } from 'react';

const HelpSupportTab = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    { q: "What is the Staffly HRMS Dashboard?", a: "The Staffly App dashboard is an HR management platform designed to simplify employee administration processes, including attendance, leave requests, payroll, performance evaluation, and employee data — all in one integrated system." },
    { q: "How do I update the official company hours?", a: "Go to the 'Access' tab from settings, adjust the standard start and end times, and then press 'Save Access Policies'." },
    { q: "How do I calculate monthly attendance penalties?", a: "The system automates penalty deductions based on the 'Grace Period' and 'Deduction Multiplier' numbers specified in your Access panel settings." }
  ];

  return (
    <div className="space-y-6" style={{ color: 'var(--text-main)' }}>
      {/* FAQ Section */}
      <div 
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} 
        className="border rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-base font-bold mb-6" style={{ color: 'var(--text-main)' }}>
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ borderBottom: index !== faqs.length - 1 ? '1px solid var(--border-main)' : 'none' }} 
              className="pb-4"
            >
              <button 
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-2 font-bold text-sm hover:text-blue-500 transition-colors"
                style={{ color: openFAQ === index ? '#3b82f6' : 'var(--text-main)' }}
              >
                <span>{faq.q}</span>
                <span className="text-xl font-light">{openFAQ === index ? '−' : '+'}</span>
              </button>
              
              {openFAQ === index && (
                <div 
                  style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-muted)' }} 
                  className="text-xs mt-3 leading-relaxed p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SupportCard 
          icon="📞" 
          title="Call Us" 
          desc="Need immediate help? Speak directly with support." 
        />
        <SupportCard 
          icon="💬" 
          title="Chat Support" 
          desc="Chat live with our technical support agents." 
        />
        <SupportCard 
          icon="✉️" 
          title="Email Us" 
          desc="Drop us an official ticket or a feedback inquiry." 
        />
      </div>
    </div>
  );
};

const SupportCard = ({ icon, title, desc }) => (
  <div 
    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} 
    className="border rounded-2xl p-6 text-center flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{title}</h4>
    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
  </div>
);

export default HelpSupportTab;