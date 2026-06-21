


import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';

const MyTasksSidebar = ({ projects, loading }) => {
  if (loading) return (
    <div className="text-center py-10">
      <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading tasks...</div>
    </div>
  );

  // ستايل الحاوية الكبيرة (الجرادينت الموحد)
  const mainCardStyle = {
    background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
    borderColor: 'var(--card-border)'
  };

  return (
    <div 
      style={mainCardStyle}
      className="p-6 rounded-[2rem] border shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 style={{ color: 'var(--text-main)' }} className="font-black text-lg uppercase tracking-widest">
          My Tasks
        </h3>
        <div style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--card-border)' }} className="p-2 rounded-xl border shadow-inner">
           <ArrowUpRight size={18} style={{ color: 'var(--text-muted)' }} className="opacity-70" />
        </div>
      </div>

      <div className="space-y-5">
        {projects?.map((project, idx) => (
          <div 
            key={project._id} 
            style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--card-border)' }}
            className="p-5 rounded-2xl border hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-lg"
          >
            {/* Project Title & Priority */}
            <div className="flex justify-between items-start mb-3">
              <h4 style={{ color: 'var(--text-main)' }} className="text-[14px] font-black tracking-tight leading-tight">
                {project.name}
              </h4>
              <span 
                style={{ 
                  backgroundColor: project.priority === 'High' ? 'var(--pill-orange-bg)' : 'var(--pill-green-bg)',
                  color: project.priority === 'High' ? 'var(--pill-orange-text)' : 'var(--pill-green-text)',
                  borderColor: project.priority === 'High' ? 'var(--pill-orange-border)' : 'var(--pill-green-border)'
                }}
                className="text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-[0.15em] border whitespace-nowrap"
              >
                {project.priority}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)' }} className="text-[11px] mb-6 font-bold leading-relaxed line-clamp-1 opacity-60 italic">
              {project.description}
            </p>
            
            <div className="flex justify-between items-center mb-5">
              {/* Assigned Users */}
              <div className="flex -space-x-2.5">
                {project.assignedTo?.slice(0, 3).map((user, i) => (
                  <img 
                    key={i} 
                    src={user.avatar} 
                    style={{ borderColor: 'var(--bg-deep)' }}
                    className="w-8 h-8 rounded-full border-2 object-cover shadow-md transition-transform group-hover:translate-y-[-2px]" 
                    alt="avatar" 
                  />
                ))}
              </div>
              
              {/* Time Info */}
              <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-50">
                <Clock size={12} className="text-blue-500" />
                <span>latest</span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2.5">
              <div 
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--card-border)' }}
                className="w-full h-2 rounded-full overflow-hidden border shadow-inner"
              >
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-in-out ${idx % 2 === 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-400' : 'bg-gradient-to-r from-purple-600 to-pink-400'}`}
                  style={{ width: `${project.projectProgress || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center px-0.5">
                <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-black uppercase tracking-tighter opacity-40">Completion</span>
                <span style={{ color: 'var(--text-main)' }} className="text-[10px] font-black">{project.projectProgress || 0}%</span>
              </div>
            </div>
          </div>
        ))}

        {(!projects || projects.length === 0) && (
          <div style={{ color: 'var(--text-muted)' }} className="text-center py-10 opacity-30 italic text-sm font-bold uppercase tracking-widest">
            No active tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasksSidebar;