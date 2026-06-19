import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMonth } from "../../store/EmployeeSlices/payroll/empPayrollSlice"
import ReusableCalendar from "../../components/UI/ReusableCalendar";

import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const PayrollHeader = ({ printRef }) => {
  const dispatch = useDispatch();
  const { selectedMonth } = useSelector((state) => state.empPayroll);
  const [isExporting, setIsExporting] = useState(false);

  const formattedMonth = new Date(selectedMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleExportPDF = async () => {
    if (!printRef || !printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        useCORS: true,
        backgroundColor: "#121417",
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
      pdf.save(`Staffly-Payroll-${formattedMonth}-${timeStamp}.pdf`);
    } catch (error) {
      console.error("PDF Export Error", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-between items-start sm:items-center gap-3 mb-4 bg-transparent p-4 rounded-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          My Payroll
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Overview of your salary and payment history for {formattedMonth}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <ReusableCalendar
          mode="month"
          value={selectedMonth}
          onSave={(newMonth) => dispatch(setSelectedMonth(newMonth))}
        />

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-3 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isExporting ? (
            <i className="fas fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fas fa-upload text-sm"></i>
          )}
          <span className="hidden sm:inline">
            {isExporting ? "Generating Report..." : "Export"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PayrollHeader;