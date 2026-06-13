import React, { useState } from 'react';
import EmployeeLeaveStatsHeader from '@/EmployeeComponents/MyleavesComponents/EmployeeLeaveStatsHeader.jsx';
// 👈 تم تعديل الاسم هنا ليطابق التصدير الافتراضي للملف تماماً
import MyLeaveYearlyChart from '@/EmployeeComponents/MyleavesComponents/MyLeaveYearlyChart.jsx';

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
      {/* الجزء العلوي: الأرصدة الثلاثة وزر التقديم */}
      <EmployeeLeaveStatsHeader onStatsUpdated={setRefreshHeaderStats} />
      
      {/* الجزء الأوسط: الشارت السنوي الخاص بالموظف */}
      <MyLeaveYearlyChart />

      {/* باقي مكونات الصفحة مثل جدول السجل ونموذج التقديم */}
    </div>
  );
};

export default Myleaves;