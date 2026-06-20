const StatsCards = ({ stats }) => {

  const cards = [
    {
      title: "Total Net Salaries",
      value: stats?.totalNetSalaries?.value,
      change: stats?.totalNetSalaries?.changePercentage,
      up: stats?.totalNetSalaries?.isIncrease,
    },
    {
      title: "Total Deductions",
      value: stats?.totalDeductions?.value,
      change: stats?.totalDeductions?.changePercentage,
      up: stats?.totalDeductions?.isIncrease,
    },
    {
      title: "Pending payments",
      value: stats?.pendingPayments?.value,
      change: stats?.pendingPayments?.changePercentage,
      up: stats?.pendingPayments?.isIncrease,
    },
    {
      title: "Paid Amount",
      value: stats?.paidAmount?.value,
      change: stats?.paidAmount?.changePercentage,
      up: stats?.paidAmount?.isIncrease,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
          }}
          className="p-5 sm:p-7 rounded-[2rem] relative group transition-all hover:border-blue-500/30 overflow-hidden"
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 truncate" style={{ color: 'var(--text-muted)' }}>
            {card.title}
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 truncate" style={{ color: 'var(--text-stat)' }}>
            {card.value?.toLocaleString() || "0"}
          </h2>

          <div
            className={`text-xs font-bold flex items-center gap-1 flex-wrap ${
              card.up === "up" ? "text-green-500" : "text-pink-500"
            }`}
          >
            <i className={`fas fa-arrow-${card.up === "up" ? "up" : "down"}`}></i>
            {card.change}%
            <span className="font-medium ml-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;