import { useNavigate } from "react-router-dom";

const StatsCards = ({ stats }) => {
  const navigate = useNavigate();


  const mapping = [
    { key: "employees", title: "Total employees", path: "/employees" },
    { key: "applicants", title: "Job applicants", path: "/hiring" },
    { key: "payroll", title: "Total payroll", path: "/payroll" },
  ];

  const cards = mapping.map((item) => {
    const sectionData = stats?.[item.key];
    const isUp = sectionData?.percentageChange >= 0;

    return {
      title: item.title,
      value:
        item.key === "payroll"
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
        <div
          key={i}
          style={{
            background:
              "linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)   ",
              borderColor: 'var(--border-main)',
          }}
          className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30"
        >
          <p className="text-gray-500 text-[10px] font-black uppercase mb-4" style={{ color: 'var(--text-main)' }}>
            {card.title}
          </p>
          <h2 className="text-3xl font-black text-white mb-4" style={{ color: 'var(--text-main)' }}>{card.value}</h2>

          <div
            className={`text-xs font-bold flex items-center gap-1 ${card.up ? "text-green-500" : "text-pink-500"}`}
          >
            <i className={`fas fa-arrow-${card.up ? "up" : "down"}`}></i>
            {card.change}
            <span className="text-gray-600 font-medium ml-1 text-[10px]">
              vs last month
            </span>
          </div>

          <button
            onClick={() => navigate(card.path)}
            style={{ background: 'var(--tab-inactive-bg)' }}
            className="absolute top-7 right-7 w-8 h-8 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-all border border-transparent"
          >
            <i             style={{ color: 'var(--text-main)' }}
 className="fas fa-arrow-right -rotate-45 text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
