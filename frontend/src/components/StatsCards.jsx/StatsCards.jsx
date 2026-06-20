import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react";

const DEFAULT_ICONS = [ClipboardList, CheckCircle2, Clock, XCircle];
const DEFAULT_ICON_STYLES = [
  { bg: 'var(--icon-blue-bg)', color: 'var(--icon-blue-color)' },
  { bg: 'var(--icon-green-bg)', color: 'var(--icon-green-color)' },
  { bg: 'var(--icon-orange-bg)', color: 'var(--icon-orange-color)' },
  { bg: 'var(--icon-pink-bg)', color: 'var(--icon-pink-color)' },
];

const STATUS_BADGE_STYLES = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
  Pending: "bg-[#F89B49]/15 text-[#F89B49] border-[#F89B49]/40",
  Draft: "bg-slate-500/20 text-slate-400 border-slate-400/40",
};

const StatsCards = ({ cards, gridCols = "md:grid-cols-4" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-2`}>
      {cards.map((card, i) => {
        const Icon = card.icon || DEFAULT_ICONS[i % DEFAULT_ICONS.length];
        const iconStyle = card.iconStyle || DEFAULT_ICON_STYLES[i % DEFAULT_ICON_STYLES.length];
        const isStatusBadge = card.type === "badge";

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
            }}
            className="p-5 sm:p-7 rounded-[2rem] relative group transition-all hover:border-blue-500/30 overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{ background: iconStyle.bg }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              >
                <Icon size={16} color={iconStyle.color} />
              </div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-widest truncate" style={{ color: 'var(--text-muted)' }}>
                {card.title}
              </p>
            </div>

            {isStatusBadge ? (
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border backdrop-blur-sm ${STATUS_BADGE_STYLES[card.value] || STATUS_BADGE_STYLES.Draft}`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {card.value || "—"}
              </span>
            ) : (
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 truncate"
                style={{ color: iconStyle.color }}
              >
                {card.value?.toLocaleString() ?? "0"}
                {card.suffix && (
                  <span
                    className="text-base sm:text-lg ml-1 opacity-70"
                    style={{ color: iconStyle.color }}
                  >
                    {card.suffix}
                  </span>
                )}
              </h2>
            )}

            {card.change != null ? (
              <div className={`text-xs font-bold flex items-center gap-1 flex-wrap mt-2 ${card.up ? "text-green-500" : "text-pink-500"}`}>
                <i className={`fas fa-arrow-${card.up ? "up" : "down"}`}></i>
                {card.change}%
                <span className="font-medium ml-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>vs last month</span>
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;