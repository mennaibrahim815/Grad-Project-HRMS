
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import YearlyChart from "@/components/Charts/YearlyChart.jsx";
import { Loader2 } from "lucide-react"; 

const MyLeaveYearlyChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYearlyLeaveStats = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/leaves/stats/yearly/me`, {
        params: { year: selectedYear }
      });

      const rawOverview = response.data?.data?.yearlyOverview || [];

      const fallbackMonths = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];

      const formatted = rawOverview.map((item, index) => ({
        ...item,
        monthName: item.monthName || fallbackMonths[index],
        totalRequests: Number(item.totalRequests || 0),
        approvedDays: Number(item.approvedDays || 0)
      }));

      setChartData(formatted);
    } catch (error) {
      console.error("Error fetching yearly leaves chart data for employee:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyLeaveStats();
  }, [selectedYear]);

  return (
    // 🛠️ تم تنظيف كلاسات الـ div الخارجي لمنع تكرار الخلفية والحواف والمساحات الزائدة
    <div className="w-full leaves-chart-override">
      
      {loading && (
        <div className="absolute inset-0 bg-[#0c1922]/40 backdrop-blur-sm z-10 rounded-[2rem] flex items-center justify-center">
          <Loader2 className="text-[#0293FA] animate-spin" size={32} />
        </div>
      )}

      <YearlyChart
        title="My Yearly Leaves Analytics"
        data={chartData}
        isLoading={loading}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        
        bar1Key="totalRequests"
        bar1Label="Total Requests"
        bar1Color={{ start: "#0293FA", end: "#0072ff" }}
        
        bar2Key="approvedDays"
        bar2Label="Approved Days"
      />

      <style>{`
        .leaves-chart-override .recharts-bar-rect {
          min-height: 3px !important;
          rx: 4px;
        }
        .leaves-chart-override .recharts-legend-item-text {
          color: #94a3b8 !important;
          font-size: 12px !important;
        }
        .leaves-chart-override .recharts-cartesian-axis-text {
          fill: #64748b !important;
          font-size: 11px !important;
        }
      `}</style>
    </div>
  );
};

export default MyLeaveYearlyChart;