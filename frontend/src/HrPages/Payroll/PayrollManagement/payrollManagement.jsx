import PayrollManagementHeader from '../../../HrComponents/PayrollComponents/PayrollManagement/PayrollManagementHeader/PayrollManagementHeader';
import ManagementTable from '../../../HrComponents/PayrollComponents/PayrollManagement/ManagementTable/ManagementTable';
import React from 'react';
import { useEffect, useRef } from "react";

const payrollManagement = () => {
  const payrollRef = useRef(null);
  return (
    <div ref={payrollRef} className="max-w-[1650px] mx-auto p-4 bg-transparent">
        {/* 1. Header Section */}
        <PayrollManagementHeader/>
        {/* 2. Full width Table */}
        <ManagementTable />
    </div>
    
  )
}

export default payrollManagement