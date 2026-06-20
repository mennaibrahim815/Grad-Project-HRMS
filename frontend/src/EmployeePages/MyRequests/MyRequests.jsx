
import React, { useState, useEffect, useCallback } from 'react';
import instance from '@/services/axios'; 
import EmployeeRequestsStatsHeader from '@/EmployeeComponents/MyRequestsComponents/EmployeeRequestsStatsHeader.jsx';
import MyRequestsTable from '@/EmployeeComponents/MyRequestsComponents/MyRequestsTable.jsx'; 
import EmployeeYearlyRequestsChart from '@/EmployeeComponents/MyRequestsComponents/EmployeeYearlyRequestsChart.jsx';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 5 
  });

  const [refreshStatsFn, setRefreshStatsFn] = useState(null);

  const fetchRequestsHistory = useCallback(async () => {
    try {
      setTableLoading(true);
      
      
      let url = `/requests/history/me?page=${pagination.currentPage}&limit=${pagination.recordsPerPage}`;
      
      if (statusFilter !== "All") {
        url += `&status=${statusFilter}`;
      }

      const response = await instance.get(url);
      
      if (response.data?.status === 'success') {
        
        setRequests(response.data.data.requests || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination?.totalPages || 1,
          totalRecords: response.data.data.pagination?.totalRecords || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching requests history:", error);
    } finally {
      setTableLoading(false);
    }
  }, [pagination.currentPage, pagination.recordsPerPage, statusFilter]);

  useEffect(() => {
    fetchRequestsHistory();
  }, [fetchRequestsHistory]);

  const handleRequestDelete = async (requestId) => {
    try {
      setTableLoading(true);
      const response = await instance.delete(`/requests/${requestId}`);
      
      if (response.data?.status === "success") {
      
        fetchRequestsHistory();
        
        if (refreshStatsFn) {
          refreshStatsFn();
        }
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert(error.response?.data?.message || "Failed to delete request. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  const handleStatsUpdated = useCallback((fetchStatsCallback) => {
    setRefreshStatsFn(() => fetchStatsCallback);
  }, []);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(prev => ({ ...prev, recordsPerPage: limit, currentPage: 1 }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 p-4 sm:p-6 box-border">
      
      
      <EmployeeRequestsStatsHeader onStatsUpdated={handleStatsUpdated} />
      <EmployeeYearlyRequestsChart />
      
      <MyRequestsTable 
        requests={requests}
        loading={tableLoading}
        onRequestDelete={handleRequestDelete}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
      
    </div>
  );
};

export default MyRequests;