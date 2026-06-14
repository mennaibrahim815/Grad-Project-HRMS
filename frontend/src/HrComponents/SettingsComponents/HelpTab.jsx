// import React, { useState } from 'react';

// const HelpTab = () => {
//   const faqs = [
//     { q: "What is the Staffly App Dashboard?", a: "Staffly is an integrated HR management platform designed to simplify employee processes like attendance, payroll, and more." },
//     { q: "How do I log in to the Staffly Dashboard?", a: "Use your registered HR email and password provided by the system administrator." },
//     { q: "Can I import employee data in bulk?", a: "Yes, you can use the import tool in the Employees section to upload CSV/Excel files." }
//   ];

//   return (
//     <div className="space-y-12">
//       <section>
//         <h3 className="text-xl font-bold text-white mb-8">Frequently Asked Questions</h3>
//         <div className="space-y-4">
//           {faqs.map((f, i) => (
//             <details key={i} className="group bg-[#0b141a] rounded-2xl border border-gray-800/50 overflow-hidden transition-all">
//               <summary className="p-5 flex justify-between items-center cursor-pointer font-bold text-sm text-gray-200">
//                 {f.q}
//                 <i className="fas fa-plus group-open:rotate-45 transition-transform text-gray-600 text-xs"></i>
//               </summary>
//               <p className="px-5 pb-5 text-xs text-gray-500 leading-relaxed font-medium">{f.a}</p>
//             </details>
//           ))}
//         </div>
//       </section>

//       <section>
//         <h3 className="text-lg font-bold text-gray-200 mb-8">Can't find what you're looking for?</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//            <ContactCard icon="fas fa-phone-alt" title="Call us" desc="Need assistance? Call our support 24/7." color="blue" />
//            <ContactCard icon="fas fa-comment-dots" title="Chat us" desc="Talk with our team in real-time." color="green" />
//            <ContactCard icon="fas fa-envelope" title="Mail us" desc="Reach us via support@staffly.com." color="orange" />
//         </div>
//       </section>
//     </div>
//   );
// };

// const ContactCard = ({ icon, title, desc, color }) => (
//   <div className="bg-[#0b141a] p-6 rounded-[2rem] border border-gray-800/40 text-center hover:border-blue-500/30 transition-all group cursor-pointer">
//     <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-lg mb-4 
//       ${color === 'blue' ? 'bg-blue-500/10 text-blue-400' : color === 'green' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
//       <i className={icon}></i>
//     </div>
//     <h5 className="font-bold text-white mb-2">{title}</h5>
//     <p className="text-[10px] text-gray-600 font-medium leading-relaxed">{desc}</p>
//   </div>
// );

// export default HelpTab;



import React, { useState } from 'react';

const HelpSupportTab = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    { q: "What is the Staffly HRMS Dashboard?", a: "The Staffly App dashboard is an HR management platform designed to simplify employee administration processes, including attendance, leave requests, payroll, performance evaluation, and employee data — all in one integrated system." },
    { q: "How do I update the official company hours?", a: "Go to the 'Access' tab from settings, adjust the standard start and end times, and then press 'Save Access Policies'." },
    { q: "How do I calculate monthly attendance penalties?", a: "The system automates penalty deductions based on the 'Grace Period' and 'Deduction Multiplier' numbers specified in your Access panel settings." }
  ];

  return (
    <div className="space-y-6 text-slate-300">
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Frequently Asked Questions</h3>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-800/60 pb-3">
              <button 
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-2 font-medium text-sm text-white hover:text-blue-400 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-lg">{openFAQ === index ? '−' : '+'}</span>
              </button>
              {openFAQ === index && (
                <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-[#15232d] p-3 rounded-xl animate-fade-in">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111c24] border border-slate-800/60 rounded-xl p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">📞</div>
          <h4 className="text-sm font-semibold text-white">Call Us</h4>
          <p className="text-xs text-slate-500">Need immediate help? Speak directly with support.</p>
        </div>
        <div className="bg-[#111c24] border border-slate-800/60 rounded-xl p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">💬</div>
          <h4 className="text-sm font-semibold text-white">Chat Support</h4>
          <p className="text-xs text-slate-500">Chat live with our technical support agents.</p>
        </div>
        <div className="bg-[#111c24] border border-slate-800/60 rounded-xl p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">✉️</div>
          <h4 className="text-sm font-semibold text-white">Email Us</h4>
          <p className="text-xs text-slate-500">Drop us an official ticket or a feedback inquiry.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportTab;