import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const ExportPDFButton = ({ 
  printRef,           
  fileName = "Staffly-Report", 
  documentDate = "", 
  variant = "primary", 
  className = ""      
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const variants = {
    primary: "bg-[#0095ff] hover:bg-[#0081dd] shadow-blue-500/20",
    dark: "bg-slate-800 hover:bg-slate-700 shadow-slate-900/40",
    outline: "bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300",
  };

  const selectedVariant = variants[variant] || variants.primary;

  const handleExportPDF = async () => {
    if (!printRef || !printRef.current) {
      console.error("No element to print found.");
      return;
    }

    setIsExporting(true);

    try {
      const element = printRef.current;

      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        useCORS: true,
        backgroundColor: "#0b141a", 
        pixelRatio: 2, 
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
        element.offsetHeight
      );

      const timeStamp = new Date().getTime();
      const finalFileName = `${fileName}${documentDate ? "-" + documentDate : ""}-${timeStamp}.pdf`;
      
      pdf.save(finalFileName);

    } catch (error) {
      console.error("Export Error:", error);
      alert("Something went wrong during PDF generation.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={isExporting}
      className={`
        ${selectedVariant} 
        text-white px-6 py-2.5 rounded-xl 
        flex items-center gap-2 font-bold 
        shadow-lg transition-all active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isExporting ? (
        <i className="fas fa-circle-notch animate-spin"></i>
      ) : (
        <i className="fas fa-file-export text-sm"></i> 
      )}
      
      <span className="text-sm">
        {isExporting ? "Generating PDF..." : "Export PDF"}
      </span>
    </button>
  );
};

export default ExportPDFButton;