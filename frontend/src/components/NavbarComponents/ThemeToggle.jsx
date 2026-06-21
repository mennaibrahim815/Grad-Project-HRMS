import { useEffect } from "react"; // 1. استيراد useEffect
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.mode === "dark");

  // 2. إضافة التأثير الذي يربط Redux بالـ HTML DOM
  useEffect(() => {
    const root = document.documentElement; // تاج <html>
    if (!isDark) {
      // لو الحالة light، ضيف الـ attribute عشان الـ CSS يشتغل
      root.setAttribute("data-theme", "light");
    } else {
      // لو الحالة dark، شيل الـ attribute عشان يرجع للألوان الافتراضية (:root)
      root.removeAttribute("data-theme");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      aria-pressed={!isDark}
      className={`
        relative w-16 h-8 rounded-full border transition-all duration-400 outline-none
        focus-visible:ring-2 focus-visible:ring-blue-400
        ${isDark
          ? "bg-[#1a2535] border-gray-600"
          : "bg-[#e9f3ff] border-blue-200"
        }
      `}
    >
      <span
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isDark
            ? "translate-x-0 bg-white"
            : "translate-x-8 bg-blue-500"
          }
        `}
      >
        <svg
          className={`absolute w-3.5 h-3.5 transition-all duration-300
            ${isDark ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
          viewBox="0 0 24 24" fill="none"
          stroke="#1a2535" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        <svg
          className={`absolute w-3.5 h-3.5 transition-all duration-300
            ${isDark ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
          viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;