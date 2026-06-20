import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../store/HrSlices/HrDashboard/dashboardSlice";

const TaskSummary = ({ data = [], pagination }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loadingProjects } = useSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState("On-going");
  const [page, setPage] = useState(1);
  
  // Ref لمنع تنفيذ الـ useEffect في أول رندر لأن الداتا بتيجي مع الصفحة الكبيرة
  const isFirstRender = useRef(true);

  const tabs = ["On-going", "Pending", "Completed"];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dispatch(fetchProjects({ status: activeTab, page, limit: 10 }));
  }, [activeTab, page, dispatch]);

  return (
    <div
              style={{
            background:
              "linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)   ",
              borderColor: 'var(--border-main)',
          }}
           className="bg-linear-to-br from-transparent/20 to-45% to-[#182731] rounded-[2.5rem] p-8 border border-gray-800/50 flex flex-col h-full shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white" style={{ color: 'var(--text-main)' }}>Project Summary</h3>
        <button
                    style={{ background: 'var(--tab-inactive-bg)' }}

          onClick={() => navigate("/project")}
          className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs" style={{ color: 'var(--text-main)' }}></i>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-transparent p-1.5 rounded-2xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1); // تصفير الصفحة عند تغيير التاب
            }}
                                          style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--border-main)',
                    color: 'var(--text-main)',}}
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

      <div className="space-y-6 overflow-y-auto scrollbar-hide flex-1 pr-1">
        {loadingProjects ? (
          <div className="flex justify-center py-20">
            <i className="fas fa-spinner fa-spin text-blue-500 text-2xl" style={{ color: 'var(--text-main)' }}></i>
          </div>
        ) : data?.length > 0 ? (
          data.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project?highlightId=${project._id}`)}
              className="group border-b border-gray-800/40 pb-6 last:border-0 hover:bg-white/[0.01] cursor-pointer transition-all p-2 rounded-xl"
            >
              <div className="flex justify-between items-start mb-2">
                <h4  style={{ color: 'var(--text-main)' }} className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h4>
                <span className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                  <i className="far fa-calendar" style={{ color: 'var(--text-main)' }}></i>
                  {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>

              <p className="text-[11px] text-gray-600 mb-4 leading-relaxed line-clamp-1" style={{ color: 'var(--text-main)' }}>
                {project.description}
              </p>

              {/* Progress */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-1.5 bg-[#0b141a] rounded-full relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.projectProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  />
                </div>
                <span className="text-[10px] font-black text-gray-400 w-8">
                  {project.projectProgress}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-[10px] text-gray-300 font-black">
                  <span>
                    <i className="fas fa-paperclip mr-1" style={{ color: 'var(--text-main)' }}></i>
                    {project.documentsCount || 0}
                  </span>
                </div>

                <div className="flex -space-x-2.5">
                  {project.assignedTo?.slice(0, 3).map((member) => (
                    <div
                      key={member._id}
                      className="w-7 h-7 rounded-full border-2 border-[#142129] bg-gray-800 overflow-hidden shadow-lg transform hover:scale-110 transition-transform"
                    >
                      <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {project.assignedTo?.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-[#142129] bg-[#1c2e38] text-blue-500 text-[9px] flex items-center justify-center font-black shadow-lg">
                      +{project.assignedTo.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-20">
            <i className="fas fa-folder-open text-4xl mb-4" style={{ color: 'var(--text-main)' }}></i>
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--text-main)' }}>No {activeTab} Projects</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
        <button
          disabled={page === 1 || loadingProjects}
          onClick={() => setPage((prev) => prev - 1)}
          style={{ color: 'var(--text-main)' }}
          className="text-xs text-gray-400 disabled:opacity-30 hover:text-white transition-colors"
        >
          Previous
        </button>

        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest" style={{ color: 'var(--text-main)' }}>
          Page {page} of {pagination?.totalPages || 1}
        </span>

        <button
          disabled={page >= (pagination?.totalPages || 1) || loadingProjects}
          onClick={() => setPage((prev) => prev + 1)}
          style={{ color: 'var(--text-main)' }}
          className="text-xs text-gray-400 disabled:opacity-30 hover:text-white transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskSummary;