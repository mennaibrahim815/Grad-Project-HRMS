
// import { useDraggable } from "@dnd-kit/core";
// import { Plus, Check, FileText } from "lucide-react";

// export default function TaskCard({ id, title, description, avatar, tag, priority, onDelete, onEdit, onAddTask, assignedTo = [], documents = [], subTasks = [] }) {

//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

//   const style = transform
//     ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
//     : undefined;

//   const getPriorityStyles = (level) => {
//     switch (level?.toLowerCase()) {
//       case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
//       case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
//       case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
//       default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
//     }
//   };

//   const projectImage = avatar || `https://via.placeholder.com/300x150/1e293b/cbd5e1?text=${encodeURIComponent(title)}`;

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] border border-slate-700/50 rounded-2xl p-4 space-y-3 w-full hover:bg-slate-700/30 transition-all shadow-sm group"
//     >
//       {/* Header & Drag Handle */}
//       <div className="flex justify-between items-center">
//         {/* 🛠️ هنا تم تصليح الثلاث نقاط بالتمام والكمال */}
//         <div {...listeners} {...attributes} className="cursor-grab text-slate-400 text-[10px] uppercase tracking-wider font-medium select-none flex items-center gap-1">
//           <div className="grid grid-cols-2 gap-0.5">
//             {[...Array(4)].map((_,i) => <div key={i} className="w-0.5 h-0.5 bg-slate-500 rounded-full"/>)}
//           </div>
//           Drag
//         </div>
        
//         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
//           <button
//             onClick={(e) => { e.stopPropagation(); onEdit(); }}
//             className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
//           </button>
//           <button onClick={onDelete} className="text-slate-600 hover:text-red-500 p-0.5 transition-colors">
//             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
//           </button>
//         </div>
//       </div>

//       {/* Tags & Priority */}
//       <div className="flex flex-wrap gap-2">
//         <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
//           {tag || "General"}
//         </span>
//         {priority && (
//           <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shadow-sm ${getPriorityStyles(priority)}`}>
//             {priority.charAt(0).toUpperCase() + priority.slice(1)}
//           </span>
//         )}
//       </div>

//       {/* Project Image */}
//       <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-700/40 bg-slate-900/50 relative">
//         <img
//           src={projectImage}
//           alt={title}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           onError={(e) => { e.target.src = "https://via.placeholder.com/300x150/1e293b/cbd5e1?text=No+Image"; }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#182731]/80 to-transparent opacity-60" />
//       </div>

//       {/* Title & Description */}
//       <div className="space-y-1">
//         <h3 className="text-slate-100 font-bold text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
//         <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{description}</p>
//       </div>

//       {/* Documents Section */}
//       {documents && documents.length > 0 && (
//         <div className="flex flex-wrap gap-2 pt-1">
//           {documents.map((doc, index) => {
//             const fileName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || `Document ${index + 1}`);
//             const fileUrl = typeof doc === 'string' ? doc : doc.url;

//             return (
//               <a
//                 key={index}
//                 href={fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center gap-1.5 bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700/40 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 transition-all max-w-full truncate"
//                 title={fileName}
//               >
//                 <FileText size={12} className="text-cyan-400 flex-shrink-0" />
//                 <span className="truncate max-w-[140px]">{fileName}</span>
//               </a>
//             );
//           })}
//         </div>
//       )}

//       {/* Subtasks Section */}
//       <div className="space-y-2 pt-3 border-t border-slate-700/30">
//         {subTasks && subTasks.length > 0 ? (
//           subTasks.map((sub, index) => {
//             const isCompleted = sub.status === "Completed" || sub.status === "completed";
//             const subKey = sub._id || sub.id || index;

//             return (
//               <div key={subKey} className="flex items-center gap-2 group/sub">
//                 <div
//                   className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${isCompleted ? "bg-emerald-500 border-emerald-500" : "border-slate-500 bg-slate-800/50"}`}
//                 >
//                   {isCompleted && <Check size={10} className="text-white stroke-[4px]" />}
//                 </div>
//                 <span className={`flex-1 text-[11px] transition-all ${isCompleted ? "line-through text-slate-500" : "text-slate-300"}`}>
//                   {sub.title || sub.name}
//                 </span>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-[10px] text-slate-600 italic px-1">No subtasks found</div>
//         )}

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onAddTask();
//           }}
//           className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-cyan-400 transition-colors mt-2 px-1"
//         >
//           <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
//             <Plus size={10} />
//           </div>
//           Add Subtask
//         </button>
//       </div>

//       {/* Footer: Assigned Members */}
//       <div className="flex items-center justify-between pt-2 border-t border-slate-700/20">
//         <div className="flex -space-x-2">
//             {assignedTo && assignedTo.length > 0 ? (
//               assignedTo.slice(0, 3).map((emp, i) => {
//                 const isObject = typeof emp === 'object' && emp !== null;
//                 const avatarUrl = isObject ? emp.general?.avatar : null;
//                 const firstName = isObject ? (emp.general?.firstName || "M") : "M";
//                 const lastName = isObject ? (emp.general?.lastName || "") : "";
//                 const fullName = `${firstName} ${lastName}`.trim();

//                 return (
//                   <img
//                     key={emp._id || i}
//                     src={avatarUrl && avatarUrl.includes('http') ? avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`}
//                     alt={fullName}
//                     title={fullName}
//                     className="w-6 h-6 rounded-full border-2 border-[#182731] hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-md object-cover"
//                     onError={(e) => {
//                         e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;
//                     }}
//                   />
//                 );
//               })
//             ) : (
//               <div className="text-[9px] text-slate-600">No one assigned</div>
//             )}
            
//             {assignedTo?.length > 3 && (
//               <div className="w-6 h-6 rounded-full border-2 border-[#182731] bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold z-0">
//                 +{assignedTo.length - 3}
//               </div>
//             )}
//         </div>
//         <div className="text-[9px] text-slate-500 font-mono bg-slate-800/40 px-1.5 py-0.5 rounded">ID: {id?.slice(-6)}</div>
//       </div>
//     </div>
//   );
// }
import { useDraggable } from "@dnd-kit/core";
import { Plus, Check, FileText } from "lucide-react";

export default function TaskCard({ id, title, description, avatar, tag, priority, onDelete, onEdit, onAddTask, assignedTo = [], documents = [], subTasks = [] }) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  const getPriorityStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
      case 'medium': return { background: 'rgba(234,179,8,0.1)', color: '#facc15', border: '1px solid rgba(234,179,8,0.2)' };
      case 'low': return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
      default: return { background: 'var(--tab-inactive-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-main)' };
    }
  };

  const projectImage = avatar || `https://via.placeholder.com/300x150/1e293b/cbd5e1?text=${encodeURIComponent(title)}`;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
        border: '1px solid var(--card-border)',
      }}
      className="rounded-2xl p-4 space-y-3 w-full transition-all shadow-sm group"
      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)'}
    >
      {/* Header & Drag Handle */}
      <div className="flex justify-between items-center">
        <div {...listeners} {...attributes} className="cursor-grab text-[10px] uppercase tracking-wider font-medium select-none flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: 'var(--text-muted)' }} className="w-0.5 h-0.5 rounded-full" />
            ))}
          </div>
          Drag
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-0.5 transition-colors hover:text-cyan-400"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button onClick={onDelete} className="p-0.5 transition-colors hover:text-red-500" style={{ color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {/* Tags & Priority */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border shadow-sm"
          style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
          {tag || "General"}
        </span>
        {priority && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm"
            style={getPriorityStyles(priority)}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}
      </div>

      {/* Project Image */}
      <div className="h-32 w-full rounded-xl overflow-hidden relative" style={{ border: '1px solid var(--border-main)' }}>
        <img
          src={projectImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x150/1e293b/cbd5e1?text=No+Image"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-main)' }}>
          {title}
        </h3>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>

      {/* Documents Section */}
      {documents && documents.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {documents.map((doc, index) => {
            const fileName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || `Document ${index + 1}`);
            const fileUrl = typeof doc === 'string' ? doc : doc.url;
            return (
              <a
                key={index}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-main)',
                  color: 'var(--text-muted)',
                }}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] transition-all max-w-full truncate hover:opacity-80"
                title={fileName}
              >
                <FileText size={12} className="text-cyan-400 flex-shrink-0" />
                <span className="truncate max-w-[140px]">{fileName}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Subtasks Section */}
      <div className="space-y-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {subTasks && subTasks.length > 0 ? (
          subTasks.map((sub, index) => {
            const isCompleted = sub.status === "Completed" || sub.status === "completed";
            const subKey = sub._id || sub.id || index;
            return (
              <div key={subKey} className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${isCompleted ? "bg-emerald-500 border-emerald-500" : ""}`}
                  style={!isCompleted ? { borderColor: 'var(--text-muted)', background: 'var(--input-bg)' } : {}}>
                  {isCompleted && <Check size={10} className="text-white stroke-[4px]" />}
                </div>
                <span className="flex-1 text-[11px] transition-all"
                  style={{ color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                  {sub.title || sub.name}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-[10px] italic px-1" style={{ color: 'var(--text-muted)' }}>No subtasks found</div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onAddTask(); }}
          className="flex items-center gap-1.5 text-[10px] font-medium hover:text-cyan-400 transition-colors mt-2 px-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
            <Plus size={10} />
          </div>
          Add Subtask
        </button>
      </div>

      {/* Footer: Assigned Members */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex -space-x-2">
          {assignedTo && assignedTo.length > 0 ? (
            assignedTo.slice(0, 3).map((emp, i) => {
              const isObject = typeof emp === 'object' && emp !== null;
              const avatarUrl = isObject ? emp.general?.avatar : null;
              const firstName = isObject ? (emp.general?.firstName || "M") : "M";
              const lastName = isObject ? (emp.general?.lastName || "") : "";
              const fullName = `${firstName} ${lastName}`.trim();
              return (
                <img
                  key={emp._id || i}
                  src={avatarUrl?.includes('http') ? avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`}
                  alt={fullName}
                  title={fullName}
                  className="w-6 h-6 rounded-full hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-md object-cover"
                  style={{ border: '2px solid var(--bg-card)' }}
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`; }}
                />
              );
            })
          ) : (
            <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>No one assigned</div>
          )}

          {assignedTo?.length > 3 && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold z-0"
              style={{ border: '2px solid var(--bg-card)', background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
              +{assignedTo.length - 3}
            </div>
          )}
        </div>

        <div className="text-[9px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
          ID: {id?.slice(-6)}
        </div>
      </div>
    </div>
  );
}