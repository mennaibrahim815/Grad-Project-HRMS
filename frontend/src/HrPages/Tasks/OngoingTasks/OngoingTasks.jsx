import { useEffect, useState } from "react";
import API from "@/services/axios";
import { Check, X, Loader2, AlertCircle, Clock, Download, Calendar, AlertTriangle } from "lucide-react";

export default function OngoingTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ستيت لإدارة فورم التأكيد (Modal)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
    actionType: "", // "accept" أو "reject"
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get("/tasks/ongoing?page=1&limit=10"); 
      
      if (response.data?.data?.tasks) {
        const validTasks = response.data.data.tasks.filter(
          (task) => task.document && task.document.trim() !== ""
        );
        setTasks(validTasks);
      } else {
        setTasks([]);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch HR Tasks Error:", err);
      setError("Failed to load ongoing tasks from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // دالة لفتح مودال التأكيد بدلاً من التنفيذ المباشر
  const openConfirmModal = (taskId, taskTitle, actionType) => {
    setConfirmModal({
      isOpen: true,
      taskId,
      taskTitle,
      actionType,
    });
  };

  // الدالة التي تنفذ الأكشن الفعلي بعد الضغط على "تأكيد" في المودال
  const handleConfirmAction = async () => {
    const { taskId, actionType } = confirmModal;
    try {
      await API.patch(`/tasks/${taskId}`, {
        acceptance: actionType // 'accept' أو 'reject'
      });
      
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" });
    } catch (err) {
      console.error(`Error performing ${actionType} on task:`, err);
      alert(err.response?.data?.message || "Something went wrong.");
      setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8 mt-10">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="text-cyan-400" /> On-going Tasks Review
        </h1>
        <p className="text-slate-400 text-sm">
          Review employee task updates and accept or reject submissions based on documentation.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-700 rounded-2xl bg-slate-900/20">
          <p className="text-slate-500 text-sm italic">No submitted tasks awaiting review at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div 
              key={task._id} 
              className="bg-gradient-to-br from-slate-900/40 to-[#182731] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Card */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-slate-100 font-bold text-base line-clamp-2">{task.title}</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                    {task.priority || "Medium"}
                  </span>
                </div>

                {/* Deadline */}
                {task.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={13} className="text-slate-500" />
                    <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Assigned To (Employee Info) */}
                {task.assignedTo && task.assignedTo.length > 0 && (
                  <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Assigned Employee:</span>
                    {task.assignedTo.map((emp) => {
                      const fullName = `${emp.general?.firstName || ""} ${emp.general?.lastName || ""}`.trim() || "Unknown Employee";
                      return (
                        <div key={emp._id} className="flex items-center gap-2.5">
                          <img 
                            src={emp.general?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`} 
                            alt={fullName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`; }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-200">{fullName}</span>
                            <span className="text-[10px] text-slate-400">{emp.employee?.jobTitle || "Developer"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Document Link */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Submitted Deliverable:</span>
                  <a
                    href={task.document}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl p-2.5 text-xs text-cyan-400 font-medium transition-colors"
                  >
                    <span className="truncate max-w-[200px]">Download Attached File</span>
                    <Download size={14} className="flex-shrink-0" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60 mt-4">
                <button
                  onClick={() => openConfirmModal(task._id, task.title, "reject")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => openConfirmModal(task._id, task.title, "accept")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold transition-all shadow-md shadow-emerald-900/20"
                >
                  <Check size={14} /> Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📋 فورم التأكيد الاحترافي (Confirmation Modal) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#182731] border border-slate-800 rounded-[2rem] max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              confirmModal.actionType === 'accept' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <AlertTriangle size={24} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Confirm Action</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you sure you want to <span className={confirmModal.actionType === 'accept' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{confirmModal.actionType.toUpperCase()}</span> this submission for: <br />
                <span className="text-slate-200 italic font-medium">"{confirmModal.taskTitle}"</span>?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" })}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-md ${
                  confirmModal.actionType === "accept" 
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20" 
                    : "bg-red-600 hover:bg-red-500 shadow-red-950/20"
                }`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}