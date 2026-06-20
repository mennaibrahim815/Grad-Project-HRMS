
import React, { useState, useEffect } from 'react';
import instance from '@/services/axios';
import EmployeeLeaveStatsHeader from '@/EmployeeComponents/MyleavesComponents/EmployeeLeaveStatsHeader.jsx';
import MyLeaveYearlyChart from '@/EmployeeComponents/MyleavesComponents/MyLeaveYearlyChart.jsx';
import MyLeaveTable from '@/EmployeeComponents/MyleavesComponents/MyLeaveTable.jsx';

const Myleaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({
    page: 1, currentPage: 1, limit: 10, totalPages: 1, totalResults: 0, totalRecords: 0
  });
  const [refreshHeaderStats, setRefreshHeaderStats] = useState(null);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/leaves/employee/me`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: statusFilter !== "All" ? statusFilter : undefined
        }
      });

      const fetchedData = response.data?.data?.leaves || response.data?.data || [];
      const backendPagination = response.data?.pagination || response.data?.data?.pagination;
      const totalPages = backendPagination?.totalPages || 1;
      const totalRecords = backendPagination?.totalRecords || fetchedData.length;

      setLeaves(fetchedData);
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalResults: totalRecords,
        totalRecords,
        currentPage: prev.page
      }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyLeaves(); }, [pagination.page, pagination.limit, statusFilter]);

  const handleLeaveDelete = async (leaveId) => {
    try {
      await instance.delete(`/leaves/${leaveId}`);
      fetchMyLeaves();
      if (refreshHeaderStats) refreshHeaderStats();
    } catch (error) {
      console.error("Failed to delete leave request:", error);
      alert(error.response?.data?.message || "Something went wrong while deleting");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <EmployeeLeaveStatsHeader onStatsUpdated={setRefreshHeaderStats} />
      <MyLeaveYearlyChart />
      <MyLeaveTable
        leaves={leaves}
        loading={loading}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagination={pagination}
        onLeaveDelete={handleLeaveDelete}
        onPageChange={(newPage) => {
          const pageNumber = typeof newPage === 'object' ? (newPage.page || newPage.currentPage) : newPage;
          if (pageNumber) {
            setPagination(prev => ({ ...prev, page: Number(pageNumber), currentPage: Number(pageNumber) }));
          }
        }}
        onLimitChange={(newLimit) => {
          const limitNumber = typeof newLimit === 'object' ? newLimit.limit : newLimit;
          if (limitNumber) {
            setPagination(prev => ({ ...prev, limit: Number(limitNumber), page: 1, currentPage: 1 }));
          }
        }}
      />
    </div>
  );
};

export default Myleaves;