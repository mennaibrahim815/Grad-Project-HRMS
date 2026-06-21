

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate, fetchEmployeeDashboardStats } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
import ReusableCalendar from "../../components/UI/ReusableCalendar";
import RequestApplicationModel from "../../EmployeeComponents/MyRequestsComponents/RequestsApplicationModel";
import { Plus } from "lucide-react";

const DashboardHeader = ({ title }) => {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state) => state.employeeDashboard);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshDashboardData = () => {
    dispatch(fetchEmployeeDashboardStats({ dateString: selectedDate }));
  };

  return (
    <div className="flex flex-row justify-between items-center mb-8">
      <h1 
        className="text-2xl font-bold tracking-tight" 
        style={{ color: 'var(--text-main)' }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <ReusableCalendar
          mode="single"
          value={selectedDate}
          onSave={(newDate) => dispatch(setSelectedDate(newDate))}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-200 text-sm active:scale-95"
          style={{ background: '#0293FA' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0282dd'}
          onMouseLeave={e => e.currentTarget.style.background = '#0293FA'}
        >
          <Plus size={18} />
          <span>New Request</span>
        </button>

        <RequestApplicationModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRequestSubmitted={refreshDashboardData} 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;