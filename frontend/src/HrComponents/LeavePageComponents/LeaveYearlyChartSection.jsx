import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import YearlyChart from "@/components/Charts/YearlyChart.jsx"; // تأكدي من مسار ملف YearlyChart الأصلي عندك



const LeaveYearlyChartSection = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYearlyLeaveStats = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/leaves/stats/yearly`, {
        params: { year: selectedYear }
      });

      // قراءة المصفوفة من الباك إند
      const rawOverview = response.data?.data?.yearlyOverview || [];

      // أسماء الشهور المضمونة لتجنب مشاكل الـ substring في الكومبوننت الأساسي
      const fallbackMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // إعادة تهيئة الداتا وضمان أن القيم أرقام صريحة وليست نصوص
      const formatted = rawOverview.map((item, index) => ({
        ...item,
        // تأمين مسمى الشهر كـ String مية بالمية
        monthName: item.monthName || fallbackMonths[index],
        // تحويل القيم لأرقام صريحة لمنع مشاكل المقياس (Scale) في Recharts
        totalRequests: Number(item.totalRequests || 0),
        approvedDays: Number(item.approvedDays || 0)
      }));

      setChartData(formatted);
    } catch (error) {
      console.error("Error fetching yearly leaves chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyLeaveStats();
  }, [selectedYear]);

  return (
    <div className="w-full leaves-chart-override">
      <YearlyChart
        title="Yearly Leaves Analytics"
        data={chartData}
        isLoading={loading}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        
        // ربط العواميد بالمسميات الجديدة الصحيحة من الـ Network
        bar1Key="totalRequests"
        bar1Label="Total Requests"
        bar1Color={{ start: "#00c6ff", end: "#0072ff" }}
        
        bar2Key="approvedDays"
        bar2Label="Approved Days"
      />

      {/* كود حقن ستايل (CSS Injection) سحري لتصحيح أطوال العواميد والمقياس الصغير دون تعديل ملف الـ Chart الأصلي */}
      <style>{`
        .leaves-chart-override .recharts-bar-rect {
          min-height: 4px !important; /* ضمان ظهور العواميد الصغيرة */
        }
      `}</style>
    </div>
  );
};

export default LeaveYearlyChartSection;