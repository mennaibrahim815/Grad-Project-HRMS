import { useNavigate } from "react-router-dom";

const StatsCards = ({ stats }) => {
  const navigate = useNavigate();

  // 💡 شيلنا الـ return null عشان الكومبوننت يظهر دائماً

  const mapping = [
    { key: "employees", title: "Total employees", path: "/employees" },
    { key: "applicants", title: "Job applicants", path: "/hiring" },
    { key: "payroll", title: "Total payroll", path: "/payroll" },
  ];

  const cards = mapping.map((item) => {
    // استخدام الـ Optional Chaining لضمان عدم حدوث Error لو الـ stats بـ null
    const sectionData = stats?.[item.key]; 
    const isUp = sectionData?.percentageChange >= 0;

    return {
      title: item.title,
      // لو مفيش داتا، اظهر 0
      value: item.key === "payroll" 
        ? `$${(sectionData?.total || 0).toLocaleString()}` 
        : (sectionData?.total || 0).toLocaleString(),
      change: `${Math.abs(sectionData?.percentageChange || 0)}%`,
      up: isUp,
      path: item.path,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <div key={i} className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30">
          <p className="text-gray-500 text-[10px] font-black uppercase mb-4">{card.title}</p>
          <h2 className="text-3xl font-black text-white mb-4">{card.value}</h2>
          
          {/* النسبة المئوية هتظهر 0% لو فيه 404 */}
          <div className={`text-xs font-bold flex items-center gap-1 ${card.up ? "text-green-500" : "text-pink-500"}`}>
            <i className={`fas fa-arrow-${card.up ? "up" : "down"}`}></i>
            {card.change}
            <span className="text-gray-600 font-medium ml-1 text-[10px]">vs last month</span>
          </div>

          <button onClick={() => navigate(card.path)} className="absolute top-7 right-7 w-8 h-8 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-all border border-transparent">
            <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};



export default StatsCards;
