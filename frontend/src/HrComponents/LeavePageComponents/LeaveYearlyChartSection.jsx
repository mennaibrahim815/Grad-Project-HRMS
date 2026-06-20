import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import YearlyChart from "@/components/Charts/YearlyChart.jsx"; 

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

      
      const rawOverview = response.data?.data?.yearlyOverview || [];
      const fallbackMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formatted = rawOverview.map((item, index) => ({
        ...item,
        
        monthName: item.monthName || fallbackMonths[index],
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
        bar1Key="totalRequests"
        bar1Label="Total Requests"
        bar1Color={{ start: "#00c6ff", end: "#0072ff" }}
        
        bar2Key="approvedDays"
        bar2Label="Approved Days"
      />

      <style>{`
        .leaves-chart-override .recharts-bar-rect {
          min-height: 4px !important; /* ضمان ظهور العواميد الصغيرة */
        }
      `}</style>
    </div>
  );
};

export default LeaveYearlyChartSection;