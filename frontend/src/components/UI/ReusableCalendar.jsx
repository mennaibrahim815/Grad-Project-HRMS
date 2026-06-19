import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReusableCalendar = ({
  mode = "single",
  value,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitialViewDate = () => {
    if (mode === "range" && value && typeof value === 'object' && value.start) {
      const date = new Date(value.start);
      return isNaN(date.getTime()) ? new Date() : date;
    }

    if (mode === "month" && typeof value === 'string' && value.includes('-')) {
      const [y, m] = value.split("-");
      return new Date(y, m - 1, 1);
    }

    const date = new Date(value && typeof value === 'string' ? value : new Date());
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const [viewDate, setViewDate] = useState(getInitialViewDate());
  const [tempDate, setTempDate] = useState(value);
  const dropdownRef = useRef(null);

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

  const handleNavigation = (direction) => {
    const newDate = new Date(viewDate);
    if (mode === "month") {
      newDate.setFullYear(viewDate.getFullYear() + direction);
    } else {
      newDate.setMonth(viewDate.getMonth() + direction);
    }
    setViewDate(newDate);
  };

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
      if (!tempDate?.start || (tempDate.start && tempDate.end)) {
        setTempDate({ start: dateStr, end: null });
      } else {
        if (new Date(dateStr) < new Date(tempDate.start)) {
          setTempDate({ start: dateStr, end: tempDate.start });
        } else {
          setTempDate({ ...tempDate, end: dateStr });
        }
      }
    } else {
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

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
        className="border w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full sm:rounded-xl flex items-center justify-center sm:justify-start sm:gap-3 hover:opacity-80 transition-all sm:min-w-[160px] shrink-0"
      >
        <i className="far fa-calendar-alt text-blue-500 text-lg sm:text-base"></i>
        <span className="hidden sm:inline text-sm font-semibold">{getDisplayText()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 sm:mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-72 border rounded-3xl p-4 z-[100] shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => handleNavigation(-1)} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 p-2 transition-colors">
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                {mode === "month" ? viewDate.getFullYear() : viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={() => handleNavigation(1)} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 p-2 transition-colors">
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
                      style={isSelected ? { background: '#2563eb', color: '#fff' } : { color: 'var(--text-muted)' }}
                      className={`py-3 text-xs rounded-xl transition-all font-bold ${isSelected ? "" : "hover:opacity-70"}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, index) => (
                  <div key={index} className="text-[10px] font-bold mb-2 uppercase" style={{ color: 'var(--text-muted)' }}>{d}</div>
                ))}
                {[...Array(firstDay(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => <div key={`e-${i}`} />)}
                {[...Array(daysInMonth(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  const isSelected = mode !== "range" && tempDate === dateStr;
                  const isStart = mode === "range" && tempDate?.start === dateStr;
                  const isEnd = mode === "range" && tempDate?.end === dateStr;
                  const inRange = mode === "range" && tempDate?.start && tempDate?.end &&
                    dateStr > tempDate.start && dateStr < tempDate.end;

                  return (
                    <button
                      key={day}
                      onClick={() => handleCellClick(day)}
                      style={
                        isSelected || isStart || isEnd
                          ? { background: '#2563eb', color: '#fff' }
                          : inRange
                          ? { background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa' }
                          : { color: 'var(--text-muted)' }
                      }
                      className={`h-9 w-9 text-xs flex items-center justify-center transition-all relative font-bold
        ${isSelected || isStart || isEnd ? "rounded-xl z-10 shadow-lg" : ""}
        ${inRange ? "!rounded-none" : "hover:opacity-70 rounded-xl"}
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