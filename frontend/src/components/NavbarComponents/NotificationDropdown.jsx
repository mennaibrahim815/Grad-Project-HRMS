
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  markAsRead,
  markAllAsRead,
  fetchNotifications,
  fetchUnreadCount,
} from "../../store/HrSlices/navbar/notificationSlice";
import { updateLeaveStatus } from "../../store/HrSlices/leaveSlice";

import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const NotificationItem = ({ n, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = () => {
    if (!n) return;
    if (n.type === "leave" || n.type === "permission") {
      navigate(`/leave?highlightId=${n.targetId || n.id}`);
    } else if (n.type === "project_complete") {
      navigate(`/project?highlightId=${n.targetId || n.id}`);
    }
    dispatch(markAsRead(n.id));
    onClose();
  };

  const onAction = (e, status) => {
    e.stopPropagation();
    dispatch(
      updateLeaveStatus({
        id: n.targetId,
        status: status === "accepted" ? "Approved" : "Rejected",
      }),
    );
  };

  return (
    <div
      style={{ 
        borderBottom: '1px solid var(--border-main)',
        backgroundColor: n.status === "unread" ? 'rgba(2, 147, 250, 0.05)' : 'transparent'
      }}
      className={`px-4 sm:px-6 py-4 hover:bg-white/[0.02] cursor-pointer transition-colors relative`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div 
          style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border"
        >
          <img
            src={n.avatar && n.avatar.trim() !== "" ? n.avatar : defaultAvatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0" onClick={handleItemClick}>
          <p style={{ color: 'var(--text-main)' }} className="text-xs sm:text-sm leading-snug break-words">
            <span className="font-bold">{n.employeeName}</span>{" "}
            {n.message}
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] sm:text-[11px] font-medium mt-1">{n.time}</p>

          <AnimatePresence>
            {isExpanded &&
              !n.actionStatus &&
              (n.type === "leave" || n.type === "permission") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  <button
                    onClick={(e) => onAction(e, "accepted")}
                    className="bg-[#0095FF] text-white text-[10px] sm:text-[11px] px-4 sm:px-5 py-1.5 rounded-full font-bold shadow-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => onAction(e, "rejected")}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)' }}
                    className="text-[10px] sm:text-[11px] px-4 sm:px-5 py-1.5 rounded-full font-bold border border-transparent hover:border-red-500/30"
                  >
                    Decline
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Action Button - Responsive width */}
        <div className="flex flex-col items-end justify-center min-w-[50px] sm:min-w-[70px] gap-2">
          {n.actionStatus ? (
            <span
              className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-1 rounded-md ${n.actionStatus === "accepted" ? "text-green-500 bg-green-500/10" : "text-red-400 bg-red-400/10"}`}
            >
              {n.actionStatus}
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(n.type === "project_complete") dispatch(markAsRead(n.id));
                else setIsExpanded(!isExpanded);
              }}
              style={{ backgroundColor: (isExpanded || n.status === "read") ? 'rgba(2, 147, 250, 0.1)' : 'var(--bg-deep)' }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isExpanded ? "text-blue-400 rotate-180" : "text-gray-500"}`}
            >
              <i className={`fas ${n.type === "project_complete" ? "fa-check" : "fa-chevron-down"} text-[10px]`}></i>
            </button>
          )}
          {n.status === "unread" && !n.actionStatus && (
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ isOpen, setIsOpen, notifRef }) => {
  const dispatch = useDispatch();
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: 'var(--card-border)', color: 'var(--text-muted)' }}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-all relative"
      >
        <i className="far fa-bell text-lg"></i>
        {unreadCount > 0 && (
          <span 
            style={{ borderColor: 'var(--bg-deep)' }}
            className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 border-2 rounded-full"
          ></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="absolute right-0 sm:right-0 mt-4 w-[calc(100vw-32px)] sm:w-[400px] border rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div 
              style={{ borderBottom: '1px solid var(--border-main)' }}
              className="p-4 sm:p-6 flex justify-between items-center"
            >
              <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-sm sm:text-base">
                Notifications{" "}
                <span className="bg-pink-500/20 text-pink-500 text-[10px] px-2 py-0.5 rounded-full ml-1">
                  {unreadCount}
                </span>
              </h3>
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-blue-500 text-[11px] sm:text-xs font-semibold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[350px] sm:max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications?.length > 0 ? (
                notifications.map((n) => n && (
                  <NotificationItem key={n.id} n={n} onClose={() => setIsOpen(false)} />
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }} className="py-16 sm:py-20 text-center text-xs sm:text-sm">
                  No new notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;