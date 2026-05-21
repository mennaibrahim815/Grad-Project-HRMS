
// import { X, Plus, Trash, Upload } from "lucide-react";
// import { useState } from "react";

// export default function AddProjectModal({ onClose }) {
//   const [activeTab, setActiveTab] = useState("description");
//   const [formData, setFormData] = useState({});
//   const [subtasks, setSubtasks] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState("");

//   const employeeList = [
//     { name: "Ali Mohamed", img: "https://i.pravatar.cc/32?img=1" },
//     { name: "Sara Ahmed", img: "https://i.pravatar.cc/32?img=2" },
//     { name: "Omar Hassan", img: "https://i.pravatar.cc/32?img=3" },
//     { name: "Nour El-Sayed", img: "https://i.pravatar.cc/32?img=4" },
//     { name: "Mona Khaled", img: "https://i.pravatar.cc/32?img=5" },
//   ];

//   const [filteredEmployees, setFilteredEmployees] = useState(employeeList);
//   const statusOptions = ["On-going", "Pending", "Completed"];
//   const priorityOptions = ["High", "Medium", "Low"];
//   const tagOptions = ["Design", "Marketing", "UI UX Design", "Social Media"];

//   const fields = [
//     { name: "Project Name", type: "text" },
//     { name: "Status", type: "dropdown", options: statusOptions },
//     { name: "Priority", type: "dropdown", options: priorityOptions },
//     { name: "Assigned To", type: "search" },
//     { name: "Due Date", type: "date" },
//     { name: "Tag", type: "dropdown", options: tagOptions },
//     { name: "Created By", type: "text" },
//     { name: "Project Image", type: "file" },
//   ];

//   // File handlers
//   const handleFileChange = (e) => {
//     setDocuments([...documents, ...Array.from(e.target.files)]);
//     setFormData({ ...formData, "Project Image": e.target.files[0] });
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDocuments([...documents, ...Array.from(e.dataTransfer.files)]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   // Handle save
//   const handleSave = () => {
//     const nestedProject = {
//       general: {
//         image: formData["Project Image"] || "",
//         name: formData["Project Name"] || "",
//         description: formData["Description"] || "",
//         createdBy: formData["Created By"] || "",
//         dueDate: formData["Due Date"] || "",
//         tag: formData["Tag"] || "",
//       },
//       assignment: {
//         assignedTo: formData["Assigned To"] || "",
//         status: formData["Status"] || "",
//         priority: formData["Priority"] || "",
//       },
//       subtasks: subtasks.map((s) => ({ name: s.name, done: s.done })),
//       documents: documents.map((d) => ({ name: d.name })),
//     };

//     console.log("Nested Project Object:", nestedProject);
//     alert("Check console for nested project object!");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[999] flex justify-end">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       {/* Panel */}
//       <div className="relative w-[480px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto animate-slideIn">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-white text-lg font-medium">Add project</h2>
//           <button onClick={onClose}>
//             <X className="text-gray-400 hover:text-white" />
//           </button>
//         </div>

//         {/* Info Fields */}
//         {fields.map((field) => (
//           <div key={field.name} className="flex flex-col mb-4 relative">
//             <label className="text-gray-400 text-sm">{field.name}</label>

//             {/* Text input */}
//             {field.type === "text" && (
//               <input
//                 type="text"
//                 placeholder={`Enter ${field.name.toLowerCase()}`}
//                 value={formData[field.name] || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, [field.name]: e.target.value })
//                 }
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition"
//               />
//             )}

//             {/* Dropdown */}
//             {field.type === "dropdown" && (
//               <select
//                 value={formData[field.name] || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, [field.name]: e.target.value })
//                 }
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition"
//               >
//                 <option value="">Select {field.name}</option>
//                 {field.options.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             )}

//             {/* Date picker */}
//             {field.type === "date" && (
//               <input
//                 type="date"
//                 value={formData[field.name] || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, [field.name]: e.target.value })
//                 }
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition"
//               />
//             )}

//             {/* Searchable Assigned To with image */}
//             {field.type === "search" && (
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search employee..."
//                   value={employeeSearch}
//                   onChange={(e) => {
//                     setEmployeeSearch(e.target.value);
//                     setFilteredEmployees(
//                       employeeList.filter((emp) =>
//                         emp.name.toLowerCase().includes(e.target.value.toLowerCase())
//                       )
//                     );
//                   }}
//                   className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition"
//                 />
//                 {employeeSearch && filteredEmployees.length > 0 && (
//                   <ul className="absolute w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-32 overflow-y-auto z-10">
//                     {filteredEmployees.map((emp, idx) => (
//                       <li
//                         key={idx}
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
//                         onClick={() => {
//                           setEmployeeSearch(emp.name);
//                           setFormData({ ...formData, "Assigned To": emp.name });
//                           setFilteredEmployees([]);
//                         }}
//                       >
//                         <img src={emp.img} alt={emp.name} className="w-6 h-6 rounded-full" />
//                         {emp.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}

//             {/* File input */}
//             {field.type === "file" && (
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//               />
//             )}
//           </div>
//         ))}

//         {/* Tabs (Description / Document) */}
//         <div className="flex bg-[#1B1E22] rounded-full p-1 mb-4 w-fit">
//           <button
//             onClick={() => setActiveTab("description")}
//             className={`px-6 py-1.5 rounded-full text-sm transition ${
//               activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"
//             }`}
//           >
//             Description
//           </button>
//           <button
//             onClick={() => setActiveTab("document")}
//             className={`px-6 py-1.5 rounded-full text-sm transition ${
//               activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"
//             }`}
//           >
//             Document
//           </button>
//         </div>

//         {/* Tab Content */}
//         {activeTab === "description" && (
//           <textarea
//             placeholder="Add detailed description"
//             className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4"
//             value={formData["Description"] || ""}
//             onChange={(e) =>
//               setFormData({ ...formData, Description: e.target.value })
//             }
//           />
//         )}

//         {activeTab === "document" && (
//           <div
//             className="mb-4"
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//           >
//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500 transition">
//               <Upload size={24} className="mb-2" />
//               <span>Click or drag files here</span>
//               <input type="file" multiple onChange={handleFileChange} className="hidden" />
//             </label>
//             {documents.length > 0 && (
//               <ul className="mt-2 text-gray-300 text-sm">
//                 {documents.map((doc, idx) => (
//                   <li key={idx}>{doc.name}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {/* Subtasks */}
//         <div className="mt-4 mb-6">
//           <h3 className="text-white text-sm mb-2">Subtasks</h3>
//           <button
//             onClick={() => setSubtasks([...subtasks, { name: "", done: false }])}
//             className="flex items-center gap-2 text-blue-500 text-sm mb-3"
//           >
//             <Plus size={14} /> Add subtask
//           </button>
//           {subtasks.map((subtask, index) => (
//             <div key={index} className="flex items-center gap-2 mb-2">
//               <input
//                 type="checkbox"
//                 checked={subtask.done}
//                 onChange={(e) => {
//                   const newSubtasks = [...subtasks];
//                   newSubtasks[index].done = e.target.checked;
//                   setSubtasks(newSubtasks);
//                 }}
//               />
//               <input
//                 type="text"
//                 placeholder={`Subtask ${index + 1}`}
//                 value={subtask.name}
//                 onChange={(e) => {
//                   const newSubtasks = [...subtasks];
//                   newSubtasks[index].name = e.target.value;
//                   setSubtasks(newSubtasks);
//                 }}
//                 className="flex-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//               />
//               <button
//                 onClick={() => {
//                   const newSubtasks = subtasks.filter((_, i) => i !== index);
//                   setSubtasks(newSubtasks);
//                 }}
//                 className="text-red-500 hover:text-red-400"
//               >
//                 <Trash size={16} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 mt-6">
//           <button className="flex-1 border border-white/20 text-gray-300 py-2 rounded-full">
//             Save as draft
//           </button>
//           <button
//             onClick={handleSave}
//             className="flex-1 bg-gray-300 text-black py-2 rounded-full font-medium"
//           >
//             Save & publish
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { X, Plus, Trash, Upload } from "lucide-react";
// import { useState } from "react";
// import API from "@/services/axios"; // تأكدي من كتابة المسار الصحيح لملف الـ axios اللي بعتيه

// export default function AddProjectModal({ onClose }) {
//   const [activeTab, setActiveTab] = useState("description");
//   const [formData, setFormData] = useState({});
//   const [subtasks, setSubtasks] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // تحديث الـ IDs عشان تطابق الـ API
//   const employeeList = [
//     { id: "69dcdc7670c70abce2167b92", name: "Ali Mohamed", img: "https://i.pravatar.cc/32?img=1" },
//     { id: "69dcdc0270c70abce2167b8c", name: "Sara Ahmed", img: "https://i.pravatar.cc/32?img=2" },
//     { id: "69dcdc0270c70abce2167b8d", name: "Omar Hassan", img: "https://i.pravatar.cc/32?img=3" },
//   ];

//   const [filteredEmployees, setFilteredEmployees] = useState(employeeList);
//   const statusOptions = ["On-going", "Pending", "Completed"];
//   const priorityOptions = ["High", "Medium", "Low"];
//   const tagOptions = ["UI Design", "Marketing", "Social Media"];

//   const fields = [
//     { name: "Project Name", key: "name", type: "text" },
//     { name: "Status", key: "status", type: "dropdown", options: statusOptions },
//     { name: "Priority", key: "priority", type: "dropdown", options: priorityOptions },
//     { name: "Assigned To", key: "assignedTo", type: "search" },
//     { name: "Due Date", key: "deadline", type: "date" },
//     { name: "Tag", key: "tag", type: "dropdown", options: tagOptions },
//     { name: "Created By ID", key: "createdBy", type: "text" },
//     { name: "Project Image URL", key: "avatar", type: "text" }, // مؤقتاً كـ String لحد ما تظبطي رفع الصور
//   ];

//   const handleFileChange = (e) => {
//     setDocuments([...documents, ...Array.from(e.target.files)]);
//   };

//   const handleSave = async () => {
//     setLoading(true);
    
//     // تجهيز الـ Body بناءً على الـ Schema الخاصة بالـ API
//     const projectPayload = {
//       general: {
//         avatar: formData["avatar"] || "https://res.cloudinary.com/default-avatar.jpg",
//         name: formData["name"] || "",
//         description: formData["Description"] || "",
//         createdBy: formData["createdBy"] || "69dcdb2670c70abce2167b86", 
//         startDate: new Date().toISOString(),
//         deadline: formData["deadline"] ? new Date(formData["deadline"]).toISOString() : null,
//         tag: formData["tag"] || "UI Design",
//       },
//       assignment: {
//         assignedTo: formData["assignedTo"] ? [formData["assignedTo"]] : ["69dcdc7670c70abce2167b92"], // الـ API يتوقع المصفوفة فيها IDs
//         status: formData["status"] || "On-going",
//         priority: formData["priority"] || "Medium",
//       },
//       // ملحوظة: لو الـ API بيدعم الـ subtasks والـ documents ضيفيهم هنا
//       documents: documents.map((d) => ({ name: d.name })),
//     };

//     try {
//       // استخدام axios instance اللي انتي بعتيه
//       const response = await API.post("/projects", projectPayload);
      
//       if (response.data.status === "success") {
//         alert("تم إنشاء المشروع بنجاح!");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error creating project:", error);
//       alert(error.response?.data?.message || "حدث خطأ أثناء حفظ المشروع");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[999] flex justify-end">
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative w-[480px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-white text-lg font-medium">Add project</h2>
//           <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
//         </div>

//         {fields.map((field) => (
//           <div key={field.key} className="flex flex-col mb-4 relative">
//             <label className="text-gray-400 text-sm">{field.name}</label>
            
//             {field.type === "text" && (
//               <input
//                 type="text"
//                 placeholder={`Enter ${field.name}`}
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               />
//             )}

//             {field.type === "dropdown" && (
//               <select
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               >
//                 <option value="">Select {field.name}</option>
//                 {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//               </select>
//             )}

//             {field.type === "date" && (
//               <input
//                 type="date"
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               />
//             )}

//             {field.type === "search" && (
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search employee..."
//                   value={employeeSearch}
//                   className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                   onChange={(e) => {
//                     setEmployeeSearch(e.target.value);
//                     setFilteredEmployees(employeeList.filter(emp => emp.name.toLowerCase().includes(e.target.value.toLowerCase())));
//                   }}
//                 />
//                 {employeeSearch && filteredEmployees.length > 0 && (
//                   <ul className="absolute w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-32 overflow-y-auto z-10">
//                     {filteredEmployees.map((emp) => (
//                       <li
//                         key={emp.id}
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
//                         onClick={() => {
//                           setEmployeeSearch(emp.name);
//                           setFormData({ ...formData, assignedTo: emp.id });
//                           setFilteredEmployees([]);
//                         }}
//                       >
//                         <img src={emp.img} className="w-6 h-6 rounded-full" />
//                         {emp.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         <div className="flex bg-[#1B1E22] rounded-full p-1 mb-4 w-fit">
//           <button onClick={() => setActiveTab("description")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Description</button>
//           <button onClick={() => setActiveTab("document")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Document</button>
//         </div>

//         {activeTab === "description" && (
//           <textarea
//             className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4"
//             placeholder="Add detailed description"
//             onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
//           />
//         )}

//         {activeTab === "document" && (
//           <div className="mb-4">
//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500">
//               <Upload size={24} className="mb-2" />
//               <span>Click to upload files</span>
//               <input type="file" multiple onChange={handleFileChange} className="hidden" />
//             </label>
//             <ul className="mt-2 text-gray-300 text-sm">
//               {documents.map((doc, i) => <li key={i}>{doc.name}</li>)}
//             </ul>
//           </div>
//         )}

//         <div className="flex gap-4 mt-6">
//           <button className="flex-1 border border-white/20 text-gray-300 py-2 rounded-full">Save as draft</button>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="flex-1 bg-gray-300 text-black py-2 rounded-full font-medium hover:bg-white disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save & publish"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 
// import { X, Plus, Trash, Upload } from "lucide-react";
// import { useState } from "react";
// import API from "../../services/axios"; // تأكدي من كتابة المسار الصحيح لملف الـ axios

// // 1. إضافة onSuccess لخصائص المكون (Props)
// export default function AddProjectModal({ onClose, onSuccess }) {
//   const [activeTab, setActiveTab] = useState("description");
//   const [formData, setFormData] = useState({});
//   const [subtasks, setSubtasks] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // تحديث الـ IDs عشان تطابق الـ API
//   const employeeList = [
//     { id: "69dcdc7670c70abce2167b92", name: "Ali Mohamed", img: "https://i.pravatar.cc/32?img=1" },
//     { id: "69dcdc0270c70abce2167b8c", name: "Sara Ahmed", img: "https://i.pravatar.cc/32?img=2" },
//     { id: "69dcdc0270c70abce2167b8d", name: "Omar Hassan", img: "https://i.pravatar.cc/32?img=3" },
//   ];

//   const [filteredEmployees, setFilteredEmployees] = useState(employeeList);
//   const statusOptions = ["On-going", "Pending", "Completed"];
//   const priorityOptions = ["High", "Medium", "Low"];
//   const tagOptions = ["UI Design", "Marketing", "Social Media"];

//   const fields = [
//     { name: "Project Name", key: "name", type: "text" },
//     { name: "Status", key: "status", type: "dropdown", options: statusOptions },
//     { name: "Priority", key: "priority", type: "dropdown", options: priorityOptions },
//     { name: "Assigned To", key: "assignedTo", type: "search" },
//     { name: "Due Date", key: "deadline", type: "date" },
//     { name: "Tag", key: "tag", type: "dropdown", options: tagOptions },
//     { name: "Created By ID", key: "createdBy", type: "text" },
//     { name: "Project Image URL", key: "avatar", type: "text" },
//   ];

//   const handleFileChange = (e) => {
//     setDocuments([...documents, ...Array.from(e.target.files)]);
//   };

//   const handleSave = async () => {
//     setLoading(true);
    
//     const projectPayload = {
//       general: {
//         avatar: formData["avatar"] || "https://res.cloudinary.com/dh4qznqpd/image/upload/v1777762868/hrms_project_uploads/mbtwn24disxv0brmcpbs.jpg",
//         name: formData["name"] || "",
//         description: formData["Description"] || "",
//         createdBy: formData["createdBy"] || "69dcdb2670c70abce2167b86", 
//         startDate: new Date().toISOString(),
//         deadline: formData["deadline"] ? new Date(formData["deadline"]).toISOString() : null,
//         tag: formData["tag"] || "UI Design",
//       },
//       assignment: {
//         assignedTo: formData["assignedTo"] ? [formData["assignedTo"]] : ["69dcdc7670c70abce2167b92"],
//         status: formData["status"] || "On-going",
//         priority: formData["priority"] || "Medium",
//       },
//       documents: documents.map((d) => ({ name: d.name })),
//     };

//     try {
//       const response = await API.post("/projects", projectPayload);
      
//       if (response.data.status === "success") {
//         alert("تم إنشاء المشروع بنجاح! 🚀");
        
//         // 2. استدعاء onSuccess لتحديث الصفحة الأب قبل قفل المودال
//         if (onSuccess) {
//           onSuccess();
//         }
//       }
//     } catch (error) {
//       console.error("Error creating project:", error);
//       alert(error.response?.data?.message || "حدث خطأ أثناء حفظ المشروع");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[999] flex justify-end">
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative w-[480px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-white text-lg font-medium">Add project</h2>
//           <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
//         </div>

//         {fields.map((field) => (
//           <div key={field.key} className="flex flex-col mb-4 relative">
//             <label className="text-gray-400 text-sm">{field.name}</label>
            
//             {field.type === "text" && (
//               <input
//                 type="text"
//                 placeholder={`Enter ${field.name}`}
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               />
//             )}

//             {field.type === "dropdown" && (
//               <select
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               >
//                 <option value="">Select {field.name}</option>
//                 {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//               </select>
//             )}

//             {field.type === "date" && (
//               <input
//                 type="date"
//                 className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                 onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
//               />
//             )}

//             {field.type === "search" && (
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search employee..."
//                   value={employeeSearch}
//                   className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
//                   onChange={(e) => {
//                     setEmployeeSearch(e.target.value);
//                     setFilteredEmployees(employeeList.filter(emp => emp.name.toLowerCase().includes(e.target.value.toLowerCase())));
//                   }}
//                 />
//                 {employeeSearch && filteredEmployees.length > 0 && (
//                   <ul className="absolute w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-32 overflow-y-auto z-10">
//                     {filteredEmployees.map((emp) => (
//                       <li
//                         key={emp.id}
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
//                         onClick={() => {
//                           setEmployeeSearch(emp.name);
//                           setFormData({ ...formData, assignedTo: emp.id });
//                           setFilteredEmployees([]);
//                         }}
//                       >
//                         <img src={emp.img} className="w-6 h-6 rounded-full" />
//                         {emp.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         <div className="flex bg-[#1B1E22] rounded-full p-1 mb-4 w-fit">
//           <button onClick={() => setActiveTab("description")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Description</button>
//           <button onClick={() => setActiveTab("document")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Document</button>
//         </div>

//         {activeTab === "description" && (
//           <textarea
//             className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4"
//             placeholder="Add detailed description"
//             onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
//           />
//         )}

//         {activeTab === "document" && (
//           <div className="mb-4">
//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500">
//               <Upload size={24} className="mb-2" />
//               <span>Click to upload files</span>
//               <input type="file" multiple onChange={handleFileChange} className="hidden" />
//             </label>
//             <ul className="mt-2 text-gray-300 text-sm">
//               {documents.map((doc, i) => <li key={i}>{doc.name}</li>)}
//             </ul>
//           </div>
//         )}

//         <div className="flex gap-4 mt-6">
//           <button className="flex-1 border border-white/20 text-gray-300 py-2 rounded-full" onClick={onClose}>Cancel</button>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="flex-1 bg-gray-300 text-black py-2 rounded-full font-medium hover:bg-white disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save & publish"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }