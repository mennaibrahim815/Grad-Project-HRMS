import React from 'react';
import { Bell, Megaphone, CheckCircle2, Calendar } from 'lucide-react';

const NotificationsWidget = () => {
  // داتا وهمية لأنها غالباً ثابتة أو بتيجي من إندبوينت منفصل
  const notifications = [
    { id: 1, title: 'Company Announcement', desc: 'The annual retreat schedule has been published.', time: '2 hours ago', icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 2, title: 'WFH Request Approved', desc: 'Your request for Work from home has been approved.', time: 'Yesterday', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 3, title: 'Team Meeting', desc: 'Weekly sync starts in 30 minutes in Room A.', time: 'Oct 23, 2024', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="bg-[#1a1c26] p-6 rounded-2xl border border-gray-800/50 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-lg">Latest Notifications</h3>
        <Bell size={18} className="text-gray-500" />
      </div>

      <div className="space-y-6">
        {notifications.map((note) => (
          <div key={note.id} className="flex gap-4 group cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${note.bg} transition-transform group-hover:scale-110`}>
              <note.icon size={18} className={note.color} />
            </div>
            <div className="space-y-1">
              <h4 className="text-gray-100 text-sm font-medium">{note.title}</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">{note.desc}</p>
              <p className="text-gray-600 text-[10px]">{note.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsWidget;