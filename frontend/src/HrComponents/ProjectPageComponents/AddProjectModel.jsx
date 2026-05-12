
import { X, Plus, Trash, Upload } from "lucide-react";
import { useState } from "react";
import API from "@/services/axios"; // تأكدي من كتابة المسار الصحيح لملف الـ axios

// 1. إضافة onSuccess لخصائص المكون (Props)
export default function AddProjectModal({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("description");
  const [formData, setFormData] = useState({});
  const [subtasks, setSubtasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // تحديث الـ IDs عشان تطابق الـ API
  const employeeList = [
    { id: "69dcdc7670c70abce2167b92", name: "Ali Mohamed", img: "https://i.pravatar.cc/32?img=1" },
    { id: "69dcdc0270c70abce2167b8c", name: "Sara Ahmed", img: "https://i.pravatar.cc/32?img=2" },
    { id: "69dcdc0270c70abce2167b8d", name: "Omar Hassan", img: "https://i.pravatar.cc/32?img=3" },
  ];

  const [filteredEmployees, setFilteredEmployees] = useState(employeeList);
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
    { name: "Created By ID", key: "createdBy", type: "text" },
    { name: "Project Image URL", key: "avatar", type: "text" },
  ];

  const handleFileChange = (e) => {
    setDocuments([...documents, ...Array.from(e.target.files)]);
  };

  const handleSave = async () => {
    setLoading(true);
    
    const projectPayload = {
      general: {
        avatar: formData["avatar"] || "https://res.cloudinary.com/dh4qznqpd/image/upload/v1777762868/hrms_project_uploads/mbtwn24disxv0brmcpbs.jpg",
        name: formData["name"] || "",
        description: formData["Description"] || "",
        createdBy: formData["createdBy"] || "69dcdb2670c70abce2167b86", 
        startDate: new Date().toISOString(),
        deadline: formData["deadline"] ? new Date(formData["deadline"]).toISOString() : null,
        tag: formData["tag"] || "UI Design",
      },
      assignment: {
        assignedTo: formData["assignedTo"] ? [formData["assignedTo"]] : ["69dcdc7670c70abce2167b92"],
        status: formData["status"] || "On-going",
        priority: formData["priority"] || "Medium",
      },
      documents: documents.map((d) => ({ name: d.name })),
    };

    try {
      const response = await API.post("/projects", projectPayload);
      
      if (response.data.status === "success") {
        alert("project created successfully");
        
        // 2. استدعاء onSuccess لتحديث الصفحة الأب قبل قفل المودال
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء حفظ المشروع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-[480px] h-full bg-[#0D0F14] border-l border-white/10 px-8 py-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-medium">Add project</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
        </div>

        {fields.map((field) => (
          <div key={field.key} className="flex flex-col mb-4 relative">
            <label className="text-gray-400 text-sm">{field.name}</label>
            
            {field.type === "text" && (
              <input
                type="text"
                placeholder={`Enter ${field.name}`}
                className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "dropdown" && (
              <select
                className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              >
                <option value="">Select {field.name}</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {field.type === "date" && (
              <input
                type="date"
                className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}

            {field.type === "search" && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="employee id"
                  value={employeeSearch}
                  className="w-full mt-1 bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  onChange={(e) => {
                    setEmployeeSearch(e.target.value);
                    setFilteredEmployees(employeeList.filter(emp => emp.name.toLowerCase().includes(e.target.value.toLowerCase())));
                  }}
                />
                {employeeSearch && filteredEmployees.length > 0 && (
                  <ul className="absolute w-full bg-[#1B1E22] border border-white/10 mt-1 rounded-xl max-h-32 overflow-y-auto z-10">
                    {filteredEmployees.map((emp) => (
                      <li
                        key={emp.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2E35] cursor-pointer text-white text-sm"
                        onClick={() => {
                          setEmployeeSearch(emp.name);
                          setFormData({ ...formData, assignedTo: emp.id });
                          setFilteredEmployees([]);
                        }}
                      >
                        <img src={emp.img} className="w-6 h-6 rounded-full" />
                        {emp.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex bg-[#1B1E22] rounded-full p-1 mb-4 w-fit">
          <button onClick={() => setActiveTab("description")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Description</button>
          <button onClick={() => setActiveTab("document")} className={`px-6 py-1.5 rounded-full text-sm ${activeTab === "document" ? "bg-[#2A2E35] text-white" : "text-gray-400"}`}>Document</button>
        </div>

        {activeTab === "description" && (
          <textarea
            className="w-full h-28 bg-[#1B1E22] border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-4"
            placeholder="Add detailed description"
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
          />
        )}

        {activeTab === "document" && (
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 text-gray-400 cursor-pointer hover:border-blue-500">
              <Upload size={24} className="mb-2" />
              <span>Click to upload files</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
            <ul className="mt-2 text-gray-300 text-sm">
              {documents.map((doc, i) => <li key={i}>{doc.name}</li>)}
            </ul>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button className="flex-1 border border-white/20 text-gray-300 py-2 rounded-full" onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gray-300 text-black py-2 rounded-full font-medium hover:bg-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & publish"}
          </button>
        </div>
      </div>
    </div>
  );
}