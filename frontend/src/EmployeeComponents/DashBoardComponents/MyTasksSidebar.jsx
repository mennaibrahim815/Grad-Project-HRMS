// import React from 'react';
// import { Clock, ArrowUpRight } from 'lucide-react';

// const MyTasksSidebar = ({ projects, loading }) => {
//   if (loading) return <div className="text-gray-400 text-center py-5">Loading tasks...</div>;

//   return (
//     <div className="bg-[#1a1c26] p-6 rounded-2xl border border-gray-800/50 ">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-white font-bold text-lg">My Tasks</h3>
//         <ArrowUpRight size={20} className="text-gray-500" />
//       </div>

//       <div className="space-y-4">
//         {projects?.map((project, idx) => (
//           <div key={project._id} className="bg-[#212431] p-4 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="text-gray-100 text-sm font-semibold">{project.name}</h4>
//               <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${project.priority === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
//                 {project.priority}
//               </span>
//             </div>
//             <p className="text-gray-400 text-[11px] mb-4 line-clamp-1">{project.description}</p>
            
//             <div className="flex justify-between items-center mb-3">
//               <div className="flex -space-x-2">
//                 {project.assignedTo?.slice(0, 3).map((user, i) => (
//                   <img key={i} src={user.avatar} className="w-6 h-6 rounded-full border-2 border-[#212431]" alt="avatar" />
//                 ))}
//               </div>
//               <div className="flex items-center gap-1 text-gray-500 text-[10px]">
//                 <Clock size={12} />
//                 <span>latest</span> {/* يمكن حسابها برمجياً من الـ deadline */}
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="space-y-1.5">
//               <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full rounded-full transition-all duration-500 ${idx === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
//                   style={{ width: `${project.projectProgress || 0}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyTasksSidebar;


// import React from 'react';
// import { Clock, ArrowUpRight } from 'lucide-react';

// const MyTasksSidebar = ({ projects, loading }) => {
//   if (loading) return (
//     <div className="text-center py-10">
//       <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading tasks...</div>
//     </div>
//   );

//   return (
//     <div 
//       style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
//       className="p-6 rounded-2xl border shadow-sm transition-colors duration-300"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-lg tracking-tight">
//           My Tasks
//         </h3>
//         <ArrowUpRight size={20} style={{ color: 'var(--text-muted)' }} className="opacity-50" />
//       </div>

//       <div className="space-y-4">
//         {projects?.map((project, idx) => (
//           <div 
//             key={project._id} 
//             style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
//             className="p-4 rounded-xl border hover:border-blue-500/50 transition-all group shadow-sm"
//           >
//             {/* Project Title & Priority */}
//             <div className="flex justify-between items-start mb-2">
//               <h4 style={{ color: 'var(--text-main)' }} className="text-sm font-bold tracking-tight">
//                 {project.name}
//               </h4>
//               <span 
//                 style={{ 
//                   backgroundColor: project.priority === 'High' ? 'var(--pill-orange-bg)' : 'var(--pill-green-bg)',
//                   color: project.priority === 'High' ? 'var(--pill-orange-text)' : 'var(--pill-green-text)',
//                   borderColor: project.priority === 'High' ? 'var(--pill-orange-border)' : 'var(--pill-green-border)'
//                 }}
//                 className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border"
//               >
//                 {project.priority}
//               </span>
//             </div>

//             {/* Description */}
//             <p style={{ color: 'var(--text-muted)' }} className="text-[11px] mb-5 font-medium leading-relaxed line-clamp-1 opacity-80">
//               {project.description}
//             </p>
            
//             <div className="flex justify-between items-center mb-4">
//               {/* Assigned Users */}
//               <div className="flex -space-x-2">
//                 {project.assignedTo?.slice(0, 3).map((user, i) => (
//                   <img 
//                     key={i} 
//                     src={user.avatar} 
//                     style={{ borderColor: 'var(--bg-deep)' }}
//                     className="w-7 h-7 rounded-full border-2 object-cover shadow-sm" 
//                     alt="avatar" 
//                   />
//                 ))}
//               </div>
              
//               {/* Time Info */}
//               <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
//                 <Clock size={12} />
//                 <span>latest</span>
//               </div>
//             </div>

//             {/* Progress Bar Container */}
//             <div className="space-y-2">
//               <div 
//                 style={{ backgroundColor: 'var(--input-bg)' }}
//                 className="w-full h-1.5 rounded-full overflow-hidden"
//               >
//                 <div 
//                   className={`h-full rounded-full transition-all duration-700 ease-out ${idx % 2 === 0 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`}
//                   style={{ width: `${project.projectProgress || 0}%` }}
//                 ></div>
//               </div>
//               <div className="flex justify-end">
//                 <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-black">{project.projectProgress || 0}%</span>
//               </div>
//             </div>
//           </div>
//         ))}

//         {(!projects || projects.length === 0) && (
//           <div style={{ color: 'var(--text-muted)' }} className="text-center py-10 opacity-30 italic text-sm">
//             No active tasks found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyTasksSidebar;



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