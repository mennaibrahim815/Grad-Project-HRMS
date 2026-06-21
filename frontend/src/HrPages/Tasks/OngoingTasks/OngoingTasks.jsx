
import { useEffect, useState } from "react";
import API from "@/services/axios";
import HrTaskCard from "@/HrComponents/TasksComponents/HrTaskCard.jsx"; 
import { Loader2, AlertCircle, Clock, AlertTriangle } from "lucide-react";

export default function OngoingTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
    actionType: "", 
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


  const openConfirmModal = (taskId, taskTitle, actionType) => {
    setConfirmModal({
      isOpen: true,
      taskId,
      taskTitle,
      actionType,
    });
  };

  const handleConfirmAction = async () => {
    const { taskId, actionType } = confirmModal;
    try {
      await API.patch(`/tasks/${taskId}`, {
        acceptance: actionType, 
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" });
    } catch (err) {
      console.error(`Error performing ${actionType} on task:`, err);
      alert(err.response?.data?.message || "Something went wrong.");
      setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" });
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
    <div>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-10" style={{ color: 'var(--text-main)' }}>
          <Clock className="text-cyan-400" /> On-going Tasks Review
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
          <p className="text-slate-500 text-sm italic">
            No submitted tasks awaiting review at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <HrTaskCard key={task._id} task={task} onAction={openConfirmModal} />
          ))}
        </div>
      )}

    
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#182731] border border-slate-800 rounded-[2rem] max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                confirmModal.actionType === "accept"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Confirm Action</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you sure you want to{" "}
                <span
                  className={
                    confirmModal.actionType === "accept"
                      ? "text-emerald-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  {confirmModal.actionType.toUpperCase()}
                </span>{" "}
                this submission for: <br />
                <span className="text-slate-200 italic font-medium">
                  "{confirmModal.taskTitle}"
                </span>
                ?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() =>
                  setConfirmModal({ isOpen: false, taskId: null, taskTitle: "", actionType: "" })
                }
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