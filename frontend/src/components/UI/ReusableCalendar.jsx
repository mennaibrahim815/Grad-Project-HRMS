import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReusableCalendar = ({
  mode = "single",
  value,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // دالة لتحديد تاريخ العرض المبدئي
  const getInitialViewDate = () => {
    // 1. لو في وضع الـ Range والـ value عبارة عن Object
    if (mode === "range" && value && typeof value === 'object' && value.start) {
      const date = new Date(value.start);
      return isNaN(date.getTime()) ? new Date() : date;
    }

    // 2. لو في وضع الـ Month
    if (mode === "month" && typeof value === 'string' && value.includes('-')) {
      const [y, m] = value.split("-");
      return new Date(y, m - 1, 1);
    }

    // 3. الوضع العادي (Single) أو لو الـ value لسه مفيهاش داتا
    const date = new Date(value && typeof value === 'string' ? value : new Date());
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const [viewDate, setViewDate] = useState(getInitialViewDate());
  const [tempDate, setTempDate] = useState(value);
  const dropdownRef = useRef(null);

  // إغلاق عند الضغط بالخارج
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setTempDate(value);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  // التنقل بالأسهم
  const handleNavigation = (direction) => {
    const newDate = new Date(viewDate);
    if (mode === "month") {
      newDate.setFullYear(viewDate.getFullYear() + direction);
    } else {
      newDate.setMonth(viewDate.getMonth() + direction);
    }
    setViewDate(newDate);
  };

  // وظيفة الزرار "Return to Today" الذكية
  const handleReturnToToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    if (mode === "month") {
      setTempDate(`${y}-${m}`);
    } else {
      setTempDate(`${y}-${m}-${d}`);
    }
    setViewDate(today);
  };

  const handleMonthSelect = (monthIndex) => {
    const y = viewDate.getFullYear();
    const m = String(monthIndex + 1).padStart(2, "0");
    setTempDate(`${y}-${m}`);
  };

  const handleCellClick = (day) => {
    const y = viewDate.getFullYear();
    const m = String(viewDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    if (mode === "range") {
      // لو لسه مفيش تاريخ بداية أو لو الموظف اختار فترة كاملة وعايز يغيرها
      if (!tempDate?.start || (tempDate.start && tempDate.end)) {
        setTempDate({ start: dateStr, end: null });
      } else {
        // لو اختار تاريخ قبل البداية، اعكسيهم عشان الـ Range يبقى صح
        if (new Date(dateStr) < new Date(tempDate.start)) {
          setTempDate({ start: dateStr, end: tempDate.start });
        } else {
          setTempDate({ ...tempDate, end: dateStr });
        }
      }
    } else {
      // الوضع القديم (Single)
      setTempDate(dateStr);
    }
  };


  const getDisplayText = () => {
    if (!value) return "Select Date";
    try {
      if (mode === "range") {
        if (!value.start) return "Select Period";
        const start = new Date(value.start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!value.end) return `${start} - ...`;
        const end = new Date(value.end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${start} - ${end}`;
      }
      if (mode === "month") {
        const [y, m] = value.split("-");
        return new Date(y, m - 1).toLocaleString("en-US", { month: "short", year: "numeric" });
      }
      return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) { return "Select Date"; }
  };

  // حسابات الأيام
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#142129] border border-gray-800 w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full sm:rounded-xl flex items-center justify-center sm:justify-start sm:gap-3 text-gray-300 hover:bg-[#1c2e38] transition-all sm:min-w-[160px] shrink-0"
      >
        <i className="far fa-calendar-alt text-blue-500 text-lg sm:text-base"></i>

        {/* إخفاء النص في الموبايل وإظهاره في الشاشات الأكبر */}
        <span className="hidden sm:inline text-sm font-semibold">{getDisplayText()}</span>

        {/* إخفاء السهم في الموبايل وإظهاره في الشاشات الأكبر */}

        
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 sm:mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-72 bg-[#142129] border border-gray-800 rounded-3xl p-4 z-[100] shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => handleNavigation(-1)} className="text-gray-500 hover:text-white p-2 transition-colors">
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="font-bold text-gray-200 text-sm">
                {mode === "month" ? viewDate.getFullYear() : viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={() => handleNavigation(1)} className="text-gray-500 hover:text-white p-2 transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            {mode === "month" ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
                  const isSelected = tempDate === `${viewDate.getFullYear()}-${String(i + 1).padStart(2, "0")}`;
                  return (
                    <button
                      key={m}
                      onClick={() => handleMonthSelect(i)}
                      className={`py-3 text-xs rounded-xl transition-all ${isSelected ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, index) => (
                  <div key={index} className="text-[10px] text-gray-600 font-bold mb-2 uppercase">{d}</div>
                ))}
                {[...Array(firstDay(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => <div key={`e-${i}`} />)}
                {[...Array(daysInMonth(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  // حسابات الحالات الجديدة
                  const isSelected = mode !== "range" && tempDate === dateStr;
                  const isStart = mode === "range" && tempDate?.start === dateStr;
                  const isEnd = mode === "range" && tempDate?.end === dateStr;
                  const inRange = mode === "range" && tempDate?.start && tempDate?.end &&
                    dateStr > tempDate.start && dateStr < tempDate.end;

                  return (
                    <button
                      key={day}
                      onClick={() => handleCellClick(day)}
                      className={`h-9 w-9 text-xs flex items-center justify-center transition-all relative
        ${isSelected || isStart || isEnd ? "bg-blue-600 text-white font-bold rounded-xl z-10 shadow-lg" : "text-gray-400"}
        ${inRange ? "bg-blue-600/20 text-blue-400 !rounded-none" : "hover:bg-gray-800 rounded-xl"}
        ${isStart && tempDate.end ? "rounded-r-none" : ""} 
        ${isEnd ? "rounded-l-none" : ""}
      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleReturnToToday}
                className="w-full text-blue-500 text-xs font-bold hover:text-blue-400 transition-colors py-1"
              >
                Return to Today
              </button>
              <button
                onClick={() => { onSave(tempDate); setIsOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-bold text-white shadow-xl transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReusableCalendar;
