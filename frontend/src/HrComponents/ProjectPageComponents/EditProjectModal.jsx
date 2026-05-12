import { useState } from "react";
import { X, Link as LinkIcon, Loader2 } from "lucide-react";

export default function EditProjectModal({ project, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: project?.title || "",
    description: project?.description || "",
    tag: project?.tag || "",
    priority: project?.priority || "Medium",
    avatar: project?.avatar || "", 
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    const updatedData = {
      general: {
        name: formData.name,
        description: formData.description,
        tag: formData.tag,
        avatar: formData.avatar, 
      },
      assignment: {
        priority: formData.priority,
        status: project.status
      }
    };

    try {
      await onUpdate(project.id, updatedData);
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#182731] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-slate-100 font-bold">Edit Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-right" dir="rtl">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 mr-1">Project Name </label>
            <input 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1 mr-1">project Image(URL)</label>
            <div className="relative">
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                placeholder="https://example.com/image.jpg"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              />
              <LinkIcon className="absolute right-3 top-2.5 text-slate-500" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 mr-1">(Priority)</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none appearance-none cursor-pointer"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 mr-1">(Tag)</label>
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/10"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save
          </button>
        </form>
      </div>
    </div>
  );
}