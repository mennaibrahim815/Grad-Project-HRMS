import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants } from "../../store/HrSlices/HrDashboard/dashboardSlice";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const JobApplicants = ({ applicants = [], pagination }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loadingApplicants } = useSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState("Applied");
  const [page, setPage] = useState(1);
  const isFirstRender = useRef(true);

  const tabs = ["Applied", "Hired", "Rejected", "Interviewing"];

  // جلب البيانات عند تغيير التاب أو الصفحة
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dispatch(fetchApplicants({ status: activeTab, page, limit: 5 }));
  }, [activeTab, page, dispatch]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "hired": return "border-green-500/30 text-green-400 bg-green-500/5";
      case "rejected": return "border-pink-500/30 text-pink-400 bg-pink-500/5";
      case "applied": return "border-blue-500/30 text-blue-400 bg-blue-500/5";
      case "Interviewing": return "border-orange-500/30 text-orange-400 bg-orange-500/5";
      default: return "border-gray-500/30 text-gray-400 bg-gray-500/5";
    }
  };

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl h-[480px] flex flex-col transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Job applicants</h3>
        <button
          onClick={() => navigate("/hiring")}
          className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/30"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-transparent p-1.5 rounded-2xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab
                ? "bg-linear-to-br from-transparent/20 to-45% to-[#182731] text-white shadow-2xl border border-gray-900"
                : "text-gray-600 hover:text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List Area */}
      <div className="space-y-6 flex-1 pr-1 overflow-y-auto scrollbar-hide">
        {loadingApplicants ? (
          <div className="h-full flex items-center justify-center py-10">
            <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {applicants?.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => navigate(`/hiring?highlightId=${app._id}`)}
                    className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.01] transition-all p-2 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={app.personalInfo?.avatar || defaultAvatar}
                          className="w-11 h-11 rounded-full object-cover border-2 border-gray-800 shadow-lg group-hover:border-blue-500/50 transition-all"
                          alt="applicant"
                          onError={(e) => { e.target.src = defaultAvatar; }}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-[#142129] rounded-full"></span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {app.personalInfo?.firstName} {app.personalInfo?.lastName}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium truncate">
                          {app.personalInfo?.department || "No Department"}
                        </p>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border shrink-0 ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
                <i className="fas fa-user-clock text-4xl mb-4"></i>
                <p className="text-[10px] uppercase font-bold tracking-widest text-center">No {activeTab} Applicants</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-800/50">
           <button 
            disabled={page === 1 || loadingApplicants}
            onClick={() => setPage(p => p - 1)}
            className="text-[10px] text-gray-500 hover:text-blue-400 disabled:opacity-20 transition-colors uppercase font-black"
          >
            Prev
          </button>
          <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
            Page {page} / {pagination.totalPages}
          </span>
          <button 
            disabled={page >= (pagination?.totalPages || 1) || loadingApplicants}
            onClick={() => setPage(p => p + 1)}
            className="text-[10px] text-gray-500 hover:text-blue-400 disabled:opacity-20 transition-colors uppercase font-black"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;