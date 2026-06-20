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


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
import ReusableCalendar from "../../Components/UI/ReusableCalendar";
import { Plus } from "lucide-react";

const DashboardHeader = ({ title }) => {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state) => state.employeeDashboard);

  return (
    <div className="flex flex-row justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <ReusableCalendar
          mode="single"
          value={selectedDate}
          onSave={(newDate) => dispatch(setSelectedDate(newDate))}
        />
        <button className="flex items-center gap-2 bg-[#0293FA] hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all text-sm">
          <Plus size={18} />
          <span>New Request</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;