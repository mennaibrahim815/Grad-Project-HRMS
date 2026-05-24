// StatsCards.jsx 
const StatsCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {cards.map((card, i) => (
        <div key={i} className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
            {card.title}
          </p>
          <h2 className="text-3xl font-black text-white mb-4">
            {card.value?.toLocaleString() ?? "0"}
            {card.suffix && <span className="text-lg text-gray-400 ml-1">{card.suffix}</span>}
          </h2>

          
          {card.change != null ? (
            <div className={`text-xs font-bold flex items-center gap-1 ${card.up ? "text-green-500" : "text-pink-500"}`}>
              <i className={`fas fa-arrow-${card.up ? "up" : "down"}`}></i>
              {card.change}%
              <span className="text-gray-600 font-medium ml-1 text-[10px]">vs last month</span>
            </div>
          ) : (
            null
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;