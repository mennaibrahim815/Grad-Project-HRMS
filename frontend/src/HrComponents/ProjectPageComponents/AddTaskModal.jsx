
// import { X, Loader2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import API from "@/services/axios";
// import Swal from "sweetalert2";

// export default function AddTaskModal({ projectId, onClose, onSuccess }) {
//   const [taskTitle, setTaskTitle] = useState("");
//   const [status, setStatus] = useState("Pending");
//   const [priority, setPriority] = useState("Medium");
//   const [deadline, setDeadline] = useState(""); 
  
//   const [employeeSearch, setEmployeeSearch] = useState("");
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const statusOptions = ["Pending", "On-going", "Completed"];
//   const priorityOptions = ["High", "Medium", "Low"];

//   useEffect(() => {
//     const searchEmployees = async () => {
//       if (employeeSearch.length < 2) {
//         setFilteredEmployees([]);
//         return;
//       }
//       setIsSearching(true);
//       try {
//         const response = await API.get(`/users/search?name=${employeeSearch}`);
//         if (response.data.status === "success") {
//           setFilteredEmployees(response.data.data.results);
//         }
//       } catch (error) {
//         console.error("Search Error:", error);
//       } finally {
//         setIsSearching(false);
//       }
//     };

//     const timeoutId = setTimeout(searchEmployees, 500);
//     return () => clearTimeout(timeoutId);
//   }, [employeeSearch]);

//   const handleSaveTask = async () => {
//     if (!taskTitle.trim() || !selectedEmployee || !deadline) {
//       Swal.fire({
//         title: "Warning!",
//         text: "Please fill in the title, deadline, and assign an employee.",
//         icon: "warning",
//         confirmButtonColor: "#0891b2",
//         background: "#182731",
//         color: "#fff",
//       });
//       return;
//     }

//     setLoading(true);

//     // دالة لضمان صياغة التاريخ السليمة والمقبولة بالسيرفر YYYY-MM-DD
//     const formatDate = (dateStr) => {
//       if (!dateStr) return "";
//       return new Date(dateStr).toISOString().split('T')[0];
//     };

//     const taskPayload = {
//       title: taskTitle,
//       status: status,
//       priority: priority,
//       deadline: formatDate(deadline), 
//       assignedTo: [
//         {
//           _id: selectedEmployee._id,
//           general: {
//             firstName: selectedEmployee.general?.firstName || "",
//             lastName: selectedEmployee.general?.lastName || "",
//             avatar: selectedEmployee.general?.avatar || ""
//           },
//           employee: {
//             jobTitle: selectedEmployee.employee?.jobTitle || "Software Engineer"
//           }
//         }
//       ]
//     };

//     try {
//       const response = await API.post(`/tasks/${projectId}`, taskPayload);
      
//       if (response.data.status === "success" || response.status === 201) {
//         Swal.fire({
//           title: "Success!",
//           text: "Task added to project successfully!",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//           background: "#182731",
//           color: "#fff",
//           iconColor: "#0891b2",
//         });

//         if (onSuccess) {
//           onSuccess(response.data.data.task);
//         }
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error creating task:", error.response?.data);
      
//       const backendError = error.response?.data?.message;
//       let errorText = "Error saving task";

//       if (Array.isArray(backendError)) {
//         errorText = backendError.map(err => `${err.field || 'Field'}: ${err.message}`).join("\n");
//       } else if (typeof backendError === "string") {
//         errorText = backendError;
//       } else if (backendError?.message) {
//         errorText = backendError.message;
//       }

//       Swal.fire({
//         title: "Validation Error!",
//         text: errorText,
//         icon: "error",
//         confirmButtonColor: "#0891b2",
//         background: "#182731",
//         color: "#fff",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[999] flex justify-end">
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative w-[450px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto shadow-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-white text-lg font-medium">Add Task to Project</h2>
//           <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
//             <X className="text-gray-400 hover:text-white" />
//           </button>
//         </div>

//         {/* Task Title */}
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-400 text-sm mb-1">Task Title</label>
//           <input
//             type="text"
//             placeholder="Enter task title..."
//             value={taskTitle}
//             className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition-all"
//             onChange={(e) => setTaskTitle(e.target.value)}
//           />
//         </div>

//         {/* Status Dropdown */}
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-400 text-sm mb-1">Status</label>
//           <select
//             value={status}
//             className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//         </div>

//         {/* Priority Dropdown */}
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-400 text-sm mb-1">Priority</label>
//           <select
//             value={priority}
//             className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
//             onChange={(e) => setPriority(e.target.value)}
//           >
//             {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//         </div>

//         {/* Deadline Input */}
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-400 text-sm mb-1">Deadline</label>
//           <input
//             type="date"
//             value={deadline}
//             className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 [color-scheme:dark]"
//             onChange={(e) => setDeadline(e.target.value)}
//           />
//         </div>

//         {/* Assigned Employee Search */}
//         <div className="flex flex-col mb-6 relative">
//           <label className="text-gray-400 text-sm mb-1">Assigned To</label>
          
//           {selectedEmployee && (
//             <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl mb-2">
//               <div className="flex items-center gap-2">
//                 <img src={selectedEmployee.general?.avatar || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full object-cover" alt="" />
//                 <span className="text-xs text-blue-400">
//                   {selectedEmployee.general?.firstName} {selectedEmployee.general?.lastName} ({selectedEmployee.employee?.jobTitle || "Employee"})
//                 </span>
//               </div>
//               <button onClick={() => setSelectedEmployee(null)} className="text-blue-400/50 hover:text-red-400">
//                 <X size={14} />
//               </button>
//             </div>
//           )}

//           {!selectedEmployee && (
//             <div className="relative flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search employee by name..."
//                 value={employeeSearch}
//                 className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
//                 onChange={(e) => setEmployeeSearch(e.target.value)}
//               />
//               {isSearching && <Loader2 size={16} className="absolute right-3 animate-spin text-gray-500" />}
//             </div>
//           )}

//           {filteredEmployees.length > 0 && !selectedEmployee && (
//             <ul className="absolute top-[100%] w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-48 overflow-y-auto z-50 shadow-xl">
//               {filteredEmployees.map((emp) => (
//                 <li
//                   key={emp._id}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
//                   onClick={() => {
//                     setSelectedEmployee(emp); 
//                     setEmployeeSearch("");
//                     setFilteredEmployees([]);
//                   }}
//                 >
//                   <img src={emp.general?.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full object-cover" alt="" />
//                   <span>{emp.general?.firstName} {emp.general?.lastName}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mt-8">
//           <button type="button" className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-full text-sm" onClick={onClose}>Cancel</button>
//           <button
//             type="button"
//             onClick={handleSaveTask}
//             disabled={loading}
//             className="flex-1 bg-white text-black py-2.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {loading ? <Loader2 size={16} className="animate-spin" /> : "Add Task"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import API from "@/services/axios";
import Swal from "sweetalert2";

export default function AddTaskModal({ projectId, onClose, onSuccess }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Pending", "On-going", "Completed"];
  const priorityOptions = ["High", "Medium", "Low"];

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-main)',
    borderRadius: '12px',
    padding: '8px 12px',
    color: 'var(--text-main)',
    outline: 'none',
  };

  useEffect(() => {
    const searchEmployees = async () => {
      if (employeeSearch.length < 2) { setFilteredEmployees([]); return; }
      setIsSearching(true);
      try {
        const response = await API.get(`/users/search?name=${employeeSearch}`);
        if (response.data.status === "success") setFilteredEmployees(response.data.data.results);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsSearching(false);
      }
    };
    const timeoutId = setTimeout(searchEmployees, 500);
    return () => clearTimeout(timeoutId);
  }, [employeeSearch]);

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !selectedEmployee || !deadline) {
      Swal.fire({
        title: "Warning!", text: "Please fill in the title, deadline, and assign an employee.",
        icon: "warning", confirmButtonColor: "#0891b2",
        background: "var(--bg-card)", color: "var(--text-main)",
      });
      return;
    }

    setLoading(true);
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : "";

    const taskPayload = {
      title: taskTitle, status, priority,
      deadline: formatDate(deadline),
      assignedTo: [{
        _id: selectedEmployee._id,
        general: {
          firstName: selectedEmployee.general?.firstName || "",
          lastName: selectedEmployee.general?.lastName || "",
          avatar: selectedEmployee.general?.avatar || ""
        },
        employee: { jobTitle: selectedEmployee.employee?.jobTitle || "Software Engineer" }
      }]
    };

    try {
      const response = await API.post(`/tasks/${projectId}`, taskPayload);
      if (response.data.status === "success" || response.status === 201) {
        Swal.fire({
          title: "Success!", text: "Task added to project successfully!",
          icon: "success", timer: 2000, showConfirmButton: false,
          background: "var(--bg-card)", color: "var(--text-main)", iconColor: "#0891b2",
        });
        if (onSuccess) onSuccess(response.data.data.task);
        onClose();
      }
    } catch (error) {
      const backendError = error.response?.data?.message;
      let errorText = "Error saving task";
      if (Array.isArray(backendError)) errorText = backendError.map(e => `${e.field || 'Field'}: ${e.message}`).join("\n");
      else if (typeof backendError === "string") errorText = backendError;
      else if (backendError?.message) errorText = backendError.message;

      Swal.fire({
        title: "Validation Error!", text: errorText, icon: "error",
        confirmButtonColor: "#0891b2",
        background: "var(--bg-card)", color: "var(--text-main)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-[450px] h-full px-8 py-6 overflow-y-auto shadow-2xl"
        style={{ background: 'var(--bg-main)', borderLeft: '1px solid var(--border-main)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium" style={{ color: 'var(--text-main)' }}>Add Task to Project</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Task Title */}
        <div className="flex flex-col mb-4">
          <label className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Task Title</label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={taskTitle}
            style={inputStyle}
            className="focus:border-blue-500 transition-all placeholder:text-[var(--text-muted)]"
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col mb-4">
          <label className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Status</label>
          <select value={status} style={inputStyle} className="cursor-pointer focus:border-blue-500"
            onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col mb-4">
          <label className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Priority</label>
          <select value={priority} style={inputStyle} className="cursor-pointer focus:border-blue-500"
            onChange={(e) => setPriority(e.target.value)}>
            {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Deadline */}
        <div className="flex flex-col mb-4">
          <label className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Deadline</label>
          <input
            type="date"
            value={deadline}
            style={inputStyle}
            className="focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Assigned Employee */}
        <div className="flex flex-col mb-6 relative">
          <label className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Assigned To</label>

          {selectedEmployee && (
            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl mb-2"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <img src={selectedEmployee.general?.avatar || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full object-cover" alt="" />
                <span className="text-xs" style={{ color: '#60a5fa' }}>
                  {selectedEmployee.general?.firstName} {selectedEmployee.general?.lastName} ({selectedEmployee.employee?.jobTitle || "Employee"})
                </span>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="hover:text-red-400 transition-colors" style={{ color: 'rgba(96,165,250,0.5)' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {!selectedEmployee && (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search employee by name..."
                value={employeeSearch}
                style={inputStyle}
                className="focus:border-blue-500 placeholder:text-[var(--text-muted)]"
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
              {isSearching && <Loader2 size={16} className="absolute right-3 animate-spin" style={{ color: 'var(--text-muted)' }} />}
            </div>
          )}

          {filteredEmployees.length > 0 && !selectedEmployee && (
            <ul
              className="absolute top-[100%] w-full mt-1 rounded-xl max-h-48 overflow-y-auto z-50 shadow-xl"
              style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border-main)' }}
            >
              {filteredEmployees.map((emp) => (
                <li
                  key={emp._id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors"
                  style={{ color: 'var(--text-main)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setSelectedEmployee(emp); setEmployeeSearch(""); setFilteredEmployees([]); }}
                >
                  <img src={emp.general?.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <span>{emp.general?.firstName} {emp.general?.lastName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="flex-1 py-2.5 rounded-full text-sm transition-colors"
            style={{ border: '1px solid var(--border-main)', color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveTask}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            style={{ background: 'var(--text-main)', color: 'var(--bg-main)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}