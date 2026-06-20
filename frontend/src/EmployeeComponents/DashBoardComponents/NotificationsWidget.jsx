// import React from 'react';
// import { Bell, Megaphone, CheckCircle2, Calendar } from 'lucide-react';

// const NotificationsWidget = () => {
//   // داتا وهمية لأنها غالباً ثابتة أو بتيجي من إندبوينت منفصل
//   const notifications = [
//     { id: 1, title: 'Company Announcement', desc: 'The annual retreat schedule has been published.', time: '2 hours ago', icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-400/10' },
//     { id: 2, title: 'WFH Request Approved', desc: 'Your request for Work from home has been approved.', time: 'Yesterday', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
//     { id: 3, title: 'Team Meeting', desc: 'Weekly sync starts in 30 minutes in Room A.', time: 'Oct 23, 2024', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
//   ];

//   return (
//     <div className="bg-[#1a1c26] p-6 rounded-2xl border border-gray-800/50 ">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-white font-bold text-lg">Latest Notifications</h3>
//         <Bell size={18} className="text-gray-500" />
//       </div>

//       <div className="space-y-6">
//         {notifications.map((note) => (
//           <div key={note.id} className="flex gap-4 group cursor-pointer">
//             <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${note.bg} transition-transform group-hover:scale-110`}>
//               <note.icon size={18} className={note.color} />
//             </div>
//             <div className="space-y-1">
//               <h4 className="text-gray-100 text-sm font-medium">{note.title}</h4>
//               <p className="text-gray-500 text-[11px] leading-relaxed">{note.desc}</p>
//               <p className="text-gray-600 text-[10px]">{note.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationsWidget;



// import React from 'react';
// import { Bell, Megaphone, CheckCircle2, Calendar } from 'lucide-react';

// const NotificationsWidget = () => {
//   // تحديث الداتا لتستخدم متغيرات الألوان المركزية (CSS Variables) لضمان التوافق مع الثيمين
//   const notifications = [
//     { 
//       id: 1, 
//       title: 'Company Announcement', 
//       desc: 'The annual retreat schedule has been published.', 
//       time: '2 hours ago', 
//       icon: Megaphone, 
//       color: 'var(--pill-blue-text)', 
//       bg: 'var(--pill-blue-bg)' 
//     },
//     { 
//       id: 2, 
//       title: 'WFH Request Approved', 
//       desc: 'Your request for Work from home has been approved.', 
//       time: 'Yesterday', 
//       icon: CheckCircle2, 
//       color: 'var(--pill-green-text)', 
//       bg: 'var(--pill-green-bg)' 
//     },
//     { 
//       id: 3, 
//       title: 'Team Meeting', 
//       desc: 'Weekly sync starts in 30 minutes in Room A.', 
//       time: 'Oct 23, 2024', 
//       icon: Calendar, 
//       color: 'var(--icon-pink-color)', 
//       bg: 'var(--icon-pink-bg)' 
//     },
//   ];

//   return (
//     <div 
//       style={{ backgroundColor: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)var(--bg-card)', borderColor: 'var(--border-main)' }}
//       className="p-6 rounded-2xl border shadow-sm transition-colors duration-300"
//     >
//       <div className="flex justify-between items-center mb-8">
//         <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-lg tracking-tight">
//           Latest Notifications
//         </h3>
//         <Bell size={18} style={{ color: 'var(--text-muted)' }} className="opacity-50" />
//       </div>

//       <div className="space-y-6">
//         {notifications.map((note) => (
//           <div key={note.id} className="flex gap-4 group cursor-pointer">
//             {/* حاوية الأيقونة تستخدم الخلفية المتغيرة */}
//             <div 
//               style={{ backgroundColor: note.bg }}
//               className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
//             >
//               <note.icon size={18} style={{ color: note.color }} />
//             </div>
            
//             <div className="space-y-1 flex-1">
//               <h4 style={{ color: 'var(--text-main)' }} className="text-sm font-bold tracking-tight">
//                 {note.title}
//               </h4>
//               <p style={{ color: 'var(--text-muted)' }} className="text-[11px] font-medium leading-relaxed opacity-80">
//                 {note.desc}
//               </p>
//               <p style={{ color: 'var(--text-muted)' }} className="text-[10px] font-bold uppercase tracking-wider opacity-50">
//                 {note.time}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {notifications.length === 0 && (
//         <div className="text-center py-10 opacity-30">
//           <p style={{ color: 'var(--text-muted)' }} className="text-xs font-bold uppercase tracking-widest">
//             No new notifications
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsWidget;



import React from 'react';
import { Bell, Megaphone, CheckCircle2, Calendar } from 'lucide-react';

const NotificationsWidget = () => {
  // استخدام متغيرات الألوان المركزية (CSS Variables) لضمان التوافق مع الثيمين
  const notifications = [
    { 
      id: 1, 
      title: 'Company Announcement', 
      desc: 'The annual retreat schedule has been published.', 
      time: '2 hours ago', 
      icon: Megaphone, 
      color: 'var(--pill-blue-text)', 
      bg: 'var(--pill-blue-bg)' 
    },
    { 
      id: 2, 
      title: 'WFH Request Approved', 
      desc: 'Your request for Work from home has been approved.', 
      time: 'Yesterday', 
      icon: CheckCircle2, 
      color: 'var(--pill-green-text)', 
      bg: 'var(--pill-green-bg)' 
    },
    { 
      id: 3, 
      title: 'Team Meeting', 
      desc: 'Weekly sync starts in 30 minutes in Room A.', 
      time: 'Oct 23, 2024', 
      icon: Calendar, 
      color: 'var(--icon-pink-color)', 
      bg: 'var(--icon-pink-bg)' 
    },
  ];

  // ستايل الكارت الموحد (الجرادينت الفخم)
  const luxuryCardStyle = {
    background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
    borderColor: 'var(--card-border)'
  };

  return (
    <div 
      style={luxuryCardStyle}
      className="p-6 rounded-[2rem] border shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 style={{ color: 'var(--text-main)' }} className="font-black text-lg uppercase tracking-widest">
          Latest Notifications
        </h3>
        <div style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--card-border)' }} className="p-2 rounded-xl border shadow-inner">
           <Bell size={18} style={{ color: 'var(--text-muted)' }} className="opacity-70" />
        </div>
      </div>

      <div className="space-y-8">
        {notifications.map((note) => (
          <div key={note.id} className="flex gap-4 group cursor-pointer transition-all">
            {/* حاوية الأيقونة تستخدم الخلفية المتغيرة */}
            <div 
              style={{ backgroundColor: note.bg, borderColor: 'var(--card-border)' }}
              className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3"
            >
              <note.icon size={20} style={{ color: note.color }} />
            </div>
            
            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 style={{ color: 'var(--text-main)' }} className="text-sm font-black tracking-tight leading-snug group-hover:text-blue-500 transition-colors">
                {note.title}
              </h4>
              <p style={{ color: 'var(--text-muted)' }} className="text-[11px] font-bold leading-relaxed opacity-60 line-clamp-2 italic">
                {note.desc}
              </p>
              <div className="flex items-center gap-2 pt-1">
                 <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                 <p style={{ color: 'var(--text-muted)' }} className="text-[9px] font-black uppercase tracking-widest opacity-40">
                   {note.time}
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {notifications.length === 0 && (
        <div className="text-center py-16 opacity-30 flex flex-col items-center gap-3">
          <Bell size={40} className="opacity-20" />
          <p style={{ color: 'var(--text-muted)' }} className="text-xs font-black uppercase tracking-[0.3em]">
            All caught up
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsWidget;