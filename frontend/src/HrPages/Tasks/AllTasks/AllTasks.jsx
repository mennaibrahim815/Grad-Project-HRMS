
import React, { useState, useEffect } from "react";
import TasksTable from "@/HrComponents/TasksComponents/AllTasksTable.jsx";
import EditTaskModal from "@/HrComponents/TasksComponents/EditTaskModal.jsx";
import TasksStatsCards from "@/HrComponents/TasksComponents/TasksStatsCards.jsx";
import API from "@/services/axios";
import { ListTodo, AlertCircle } from "lucide-react";

export default function HrAllTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 });

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await API.get("/tasks/stats");
      if (response.data?.status === "success" && response.data?.data) setStats(response.data.data);
    } catch (err) {
      console.error("Error fetching task statistics:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTasks = async (page = 1, currentLimit = pagination.limit, query = searchTitle, status = statusFilter) => {
    try {
      setLoading(true);
      const isSearching = query.trim() !== "";
      let url = isSearching
        ? `/tasks/search?title=${encodeURIComponent(query)}&page=${page}&limit=${currentLimit}`
        : `/tasks?page=${page}&limit=${currentLimit}`;
      if (status !== "All") url += `&status=${status}`;

      const response = await API.get(url);
      if (response.data?.status === "success" && response.data?.data) {
        const incomingTasks = isSearching ? response.data.data.results : response.data.data.tasks;
        setTasks(incomingTasks || []);
        setPagination(response.data.data.pagination
          ? { currentPage: response.data.data.pagination.currentPage, totalPages: response.data.data.pagination.totalPages, limit: response.data.data.pagination.limit, totalRecords: response.data.data.pagination.totalRecords }
          : { currentPage: page, totalPages: Math.ceil((incomingTasks?.length || 0) / currentLimit) || 1, limit: currentLimit, totalRecords: incomingTasks?.length || 0 }
        );
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchTasks(1, pagination.limit, searchTitle, statusFilter); }, [statusFilter]);

  const handleSearchChange = (val) => { setSearchTitle(val); fetchTasks(1, pagination.limit, val, statusFilter); };
  const handleEditClick = (task) => { setSelectedTaskToEdit(task); setIsEditModalOpen(true); };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const response = await API.patch(`/tasks/${id}`, updatedData);
      if (response.data?.status === "success" && response.data?.data?.task) {
        setTasks(prev => prev.map(task => task._id === id ? { ...task, ...response.data.data.task } : task));
        setIsEditModalOpen(false);
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update the task.");
    }
  };

  const handleCancelOrDeleteTask = async (id) => {
    try {
      const response = await API.delete(`/tasks/${id}`);
      if (response.data?.status === "success" || response.status === 200) {
        setTasks(prev => prev.filter(task => task._id !== id));
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete the task.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-10" style={{ color: 'var(--text-main)' }}>
          <ListTodo size={26} style={{ color: 'var(--accent-cyan)' }} />
          All System Tasks
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Manage, track, complete, or remove tasks distributed across your organizational system.
        </p>
      </div>

      <TasksStatsCards stats={stats} loading={statsLoading} />

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <TasksTable
        tasks={tasks} loading={loading}
        onDeleteTask={handleCancelOrDeleteTask}
        onEditClick={handleEditClick}
        searchTitle={searchTitle}
        setSearchTitle={handleSearchChange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination}
        onPageChange={(p) => fetchTasks(p, pagination.limit, searchTitle, statusFilter)}
        onLimitChange={(l) => fetchTasks(1, l, searchTitle, statusFilter)}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTaskToEdit}
        onSave={handleUpdateTask}
      />
    </div>
  );
}