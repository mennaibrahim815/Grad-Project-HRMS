
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ضفنا useNavigate
import API from "@/services/axios";
import { ArrowLeft } from "lucide-react"; // أيقونة السهم

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // تعريف الـ navigate
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveById = async () => {
      try {
        const response = await API.get(`/leaves/${id}`);
        setLeave(response.data.data);
      } catch (error) {
        console.error("Error fetching leave details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveById();
  }, [id]);

  if (loading) return <div className="text-white p-10 text-center">Loading...</div>;
  if (!leave) return <div className="text-white p-10 text-center">No data found.</div>;

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-slate-200">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* زرار العودة */}
        <button 
          onClick={() => navigate(-1)} // -1 يعني ارجع لآخر صفحة كنت فيها
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-500 w-fit"
        >
          <ArrowLeft size={18} />
          Back to Requests
        </button>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header: Employee Info */}
          <div className="p-8 border-b border-slate-800 flex items-center gap-6">
            <img 
              src={leave.employee?.avatar || `https://ui-avatars.com/api/?name=${leave.employee?.firstName}&background=0D8ABC&color=fff`} 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg"
              alt="avatar"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {leave.employee?.firstName} {leave.employee?.lastName}
              </h2>
              <p className="text-cyan-400 font-medium">{leave.employee?.jobTitle}</p>
              <p className="text-slate-500 text-sm">{leave.employee?.email}</p>
            </div>
            
            <div className="ml-auto text-right">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
              }`}>
                {leave.status}
              </span>
            </div>
          </div>

          {/* Content: Leave Details */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest">Leave Information</h3>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-500">Type</p>
                <p className="text-lg font-semibold text-white">{leave.type}</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-500">Duration</p>
                <p className="text-lg font-semibold text-white">{leave.duration} Days</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-500">Date Range</p>
                <p className="text-sm font-medium">
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest">Reason & Approval</h3>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 min-h-[100px]">
                <p className="text-sm text-slate-500">Reason</p>
                <p className="text-sm italic text-slate-300">"{leave.reason}"</p>
              </div>
              {leave.hrApprovedBy && (
                <div className="p-4 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl">
                  <p className="text-xs text-cyan-500 font-bold uppercase">Approved By HR</p>
                  <p className="text-sm text-white font-medium">
                    {leave.hrApprovedBy.firstName} {leave.hrApprovedBy.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;