import React, { useState, useEffect } from "react";
import TasksTable from "@/HrComponents/TasksComponents/AllTasksTable.jsx"; // تأكدي من ضبط المسار الصحيح للمكون
import API from "@/services/axios"; // مسار الـ axios الخاص بمشروعك
import { ListTodo, Loader2, AlertCircle } from "lucide-react";

export default function HrAllTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States الخاصة بالتحكم في الجدول (البحث والفلترة)
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State الـ Pagination المتوافق مع راجع الباكيند
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5, // بناءً على الـ limit المرجع من الباكيند عندك
    totalRecords: 0,
  });

  // دالة جلب البيانات من السيرفر
  const fetchTasks = async (page = 1, currentLimit = pagination.limit) => {
    try {
      setLoading(true);
      
      // بناء الـ Query Parameters ديناميكياً
      let url = `/tasks?page=${page}&limit=${currentLimit}`;
      
      // ملاحظة: إذا كان الباكيند يدعم الفلترة والسيرش في الـ الروت العام، نمررهم هنا
      // لو الباكيند لسه مش ممهد السيرش على الروت ده، الفلترة بتتم تلقائياً في الـ Frontend
      const response = await API.get(url);

      if (response.data?.status === "success" && response.data?.data) {
        setTasks(response.data.data.tasks || []);
        setPagination({
          currentPage: response.data.data.pagination.currentPage,
          totalPages: response.data.data.pagination.totalPages,
          limit: response.data.data.pagination.limit,
          totalRecords: response.data.data.pagination.totalRecords,
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks from the server.");
    } finally {
      setLoading(false);
    }
  };

  // استدعاء الداتا عند فتح الصفحة لأول مرة
  useEffect(() => {
    fetchTasks(1);
  }, []);

  // 1. أكشن قبول وتحديث التاسك لـ Completed (PATCH /api/tasks/:id)
  const handleAcceptTask = async (id) => {
    try {
      const response = await API.patch(`/tasks/${id}`, {
        acceptance: "accept" // بناءً على الـ business logic للباكيند لتحديث الحالة لـ Completed
      });

      if (response.data?.status === "success" || response.status === 200) {
        // تحديث الستيت محلياً فوراً لجعل التاسك Completed بدون إعادة تحميل الصفحة بالكامل
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, done: true } : task
          )
        );
      }
    } catch (err) {
      console.error("Error accepting task:", err);
      alert(err.response?.data?.message || "Failed to accept the task.");
    }
  };

  // 2. أكشن حذف التاسك نهائياً (DELETE /api/tasks/:id)
  const handleCancelOrDeleteTask = async (id) => {
    try {
      const response = await API.delete(`/tasks/${id}`);

      if (response.data?.status === "success" || response.status === 200) {
        // إزالة التاسك المحذوف من الستيت مباشرة
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert(err.response?.data?.message || "Failed to delete the task.");
    }
  };

  // هندلة تغيير رقم الصفحة
  const handlePageChange = (newPage) => {
    fetchTasks(newPage, pagination.limit);
  };

  // هندلة تغيير عدد الريكوردز المعروضة في الصفحة الواحدة
  const handleLimitChange = (newLimit) => {
    fetchTasks(1, newLimit);
  };

  // 🔍 فلتَرة الداتا في الـ Frontend بناءً على قيمة البحث والفلتر المختار
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());

    if (statusFilter === "Completed") {
      return matchesSearch && task.done === true;
    } else if (statusFilter === "Active") {
      return matchesSearch && task.done === false;
    }

    return matchesSearch; // لو "All" بيرجع كله
  });

  return (
    <div >
      {/* العنوان العلوي */}
      <div className="flex flex-col gap-2 mb-8 mt-10">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ListTodo className="text-cyan-400" size={26} /> All System Tasks
        </h1>
        <p className="text-slate-400 text-sm">
          Manage, track, complete, or remove tasks distributed across your organizational system.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* رندرة الكومبوننت (الجدول والكنترولز) وتمرير الـ props المطلوبة */}
      <TasksTable
        tasks={filteredTasks}
        loading={loading}
        onAcceptTask={handleAcceptTask}
        onDeleteTask={handleCancelOrDeleteTask}
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}