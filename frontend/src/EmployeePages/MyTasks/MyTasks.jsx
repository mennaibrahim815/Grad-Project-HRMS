
import React, { useState, useEffect, useCallback } from 'react';
import instance from '@/services/axios'; 
import EmployeeTasksStatsHeader from '@/EmployeeComponents/MyTasksComponents/EmployeeTasksStatsHeader.jsx';
import MyTasksTable from '@/EmployeeComponents/MyTasksComponents/MyTasksTable.jsx'; 
import { useSearchParams } from "react-router-dom";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [taskScope, setTaskScope] = useState("My Tasks"); // القيمة الظاهرة بالجدول "My Tasks" أو "Team Tasks"
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
const highlightId = searchParams.get("highlightId");

const [activeRow, setActiveRow] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10 
  });

  const [refreshStatsFn, setRefreshStatsFn] = useState(null);

  useEffect(() => {
  if (highlightId) {
    setActiveRow(highlightId);

    const timer = setTimeout(() => {
      setActiveRow(null);
    }, 1200); // 1.2 ثانية highlight

    return () => clearTimeout(timer);
  }
}, [highlightId]);
  // دالة موحدة لجلب وتصفية البيانات بناءً على البحث أو الفلتر
  const fetchTasksHistory = useCallback(async () => {
    try {
      setTableLoading(true);
      let url = "";

      // 1️⃣ حالة البحث: لو شريط البحث مكتوب فيه حاجة، يضرب الـ Search API مباشرة
      if (searchTerm.trim() !== "") {
        url = `/tasks/search?title=${encodeURIComponent(searchTerm.trim())}`;
        const response = await instance.get(url);
        
        if (response.data?.status === 'success') {
          // الـ Search API بيرجع النتائج في مصفوفة اسمها results
          const results = response.data.data.results || [];
          setTasks(results);
          setPagination(prev => ({
            ...prev,
            totalPages: 1,
            totalRecords: results.length,
            currentPage: 1
          }));
        }
        return; // إنهاء الدالة هنا لأننا في حالة بحث
      }

      // 2️⃣ حالة الفلترة العادية بالـ Tabs عند غياب البحث
      const apiFilterParam = taskScope === "My Tasks" ? "my-tasks" : "team-tasks";
      url = `/tasks/my-tasks?filter=${apiFilterParam}&page=${pagination.currentPage}&limit=${pagination.recordsPerPage}`;
      
      const response = await instance.get(url);
      if (response.data?.status === 'success') {
        setTasks(response.data.data.tasks || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination?.totalPages || 1,
          totalRecords: response.data.data.pagination?.totalRecords || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setTableLoading(false);
    }
  }, [pagination.currentPage, pagination.recordsPerPage, taskScope, searchTerm]);

  // عمل Debounce بسيط للبحث وتحديث الإحصائيات تلقائياً عند أي تعديل
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasksHistory();
      // تحديث أرقام كروت الإحصائيات في الهيدر إذا كانت الدالة متوفرة
      if (refreshStatsFn) refreshStatsFn();
    }, 400); // تأخير 400ms لتجنب تكرار الطلبات غير الضرورية أثناء الكتابة



    
    return () => clearTimeout(delayDebounceFn);
  }, [fetchTasksHistory, refreshStatsFn]);

  const handleStatsUpdated = useCallback((fetchStatsCallback) => {
    setRefreshStatsFn(() => fetchStatsCallback);
  }, []);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(prev => ({ ...prev, recordsPerPage: limit, currentPage: 1 }));
  };

  return (
    <div >
      
      {/* هيدر الإحصائيات */}
      <EmployeeTasksStatsHeader onStatsUpdated={handleStatsUpdated} />
      
      {/* جدول المهام الشامل بعد دمج الـ Tabs والسيرش وتحديثات الفورم */}
<MyTasksTable 
  tasks={tasks}
  loading={tableLoading}
  taskScope={taskScope}
  setTaskScope={setTaskScope}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  pagination={pagination}
  onPageChange={handlePageChange}
  onLimitChange={handleLimitChange}
  refreshTable={fetchTasksHistory}
  highlightId={activeRow}
/>
      
    </div>
  );
};

export default MyTasks;