
// import LeaveTable from "../../../components/LeavePageComponents/LeaveTable.jsx";


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
  // ===== STATE =====
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== PAGINATION =====
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // ===== FILTER =====
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // ===== FETCH =====
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
      };

      // ✔️ important: avoid sending empty strings (fix 400 error)
      if (searchName.trim() !== "") {
        params.employeeName = searchName.trim();
      }

      if (searchDate !== "") {
        params.date = searchDate;
      }

      // ⚠️ backend search endpoint
      const response = await instance.get("/leaves/search", {
        params,
      });

      console.log("API RESPONSE:", response.data);

      // ✔️ safe fallback (fix undefined crash)
      const data = response.data?.data?.leave || [];

      setLeaves(Array.isArray(data) ? data : []);

      setTotalPages(
        response.data?.data?.pagination?.totalPages || 1
      );

      setError(null);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("تعذر تحميل البيانات");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== EFFECT =====
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeaves();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, searchName, searchDate]);

  // ===== STATUS UPDATE =====
  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await instance.patch(`/leaves/${leaveId}/status`, {
        status: newStatus,
      });

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status: newStatus } : l
        )
      );
    } catch (err) {
      console.error(err);
      alert("فشل تحديث الحالة");
    }
  };

  // ===== DELETE =====
  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await instance.delete(`/leaves/${leaveId}`);

      setLeaves((prev) =>
        prev.filter((l) => l._id !== leaveId)
      );
    } catch (err) {
      console.error(err);
      alert("فشل الحذف");
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="p-10 text-center text-cyan-400">
        جاري تحميل الطلبات...
      </div>
    );
  }

  // ===== ERROR =====
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ===== SEARCH ===== */}
      <div className="flex gap-3 mb-5">

        {/* name search */}
        <input
          type="text"
          placeholder="Search by employee name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded bg-slate-800 text-white"
        />

        {/* date filter */}
        <input
          type="date"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded bg-slate-800 text-white"
        />
      </div>

      {/* ===== TABLE ===== */}
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