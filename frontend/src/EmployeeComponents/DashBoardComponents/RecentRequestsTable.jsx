import React from 'react';
import { 
  FileText, 
  Home, 
  Monitor, 
  Activity, 
  DollarSign, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const RecentRequestsTable = ({ requests, loading }) => {
  // 1. دالة لتحديد الأيقونة واللون بناءً على نوع الطلب
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Sick Leave': return { icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/20' };
      case 'WFH Request': return { icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'New Equipment': return { icon: Monitor, color: 'text-purple-400', bg: 'bg-purple-500/20' };
      case 'HR Letter': return { icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/20' };
      case 'Payroll Inquiry': return { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
      default: return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-500/20' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/10 text-green-500';
      case 'Pending': return 'bg-orange-500/10 text-orange-500';
      case 'Rejected': return 'bg-red-500/10 text-red-500';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  if (loading) return (
    <div className="bg-[#111c2a] rounded-[2rem] p-8 text-center border border-slate-800/50">
       <div className="animate-pulse text-slate-500">Loading requests...</div>
    </div>
  );

  return (
    <div className="bg-[#111c2a] rounded-[2rem] p-6 border border-slate-800/50 shadow-xl ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-white text-lg font-bold">Recent Requests</h3>
        {/* <button className="text-[#0293FA] text-xs font-bold hover:underline flex items-center gap-1">
          View All
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black">
              <th className="pb-6 font-black">Type</th>
              <th className="pb-6 font-black">Date</th>
              <th className="pb-6 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {requests?.map((request) => {
              const typeStyle = getTypeStyles(request.type);
              const Icon = typeStyle.icon;

              return (
                <tr key={request._id} className="group transition-all">
                  <td className="py-3">
                    <div className="flex items-center gap-4">
                      {/* Icon Container */}
                      <div className={`w-10 h-10 rounded-xl ${typeStyle.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon size={18} className={typeStyle.color} />
                      </div>
                      <span className="text-slate-200 text-sm font-semibold">{request.type}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-slate-400 text-[13px]">
                      {new Date(request.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!requests || requests.length === 0) && (
          <div className="text-center py-10 text-slate-600 text-sm italic">
            No recent requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRequestsTable;