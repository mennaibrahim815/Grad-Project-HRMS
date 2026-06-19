

// import React, { useState, useEffect } from "react";
// import instance from "@/services/axios"; 
// import RequestStatsHeader from "@/HrComponents/RequestsComponents/RequestStatsHeader.jsx"; 
// import YearlyRequestsChart from "@/HrComponents/RequestsComponents/YearlyRequestsChart.jsx";
// import RequestCard from "@/HrComponents/RequestsComponents/RequestCard";
// import RequestDrawer from "@/HrComponents/RequestsComponents/RequestDrawer";
// import { AlertCircle } from "lucide-react";

// const HrRequestsPage = () => {
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
//   // التاب النشط حالياً: Pending أو Approved أو Rejected
//   const [activeTab, setActiveTab] = useState("Pending");

//   const [requests, setRequests] = useState([]);
//   const [loadingRequests, setLoadingRequests] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [triggerStatsUpdate, setTriggerStatsUpdate] = useState(null);

//   // جلب الطلبات بناءً على الشهر، السنة، والـ status الخاصة بالتاب النشط
//   const fetchAllRequests = async () => {
//     try {
//       setLoadingRequests(true);

//       const response = await instance.get(`/requests`, {
//         params: { 
//           status: activeTab, // بيمرر الحالات ديناميكياً: Pending, Approved, Rejected
//           month: currentMonth,
//           year: currentYear
//         }
//       });

//       if (response.data && response.data.status === "success") {
//         setRequests(response.data.data?.requests || []);
//       }
//     } catch (error) {
//       console.error("Error fetching requests list:", error);
//       setRequests([]); // تصغير الـ array لحماية الصفحة عند حدوث خطأ
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   // إعادة جلب البيانات فوراً عند تغيير الشهر أو السنة أو الـ Tab
//   useEffect(() => {
//     fetchAllRequests();
//   }, [currentMonth, currentYear, activeTab]);

//   const handleStatsUpdated = (fetchStatsFn) => {
//     setTriggerStatsUpdate(() => fetchStatsFn);
//   };

//   // اتخاذ إجراء (قبول/رفض) للطلبات المنتظرة
//   // اتخاذ إجراء (قبول/رفض) للطلب
//   const handleRequestAction = async (requestId, formData) => {
//     try {
//       // تعديل مسار الـ URL ليكون الـ ID في المنتصف والـ reply في الآخر
//       const response = await instance.patch(`/requests/${requestId}/reply`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       if (response.data && response.data.status === "success") {
//         // إغلاق الـ Drawer
//         setIsDrawerOpen(false);
        
//         // حذف الكارد فوراً وسحب العنصر من الـ UI الحالي
//         setRequests((prev) => prev.filter((req) => req._id !== requestId));
        
//         // تحديث العدادات فوق فوراً
//         if (triggerStatsUpdate) triggerStatsUpdate();
        
//         console.log("Request updated successfully!");
//       }
//     } catch (error) {
//       console.error("Error updating request status:", error);
//       alert("Failed to update status. Please check backend response or file upload keys.");
//     }
//   };
//   return (
//     <div >
      
//       {/* هيدر الصفحة الإحصائي */}
//       <RequestStatsHeader 
//         onStatsUpdated={handleStatsUpdated} 
//         month={currentMonth}
//         year={currentYear}
//         setMonth={setCurrentMonth}
//         setYear={setCurrentYear}
//       />

//       {/* الشارت السنوي */}
//       <YearlyRequestsChart />

//       {/* شريط التابات النيون الحديث لتصفح الحالات المختلفة */}
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
//         <div className="flex gap-2 bg-[#0F171E] p-1 rounded-xl border border-slate-800/60">
//           {[
//             { id: "Pending", label: "Pending Requests", color: "bg-yellow-500" },
//             { id: "Approved", label: "Approved Requests", color: "bg-emerald-500" },
//             { id: "Rejected", label: "Rejected Requests", color: "bg-red-500" }
//           ].map((tab) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all duration-200 ${
//                   isActive 
//                     ? "bg-slate-800 text-white shadow-md shadow-black/40 border border-slate-700/50" 
//                     : "text-slate-500 hover:text-slate-300"
//                 }`}
//               >
//                 <span className={`w-1.5 h-1.5 rounded-full ${tab.color} ${isActive ? "animate-pulse" : ""}`}></span>
//                 {tab.label} {isActive ? `(${requests.length})` : ""}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* عرض البيانات أو رسائل التنبيه */}
//       {loadingRequests ? (
//         <div className="text-center text-slate-500 py-12 text-sm font-mono">Loading requests...</div>
//       ) : requests.length === 0 ? (
//         <div className="text-center text-slate-500 py-16 border border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-2">
//           <AlertCircle size={32} className="text-slate-600" />
//           <p className="text-sm font-mono">No {activeTab.toLowerCase()} requests found for this period.</p>
//         </div>
//       ) : (
//         /* رسم الكروت بمرونة تامة */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {requests.map((req) => (
//             <RequestCard
//               key={req._id}
//               req={req}
//               onClick={() => {
//                 setSelectedRequest(req);
//                 setIsDrawerOpen(true);
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* الـ Drawer الجانبي */}
//       <RequestDrawer
//         isOpen={isDrawerOpen}
//         req={selectedRequest}
//         onClose={() => setIsDrawerOpen(false)}
//         onAction={handleRequestAction}
//       />

//     </div>
//   );
// };

// export default HrRequestsPage;
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import RequestStatsHeader from "@/HrComponents/RequestsComponents/RequestStatsHeader.jsx";
import YearlyRequestsChart from "@/HrComponents/RequestsComponents/YearlyRequestsChart.jsx";
import RequestCard from "@/HrComponents/RequestsComponents/RequestCard";
import RequestDrawer from "@/HrComponents/RequestsComponents/RequestDrawer";
import { AlertCircle } from "lucide-react";

const HrRequestsPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [triggerStatsUpdate, setTriggerStatsUpdate] = useState(null);

  const fetchAllRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await instance.get(`/requests`, {
        params: { status: activeTab, month: currentMonth, year: currentYear }
      });
      if (response.data?.status === "success") {
        setRequests(response.data.data?.requests || []);
      }
    } catch (error) {
      console.error("Error fetching requests list:", error);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { fetchAllRequests(); }, [currentMonth, currentYear, activeTab]);

  const handleStatsUpdated = (fetchStatsFn) => setTriggerStatsUpdate(() => fetchStatsFn);

  const handleRequestAction = async (requestId, formData) => {
    try {
      const response = await instance.patch(`/requests/${requestId}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data?.status === "success") {
        setIsDrawerOpen(false);
        setRequests(prev => prev.filter(req => req._id !== requestId));
        if (triggerStatsUpdate) triggerStatsUpdate();
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update status.");
    }
  };

  const tabs = [
    { id: "Pending",  label: "Pending Requests",  dot: "#eab308" },
    { id: "Approved", label: "Approved Requests", dot: "#10b981" },
    { id: "Rejected", label: "Rejected Requests", dot: "#ef4444" },
  ];

  return (
    <div>
      <RequestStatsHeader
        onStatsUpdated={handleStatsUpdated}
        month={currentMonth}
        year={currentYear}
        setMonth={setCurrentMonth}
        setYear={setCurrentYear}
      />

      <YearlyRequestsChart />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-3"
        style={{ borderBottom: '1px solid var(--border-main)' }}>
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-main)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all duration-200"
                style={{
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-main)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: tab.dot,
                    animation: isActive ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none'
                  }}
                />
                {tab.label} {isActive ? `(${requests.length})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loadingRequests ? (
        <div className="text-center py-12 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div
          className="text-center py-16 rounded-[2rem] flex flex-col items-center justify-center gap-2 border border-dashed"
          style={{ borderColor: 'var(--border-main)' }}
        >
          <AlertCircle size={32} style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            No {activeTab.toLowerCase()} requests found for this period.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              req={req}
              onClick={() => { setSelectedRequest(req); setIsDrawerOpen(true); }}
            />
          ))}
        </div>
      )}

      <RequestDrawer
        isOpen={isDrawerOpen}
        req={selectedRequest}
        onClose={() => setIsDrawerOpen(false)}
        onAction={handleRequestAction}
      />
    </div>
  );
};

export default HrRequestsPage;