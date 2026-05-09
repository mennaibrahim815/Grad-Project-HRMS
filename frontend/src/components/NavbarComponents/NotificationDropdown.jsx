import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  markAsRead,
  handleNotificationAction,
  markAllAsRead,
  fetchNotifications,
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

  // const onAction = (e, status) => {
  //   e.stopPropagation();
  //   dispatch(handleNotificationAction({ id: n.id, actionStatus: status }));
  // };
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
      className={`px-6 py-4 hover:bg-white/[0.02] cursor-pointer transition-colors border-b border-gray-800/50 relative ${n.status === "unread" ? "bg-blue-500/5" : ""}`}
    >
      <div className="flex gap-4">
        <div className="w-11 h-11 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
          {/*  NotificationItem: */}
          <img
            src={n.avatar && n.avatar.trim() !== "" ? n.avatar : defaultAvatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1" onClick={handleItemClick}>
          <p className="text-sm text-gray-200 leading-snug">
            <span className="font-bold text-white">{n.employeeName}</span>{" "}
            {n.message}
          </p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">{n.time}</p>

          <AnimatePresence>
            {isExpanded &&
              !n.actionStatus &&
              (n.type === "leave" || n.type === "permission") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex gap-2 mt-4"
                >
                  <button
                    onClick={(e) => onAction(e, "accepted")}
                    className="bg-[#0095FF] text-white text-[11px] px-5 py-1.5 rounded-full font-bold shadow-lg shadow-blue-500/20"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => onAction(e, "rejected")}
                    className="bg-[#1c2e38] text-gray-300 text-[11px] px-5 py-1.5 rounded-full font-bold"
                  >
                    Decline
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-end justify-center min-w-[70px] gap-2">
          {n.actionStatus ? (
            <span
              className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${n.actionStatus === "accepted" ? "text-green-500 bg-green-500/10" : "text-red-400 bg-red-400/10"}`}
            >
              {n.actionStatus}
            </span>
          ) : n.type === "project_complete" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(markAsRead(n.id));
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${n.status === "read" ? "bg-blue-500/20 text-blue-500" : "bg-gray-800 text-gray-500"}`}
            >
              <i className="fas fa-check text-[10px]"></i>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isExpanded ? "bg-blue-500/20 text-blue-400 rotate-180" : "bg-gray-800 text-gray-500"}`}
            >
              <i className="fas fa-chevron-down text-[10px]"></i>
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

// (Dropdown)
const NotificationDropdown = ({ isOpen, setIsOpen, notifRef }) => {
  const dispatch = useDispatch();
  const { list: notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-[#142129] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all relative"
      >
        <i className="far fa-bell text-lg"></i>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 border-2 border-[#142129] rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute right-0 mt-4 w-[400px] bg-[#142129]/95 border border-gray-800 rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-white">
                Notifications{" "}
                <span className="bg-pink-500/20 text-pink-500 text-[10px] px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              </h3>
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-blue-500 text-xs font-semibold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications?.length > 0 ? (
                notifications.map(
                  (n) =>
                    n && (
                      <NotificationItem
                        key={n.id}
                        n={n}
                        onClose={() => setIsOpen(false)}
                      />
                    ),
                )
              ) : (
                <div className="py-20 text-center text-gray-500 text-sm">
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
