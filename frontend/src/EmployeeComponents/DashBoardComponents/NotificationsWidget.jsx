


import React from 'react';
import { Bell, Megaphone, CheckCircle2, Calendar } from 'lucide-react';

const NotificationsWidget = () => {
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