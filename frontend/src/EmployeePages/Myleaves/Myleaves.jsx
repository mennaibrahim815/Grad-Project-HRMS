import React, { useState } from 'react';
import EmployeeLeaveStatsHeader from '@/EmployeeComponents/MyleavesComponents/EmployeeLeaveStatsHeader.jsx';

const Myleaves = () => {
  const [refreshHeaderStats, setRefreshHeaderStats] = useState(null);

  const handleLeaveSubmittedSuccessfully = () => {
    // عندما ينجح الـ API الخاص بطلب الإجازة الجديدة، نقوم باستدعاء الدالة لتحديث الكاردز فوراً
    if (refreshHeaderStats) {
      refreshHeaderStats();
    }
  };

  return (
    <div className="p-6">
      <EmployeeLeaveStatsHeader onStatsUpdated={setRefreshHeaderStats} />
      
      {/* باقي مكونات الصفحة مثل جدول السجل ونموذج التقديم */}
    </div>
  );
};

export default Myleaves;