// import { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedDate } from "../../store/HrSlices/mainDashboard/dashboardSlice";

// // export liberaries
// import * as htmlToImage from "html-to-image";
// import jsPDF from "jspdf";

// const DashboardHeader = ({ printRef }) => {
//   const dispatch = useDispatch();
//   const dropdownRef = useRef(null);

//   const { selectedDate: appliedDate } = useSelector((state) => state.dashboard);

//   const [isOpen, setIsOpen] = useState(false);
//   const [tempDate, setTempDate] = useState(appliedDate);
//   const [viewDate, setViewDate] = useState(new Date(appliedDate));
//   const [isExporting, setIsExporting] = useState(false);

//   const handleExportPDF = async () => {
//     if (!printRef || !printRef.current) return;

//     setIsExporting(true);

//     try {
//       const element = printRef.current;

//       const dataUrl = await htmlToImage.toPng(element, {
//         cacheBust: true,
//         useCORS: true,
//         backgroundColor: "#0b141a",
//         skipFonts: true,
//         fontEmbedCSS: "",

//         filter: (node) => {
//           if (node.tagName === "LINK") return false;
//           return true;
//         },

//         imagePlaceholder:
//           "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
//       });

//       // 2. إعداد الـ PDF
//       const pdf = new jsPDF({
//         orientation: "landscape",
//         unit: "px",
//         format: [element.offsetWidth, element.offsetHeight],
//       });

//       pdf.addImage(
//         dataUrl,
//         "PNG",
//         0,
//         0,
//         element.offsetWidth,
//         element.offsetHeight,
//       );

//       const timeStamp = new Date().getTime();
//       pdf.save(`Staffly-Report-${appliedDate}-${timeStamp}.pdf`);
//     } catch (error) {
//       try {
//         const dataUrlFallback = await htmlToImage.toJpeg(printRef.current, {
//           quality: 0.9,
//           backgroundColor: "#0b141a",
//         });
//         const pdf = new jsPDF("l", "px", [
//           printRef.current.offsetWidth,
//           printRef.current.offsetHeight,
//         ]);
//         pdf.addImage(
//           dataUrlFallback,
//           "JPEG",
//           0,
//           0,
//           printRef.current.offsetWidth,
//           printRef.current.offsetHeight,
//         );
//         pdf.save(`Staffly-Report-Fixed.pdf`);
//       } catch (err) {
//         alert("Export blocked by browser security. Try using local images.");
//       }
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   useEffect(() => {
//     setTempDate(appliedDate);
//     setViewDate(new Date(appliedDate));
//   }, [appliedDate]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//         setTempDate(appliedDate);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [appliedDate]);

//   const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
//   const firstDayOfMonth = (year, month) => {
//     const day = new Date(year, month, 1).getDay();
//     return day === 0 ? 6 : day - 1;
//   };

//   const handleMonthChange = useCallback(
//     (direction) => {
//       const newDate = new Date(viewDate);
//       newDate.setMonth(viewDate.getMonth() + direction);
//       setViewDate(newDate);
//     },
//     [viewDate],
//   );

//   const isToday = (day) => {
//     const today = new Date();
//     return (
//       today.getDate() === day &&
//       today.getMonth() === viewDate.getMonth() &&
//       today.getFullYear() === viewDate.getFullYear()
//     );
//   };

//   const isSelectedTemp = (day) => {
//     const y = viewDate.getFullYear();
//     const m = String(viewDate.getMonth() + 1).padStart(2, "0");
//     const d = String(day).padStart(2, "0");
//     return tempDate === `${y}-${m}-${d}`;
//   };

//   const onDateClick = (day) => {
//     const y = viewDate.getFullYear();
//     const m = String(viewDate.getMonth() + 1).padStart(2, "0");
//     const d = String(day).padStart(2, "0");
//     setTempDate(`${y}-${m}-${d}`);
//   };

//   const handleReturnToToday = () => {
//     const today = new Date().toISOString().split("T")[0];
//     setTempDate(today);
//     setViewDate(new Date());
//   };

//   const handleSave = () => {
//     dispatch(setSelectedDate(tempDate));
//     setIsOpen(false);
//   };

//   return (
//     <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
//       <h1 className="text-2xl font-bold text-white tracking-tight">
//         Dashboard
//       </h1>

//       <div className="flex items-center gap-3 relative" ref={dropdownRef}>
//         {/* زر التاريخ */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="bg-[#142129] border border-gray-800 px-5 py-2.5 rounded-xl flex items-center gap-3 text-gray-300 hover:bg-[#1c2e38] transition-all"
//         >
//           <i className="far fa-calendar-alt text-blue-500"></i>
//           <span className="text-sm font-semibold">
//             {new Date(appliedDate).toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </span>
//           <i
//             className={`fas fa-chevron-down text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}
//           ></i>
//         </button>

//         {/* زر التصدير الذكي */}
//         <button
//           onClick={handleExportPDF}
//           disabled={isExporting}
//           className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
//         >
//           {isExporting ? (
//             <i className="fas fa-circle-notch animate-spin"></i>
//           ) : (
//             <i className="fas fa-upload text-sm"></i>
//           )}
//           <span>{isExporting ? "Generating Report..." : "Export"}</span>
//         </button>

//         {/* المودال الخاص بالتقويم */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: 10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.95 }}
//               className="absolute top-full right-0 mt-3 w-80 bg-[#142129] border border-gray-800 rounded-[2rem] p-6 z-[100] shadow-2xl"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <button
//                   onClick={() => handleMonthChange(-1)}
//                   className="text-gray-500 hover:text-white p-2 transition-colors"
//                 >
//                   <i className="fas fa-chevron-left"></i>
//                 </button>
//                 <span className="font-bold text-gray-200 text-sm">
//                   {viewDate.toLocaleString("default", { month: "long" })}{" "}
//                   {viewDate.getFullYear()}
//                 </span>
//                 <button
//                   onClick={() => handleMonthChange(1)}
//                   className="text-gray-500 hover:text-white p-2 transition-colors"
//                 >
//                   <i className="fas fa-chevron-right"></i>
//                 </button>
//               </div>

//               <div className="grid grid-cols-7 gap-1 text-center mb-6">
//                 {["M", "T", "W", "T", "F", "S", "S"].map((d, index) => (
//                   <div
//                     key={`weekday-${index}`}
//                     className="text-[10px] text-gray-600 font-bold mb-2 uppercase"
//                   >
//                     {d}
//                   </div>
//                 ))}
//                 {[
//                   ...Array(
//                     firstDayOfMonth(
//                       viewDate.getFullYear(),
//                       viewDate.getMonth(),
//                     ),
//                   ),
//                 ].map((_, i) => (
//                   <div key={`empty-${i}`} />
//                 ))}
//                 {[
//                   ...Array(
//                     daysInMonth(viewDate.getFullYear(), viewDate.getMonth()),
//                   ),
//                 ].map((_, i) => {
//                   const day = i + 1;
//                   return (
//                     <button
//                       key={`day-${day}`}
//                       onClick={() => onDateClick(day)}
//                       className={`h-9 w-9 text-xs rounded-xl flex items-center justify-center transition-all relative ${isSelectedTemp(day) ? "bg-blue-600 text-white font-bold shadow-lg scale-110" : isToday(day) ? "bg-gray-700/50 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
//                     >
//                       {day}
//                       {isToday(day) && (
//                         <span
//                           className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelectedTemp(day) ? "bg-white" : "bg-blue-500"}`}
//                         ></span>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={handleReturnToToday}
//                   className="w-full text-blue-500 text-xs font-bold hover:text-blue-400 transition-colors py-1"
//                 >
//                   Return to Today
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-bold text-white shadow-xl transition-all"
//                 >
//                   Save
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../../store/HrSlices/HrDashboard/dashboardSlice";
import ReusableCalendar from "../../components/UI/ReusableCalendar"; // تأكد من المسار الصحيح للملف

// export libraries
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const DashboardHeader = ({ printRef }) => {
  const dispatch = useDispatch();
  const { selectedDate: appliedDate } = useSelector((state) => state.dashboard);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!printRef || !printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        useCORS: true,
        backgroundColor: "#0b141a",
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [element.offsetWidth, element.offsetHeight],
      });

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        element.offsetWidth,
        element.offsetHeight,
      );
      const timeStamp = new Date().getTime();
      pdf.save(`Staffly-Report-${appliedDate}-${timeStamp}.pdf`);
    } catch (error) {
      console.error("PDF Export Error", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Dashboard
      </h1>

      <div className="flex items-center gap-3 relative">
        {/* تم استبدال كل كود التقويم القديم بهذا المكون السحري */}
        <ReusableCalendar
          mode="single"
          value={appliedDate}
          onSave={(newDate) => dispatch(setSelectedDate(newDate))}
        />

        {/* زر التصدير الذكي */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isExporting ? (
            <i className="fas fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fas fa-upload text-sm"></i>
          )}
          <span>{isExporting ? "Generating Report..." : "Export"}</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
