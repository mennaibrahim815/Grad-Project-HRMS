

import { useState, useEffect } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "@/HrComponents/ProjectPageComponents/Column.jsx";
import ProjectHeader from "@/HrComponents/ProjectPageComponents/ProjectHeader.jsx";
import EditProjectModal from "@/HrComponents/ProjectPageComponents/EditProjectModal.jsx";
import DeleteModal from "@/components/UI/DeleteModel.jsx"; // استدعاء الموديل اللي عملناه
import API from "@/services/axios"; 

export default function Project() {
  // --- States ---
  const [columns, setColumns] = useState({
    "On-going": [],
    Pending: [],
    Completed: [],
  });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // حالات موديل الحذف
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // --- API Calls ---
  const fetchStats = async () => {
    try {
      const response = await API.get("/projects/stats");
      if (response.data.status === "success") setStats(response.data.data);
    } catch (error) { 
      console.error("Stats Error:", error); 
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await API.get("/projects?limit=100"); 
      if (response.data.status === "success") {
        distributeProjects(response.data.data.projects);
      }
    } catch (error) { 
      console.error("Projects Error:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const distributeProjects = (projectsList) => {
    const newColumns = {
      "On-going": projectsList.filter(p => p.assignment.status.toLowerCase() === "on-going"),
      Pending: projectsList.filter(p => p.assignment.status.toLowerCase() === "pending"),
      Completed: projectsList.filter(p => p.assignment.status.toLowerCase() === "completed"),
    };
    setColumns(newColumns);
  };

  // --- Handlers ---
  const handleSearch = async (query) => {
    if (!query || query.trim() === "") {
      fetchProjects();
      return;
    }
    try {
      const response = await API.get(`/projects/search?name=${query}`);
      if (response.data.status === "success") {
        distributeProjects(response.data.data.results);
      }
    } catch (error) { 
      console.error("Search Error:", error); 
    }
  };

  const handleUpdateProject = async (projectId, updatedData) => {
    try {
      const response = await API.patch(`/projects/${projectId}`, updatedData);
      if (response.data.status === "success") {
        fetchProjects();
        fetchStats();
      }
    } catch (error) {
      console.error("Update Error:", error.response?.data);
    }
  };

  // وظيفة فتح موديل الحذف وتخزين بيانات المشروع مؤقتاً
  const openDeleteModal = (id, name) => {
    setProjectToDelete({ id, title: name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await API.delete(`/projects/${projectToDelete.id}`);
      fetchProjects();
      fetchStats();
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete project");
      setIsDeleteModalOpen(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const projectId = active.id;
    const targetCol = over.id;

    try {
      await API.patch(`/projects/${projectId}`, { 
        assignment: { status: targetCol } 
      });
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      fetchProjects();
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-[1700px] mx-auto p-4 bg-transparent">
      {/* الهيدر */}
      <ProjectHeader 
        onProjectAdded={() => { fetchProjects(); fetchStats(); }} 
        stats={stats} 
        onSearch={handleSearch}
      />

      {/* موديل الحذف (Component مستدعى) */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={projectToDelete?.title}
        message="Are you sure you want to delete this project? This action will remove all associated tasks and data permanently."
      />

      {/* محتوى الصفحة */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="animate-pulse text-lg font-medium">Loading Projects...</div>
        </div>
      ) : (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.keys(columns).map((col) => (
              <Column
                key={col}
                id={col}
                title={col}
                onDeleteProject={(id) => {
                  // بنجيب اسم المشروع عشان نعرضه في موديل الحذف
                  const project = columns[col].find(p => p._id === id);
                  openDeleteModal(id, project?.general?.name);
                }}
                tasks={columns[col].map(p => ({
                  ...p,
                  id: p._id,
                  title: p.general.name,
                  description: p.general.description,
                  tag: p.general.tag,
                  avatar: p.general.avatar,
                  priority: p.assignment?.priority,
                  assignedTo: p.assignment?.assignedTo || [], 
                  onEdit: () => {
                    setSelectedProject({
                      id: p._id,
                      assignment: p.assignment,
                      title: p.general.name,
                      description: p.general.description,
                      tag: p.general.tag,
                      avatar: p.general.avatar,
                      priority: p.assignment?.priority,
                      status: p.assignment?.status
                    });
                    setIsEditModalOpen(true);
                  }
                }))}
              />
            ))}
          </div>
        </DndContext>
      )}

      {/* موديل التعديل */}
      {isEditModalOpen && selectedProject && (
        <EditProjectModal 
          project={selectedProject}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProject}
        />
      )}
    </div>
  );
}