import { useEffect, useRef } from "react";

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
    <div ref={menuRef} className="absolute right-0 mt-2 z-50">
      <div
        style={{
          background: 'linear-gradient(to bottom right, var(--menu-gradient-from), var(--menu-gradient-to))',
          borderColor: 'var(--menu-border)',
        }}
        className="rounded-[14px] p-1.5 min-w-[160px]
                    shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(0,0,0,0.2)]
                    border flex flex-col"
      >
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
              style={{
                color: isDanger
                  ? '#f472b6' 
                  : isSuccess
                  ? '#34d399' 
                  : 'var(--text-main)',
              }}
              className="flex items-center gap-3 px-4 py-3
                rounded-[10px] w-full text-sm font-medium
                transition-all duration-200 active:scale-[0.98]
                hover:opacity-80"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDanger
                  ? 'rgba(244, 114, 182, 0.1)'
                  : isSuccess
                  ? 'rgba(52, 211, 153, 0.1)'
                  : 'var(--menu-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {action.icon && (
                <action.icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
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