import { useEffect, useRef } from "react";
import { Eye, Trash2 } from "lucide-react";

const RowActionMenu = ({ isOpen, onClose, actions }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 z-50"
    >
      <div className="bg-gradient-to-br from-[#1e2a3a] to-[#162231] 
                      rounded-[14px] p-1.5 min-w-[160px]
                      shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(0,0,0,0.2)] 
                      border border-white/[0.08]
                      flex flex-col">

        {actions.map((action, index) => {
          const isDanger = action.variant === "danger";
          const isSuccess = action.variant === "success";

          return (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
  className={`flex items-center gap-3 px-4 py-3 
            rounded-[10px] w-full text-sm font-medium
            transition-all duration-200 active:scale-[0.98]
            ${
              isDanger
                ? "text-pink-400 hover:bg-pink-400/10"
                : isSuccess
                ? "text-emerald-400 hover:bg-emerald-400/10" 
                : "text-slate-200 hover:bg-white/[0.08]"
            }`}
            >
              {/* Icon */}
              {action.icon && (
                <action.icon
                  className="w-[18px] h-[18px] flex-shrink-0"
                  strokeWidth={2}
                />
              )}

              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RowActionMenu;
