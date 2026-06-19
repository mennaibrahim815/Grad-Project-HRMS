
import { X, Plus, Trash, Upload, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import API from "@/services/axios";
import Swal from "sweetalert2";

export default function AddProjectModal({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("description");
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [subTasks, setSubTasks] = useState([]);

  const statusOptions = ["On-going", "Pending", "Completed"];
  const priorityOptions = ["High", "Medium", "Low"];
  const tagOptions = ["UI Design", "Marketing", "Social Media"];

  const fields = [
    { name: "Project Name", key: "name", type: "text" },
    { name: "Status", key: "status", type: "dropdown", options: statusOptions },
    { name: "Priority", key: "priority", type: "dropdown", options: priorityOptions },
    { name: "Assigned To", key: "assignedTo", type: "search" },
    { name: "Due Date", key: "deadline", type: "date" },
    { name: "Tag", key: "tag", type: "dropdown", options: tagOptions },
    { name: "Project Image URL", key: "avatar", type: "text" },
  ];

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

  const handleFileChange = (e) => {
    setDocuments([...documents, ...Array.from(e.target.files)]);
  };

  const handleAddSubTask = () => {
    setSubTasks([
      ...subTasks,
      {
        title: "",
        deadline: new Date().toISOString().split('T')[0],
        status: "Pending",
        priority: "Medium",
        assignedTo: null 
      }
    ]);
  };

  const handleUpdateSubTask = (index, key, value) => {
    const updated = [...subTasks];
    updated[index][key] = value;
    setSubTasks(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = storedUser.id || storedUser._id || "69dcdb2670c70abce2167b86"; 

    const data = new FormData();
    
    // دالة صارمة لضمان صيغة التاريخ YYYY-MM-DD وحل مشكلة السلاش
    const formatDate = (dateStr) => {
      if (!dateStr) return new Date().toISOString().split('T')[0];
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) {
          return new Date().toISOString().split('T')[0];
        }
        return d.toISOString().split('T')[0];
      } catch (e) {
        return new Date().toISOString().split('T')[0];
      }
    };

    // 1. كائن الـ general الأساسي للمشروع
    data.append("general[avatar]", formData["avatar"] || "https://res.cloudinary.com/dh4qznqpd/image/upload/v1777762868/hrms_project_uploads/mbtwn24disxv0brmcpbs.jpg");
    data.append("general[name]", formData["name"] || "");
    data.append("general[description]", formData["description"] || ""); 
    data.append("general[createdBy]", currentUserId);
    data.append("general[startDate]", formatDate(new Date()));
    data.append("general[deadline]", formatDate(formData["deadline"]));
    data.append("general[tag]", formData["tag"] || "UI Design");

    // 2. الحقول الأساسية على الـ Root مباشرة
    data.append("status", formData["status"] || "Pending");
    data.append("priority", formData["priority"] || "High");

    // 3. تعديل الهيكل ليرسل Object سليم للباك إند لحل (expected object)
    selectedEmployees.forEach((emp, index) => {
      data.append(`assignedTo[${index}][_id]`, emp.id);
      data.append(`assignedTo[${index}][general][firstName]`, emp.firstName || "");
      data.append(`assignedTo[${index}][general][lastName]`, emp.lastName || "");
      data.append(`assignedTo[${index}][general][avatar]`, emp.img || "");
      data.append(`assignedTo[${index}][employee][jobTitle]`, emp.jobTitle || "");
    });

    // 4. ضبط تفكيك الـ subTasks والتاريخ بصيغة YYYY-MM-DD
    subTasks.forEach((task, index) => {
      data.append(`subTasks[${index}][title]`, task.title || "");
      data.append(`subTasks[${index}][deadline]`, formatDate(task.deadline));
      data.append(`subTasks[${index}][status]`, task.status || "Pending");
      data.append(`subTasks[${index}][priority]`, task.priority || "Medium");
      
      // هنا التعديل السحري: إرسال الـ assignedTo جوه الـ subTask كمصفوفة كائنات كاملة
      if (task.assignedTo) {
        data.append(`subTasks[${index}][assignedTo][0][_id]`, task.assignedTo.id);
        data.append(`subTasks[${index}][assignedTo][0][general][firstName]`, task.assignedTo.firstName || "");
        data.append(`subTasks[${index}][assignedTo][0][general][lastName]`, task.assignedTo.lastName || "");
        data.append(`subTasks[${index}][assignedTo][0][general][avatar]`, task.assignedTo.img || "");
        data.append(`subTasks[${index}][assignedTo][0][employee][jobTitle]`, task.assignedTo.jobTitle || "");
      } else {
        // لو مفيش موظف للتاسك الفرعية ابعتي مصفوفة فاضية عشان الباك إند ميعلقش
        data.append(`subTasks[${index}][assignedTo]`, "[]");
      }
    });

    // 5. الـ Documents
    if (documents.length > 0) {
      documents.forEach((file) => {
        data.append("documents[]", file); 
      });
    }

    try {
      const response = await API.post("/projects", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data.status === "success") {
        Swal.fire({
          title: "Success!",
          text: "Project created successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#182731",
          color: "#fff",
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating project:", error.response?.data);
      const backendError = error.response?.data?.message;
      let errMsg = "Error saving project";

      if (Array.isArray(backendError)) {
        errMsg = backendError.map(err => `${err.field || 'Field'}: ${err.message}`).join("\n");
      } else if (typeof backendError === "string") {
        errMsg = backendError;
      } else if (backendError?.message) {
        errMsg = backendError.message;
      }

      Swal.fire({
        title: "Error!",
        text: errMsg,
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
      
      <div className="relative w-[480px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-medium">Add Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full">
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {fields.map((field) => (
          <div key={field.key} className="flex flex-col mb-4 relative">
            <label className="text-gray-400 text-sm mb-1">{field.name}</label>
            
            {field.type === "text" && (
              <input
                type="text"
                placeholder={`Enter ${field.name}`}
                value={formData[field.key] || ""}
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "dropdown" && (
              <select
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                value={formData[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              >
                <option value="">Select {field.name}</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {field.type === "date" && (
              <input
                type="date"
                value={formData[field.key] || ""}
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 [color-scheme:dark]"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "search" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg">
                      <img src={emp.img || "https://i.pravatar.cc/100"} className="w-4 h-4 rounded-full object-cover" alt="" />
                      <span className="text-[11px] text-blue-400">{emp.name}</span>
                      <button 
                        type="button"
                        onClick={() => setSelectedEmployees(prev => prev.filter(e => e.id !== emp.id))}
                        className="text-blue-400/50 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search and add employees..."
                    value={employeeSearch}
                    className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                  {isSearching && <Loader2 size={16} className="absolute right-3 animate-spin text-gray-500" />}
                </div>

                {filteredEmployees.length > 0 && (
                  <ul className="absolute w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-48 overflow-y-auto z-50">
                    {filteredEmployees.map((emp) => (
                      <li
                        key={emp._id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
                        onClick={() => {
                          if (!selectedEmployees.find(e => e.id === emp._id)) {
                            setSelectedEmployees([...selectedEmployees, {
                              id: emp._id,
                              name: `${emp.general.firstName} ${emp.general.lastName}`,
                              firstName: emp.general.firstName,
                              lastName: emp.general.lastName,
                              img: emp.general.avatar,
                              jobTitle: emp.employee?.jobTitle || "Employee"
                            }]);
                          }
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
            )}
          </div>
        ))}

        <div className="flex bg-[#1B1E22] rounded-full p-1 mb-4 w-fit mt-6">
          <button type="button" onClick={() => setActiveTab("description")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Description</button>
          <button type="button" onClick={() => setActiveTab("subtasks")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === "subtasks" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Sub Tasks</button>
          <button type="button" onClick={() => setActiveTab("document")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Documents</button>
        </div>

        {activeTab === "description" && (
          <textarea
            className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4 resize-none"
            placeholder="Add detailed project description..."
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        )}

        {activeTab === "subtasks" && (
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Project Sub Tasks</span>
              <button 
                type="button" 
                onClick={handleAddSubTask}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Plus size={14} /> Add SubTask
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {subTasks.map((task, index) => (
                <div key={index} className="bg-[#1B1E22] border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="SubTask Title"
                      value={task.title}
                      className="flex-1 bg-[#0D0F14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      onChange={(e) => handleUpdateSubTask(index, "title", e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setSubTasks(subTasks.filter((_, i) => i !== index))}
                      className="text-gray-500 hover:text-red-400 p-1.5"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={task.status}
                      className="bg-[#0D0F14] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none"
                      onChange={(e) => handleUpdateSubTask(index, "status", e.target.value)}
                    >
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select
                      value={task.priority}
                      className="bg-[#0D0F14] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none"
                      onChange={(e) => handleUpdateSubTask(index, "priority", e.target.value)}
                    >
                      {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  <input
                    type="date"
                    value={task.deadline || ""}
                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white outline-none [color-scheme:dark]"
                    onChange={(e) => handleUpdateSubTask(index, "deadline", e.target.value)}
                  />

                  <select
                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none"
                    value={task.assignedTo ? task.assignedTo.id : ""}
                    onChange={(e) => {
                      const empId = e.target.value;
                      const fullEmp = selectedEmployees.find(emp => emp.id === empId);
                      handleUpdateSubTask(index, "assignedTo", fullEmp || null);
                    }}
                  >
                    <option value="">Assign Employee...</option>
                    {selectedEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "document" && (
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500">
              <Upload size={24} className="mb-2" />
              <span className="text-xs">Click to upload files (Optional)</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
            <ul className="mt-3 space-y-1">
              {documents.map((doc, i) => (
                <div key={i} className="text-gray-400 text-[11px] flex items-center justify-between bg-[#1B1E22] px-3 py-1.5 rounded-lg">
                  <span className="truncate max-w-[280px]">{doc.name}</span>
                  <button type="button" onClick={() => setDocuments(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button type="button" className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-full" onClick={onClose}>Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || selectedEmployees.length === 0}
            className="flex-1 bg-white text-black py-2.5 rounded-full font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}