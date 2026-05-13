
// import LeaveTable from "@/HrComponents/LeavePageComponents/LeaveTable.jsx";


// export default function LeaveRequests() {
//   const leaves = [
//     { id: 1, name: "Ahmed Ali", type: "Annual", from: "1 Mar", to: "3 Mar", days: 3 },
//     { id: 2, name: "Sara Omar", type: "Sick", from: "2 Mar", to: "2 Mar", days: 1 },
//     { id: 3, name: "Mohamed Hassan", type: "Annual", from: "5 Mar", to: "8 Mar", days: 4 },
//     { id: 4, name: "Laila Samir", type: "Sick", from: "6 Mar", to: "7 Mar", days: 2 },
//     { id: 5, name: "Omar Khaled", type: "Annual", from: "8 Mar", to: "12 Mar", days: 5 },
//     { id: 6, name: "Nour Ahmed", type: "Sick", from: "10 Mar", to: "10 Mar", days: 1 },
//     { id: 7, name: "Hossam Ali", type: "Annual", from: "12 Mar", to: "14 Mar", days: 3 },
//     { id: 8, name: "Mona Adel", type: "Annual", from: "13 Mar", to: "15 Mar", days: 3 },
//     { id: 9, name: "Tamer Fathy", type: "Sick", from: "14 Mar", to: "14 Mar", days: 1 },
//     { id: 10, name: "Yasmine Omar", type: "Annual", from: "16 Mar", to: "18 Mar", days: 3 },
//   ];

//   return (
//     <div className="p-6">
//       {/* <LeaveHero /> */}
//       <LeaveTable leaves={leaves} />
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import LeaveTable from "@/HrComponents/LeavePageComponents/LeaveTable";
import instance from "@/services/axios";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, limit };
      let endpoint = "/leaves"; // المسار الافتراضي

      // إذا كان هناك بحث بالاسم أو التاريخ نستخدم مسار الـ search
      if (searchName.trim() || searchDate) {
        endpoint = "/leaves/search";
        if (searchName.trim()) params.employeeName = searchName.trim();
        if (searchDate) params.date = searchDate;
      }

      const response = await instance.get(endpoint, { params });
      
      console.log("API Response:", response.data);

      // --- التعامل مع اختلاف الـ Response Structure ---
      let fetchedData = [];
      let total = 1;

      if (endpoint === "/leaves/search") {
        // في البحث البيانات تكون داخل data.leave
        fetchedData = response.data?.data?.leave || [];
        total = response.data?.data?.pagination?.totalPages || 1;
      } else {
        // في العرض العادي البيانات تكون داخل data مباشرة
        fetchedData = response.data?.data || [];
        total = response.data?.pagination?.totalPages || 1;
      }

      setLeaves(fetchedData);
      setTotalPages(total);

    } catch (err) {
      console.error("Fetch Error:", err.response?.data);
      const errorObj = err.response?.data;
      // حل مشكلة [object Object]
      const msg = Array.isArray(errorObj?.message) ? errorObj.message[0] : errorObj?.message;
      setError(msg || "تعذر تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchLeaves(), 500);
    return () => clearTimeout(delay);
  }, [page, searchName, searchDate]);

  // دالة التحديث والحذف (نفس الـ Logic السابق)
  const handleStatusUpdate = async (id, status) => {
    try {
      await instance.patch(`/leaves/${id}/status`, { status });
      setLeaves(prev => prev.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) { alert("فشل تحديث الحالة"); }
  };

  const handleDeleteLeave = async (id) => {
    if (!window.confirm("حذف؟")) return;
    try {
      await instance.delete(`/leaves/${id}`);
      setLeaves(prev => prev.filter(l => l._id !== id));
    } catch (err) { alert("فشل الحذف"); }
  };

  if (loading) return <div className="p-10 text-center text-cyan-400 font-bold">جاري التحميل...</div>;

  return (
    <div className="p-6">
      {error && <p className="text-red-500 text-center mb-4">{String(error)}</p>}
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded bg-slate-800 text-white outline-none border border-slate-700 focus:border-cyan-500"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => { setSearchDate(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-cyan-500"
        />
      </div>

      <LeaveTable
        leaves={leaves}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDeleteLeave}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}