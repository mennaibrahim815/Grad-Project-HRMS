
import { X, Plus, Trash, Upload, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import API from "@/services/axios";
import Swal from "sweetalert2"; // 1. استيراد المكتبة

export default function AddProjectModal({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("description");
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    setLoading(true);
    
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = storedUser.id || storedUser._id || "69dcdb2670c70abce2167b86"; 

    const projectPayload = {
      general: {
        avatar: formData["avatar"] || "https://res.cloudinary.com/dh4qznqpd/image/upload/v1777762868/hrms_project_uploads/mbtwn24disxv0brmcpbs.jpg",
        name: formData["name"] || "",
        description: formData["description"] || "", 
        createdBy: currentUserId,
        startDate: new Date().toISOString(),
        deadline: formData["deadline"] ? new Date(formData["deadline"]).toISOString() : null,
        tag: formData["tag"] || "UI Design",
      },
      assignment: {
        assignedTo: selectedEmployees.map(emp => ({
          _id: emp.id,
          general: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            avatar: emp.img
          },
          employee: {
            jobTitle: emp.jobTitle
          }
        })), 
        status: formData["status"] || "On-going",
        priority: formData["priority"] || "Medium",
      },
      documents: documents.map((d) => ({ name: d.name })),
    };

    try {
      const response = await API.post("/projects", projectPayload);
      if (response.data.status === "success") {
        // 2. استبدال الـ Alert بشكل شيك
        Swal.fire({
          title: "Success!",
          text: "Project created successfully!",
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
      console.error("Error creating project:", error);
      // 3. استبدال Alert الخطأ
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message?.[0]?.message || "Error saving project",
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
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
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
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "dropdown" && (
              <select
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              >
                <option value="">Select {field.name}</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {field.type === "date" && (
              <input
                type="date"
                className="w-full bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "search" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg">
                      <img src={emp.img || "https://i.pravatar.cc/100"} className="w-4 h-4 rounded-full" alt="" />
                      <span className="text-[11px] text-blue-400">{emp.name}</span>
                      <button 
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
                              jobTitle: emp.employee?.jobTitle || "Team Member"
                            }]);
                          }
                          setEmployeeSearch("");
                          setFilteredEmployees([]);
                        }}
                      >
                        <img src={emp.general.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full" alt="" />
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
          <button onClick={() => setActiveTab("description")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Description</button>
          <button onClick={() => setActiveTab("document")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Documents</button>
        </div>

        {activeTab === "description" && (
          <textarea
            className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4 resize-none"
            placeholder="Add detailed project description..."
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        )}

        {activeTab === "document" && (
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500">
              <Upload size={24} className="mb-2" />
              <span className="text-xs">Click to upload files</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
            <ul className="mt-3 space-y-1">
              {documents.map((doc, i) => (
                <li key={i} className="text-gray-400 text-[11px] flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" /> {doc.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-full" onClick={onClose}>Cancel</button>
          <button
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