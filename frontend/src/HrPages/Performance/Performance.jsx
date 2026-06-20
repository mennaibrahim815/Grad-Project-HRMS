
import React, { useState, useEffect } from "react";
import PerformanceTable from "@/HrComponents/PerformanceComponents/PerformanceTable.jsx";
import instance from "@/services/axios";

const Performance = () => {
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0, currentPage: 1, totalPages: 1, limit: 5
  });

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchName.trim() !== "") {
        response = await instance.get(
          `/employeePerformance/search?name=${encodeURIComponent(searchName)}`
        );
      } else {
        response = await instance.get(
          `/employeePerformance/all?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
        );
      }

      if (response.data?.status === "success") {
        const dataPayload = response.data.data;
        
        const performanceReport = dataPayload?.performanceReport || [];
        setReports(performanceReport);

        if (dataPayload?.pagination) {
          setPagination(dataPayload.pagination);
        } else {
          setPagination({
            totalRecords: performanceReport.length,
            currentPage: 1,
            totalPages: 1,
            limit: limit
          });
        }
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPerformanceData(); 
  }, [page, limit, startDate, endDate, searchName]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
          Employees Performance Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Monitor and evaluate employee KPIs and tracks.
        </p>
      </div>

      <PerformanceTable
        reportData={reports}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        searchName={searchName}
        setSearchName={setSearchName}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        loading={loading}
      />
    </div>
  );
};

export default Performance;