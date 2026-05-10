
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceReport = ({ title, desc, data, filter }) => {
  
  const rawData = data?.chartData || data?.weeklyAttendenceStats || [];

  
  const chartData = rawData.map((item) => ({
    name: (item.monthName || item.dayName || "").substring(0, 3),
    onTime: item.totalOnTime ?? item.onTimeCount ?? 0,
    late: item.totalLate ?? item.lateCount ?? 0,
    absent: item.totalAbsent ?? item.absentCount ?? 0,
    displayDate: item.year 
      ? `${item.monthName} ${item.year}` 
      : (item.fullDate ? new Date(item.fullDate).toLocaleDateString("en-GB") : ""),
  }));


  const stats = data?.totals || {
    onTime: chartData[chartData.length - 1]?.onTime || 0,
    late: chartData[chartData.length - 1]?.late || 0,
    absent: chartData[chartData.length - 1]?.absent || 0,
  };

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl w-full mb-8 min-h-[420px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{desc}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 text-sm hover:bg-slate-600/50 transition-colors">
          {filter}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
      
        <div className="flex lg:flex-col justify-center gap-6 min-w-[105px]">
          <StatItem label="On-time" value={stats.onTime} color="bg-blue-500" />
          <StatItem label="Late attend" value={stats.late} color="bg-green-400" />
          <StatItem label="Absent" value={stats.absent} color="bg-gray-600" />
        </div>

        <div className="w-full lg:flex-1 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartData.length > 0 ? (
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c6ff" />
                    <stop offset="100%" stopColor="#0072ff" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43e97b" />
                    <stop offset="100%" stopColor="#38f9d7" />
                  </linearGradient>
                  <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45 2 2)">
                    <path d="M-1,2 l6,0" stroke="#374151" strokeWidth="2" />
                  </pattern>
                </defs>
                <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0b141a] border border-gray-700 rounded-xl p-3 shadow-xl">
                        <p className="text-xs text-gray-400 font-bold mb-2">{d.displayDate}</p>
                        <div className="text-xs space-y-1">
                          <p className="text-blue-400">On-time: {d.onTime}</p>
                          <p className="text-green-400">Late: {d.late}</p>
                          <p className="text-gray-400">Absent: {d.absent}</p>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="onTime" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="late" fill="url(#greenGrad)" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="absent" fill="url(#diagonalHatch)" radius={[6, 6, 0, 0]} barSize={20} stroke="#374151" />
              </BarChart>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-700 rounded-3xl">
                <p className="text-gray-500 text-xs uppercase tracking-widest">No Data Available</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


const StatItem = ({ label, value, color }) => (
  <div className="space-y-0.5">
    <div className="text-4xl font-black text-white tracking-tighter">
      {value}
    </div>
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  </div>
);

export default AttendanceReport;



