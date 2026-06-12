import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllLeaves,
  updateLeaveStatus,
} from "../../../store/HrSlices/leaveSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BaseCard from "../../../components/UI/Card";

function HRApproval() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 📜 استدعاء updatingItem من الـ Store
  const { list, loading, updatingItem } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchAllLeaves());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(updateLeaveStatus({ id, status: "Approved" }));
  };

  const handleDecline = (id) => {
    dispatch(updateLeaveStatus({ id, status: "Rejected" }));
  };

  return (
    <div className="w-full ">
      <BaseCard className=" flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-semibold tracking-tight">
            Leave application
          </h1>
          <button className="w-10 h-10 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 flex items-center justify-center transition-all duration-200 hover:scale-105" onClick={() => navigate("/leave-requests")}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
          </button>
        </div>

        {/* Leave Requests List */}
        <div className="flex flex-col gap-4">
          {list.map((request) => {
            // 📜 شروط التحميل الخاصة بكل صف وبكل زرار
            const isAcceptLoading = updatingItem.id === request._id && updatingItem.status === "Approved";
            const isDeclineLoading = updatingItem.id === request._id && updatingItem.status === "Rejected";
            const isRowLoading = updatingItem.id === request._id; // لو أي زرار في الصف بيحمل هنوقف الصف كله منعا للضغط المتكرر

            return (
              <div key={request._id} className="flex items-center justify-between group"> 
                <div className="flex items-center gap-3">
                  <img
                    src={request.employee?.avatar}
                    alt={request.employee?.firstName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-600/50"
                  />
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">
                      {request.employee?.firstName} {request.employee?.lastName} 
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{request.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {request.status === "Approved" ? (
                    <span className="px-4 py-2 text-xs font-medium text-emerald-400 bg-emerald-500/20 rounded-full">
                      Accepted
                    </span>
                  ) : request.status === "Rejected" ? (
                    <span className="px-4 py-2 text-xs font-medium text-red-400 bg-red-500/20 rounded-full">
                      Declined
                    </span>
                  ) : (
                    <>
                      {/* زرار Accept */}
                      <button
                        onClick={() => handleAccept(request._id)}
                        disabled={isRowLoading}
                        className={`px-4 py-2 text-xs font-medium text-white rounded-full transition-all flex items-center justify-center min-w-[75px]
                          ${isRowLoading ? "bg-gray-600 cursor-not-allowed opacity-60" : "bg-[#0095ff] hover:bg-[#0052cc]"}`}
                      >
                        {isAcceptLoading ? (
                          <i className="fas fa-spinner fa-spin text-xs text-white"></i>
                        ) : (
                          "Accept"
                        )}
                      </button>

                      {/* زرار Decline */}
                      <button
                        onClick={() => handleDecline(request._id)} 
                        disabled={isRowLoading}
                        className={`px-4 py-2 text-xs font-medium rounded-full transition-all flex items-center justify-center min-w-[75px]
                          ${isRowLoading ? "bg-slate-800 text-gray-500 cursor-not-allowed" : "text-slate-300 bg-slate-700/70 hover:bg-slate-600/70"}`}
                      >
                        {isDeclineLoading ? (
                          <i className="fas fa-spinner fa-spin text-xs text-white"></i>
                        ) : (
                          "Decline"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BaseCard>
    </div>
  );
}

export default HRApproval;