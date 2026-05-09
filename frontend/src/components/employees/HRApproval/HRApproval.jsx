import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllLeaves,
  updateLeaveStatus,
} from "../../../store/HrSlices/leaveSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BaseCard from "../../UI/Card";

function HRApproval() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.leaves);
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
          <button className="w-10 h-10 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 flex items-center justify-center transition-all duration-200 hover:scale-105" onClick={() => navigate("/leave")}>
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
        <div className="space-y-4">
          {list.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between group"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-600/50"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium leading-tight">
                    {request.employeeName}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {request.reason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
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
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-4 py-2 text-xs font-medium text-white bg-[#0095ff] hover:bg-[#0052cc] rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-700/70 hover:bg-slate-600/70 rounded-full transition-all duration-200"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
}

export default HRApproval;
