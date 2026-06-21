
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
    <div className="flex md:flex-row flex-col justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      <h1 className="text-2xl mb-4 font-bold text-white tracking-tight" style={{ color: 'var(--text-main)' }}>
        Dashboard
      </h1>

      <div className="flex   sm:flex-row flex-col items-center gap-3 relative">
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
