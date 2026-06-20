import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';

const MyTasksSidebar = ({ projects, loading }) => {
  if (loading) return <div className="text-gray-400 text-center py-5">Loading tasks...</div>;

  return (
    <div className="bg-[#1a1c26] p-6 rounded-2xl border border-gray-800/50 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-lg">My Tasks</h3>
        <ArrowUpRight size={20} className="text-gray-500" />
      </div>

      <div className="space-y-4">
        {projects?.map((project, idx) => (
          <div key={project._id} className="bg-[#212431] p-4 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-gray-100 text-sm font-semibold">{project.name}</h4>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${project.priority === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-gray-400 text-[11px] mb-4 line-clamp-1">{project.description}</p>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex -space-x-2">
                {project.assignedTo?.slice(0, 3).map((user, i) => (
                  <img key={i} src={user.avatar} className="w-6 h-6 rounded-full border-2 border-[#212431]" alt="avatar" />
                ))}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                <Clock size={12} />
                <span>latest</span> {/* يمكن حسابها برمجياً من الـ deadline */}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${idx === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                  style={{ width: `${project.projectProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksSidebar;