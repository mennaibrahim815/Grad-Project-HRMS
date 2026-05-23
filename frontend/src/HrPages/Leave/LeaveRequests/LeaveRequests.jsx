

// ==========================================================================
// import React, { useState, useEffect } from "react";
// import LeaveTable from "@/HrComponents/LeavePageComponents/LeaveTable";
// import instance from "@/services/axios";

// export default function LeaveRequests() {
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchName, setSearchName] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   const [paginationInfo, setPaginationInfo] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 5
//   });

//   const fetchLeaves = async () => {
//     try {
//       setLoading(true);
//       let endpoint = (searchName.trim() || searchDate) ? "/leaves/search" : "/leaves";
      
//       const params = { 
//         page: paginationInfo.currentPage, 
//         limit: paginationInfo.limit,
//         ...(searchName.trim() && { employeeName: searchName.trim() }),
//         ...(searchDate && { date: searchDate }),
//         ...(statusFilter !== "All" && { status: statusFilter })
//       };

//       const response = await instance.get(endpoint, { params });
      
//       const isSearch = endpoint === "/leaves/search";
//       const resultData = isSearch ? response.data?.data : response.data;
//       const fetchedLeaves = isSearch ? resultData?.leave : resultData?.data;
//       const pag = isSearch ? resultData?.pagination : response.data?.pagination;

//       setLeaves(fetchedLeaves || []);
      
//       setPaginationInfo(prev => ({
//         ...prev,
//         totalPages: pag?.totalPages || 1,
//         totalRecords: pag?.totalRecords || (fetchedLeaves?.length || 0)
//       }));

//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- تحديث الحالة مع استلام سبب الرفض ---
//   const handleUpdateStatus = async (id, newStatus, reason = "") => {
//     try {
//       const response = await instance.patch(`/leaves/${id}/status`, { 
//         status: newStatus,
//         rejectReason: reason // إرسال السبب للباك إند
//       });

//       if (response.data.status === "success" || response.status === 200) {
//         setLeaves(prevLeaves => 
//           prevLeaves.map(leave => 
//             (leave._id === id || leave.id === id) ? { ...leave, status: newStatus, rejectReason: reason } : leave
//           )
//         );
//         console.log(`Leave ${newStatus} successfully`);
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => fetchLeaves(), 500);
//     return () => clearTimeout(delay);
//   }, [paginationInfo.currentPage, paginationInfo.limit, searchName, searchDate, statusFilter]);

//   const handlePageChange = (newPage) => {
//     setPaginationInfo(prev => ({ ...prev, currentPage: newPage }));
//   };

//   const handleLimitChange = (newLimit) => {
//     setPaginationInfo(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
//   };

//   return (
//     <div className="p-6 bg-[#0f172a] min-h-screen text-slate-200">
//       <div className="mb-6 text-white text-2xl font-bold tracking-tight">Leave Requests</div>

//       <LeaveTable
//         leaves={leaves}
//         loading={loading}
//         pagination={paginationInfo}
//         onPageChange={handlePageChange}
//         onLimitChange={handleLimitChange}
//         onStatusUpdate={handleUpdateStatus} 
//         searchName={searchName}
//         setSearchName={(val) => { setSearchName(val); handlePageChange(1); }}
//         searchDate={searchDate}
//         setSearchDate={(val) => { setSearchDate(val); handlePageChange(1); }}
//         statusFilter={statusFilter}
//         setStatusFilter={(val) => { setStatusFilter(val); handlePageChange(1); }}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import LeaveTable from "@/HrComponents/LeavePageComponents/LeaveTable";
import LeaveStatsHeader from "@/HrComponents/LeavePageComponents/LeaveStatsHeader.jsx"; // استدعاء المكون الجديد هنا
import instance from "@/services/axios";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // دالة لحفظ ريفيرنس لتحديث الإحصائيات من المكون الابن
  const [refreshStats, setRefreshStats] = useState(null);

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 5
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let endpoint = (searchName.trim() || searchDate) ? "/leaves/search" : "/leaves";
      
      const params = { 
        page: paginationInfo.currentPage, 
        limit: paginationInfo.limit,
        ...(searchName.trim() && { employeeName: searchName.trim() }),
        ...(searchDate && { date: searchDate }),
        ...(statusFilter !== "All" && { status: statusFilter })
      };

      const response = await instance.get(endpoint, { params });
      
      const isSearch = endpoint === "/leaves/search";
      const resultData = isSearch ? response.data?.data : response.data;
      const fetchedLeaves = isSearch ? resultData?.leave : resultData?.data;
      const pag = isSearch ? resultData?.pagination : response.data?.pagination;

      setLeaves(fetchedLeaves || []);
      
      setPaginationInfo(prev => ({
        ...prev,
        totalPages: pag?.totalPages || 1,
        totalRecords: pag?.totalRecords || (fetchedLeaves?.length || 0)
      }));

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- تحديث الحالة مع استلام سبب الرفض ---
  const handleUpdateStatus = async (id, newStatus, reason = "") => {
    try {
      const response = await instance.patch(`/leaves/${id}/status`, { 
        status: newStatus,
        rejectReason: reason 
      });

      if (response.data.status === "success" || response.status === 200) {
        setLeaves(prevLeaves => 
          prevLeaves.map(leave => 
            (leave._id === id || leave.id === id) ? { ...leave, status: newStatus, rejectReason: reason } : leave
          )
        );
        
        // لو اتغيرت الحالة بنادي الدالة اللي بتحدث الكاردز فوق تلقائياً
        if (refreshStats) refreshStats();
        
        console.log(`Leave ${newStatus} successfully`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchLeaves(), 500);
    return () => clearTimeout(delay);
  }, [paginationInfo.currentPage, paginationInfo.limit, searchName, searchDate, statusFilter]);

  const handlePageChange = (newPage) => {
    setPaginationInfo(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPaginationInfo(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
  };

  return (
    <div >
      
      {/* استدعاء الكومبوننت الجديد وتمرير دالة التحديث */}
      <LeaveStatsHeader onStatsUpdated={setRefreshStats} />

      {/* الجدول الأصلي بتاعك */}
      <LeaveTable
        leaves={leaves}
        loading={loading}
        pagination={paginationInfo}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onStatusUpdate={handleUpdateStatus} 
        searchName={searchName}
        setSearchName={(val) => { setSearchName(val); handlePageChange(1); }}
        searchDate={searchDate}
        setSearchDate={(val) => { setSearchDate(val); handlePageChange(1); }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => { setStatusFilter(val); handlePageChange(1); }}
      />
    </div>
  );
}