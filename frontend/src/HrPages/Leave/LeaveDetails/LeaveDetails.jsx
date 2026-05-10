
// pages/Leave/LeaveDetails/LeaveDetails.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";

// // بيانات وهمية لكل طلب
// const leavesData = [
//   { id: 1, name: "Ahmed Ali", position: "Frontend Developer", department: "IT", image: "https://i.pravatar.cc/150?img=3", leaveType: "Annual", from: "1 March", to: "3 March", days: 3, reason: "Vacation with family." },
//   { id: 2, name: "Sara Omar", position: "HR Specialist", department: "HR", image: "https://i.pravatar.cc/150?img=4", leaveType: "Sick", from: "2 March", to: "2 March", days: 1, reason: "Feeling unwell." },
//   { id: 3, name: "Mohamed Hassan", position: "Backend Developer", department: "IT", image: "https://i.pravatar.cc/150?img=5", leaveType: "Annual", from: "5 March", to: "8 March", days: 4, reason: "Family trip." },
//   { id: 4, name: "Laila Samir", position: "Designer", department: "Design", image: "https://i.pravatar.cc/150?img=6", leaveType: "Sick", from: "6 March", to: "7 March", days: 2, reason: "Medical appointment." },
//   { id: 5, name: "Omar Khaled", position: "Frontend Developer", department: "IT", image: "https://i.pravatar.cc/150?img=7", leaveType: "Annual", from: "8 March", to: "12 March", days: 5, reason: "Traveling abroad." },
//   { id: 6, name: "Nour Ahmed", position: "HR Assistant", department: "HR", image: "https://i.pravatar.cc/150?img=8", leaveType: "Sick", from: "10 March", to: "10 March", days: 1, reason: "Feeling unwell." },
//   { id: 7, name: "Hossam Ali", position: "Backend Developer", department: "IT", image: "https://i.pravatar.cc/150?img=9", leaveType: "Annual", from: "12 March", to: "14 March", days: 3, reason: "Family event." },
//   { id: 8, name: "Mona Adel", position: "Designer", department: "Design", image: "https://i.pravatar.cc/150?img=10", leaveType: "Annual", from: "13 March", to: "15 March", days: 3, reason: "Vacation with friends." },
//   { id: 9, name: "Tamer Fathy", position: "HR Specialist", department: "HR", image: "https://i.pravatar.cc/150?img=11", leaveType: "Sick", from: "14 March", to: "14 March", days: 1, reason: "Medical checkup." },
//   { id: 10, name: "Yasmine Omar", position: "Frontend Developer", department: "IT", image: "https://i.pravatar.cc/150?img=12", leaveType: "Annual", from: "16 March", to: "18 March", days: 3, reason: "Family trip." },
// ];

// export default function LeaveDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [status, setStatus] = useState("Pending");

//   // اختار البيانات حسب الـ id
//   const leave = leavesData.find((l) => l.id === parseInt(id));

//   if (!leave)
//     return <p className="text-white p-6">Leave not found!</p>;

//   return (
//     <div className="p-6">
//       {/* Hero */}
//       {/* <div className="bg-[#233A9F] rounded-2xl p-10 flex items-center justify-between mb-10">
//         <h1 className="text-2xl font-semibold text-white">
//           Leave Request Details
//         </h1>
//       </div> */}

//       {/* التفاصيل */}
//       <div className="w-full text-white">
//         <div className="w-full text-white">
//           <img src={leave.image} className="w-16 h-16 rounded-full" />
//           <div>
//             <h2 className="text-lg font-semibold text-white">{leave.name}</h2>
//             <p className="text-gray-400">{leave.position}</p>
//           </div>
//         </div>

//         <p><b>Department:</b> {leave.department}</p>
//         <p><b>Leave Type:</b> {leave.leaveType}</p>
//         <p><b>From:</b> {leave.from}</p>
//         <p><b>To:</b> {leave.to}</p>
//         <p><b>Total Days:</b> {leave.days}</p>

//         <div className="mt-4">
//           <b>Reason:</b>
//           <p className="text-gray-400 mt-1">{leave.reason}</p>
//         </div>

//         {/* أزرار التحكم */}
//         <div className="flex gap-3 mt-6">
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded"
//             onClick={() => setStatus("Approved")}
//           >
//             Approve
//           </button>
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded"
//             onClick={() => setStatus("Rejected")}
//           >
//             Reject
//           </button>
//           <button
//             className="bg-gray-700 text-white px-4 py-2 rounded"
//             onClick={() => navigate("/leave-requests")}
//           >
//             Back
//           </button>
//         </div>

//         {/* الحالة */}
//         <p className="mt-4">
//           <b>Status:</b>{" "}
//           <span className={
//             status === "Pending"
//               ? "text-yellow-400"
//               : status === "Approved"
//               ? "text-green-500"
//               : "text-red-500"
//           }>
//             {status}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "@/services/axios";

export default function LeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== FETCH LEAVE =====
  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        setLoading(true);

        const res = await instance.get(`/leaves/${id}`);

        console.log("Leave Details API:", res.data);

        // ✔️ safe fallback (backend returns object in data)
        setLeave(res.data?.data || null);

      } catch (error) {
        console.error("Error fetching leave details:", error);
        setLeave(null);
      } finally {
        setLoading(false);
      }
    };

    // ✔️ prevent undefined API call
    if (id && id !== "undefined") {
      fetchLeaveDetails();
    }
  }, [id]);

  // ===== UPDATE STATUS =====
  const handleStatusUpdate = async (newStatus) => {
    try {
      const res = await instance.patch(`/leaves/${id}/status`, {
        status: newStatus,
      });

      if (res.data?.status === "success") {
        setLeave((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );

        alert(`Request ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating status.");
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <p className="text-white p-6 text-center text-cyan-400">
        Loading details...
      </p>
    );
  }

  // ===== EMPTY STATE (IMPORTANT FIX) =====
  if (!leave) {
    return (
      <p className="text-white p-6 text-center">
        Leave request not found!
      </p>
    );
  }

  return (
    <div className="p-6 text-white space-y-4">

      {/* ===== EMPLOYEE ===== */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={leave.employee?.avatar || "/default-avatar.png"}
          className="w-20 h-20 rounded-full border-2 border-slate-700 object-cover"
          alt="Employee"
        />

        <div>
          <h2 className="text-xl font-bold">
            {leave.employee?.firstName || "N/A"}{" "}
            {leave.employee?.lastName || ""}
          </h2>
          <p className="text-cyan-400">
            {leave.employee?.jobTitle || "No Title"}
          </p>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/30 p-6 rounded-xl border border-slate-700">

        <p>
          <b>Department:</b>{" "}
          {leave.employee?.department || "N/A"}
        </p>

        <p>
          <b>Leave Type:</b> {leave.type || "N/A"}
        </p>

        <p>
          <b>From:</b>{" "}
          {leave.startDate
            ? new Date(leave.startDate).toLocaleDateString("en-GB")
            : "-"}
        </p>

        <p>
          <b>To:</b>{" "}
          {leave.endDate
            ? new Date(leave.endDate).toLocaleDateString("en-GB")
            : "-"}
        </p>

        <p>
          <b>Total Days:</b> {leave.duration || 0}
        </p>

        <p>
          <b>Status:</b>{" "}
          <span
            className={
              leave.status === "Pending"
                ? "text-yellow-400"
                : leave.status === "Approved"
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {leave.status || "Unknown"}
          </span>
        </p>

        {/* ===== HR ===== */}
        {leave.hrApprovedBy && (
          <p>
            <b>Approved By:</b>{" "}
            {leave.hrApprovedBy.firstName}{" "}
            {leave.hrApprovedBy.lastName}
          </p>
        )}
      </div>

      {/* ===== REASON ===== */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <b>Reason:</b>
        <p className="text-gray-400 mt-2 italic">
          "{leave.reason || "No reason provided"}"
        </p>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="flex gap-3 mt-8">

        {leave.status === "Pending" && (
          <>
            <button
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg"
              onClick={() => handleStatusUpdate("Approved")}
            >
              Approve
            </button>

            <button
              className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg"
              onClick={() => handleStatusUpdate("Rejected")}
            >
              Reject
            </button>
          </>
        )}

        <button
          className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
          onClick={() => navigate("/leave-requests")}
        >
          Back
        </button>
      </div>
    </div>
  );
}