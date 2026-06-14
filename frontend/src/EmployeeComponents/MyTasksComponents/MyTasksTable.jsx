import React, { useState } from "react";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import instance from "@/services/axios"; 
import { CheckCircle, X, Upload, Loader2 } from "lucide-react";

// الاستايل الخاص بحالة المهمة
const TaskStatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    "On-going": "bg-blue-500/15 text-blue-400 border-blue-400/40",
    "In Progress": "bg-amber-500/15 text-amber-400 border-amber-400/40",
    Pending: "bg-slate-500/30 text-slate-400 border-slate-500/40",
    Testing: "bg-purple-500/15 text-purple-400 border-purple-400/40",
  };
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-500/20 text-slate-400 border-slate-400/40"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status || "Pending"}
    </span>
  );
};

const MyTasksTable = ({ 
  tasks, 
  taskScope,          
  setTaskScope,       
  searchTerm,         
  setSearchTerm,      
  pagination, 
  onPageChange,
  onLimitChange,
  loading,
  refreshTable 
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // حالة الـ Modal الخاص بالتحديث
  const [updateModal, setUpdateModal] = useState({ show: false, taskId: null, currentStatus: "Pending" });
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleOpenUpdate = (id, currentStatus) => {
    setOpenMenuId(null);
    setSelectedStatus(currentStatus);
    setSelectedFile(null);
    setUpdateModal({ show: true, taskId: id, currentStatus });
  };

  const handleStatusAndDocSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      
      const formData = new FormData();
      formData.append("status", selectedStatus);
      if (selectedFile) {
        formData.append("document", selectedFile); 
      }

      const response = await instance.patch(`/tasks/${updateModal.taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data?.status === "success") {
        setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" });
        if (refreshTable) refreshTable(); 
      }
    } catch (error) {
      console.error("Error updating task progress:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    { 
      header: "Task Title", 
      render: (row) => <span className="font-semibold text-white truncate max-w-[220px] block">{row.title || "N/A"}</span> 
    },
    { 
      header: "Assigned To", 
      render: (row) => {
        const assignees = row.assignedTo || [];
        if (assignees.length === 0) return <span className="text-slate-500 text-xs">Unassigned</span>;
        
        return (
          <div className="flex items-center -space-x-2 overflow-hidden">
            {assignees.map((user, idx) => {
              const fullName = `${user.general?.firstName || ""} ${user.general?.lastName || ""}`;
              return (
                <img
                  key={user._id || idx}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover bg-slate-800"
                  src={user.general?.avatar || "https://via.placeholder.com/150"}
                  alt={fullName}
                  title={fullName}
                />
              );
            })}
          </div>
        );
      } 
    },
    { 
      header: "Priority", 
      render: (row) => {
        const priorityColors = {
          High: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          Low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        };
        return (
          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold uppercase tracking-wide ${priorityColors[row.priority] || "text-slate-300 bg-slate-500/10"}`}>
            {row.priority || "Medium"}
          </span>
        );
      }
    },
    {
      header: "Deadline", 
      render: (row) => row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : "N/A"
    },
    { header: "Status", render: (row) => <TaskStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id || row.id;
        const isCompleted = row.status === "Completed"; // فحص لو الـ HR قفل التاسك خلاص

        return (
          <div className="relative">
            <button 
              disabled={isCompleted} // منع فتح المنيو لو التاسك خلاص Completed
              onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} 
              className={`p-2 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { 
                  label: "Submit Work", 
                  icon: CheckCircle, 
                  onClick: () => handleOpenUpdate(rowId, row.status)
                },
              ]}
            />
          </div>
        );
      }
    }
  ];

  return (
    <BaseCard padding="p-0">
      <TableControls
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filterValue={taskScope} 
        setFilterValue={(val) => { setTaskScope(val); onPageChange(1); }}
        filterOptions={["My Tasks", "Team Tasks"]} 
        setCurrentPage={onPageChange}
      />

      <DataTable columns={columns} data={tasks} loading={loading} />

      <Pagination
        pagination={pagination}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={tasks.length}
        entityName="tasks"
      />

      {/* 🌟 مودال تحديث حالة المهمة ورفع الملفات */}
      {updateModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" dir="ltr">
          <div className="bg-[#0B131A] border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-left relative">
            
            <button 
              onClick={() => setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" })}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-bold text-white">Submit Task Progress</h3>
              <p className="text-xs text-slate-400 mt-1">Upload your work deliverables. Your submission will be reviewed by HR for full approval.</p>
            </div>

            <form onSubmit={handleStatusAndDocSubmit} className="space-y-5">
              
              {/* 1. اختيار الحالة (تم استبعاد Completed لتبقى صلاحية للـ HR فقط) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">Task Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#0293FA] transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On-going">On-going (Work Submitted)</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>

              {/* 2. منطقة رفع الملف */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">Deliverables / Documentation</label>
                <div className="relative border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".doc,.docx,.pdf,.zip,.rar"
                  />
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-slate-200 mb-2 transition-colors">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedFile ? selectedFile.name : "Click to upload document"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Supports PDF, DOCX, ZIP up to 10MB"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" })}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0293FA] hover:bg-[#0293FA]/90 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Work"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default MyTasksTable;