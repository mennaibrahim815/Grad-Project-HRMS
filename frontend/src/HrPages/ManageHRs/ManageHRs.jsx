// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from '../../services/axios'
// import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

// import EmployeeHeader from "../../HrComponents/employees/EmployeeHeader/EmployeeHeader";
// import EmployeesTable from "../../HrComponents/employees/EmployeesTable/EmployeesTable";


// const ManageHRs = () => {
//   const [hrs, setHrs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. جلب قائمة الـ HRs من الباك إيند


//   return (
//     <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
//       <div className="space-y-3">
//         <EmployeeHeader title={"Manage HRs Team"} addButtonNAme={"Add New HR"} />

// {/* <PayrollTable roleFilter="HR" /> */}

//           <div className="lg:col-span-2 ">
            
//             <EmployeesTable /> 
//           </div>
//         </div></div>
//   );
// };

// export default ManageHRs;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../../services/axios'
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

import EmployeeHeader from "../../HrComponents/employees/EmployeeHeader/EmployeeHeader";
import EmployeesTable from "../../HrComponents/employees/EmployeesTable/EmployeesTable";


const ManageHRs = () => {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب قائمة الـ HRs من الباك إيند


  return (
    <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
      <div className="space-y-3">
        <EmployeeHeader title={"Manage HRs Team"} addButtonNAme={"Add New HR"} />

{/* <PayrollTable roleFilter="HR" /> */}

          <div className="lg:col-span-2 ">
            
            {/* تم تمرير الفلتر هنا */}
            {/* <EmployeesTable roleFilter="HR" />  */}
<EmployeesTable mode="hrs" />

          </div>
        </div></div>
  );
};

export default ManageHRs;