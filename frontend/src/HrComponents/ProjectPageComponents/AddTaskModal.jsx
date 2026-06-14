// import { X, Loader2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import API from "@/services/axios";
// import Swal from "sweetalert2";

// export default function AddTaskModal({ projectId, onClose, onSuccess }) {
//   const [taskTitle, setTaskTitle] = useState("");
//   const [status, setStatus] = useState("Pending");
//   const [priority, setPriority] = useState("Medium");
  
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
//     if (!taskTitle || !selectedEmployee) {
//       Swal.fire({
//         title: "Warning!",
//         text: "Please fill in the title and assign an employee.",
//         icon: "warning",
//         confirmButtonColor: "#0891b2",
//         background: "#182731",
//         color: "#fff",
//       });
//       return;
//     }

//     setLoading(true);

//     // بناء الـ Payload المتطابق مع تعديل الباك إند الجديد في الـ Task
//     const taskPayload = {
//       title: taskTitle,
//       assignment: {
//         status: status,
//         priority: priority,
//         assignedTo: [
//           {
//             _id: selectedEmployee.id,
//             general: {
//               firstName: selectedEmployee.firstName,
//               lastName: selectedEmployee.lastName,
//               avatar: selectedEmployee.img
//             },
//             employee: {
//               jobTitle: selectedEmployee.jobTitle
//             }
//           }
//         ]
//       }
//     };

//     try {
//       // إرسال الـ request إلى الـ endpoint بالـ projectId المطلوب للـ Task
//       const response = await API.post(`/tasks/${projectId}`, taskPayload);
//       if (response.data.status === "success") {
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
//         if (onSuccess) onSuccess();
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error creating task:", error);
//       Swal.fire({
//         title: "Error!",
//         text: error.response?.data?.message?.[0]?.message || "Error saving task",
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

//         {/* Assigned Employee Search */}
//         <div className="flex flex-col mb-6 relative">
//           <label className="text-gray-400 text-sm mb-1">Assigned To</label>
          
//           {selectedEmployee && (
//             <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl mb-2">
//               <div className="flex items-center gap-2">
//                 <img src={selectedEmployee.img || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full" alt="" />
//                 <span className="text-xs text-blue-400">{selectedEmployee.name} ({selectedEmployee.jobTitle})</span>
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
//                     setSelectedEmployee({
//                       id: emp._id,
//                       name: `${emp.general.firstName} ${emp.general.lastName}`,
//                       firstName: emp.general.firstName,
//                       lastName: emp.general.lastName,
//                       img: emp.general.avatar,
//                       jobTitle: emp.employee?.jobTitle || "Software Engineer"
//                     });
//                     setEmployeeSearch("");
//                     setFilteredEmployees([]);
//                   }}
//                 >
//                   <img src={emp.general.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full" alt="" />
//                   <span>{emp.general.firstName} {emp.general.lastName}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mt-8">
//           <button className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-full text-sm" onClick={onClose}>Cancel</button>
//           <button
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
  
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Pending", "On-going", "Completed"];
  const priorityOptions = ["High", "Medium", "Low"];

  useEffect(() => {
    const searchEmployees = async () => {
      if (employeeSearch.length < 2) {
        setFilteredEmployees([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await API.get(`/users/search?name=${employeeSearch}`);
        if (response.data.status === "success") {
          setFilteredEmployees(response.data.data.results);
        }
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
    if (!taskTitle || !selectedEmployee) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in the title and assign an employee.",
        icon: "warning",
        confirmButtonColor: "#0891b2",
        background: "#182731",
        color: "#fff",
      });
      return;
    }

    setLoading(true);

    // 🛠️ التعديل الجوهري: بناء الـ Payload الجديد المسطح (Flat Structure) المتوافق مع تعديلات الباك إند
    const taskPayload = {
      projectId: projectId,           // إرسال الـ projectId صراحة جوه الـ body لتأمين الربط
      title: taskTitle,
      status: status,                 // على الـ Root مباشرة
      priority: priority,             // على الـ Root مباشرة
      assignedTo: [selectedEmployee.id] // مصفوفة من الـ IDs فقط كما يتوقعها السيرفر الآن لمنع الـ Validation Error
    };

    try {
      // إرسال الـ request إلى الـ endpoint (تأكدي إذا كان السيرفر يتوقع الـ id في الـ URL أو يكتفي بالـ body)
      // هنا أرسلناه في الـ Body مع الـ Payload كطريقة أكثر استقراراً مع التعديل الجديد
      const response = await API.post("/tasks", taskPayload);
      
      if (response.data.status === "success" || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Task added to project successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#182731",
          color: "#fff",
          iconColor: "#0891b2",
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating task:", error.response?.data);
      // قراءة رسالة الخطأ المفصلة القادمة من الباك إند بشكل مرن
      const errMsg = error.response?.data?.message?.[0]?.message || error.response?.data?.message || "Error saving task";
      Swal.fire({
        title: "Error!",
        text: typeof errMsg === "object" ? JSON.stringify(errMsg) : errMsg,
        icon: "error",
        confirmButtonColor: "#0891b2",
        background: "#182731",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-[450px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-medium">Add Task to Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Task Title */}
        <div className="flex flex-col mb-4">
          <label className="text-gray-400 text-sm mb-1">Task Title</label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={taskTitle}
            className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col mb-4">
          <label className="text-gray-400 text-sm mb-1">Status</label>
          <select
            value={status}
            className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex flex-col mb-4">
          <label className="text-gray-400 text-sm mb-1">Priority</label>
          <select
            value={priority}
            className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Assigned Employee Search */}
        <div className="flex flex-col mb-6 relative">
          <label className="text-gray-400 text-sm mb-1">Assigned To</label>
          
          {selectedEmployee && (
            <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <img src={selectedEmployee.img || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full object-cover" alt="" />
                <span className="text-xs text-blue-400">{selectedEmployee.name} ({selectedEmployee.jobTitle})</span>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-blue-400/50 hover:text-red-400">
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
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
              {isSearching && <Loader2 size={16} className="absolute right-3 animate-spin text-gray-500" />}
            </div>
          )}

          {filteredEmployees.length > 0 && !selectedEmployee && (
            <ul className="absolute top-[100%] w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-48 overflow-y-auto z-50 shadow-xl">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
                  onClick={() => {
                    setSelectedEmployee({
                      id: emp._id,
                      name: `${emp.general.firstName} ${emp.general.lastName}`,
                      firstName: emp.general.firstName,
                      lastName: emp.general.lastName,
                      img: emp.general.avatar,
                      jobTitle: emp.employee?.jobTitle || "Software Engineer"
                    });
                    setEmployeeSearch("");
                    setFilteredEmployees([]);
                  }}
                >
                  <img src={emp.general.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <span>{emp.general.firstName} {emp.general.lastName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button type="button" className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-full text-sm" onClick={onClose}>Cancel</button>
          <button
            type="button"
            onClick={handleSaveTask}
            disabled={loading}
            className="flex-1 bg-white text-black py-2.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}