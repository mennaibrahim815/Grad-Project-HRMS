// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedDate } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
// import ReusableCalendar from "../../components/UI/ReusableCalendar";
// import { Plus } from "lucide-react";

// const DashboardHeader = ({ title }) => {
//   const dispatch = useDispatch();
//   const { selectedDate } = useSelector((state) => state.employeeDashboard);

//   return (
//     <div className="flex flex-row justify-between items-center mb-8 bg-transparent">
//       <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>

//       <div className="flex items-center gap-4">
//         {/* Calendar مربوط بالـ Redux مباشرة */}
//         <ReusableCalendar
//           mode="single"
//           value={selectedDate}
//           onSave={(newDate) => dispatch(setSelectedDate(newDate))}
//         />

//         {/* زر الإضافة السريع */}
//         <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-lg transition-all text-sm font-bold">
//           <Plus size={18} />
//           <span>New Request</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedDate } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
// import ReusableCalendar from "../../Components/UI/ReusableCalendar";
// import RequestApplicationModel from "/EmployeeComponents/MyRequestsComponents/RequestsApplicationModel.jsx";
// import { Plus } from "lucide-react";

// const DashboardHeader = ({ title }) => {
//   const dispatch = useDispatch();
//   const { selectedDate } = useSelector((state) => state.employeeDashboard);

//   return (
//     <div className="flex flex-row justify-between items-center mb-8">
//       <h1 className="text-2xl font-bold text-white tracking-tight" style={{ color: 'var(--text-main)' }}>{title}</h1>
//       <div className="flex items-center gap-4">
//         <ReusableCalendar
//           mode="single"
//           value={selectedDate}
//           onSave={(newDate) => dispatch(setSelectedDate(newDate))}
//         />
//         <button className="flex items-center gap-2 bg-[#0293FA] hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all text-sm">
//           <Plus size={18} />
//           <span>New Request</span>
//         </button>

//               <RequestApplicationModel
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 onRequestSubmitted={fetchRequestStats}
//               />
//             </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;


import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// استيراد الأكشن لتحديث البيانات بعد إرسال الطلب
import { setSelectedDate, fetchEmployeeDashboardStats } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
import ReusableCalendar from "../../Components/UI/ReusableCalendar";
import RequestApplicationModel from "../../EmployeeComponents/MyRequestsComponents/RequestsApplicationModel";
import { Plus } from "lucide-react";

const DashboardHeader = ({ title }) => {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state) => state.employeeDashboard);
  
  // حالة التحكم في فتح وقفل المودال
  const [isModalOpen, setIsModalOpen] = useState(false);

  // دالة تُنفذ بعد إرسال الطلب بنجاح لتحديث أرقام الداشبورد
  const refreshDashboardData = () => {
    dispatch(fetchEmployeeDashboardStats({ dateString: selectedDate }));
  };

  return (
    <div className="flex flex-row justify-between items-center mb-8">
      {/* العنوان */}
      <h1 
        className="text-2xl font-bold tracking-tight" 
        style={{ color: 'var(--text-main)' }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* مكون التقويم */}
        <ReusableCalendar
          mode="single"
          value={selectedDate}
          onSave={(newDate) => dispatch(setSelectedDate(newDate))}
        />

        {/* زر إضافة طلب جديد - تم تفعيله بالكامل بنفس ستايلك */}
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

        {/* المودال الخاص بتقديم الطلبات */}
        <RequestApplicationModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRequestSubmitted={refreshDashboardData} // سيقوم بعمل ريفرش للكروت فور النجاح
        />
      </div>
    </div>
  );
};

export default DashboardHeader;