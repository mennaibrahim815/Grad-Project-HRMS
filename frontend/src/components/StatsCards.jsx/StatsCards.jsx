// StatsCards.jsx
import { ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react";

const DEFAULT_ICONS = [ClipboardList, CheckCircle2, Clock, XCircle];
const DEFAULT_ICON_STYLES = [
  { bg: "bg-[#013256]", color: "#62BDFE" },
  { bg: "bg-[#00331E]", color: "#A8FFDA" },
  { bg: "bg-[#673204]", color: "#FBCCA2" },
  { bg: "bg-[#34141F]", color: "#F598B7" },
];

const StatsCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {cards.map((card, i) => {
        const Icon = card.icon || DEFAULT_ICONS[i % DEFAULT_ICONS.length];
        const iconStyle = card.iconStyle || DEFAULT_ICON_STYLES[i % DEFAULT_ICON_STYLES.length];

        return (
          <div
            key={i}
            className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-5 sm:p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30 overflow-hidden"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${iconStyle.bg}`}>
              <Icon size={16} color={iconStyle.color} />
            </div>

            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3 truncate">
              {card.title}
            </p>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 truncate">
              {card.value?.toLocaleString() ?? "0"}
              {card.suffix && <span className="text-base sm:text-lg text-gray-400 ml-1">{card.suffix}</span>}
            </h2>

            {card.change != null ? (
              <div className={`text-xs font-bold flex items-center gap-1 flex-wrap ${card.up ? "text-green-500" : "text-pink-500"}`}>
                <i className={`fas fa-arrow-${card.up ? "up" : "down"}`}></i>
                {card.change}%
                <span className="text-gray-600 font-medium ml-1 text-[10px]">vs last month</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;