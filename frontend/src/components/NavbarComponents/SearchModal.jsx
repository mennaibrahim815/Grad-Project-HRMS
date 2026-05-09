/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  executeSearch,
  clearSearch,
} from "../../store/HrSlices/navbar/searchSlice";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const SearchModal = ({ isOpen, onClose, searchRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("employees");

  const { results, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (query.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        dispatch(executeSearch({ query: query.trim(), type: activeTab }));
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearch());
    }
  }, [query, activeTab, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      dispatch(clearSearch());
    }
  }, [isOpen, dispatch]);

  const handleResultClick = (result) => {
    if (activeTab === "employees") {
      navigate(`/employee/${result.id}`);
    } else if (activeTab === "projects") {
      navigate(`/project?highlightId=${result.id}`);
    } else if (activeTab === "hiring") {
      navigate(`/hiring?highlightId=${result.id}`);
    } else if (activeTab === "leave") {
      navigate(`/leave?highlightId=${result.id}`);
    }

    onClose();
  };

  const tabs = [
    { id: "employees", label: "Employees", icon: "fa-users" },
    { id: "projects", label: "Projects", icon: "fa-tasks" },
    { id: "hiring", label: "Hiring", icon: "fa-user-tie" },
    { id: "leave", label: "Leaves", icon: "fa-calendar-times" },
  ];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          ref={searchRef}
          initial={{ y: -50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#142129] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* شريط البحث */}
          <div className="p-6 border-b border-gray-800">
            <div className="relative">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search employees, projects, hiring, leaves..."
                autoFocus
                className="w-full bg-[#1c2e38] border border-gray-700 rounded-2xl pl-14 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* التبويبات */}
          <div className="px-6 py-3 border-b border-gray-800/50 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* النتائج */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
                <p className="text-gray-500 text-sm mt-3">Searching...</p>
              </div>
            ) : results?.length > 0 ? (
              <div className="divide-y divide-gray-800/50">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors text-left"
                  >
                    {/* الصورة (للموظفين والمتقدمين) */}
                    {(activeTab === "employees" || activeTab === "hiring") && (
                      <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
                        <img
                          src={result.image || result.avatar || defaultAvatar}
                          alt={result.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                      </div>
                    )}

                    {/* أيقونة (للمشاريع والأجازات) */}
                    {(activeTab === "projects" || activeTab === "leave") && (
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                        <i
                          className={`fas ${
                            activeTab === "projects"
                              ? "fa-tasks"
                              : "fa-calendar-times"
                          } text-blue-400`}
                        ></i>
                      </div>
                    )}

                    {/* التفاصيل */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {result.name || result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {result.position ||
                          result.role ||
                          result.desc ||
                          result.type}
                      </p>
                    </div>

                    {/* السهم */}
                    <i className="fas fa-arrow-right text-gray-600"></i>
                  </button>
                ))}
              </div>
            ) : query.trim().length > 0 ? (
              <div className="py-20 text-center text-gray-500">
                <i className="fas fa-search text-4xl mb-3 opacity-30"></i>
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <i className="fas fa-keyboard text-4xl mb-3 opacity-30"></i>
                <p className="text-sm">Start typing to search...</p>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="px-6 py-3 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-[10px]">
                  Tab
                </kbd>{" "}
                to switch
              </span>
            </div>
            <span>{results?.length || 0} results</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default SearchModal;
