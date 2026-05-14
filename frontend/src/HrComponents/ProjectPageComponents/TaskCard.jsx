

 import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Plus, Check, X, Trash2, Edit2, Loader2 } from "lucide-react"; 
import API from "@/services/axios"; 

export default function TaskCard({ id, title, description, avatar, tag, priority, onDelete, onEdit, assignedTo = [] }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  
  const [subtasks, setSubtasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  const getPriorityStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const response = await API.get(`/tasks/${id}`); 
        if (response.data.status === "success") setSubtasks(response.data.data.tasks);
      } catch (error) { 
        console.error("Error fetching tasks:", error);
      } finally { 
        setLoadingTasks(false); 
      }
    };
    fetchSubtasks();
  }, [id]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const response = await API.post(`/tasks/${id}`, { title: newTaskTitle, done: false });
      if (response.data.status === "success") {
        setSubtasks((prev) => [...prev, response.data.data.task]);
        setNewTaskTitle("");
        setIsAdding(false);
      }
    } catch (error) { console.error("Add Task Error:", error); }
  };

  const toggleSubtask = async (subId, currentStatus) => {
    try {
      await API.patch(`/tasks/${subId}`, { done: !currentStatus });
      setSubtasks((prev) => prev.map((s) => s._id === subId ? { ...s, done: !currentStatus } : s));
    } catch (error) { console.error("Update Task Error:", error); }
  };

  const handleDeleteSubtask = async (subId) => {
    if (!window.confirm("حذف هذه المهمة؟")) return;
    try {
      const response = await API.delete(`/tasks/${subId}`);
      if (response.data.status === "success") setSubtasks((prev) => prev.filter((s) => s._id !== subId));
    } catch (error) { console.error("Delete Task Error:", error); }
  };

  const projectImage = avatar || `https://via.placeholder.com/300x150/1e293b/cbd5e1?text=${encodeURIComponent(title)}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] border border-slate-700/50 rounded-2xl p-4 space-y-3 w-full hover:bg-slate-700/30 transition-all shadow-sm group"
    >
      {/* Header & Drag Handle */}
      <div className="flex justify-between items-center">
        <div {...listeners} {...attributes} className="cursor-grab text-slate-400 text-[10px] uppercase tracking-wider font-medium select-none flex items-center gap-1">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_,i) => <div key={i} className="w-0.5 h-0.5 bg-slate-500 rounded-full"/>)}
          </div>
          Drag
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} className="text-slate-600 hover:text-red-500 p-0.5 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Tags & Priority */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
          {tag || "General"}
        </span>
        {priority && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shadow-sm ${getPriorityStyles(priority)}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}
      </div>

      {/* Project Image */}
      <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-700/40 bg-slate-900/50 relative">
        <img 
          src={projectImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x150/1e293b/cbd5e1?text=No+Image"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#182731]/80 to-transparent opacity-60" />
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="text-slate-100 font-bold text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{description}</p>
      </div>

      {/* Subtasks */}
      <div className="space-y-2 pt-3 border-t border-slate-700/30">
        {loadingTasks ? (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
            <Loader2 size={12} className="animate-spin" /> Loading subtasks...
          </div>
        ) : (
          subtasks.map((sub) => (
            <div key={sub._id} className="flex items-center gap-2 group/sub">
              <div
                onClick={() => toggleSubtask(sub._id, sub.done)}
                className={`w-3.5 h-3.5 border rounded flex items-center justify-center cursor-pointer transition-all ${sub.done ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-cyan-500 bg-slate-800/50"}`}
              >
                {sub.done && <Check size={10} className="text-white stroke-[4px]" />}
              </div>
              <span className={`flex-1 text-[11px] transition-all ${sub.done ? "line-through text-slate-500" : "text-slate-300"}`}>{sub.title}</span>
              <button onClick={() => handleDeleteSubtask(sub._id)} className="opacity-0 group-hover/sub:opacity-100 text-slate-600 hover:text-red-400 transition-all p-0.5"><X size={12} /></button>
            </div>
          ))
        )}

        {isAdding ? (
          <div className="flex items-center gap-2 mt-2 bg-slate-900/80 p-1.5 rounded-lg border border-cyan-500/40 shadow-inner animate-in fade-in zoom-in duration-200">
            <input autoFocus className="flex-1 bg-transparent px-1 text-[11px] text-white outline-none placeholder:text-slate-600" placeholder="New subtask..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTask()} />
            <div className="flex gap-1">
              <button onClick={handleAddTask} className="text-emerald-500 p-1 rounded hover:bg-emerald-500/10"><Check size={14} /></button>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 p-1 rounded hover:bg-slate-500/10"><X size={14} /></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-cyan-400 transition-colors mt-2 px-1">
            <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><Plus size={10} /></div> Add Subtask
          </button>
        )}
      </div>

      {/* Footer: Assigned Members (Real Data) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/20">
        <div className="flex -space-x-2">
            {assignedTo && assignedTo.length > 0 ? (
              assignedTo.slice(0, 3).map((emp, i) => {
                // التشيك الذكي على الداتا
                const isObject = typeof emp === 'object' && emp !== null;
                const avatarUrl = isObject ? emp.general?.avatar : null;
                const firstName = isObject ? (emp.general?.firstName || "M") : "M";
                const lastName = isObject ? (emp.general?.lastName || "") : "";
                const fullName = `${firstName} ${lastName}`.trim();

                return (
                  <img 
                    key={emp._id || i} 
                    // لو في URL حقيقي هنعرضه، لو مفيش هنعرض أول حرفين ملونين (UI-Avatar)
                    src={avatarUrl && avatarUrl.includes('http') ? avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`} 
                    alt={fullName}
                    title={fullName}
                    className="w-6 h-6 rounded-full border-2 border-[#182731] hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-md object-cover" 
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;
                    }}
                  />
                );
              })
            ) : (
              <div className="text-[9px] text-slate-600">No one assigned</div>
            )}
            
            {assignedTo?.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-[#182731] bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold z-0">
                +{assignedTo.length - 3}
              </div>
            )}
        </div>
        <div className="text-[9px] text-slate-500 font-mono bg-slate-800/40 px-1.5 py-0.5 rounded">ID: {id?.slice(-6)}</div>
      </div>
    </div>
  );
}