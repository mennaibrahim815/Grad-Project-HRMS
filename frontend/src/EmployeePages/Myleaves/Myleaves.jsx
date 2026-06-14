// import React, { useState, useEffect } from 'react';
// import instance from '@/services/axios'; // استدعاء أكسيوس
// import EmployeeLeaveStatsHeader from '@/EmployeeComponents/MyleavesComponents/EmployeeLeaveStatsHeader.jsx';
// import MyLeaveYearlyChart from '@/EmployeeComponents/MyleavesComponents/MyLeaveYearlyChart.jsx';
// import MyLeaveTable from '@/EmployeeComponents/MyleavesComponents/MyLeaveTable.jsx'; // تأكدي من اسم ملف الجدول المحدث

// const Myleaves = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  
//   const [refreshHeaderStats, setRefreshHeaderStats] = useState(null);

//   // 1️⃣ دالة جلب الإجازات الخاصة بالموظف
//   const fetchMyLeaves = async () => {
//     try {
//       setLoading(true);
//       const response = await instance.get(`/leaves/employee/me`, {
//         params: {
//           page: pagination.page,
//           limit: pagination.limit,
//           status: statusFilter !== "All" ? statusFilter : undefined
//         }
//       });
      
//       const fetchedData = response.data?.data?.leaves || response.data?.data || [];
//       const totalPages = response.data?.data?.totalPages || 1;
      
//       setLeaves(fetchedData);
//       setPagination(prev => ({ ...prev, totalPages }));
//     } catch (error) {
//       console.error("Error fetching leaves:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // إعادة جلب البيانات عند تغيير الصفحة أو الفلتر
//   useEffect(() => {
//     fetchMyLeaves();
//   }, [pagination.page, pagination.limit, statusFilter]);

//   // 2️⃣ دالة حذف الإجازة باستخدام الـ Endpoint الجديدة
//   const handleLeaveDelete = async (leaveId) => {
//     try {
//       // استدعاء الـ API وحذف الإجازة عن طريق الـ ID
//       await instance.delete(`/leaves/${leaveId}`);
      
//       // توست أو الرت نجاح اختياري
//       // alert("Leave request deleted successfully");

//       // تحديث بيانات الجدول فوراً بعد الحذف
//       fetchMyLeaves();

//       // تحديث كروت الأرصدة اللي فوق عشان لو كانت الإجازة المحذوفة مأثرة في الرصيد المعلق
//       if (refreshHeaderStats) {
//         refreshHeaderStats();
//       }
//     } catch (error) {
//       console.error("Failed to delete leave request:", error);
//       alert(error.response?.data?.message || "Something went wrong while deleting");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* الجزء العلوي: الأرصدة الثلاثة وزر التقديم */}
//       <EmployeeLeaveStatsHeader onStatsUpdated={setRefreshHeaderStats} />
      
//       {/* الجزء الأوسط: التشارت السنوي */}
//       <MyLeaveYearlyChart />

//       {/* الجزء السفلي: جدول الإجازات المحدث مع تمرير دالة الحذف والـ States */}
//       <MyLeaveTable 
//         leaves={leaves}
//         loading={loading}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         pagination={pagination}
//         onLeaveDelete={handleLeaveDelete} // 👈 مررنا دالة الحذف هنا للجدول
//         onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//         onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
//       />
//     </div>
//   );
// };

// export default Myleaves;
import React, { useState, useEffect } from 'react';
import instance from '@/services/axios'; 
import EmployeeLeaveStatsHeader from '@/EmployeeComponents/MyleavesComponents/EmployeeLeaveStatsHeader.jsx';
import MyLeaveYearlyChart from '@/EmployeeComponents/MyleavesComponents/MyLeaveYearlyChart.jsx';
import MyLeaveTable from '@/EmployeeComponents/MyleavesComponents/MyLeaveTable.jsx'; 

const Myleaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  
  // الاحتفاظ بالـ page والـ currentPage معاً لضمان قراءة كومبوننت الـ Pagination لها بشكل صحيح
  const [pagination, setPagination] = useState({ 
    page: 1, 
    currentPage: 1,
    limit: 10, 
    totalPages: 1,
    totalResults: 0,
    totalRecords: 0
  });
  
  const [refreshHeaderStats, setRefreshHeaderStats] = useState(null);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/leaves/employee/me`, {
        params: {
          page: pagination.page, // يرسل الصفحة الحالية المطلوبة للباك إند
          limit: pagination.limit,
          status: statusFilter !== "All" ? statusFilter : undefined
        }
      });
      
      const fetchedData = response.data?.data?.leaves || response.data?.data || [];
      const backendPagination = response.data?.pagination || response.data?.data?.pagination;
      
      const totalPages = backendPagination?.totalPages || 1;
      const totalRecords = backendPagination?.totalRecords || fetchedData.length;
      
      setLeaves(fetchedData);
      
      // التحديث الآمن: نحدث الإجماليات ونثبت رقم الصفحة الحالي المتغير بناء على الضغط
      setPagination(prev => ({ 
        ...prev,
        totalPages: totalPages,
        totalResults: totalRecords, 
        totalRecords: totalRecords,
        currentPage: prev.page // 👈 السحر هنا: نجعل الـ currentPage يطابق الصفحة النشطة ليضيء الزر الأزرق فوراً
      }));

    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [pagination.page, pagination.limit, statusFilter]);

  const handleLeaveDelete = async (leaveId) => {
    try {
      await instance.delete(`/leaves/${leaveId}`);
      fetchMyLeaves();
      if (refreshHeaderStats) {
        refreshHeaderStats();
      }
    } catch (error) {
      console.error("Failed to delete leave request:", error);
      alert(error.response?.data?.message || "Something went wrong while deleting");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <EmployeeLeaveStatsHeader onStatsUpdated={setRefreshHeaderStats} />
      <MyLeaveYearlyChart />

      <MyLeaveTable 
        leaves={leaves}
        loading={loading}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination} 
        onLeaveDelete={handleLeaveDelete} 
        onPageChange={(newPage) => {
          // فك رقم الصفحة بأي صيغة كانت ممررة بها من كومبوننت الجدول
          const pageNumber = typeof newPage === 'object' ? (newPage.page || newPage.currentPage) : newPage;
          if (pageNumber) {
            setPagination(prev => ({ 
              ...prev, 
              page: Number(pageNumber),
              currentPage: Number(pageNumber)
            }));
          }
        }}
        onLimitChange={(newLimit) => {
          const limitNumber = typeof newLimit === 'object' ? newLimit.limit : newLimit;
          if (limitNumber) {
            setPagination(prev => ({ ...prev, limit: Number(limitNumber), page: 1, currentPage: 1 }));
          }
        }}
      />
    </div>
  );
};

export default Myleaves;