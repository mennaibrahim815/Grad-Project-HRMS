import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const LiveNotificationToast = ({ notification, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClick = () => {
    if (notification.type === "leave" || notification.type === "permission") {
      navigate(`/leave-requests?highlightId=${notification.targetId}`);
    } else if (notification.type === "project") {
      navigate(`/project?highlightId=${notification.targetId}`);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      onClick={handleClick}
      style={{ 
        background: 'linear-gradient(to bottom right, var(--card-from), var(--card-to))',
        borderColor: 'var(--border-main)'
      }}
      className="fixed bottom-6 right-6 w-80 border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 cursor-pointer z-[9999] backdrop-blur-xl group"
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img 
            src={notification.avatar || defaultAvatar} 
            className="w-10 h-10 rounded-full border border-blue-500/30 object-cover" 
            alt="" 
          />
          <div className="absolute -bottom-1 -right-1 bg-pink-500 w-3 h-3 rounded-full border-2 border-[#142129]"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 style={{ color: 'var(--text-main)' }} className="text-xs font-black uppercase tracking-wider mb-1">
             {notification.title}
          </h4>
          <p style={{ color: 'var(--text-muted)' }} className="text-[11px] leading-relaxed line-clamp-2">
            <span className="font-bold text-white">{notification.employeeName}</span> {notification.message}
          </p>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      
      {/* Progress bar line */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: 3, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-2xl"
      />
    </motion.div>
  );
};

export default LiveNotificationToast;