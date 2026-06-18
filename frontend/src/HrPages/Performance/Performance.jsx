
// import React, { useState, useEffect } from "react";
// import PerformanceTable from "@/HrComponents/PerformanceComponents/PerformanceTable.jsx"; 
// import instance from "@/services/axios";

// const Performance = () => {
//   const [startDate, setStartDate] = useState("2026-06-01");
//   const [endDate, setEndDate] = useState("2026-06-30");
//   const [searchName, setSearchName] = useState(""); // الـ State الجديدة الخاصة بنص البحث
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(5);

//   const [reports, setReports] = useState([]); 
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     totalRecords: 0,
//     currentPage: 1,
//     totalPages: 1,
//     limit: 5
//   });

//   const fetchPerformanceData = async () => {
//     setLoading(true);
//     try {
//       // تمرير الـ searchName كـ query parameter في حال كان الباك اند يدعم البحث بالاسم (مثال: &search=${searchName})
//       // إذا كان الباك اند يدمجه في الـ Endpoint كـ Param، قومي بتعديله حسب توثيق الـ API الخاص بكم.
//       const response = await instance .get(
//         `/employeePerformance/all?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&search=${searchName}`
//       );
      
//       if (response.data?.status === "success") {
//         setReports(response.data.data.performanceReport || []);
//         setPagination(response.data.data.pagination);
//       }
//     } catch (error) {
//       console.error("Error fetching performance data:", error);
//       setReports([]); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   // إضافة searchName إلى مصفوفة الاعتماديات ليعيد الـ fetch فوراً أثناء الكتابة
//   useEffect(() => {
//     fetchPerformanceData();
//   }, [page, limit, startDate, endDate, searchName]);

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-xl font-bold text-white">Employees Performance Dashboard</h1>
//         <p className="text-sm text-slate-400">Monitor and evaluate employee KPIs and tracks.</p>
//       </div>

//       <PerformanceTable
//         reportData={reports}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
//         searchName={searchName}     // تمريرها للمكون
//         setSearchName={setSearchName} // تمريرها للمكون
//         pagination={pagination}
//         onPageChange={setPage}
//         onLimitChange={setLimit}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default Performance;
import React, { useState, useEffect } from "react";
import PerformanceTable from "@/HrComponents/PerformanceComponents/PerformanceTable.jsx"; 
import instance from "@/services/axios";




const Performance = () => {
  // إعادة التواريخ كـ داتا منفصلة ومباشرة
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [searchName, setSearchName] = useState(""); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [reports, setReports] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5
  });

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/employeePerformance/all?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&search=${searchName}`
      );
      
      if (response.data?.status === "success") {
        setReports(response.data.data.performanceReport || []);
        setPagination(response.data.data.pagination);
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
        <h1 className="text-xl font-bold text-white">Employees Performance Dashboard</h1>
        <p className="text-sm text-slate-400">Monitor and evaluate employee KPIs and tracks.</p>
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