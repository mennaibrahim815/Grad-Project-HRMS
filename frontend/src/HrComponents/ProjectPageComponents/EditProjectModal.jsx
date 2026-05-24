// import { useState } from "react";
// import { X, Link as LinkIcon, Loader2 } from "lucide-react";

// export default function EditProjectModal({ project, isOpen, onClose, onUpdate }) {
//   const [formData, setFormData] = useState({
//     name: project?.title || "",
//     description: project?.description || "",
//     tag: project?.tag || "",
//     priority: project?.priority || "Medium",
//     avatar: project?.avatar || "", 
//   });
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
    
//     const updatedData = {
//       general: {
//         name: formData.name,
//         description: formData.description,
//         tag: formData.tag,
//         avatar: formData.avatar, 
//       },
//       assignment: {
//         priority: formData.priority,
//         status: project.status
//       }
//     };

//     try {
//       await onUpdate(project.id, updatedData);
//       onClose();
//     } catch (error) {
//       console.error("Update failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//       <div className="bg-[#182731] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b border-slate-700">
//           <h2 className="text-slate-100 font-bold">Edit Project</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-4 space-y-4 text-right" dir="rtl">
//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1 mr-1">Project Name </label>
//             <input 
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//           </div>

//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1 mr-1">project Image(URL)</label>
//             <div className="relative">
//               <input 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
//                 placeholder="https://example.com/image.jpg"
//                 value={formData.avatar}
//                 onChange={(e) => setFormData({...formData, avatar: e.target.value})}
//               />
//               <LinkIcon className="absolute right-3 top-2.5 text-slate-500" size={16} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-[10px] text-slate-400 mb-1 mr-1">(Priority)</label>
//               <select 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none appearance-none cursor-pointer"
//                 value={formData.priority}
//                 onChange={(e) => setFormData({...formData, priority: e.target.value})}
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-[10px] text-slate-400 mb-1 mr-1">(Tag)</label>
//               <input 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
//                 value={formData.tag}
//                 onChange={(e) => setFormData({...formData, tag: e.target.value})}
//               />
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/10"
//           >
//             {loading && <Loader2 size={16} className="animate-spin" />}
//             Save
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { X, Link as LinkIcon, Loader2, Search } from "lucide-react";
// import API from "@/services/axios";

// export default function EditProjectModal({ project, isOpen, onClose, onUpdate }) {
//   // الـ State الأساسية للفورم - مع قيم افتراضية عشان مفيش حاجة تضرب
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     tag: "",
//     priority: "Medium",
//     avatar: "",
//   });

//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState("");
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // تحديث البيانات لما المودال يفتح
//   useEffect(() => {
//     if (project && isOpen) {
//       setFormData({
//         name: project.general?.name || project.name || "",
//         description: project.general?.description || project.description || "",
//         tag: project.general?.tag || project.tag || "",
//         priority: project.assignment?.priority || project.priority || "Medium",
//         avatar: project.general?.avatar || project.avatar || "",
//       });

//       // استخراج الموظفين بأمان
//       const currentStaff = project.assignment?.assignedTo?.map(emp => ({
//         id: emp._id || emp.id,
//         name: emp.general ? `${emp.general.firstName} ${emp.general.lastName}` : "Unknown",
//         firstName: emp.general?.firstName || "",
//         lastName: emp.general?.lastName || "",
//         img: emp.general?.avatar || "",
//         jobTitle: emp.employee?.jobTitle || ""
//       })) || [];
      
//       setSelectedEmployees(currentStaff);
//     }
//   }, [project, isOpen]);

//   // دالة البحث (Debounced)
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

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     // تأكدي إننا بنستخدم الـ ID الصح (سواء _id أو id)
//     const projectId = project._id || project.id;

//     const updatedData = {
//       general: {
//         name: formData.name,
//         description: formData.description,
//         tag: formData.tag,
//         avatar: formData.avatar,
//         createdBy: project.general?.createdBy,
//         startDate: project.general?.startDate,
//         deadline: project.general?.deadline,
//       },
//       assignment: {
//         priority: formData.priority,
//         status: project.assignment?.status || "On-going",
//         assignedTo: selectedEmployees.map(emp => ({
//           _id: emp.id,
//           general: {
//             firstName: emp.firstName,
//             lastName: emp.lastName,
//             avatar: emp.img
//           },
//           employee: { jobTitle: emp.jobTitle }
//         })),
//       }
//     };

//     try {
//       await onUpdate(projectId, updatedData);
//       onClose();
//     } catch (error) {
//       console.error("Update failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//       <div className="bg-[#182731] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b border-slate-700">
//           <h2 className="text-slate-100 font-bold">Edit Project</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
//           {/* Project Name */}
//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1">Project Name</label>
//             <input 
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//           </div>

//           {/* Assigned To */}
//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1">Assigned To</label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {selectedEmployees.map((emp) => (
//                 <div key={emp.id} className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
//                   <img src={emp.img || "https://i.pravatar.cc/100"} className="w-4 h-4 rounded-full" alt="" />
//                   <span className="text-[11px] text-cyan-400">{emp.name}</span>
//                   <button type="button" onClick={() => setSelectedEmployees(prev => prev.filter(e => e.id !== emp.id))} className="text-cyan-400/50 hover:text-red-400">
//                     <X size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <div className="relative">
//               <input 
//                 type="text"
//                 placeholder="Search to add team members..."
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
//                 value={employeeSearch}
//                 onChange={(e) => setEmployeeSearch(e.target.value)}
//               />
//               <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
//               {isSearching && <Loader2 size={16} className="absolute right-3 top-2.5 animate-spin text-cyan-500" />}

//               {filteredEmployees.length > 0 && (
//                 <ul className="absolute w-full bg-[#1B1E22] border border-slate-700 mt-1 rounded-xl max-h-40 overflow-y-auto z-50 shadow-2xl">
//                   {filteredEmployees.map((emp) => (
//                     <li
//                       key={emp._id}
//                       className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer text-white text-xs border-b border-white/5"
//                       onClick={() => {
//                         if (!selectedEmployees.find(e => e.id === emp._id)) {
//                           setSelectedEmployees([...selectedEmployees, {
//                             id: emp._id,
//                             name: `${emp.general.firstName} ${emp.general.lastName}`,
//                             firstName: emp.general.firstName,
//                             lastName: emp.general.lastName,
//                             img: emp.general.avatar,
//                             jobTitle: emp.employee?.jobTitle || "Team Member"
//                           }]);
//                         }
//                         setEmployeeSearch("");
//                         setFilteredEmployees([]);
//                       }}
//                     >
//                       <img src={emp.general.avatar || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full" alt="" />
//                       <span>{emp.general.firstName} {emp.general.lastName}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Image URL */}
//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1">Project Image (URL)</label>
//             <div className="relative">
//               <input 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-3 pl-9 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
//                 value={formData.avatar}
//                 onChange={(e) => setFormData({...formData, avatar: e.target.value})}
//               />
//               <LinkIcon className="absolute left-3 top-2.5 text-slate-500" size={16} />
//             </div>
//           </div>

//           {/* Priority & Tag */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-[10px] text-slate-400 mb-1">Priority</label>
//               <select 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
//                 value={formData.priority}
//                 onChange={(e) => setFormData({...formData, priority: e.target.value})}
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-[10px] text-slate-400 mb-1">Tag</label>
//               <input 
//                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
//                 value={formData.tag}
//                 onChange={(e) => setFormData({...formData, tag: e.target.value})}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] text-slate-400 mb-1">Description</label>
//             <textarea 
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 h-20 resize-none"
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//             />
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
//           >
//             {loading && <Loader2 size={16} className="animate-spin" />}
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { X, Link as LinkIcon, Loader2, Search, Upload, FileText } from "lucide-react";
import API from "@/services/axios";

export default function EditProjectModal({ project, isOpen, onClose, onUpdate }) {
  // الـ State الأساسية للفورم
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tag: "",
    priority: "Medium",
    avatar: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // حالات الملفات (الملفات السابقة القادمة من السيرفر والملفات الجديدة المرفوعة حالياً)
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const fileInputRef = useRef(null);

  // تحديث البيانات لما المودال يفتح
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        name: project.general?.name || project.name || "",
        description: project.general?.description || project.description || "",
        tag: project.general?.tag || project.tag || "",
        priority: project.assignment?.priority || project.priority || "Medium",
        avatar: project.general?.avatar || project.avatar || "",
      });

      // الاحتفاظ بالملفات القديمة الموجودة بالفعل في المشروع
      setExistingDocuments(project.documents || []);
      setNewDocuments([]); // تصفير الملفات الجديدة عند فتح المشروع

      // استخراج الموظفين بأمان
      const currentStaff = project.assignment?.assignedTo?.map(emp => ({
        id: emp._id || emp.id,
        name: emp.general ? `${emp.general.firstName} ${emp.general.lastName}` : "Unknown",
        firstName: emp.general?.firstName || "",
        lastName: emp.general?.lastName || "",
        img: emp.general?.avatar || "",
        jobTitle: emp.employee?.jobTitle || ""
      })) || [];
      
      setSelectedEmployees(currentStaff);
    }
  }, [project, isOpen]);

  // دالة البحث (Debounced) عن الموظفين
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

  if (!isOpen) return null;

  // معالجة اختيار ملفات جديدة من الجهاز
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewDocuments((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const projectId = project._id || project.id;

    // بناء الـ FormData بدلاً من Object الـ JSON العادي لدعم رفع الملفات
    const data = new FormData();

    // 1. البيانات العامة (general) بصيغة Form-Data مطابقة لتوقعات الباك إند
    data.append("general[name]", formData.name);
    data.append("general[description]", formData.description);
    data.append("general[tag]", formData.tag);
    data.append("general[avatar]", formData.avatar);
    if (project.general?.createdBy) data.append("general[createdBy]", project.general.createdBy);
    if (project.general?.startDate) data.append("general[startDate]", project.general.startDate);
    if (project.general?.deadline) data.append("general[deadline]", project.general.deadline);

    // 2. بيانات التكليف والترتيب (assignment)
    data.append("assignment[priority]", formData.priority);
    data.append("assignment[status]", project.assignment?.status || "On-going");

    // 3. تمرير المصفوفات المعقدة (الموظفين المختارين) للباك إند خطوة خطوة
    selectedEmployees.forEach((emp, index) => {
      data.append(`assignment[assignedTo][${index}][_id]`, emp.id);
      data.append(`assignment[assignedTo][${index}][general][firstName]`, emp.firstName);
      data.append(`assignment[assignedTo][${index}][general][lastName]`, emp.lastName);
      data.append(`assignment[assignedTo][${index}][general][avatar]`, emp.img);
      data.append(`assignment[assignedTo][${index}][employee][jobTitle]`, emp.jobTitle);
    });

    // 4. إرسال الملفات القديمة التي لم يتم حذفها (على هيئة نصوص أو روابط)
    existingDocuments.forEach((doc) => {
      data.append("documents", doc);
    });

    // 5. إضافة الملفات الجديدة المرفوعة (كـ Binary Files حقيقية)
    newDocuments.forEach((file) => {
      data.append("documents", file); 
    });

    try {
      // إرسال الـ FormData مباشرةً بدلاً من الـ object
      await onUpdate(projectId, data);
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#182731] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-slate-100 font-bold">Edit Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        
        {/* Form body with scroll toggle */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto flex-1">
          {/* Project Name */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Project Name</label>
            <input 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Assigned To</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
                  <img src={emp.img || "https://i.pravatar.cc/100"} className="w-4 h-4 rounded-full object-cover" alt="" />
                  <span className="text-[11px] text-cyan-400">{emp.name}</span>
                  <button type="button" onClick={() => setSelectedEmployees(prev => prev.filter(e => e.id !== emp.id))} className="text-cyan-400/50 hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="Search to add team members..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              {isSearching && <Loader2 size={16} className="absolute right-3 top-2.5 animate-spin text-cyan-500" />}

              {filteredEmployees.length > 0 && (
                <ul className="absolute w-full bg-[#1B1E22] border border-slate-700 mt-1 rounded-xl max-h-40 overflow-y-auto z-50 shadow-2xl">
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp._id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer text-white text-xs border-b border-white/5"
                      onClick={() => {
                        if (!selectedEmployees.find(e => e.id === emp._id)) {
                          setSelectedEmployees([...selectedEmployees, {
                            id: emp._id,
                            name: `${emp.general.firstName} ${emp.general.lastName}`,
                            firstName: emp.general.firstName,
                            lastName: emp.general.lastName,
                            img: emp.general.avatar,
                            jobTitle: emp.employee?.jobTitle || "Team Member"
                          }]);
                        }
                        setEmployeeSearch("");
                        setFilteredEmployees([]);
                      }}
                    >
                      <img src={emp.general.avatar || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full object-cover" alt="" />
                      <span>{emp.general.firstName} {emp.general.lastName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Project Image URL */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Project Image (URL)</label>
            <div className="relative">
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-3 pl-9 py-2 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              />
              <LinkIcon className="absolute left-3 top-2.5 text-slate-500" size={16} />
            </div>
          </div>

          {/* Documents Upload Section - السيكشن الجديد بالكامل */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Project Files & Documents</label>
            
            {/* عرض الملفات المرفوعة مسبقاً مع إمكانية حذفها */}
            {existingDocuments.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Current Files:</p>
                {existingDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-cyan-500 flex-shrink-0" />
                      <span className="truncate max-w-[280px]">{typeof doc === 'string' ? doc.split('/').pop() : `Document ${idx+1}`}</span>
                    </div>
                    <button type="button" onClick={() => setExistingDocuments(prev => prev.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* عرض الملفات الجديدة التي تم اختيارها حالياً قبل الحفظ */}
            {newDocuments.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <p className="text-[9px] text-emerald-500 uppercase font-semibold">New Files to Upload:</p>
                {newDocuments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-xs text-emerald-400">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate max-w-[280px]">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => setNewDocuments(prev => prev.filter((_, i) => i !== idx))} className="text-emerald-400/50 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* منطقة سحب وإفلات / رفع ملف جديد */}
            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-900/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
            >
              <Upload size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">Click to upload or append project documents</span>
            </div>
          </div>

          {/* Priority & Tag */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Priority</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Tag</label>
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Description</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 h-20 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 flex-shrink-0"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}