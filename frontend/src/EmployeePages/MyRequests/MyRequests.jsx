// import React, { useState, useEffect } from 'react';
// import instance from '@/services/axios'; 
// import EmployeeRequestsStatsHeader from '@/EmployeeComponents/MyRequestsComponents/EmployeeRequestsStatsHeader.jsx';

// const MyRequests = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         // هنا حددنا شهر 1 وسنة 2026 بناءً على الـ API بتاعك، تقدري تخليهم ديناميك حسب التاريخ الحالي
//         const response = await instance.get('/requests/monthly-stats/me?month=1&year=2026');
        
//         if (response.data.status === 'success') {
//           setStats(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div >
    
      
//       {/* استدعاء الهيدر وتمرير الداتا وحالة التحميل */}
//       <EmployeeRequestsStatsHeader stats={stats} loading={loading} />
      
//       {/* هنا هيبقي الجزء التاني بتاع الجدول أو لستة الطلبات */}
//     </div>
//   );
// };

// export default MyRequests;
import React, { useState, useEffect, useCallback } from 'react';
import instance from '@/services/axios'; 
import EmployeeRequestsStatsHeader from '@/EmployeeComponents/MyRequestsComponents/EmployeeRequestsStatsHeader.jsx';
import MyRequestsTable from '@/EmployeeComponents/MyRequestsComponents/MyRequestsTable.jsx'; 
import EmployeeYearlyRequestsChart from '@/EmployeeComponents/MyRequestsComponents/EmployeeYearlyRequestsChart.jsx';

const MyRequests = () => {
  // حالات الجدول والـ Pagination والفلترة
  const [requests, setRequests] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 5 // القيمة الافتراضية مطابقة للـ UI الخاص بكِ (5 أسطر)
  });

  // دالة لحفظ دالة تحديث الكروت القادمة من الهيدر عشان نناديها وقت الحذف أو الإضافة
  const [refreshStatsFn, setRefreshStatsFn] = useState(null);

  // دالة جلب طلبات الجدول من الباك إند (تم تعديل المسار هنا ليتوافق مع الـ API الصحيح)
  const fetchRequestsHistory = useCallback(async () => {
    try {
      setTableLoading(true);
      
      // استخدام المسار الصحيح: /requests/history/me بناءً على توثيق الباك إند الناجح
      let url = `/requests/history/me?page=${pagination.currentPage}&limit=${pagination.recordsPerPage}`;
      
      if (statusFilter !== "All") {
        url += `&status=${statusFilter}`;
      }

      const response = await instance.get(url);
      
      if (response.data?.status === 'success') {
        // قراءة البيانات وهيكلة الـ Pagination الواردة من السيرفر بشكل سليم
        setRequests(response.data.data.requests || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination?.totalPages || 1,
          totalRecords: response.data.data.pagination?.totalRecords || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching requests history:", error);
    } finally {
      setTableLoading(false);
    }
  }, [pagination.currentPage, pagination.recordsPerPage, statusFilter]);

  // إعادة جلب البيانات تلقائياً عند تغيير الصفحة، عدد الأسطر، أو الفلترة
  useEffect(() => {
    fetchRequestsHistory();
  }, [fetchRequestsHistory]);

  // دالة حذف الطلب المعلق (Pending) المربوطة بالباك إند
  const handleRequestDelete = async (requestId) => {
    try {
      setTableLoading(true);
      const response = await instance.delete(`/requests/${requestId}`);
      
      if (response.data?.status === "success") {
        // 1. إعادة جلب بيانات الجدول مجدداً
        fetchRequestsHistory();
        
        // 2. تحديث كروت الإحصائيات في الهيدر تلقائياً
        if (refreshStatsFn) {
          refreshStatsFn();
        }
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert(error.response?.data?.message || "Failed to delete request. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  // استلام زناد التحديث من الهيدر لتحديث الكروت والجدول سوياً
  const handleStatsUpdated = useCallback((fetchStatsCallback) => {
    setRefreshStatsFn(() => fetchStatsCallback);
  }, []);

  // دوال الـ Pagination التفاعلية مع الجدول
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(prev => ({ ...prev, recordsPerPage: limit, currentPage: 1 }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 p-4 sm:p-6 box-border">
      
      {/* 1️⃣ هيدر الإحصائيات وبداخله زر الإنشاء والمودال الإنجليزي */}
      <EmployeeRequestsStatsHeader onStatsUpdated={handleStatsUpdated} />
      <EmployeeYearlyRequestsChart />
      
      {/* 2️⃣ جدول عرض الطلبات والتحكم الكامل بها */}
      <MyRequestsTable 
        requests={requests}
        loading={tableLoading}
        onRequestDelete={handleRequestDelete}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
      
    </div>
  );
};

export default MyRequests;