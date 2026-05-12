
export default function StatCard({ title, value, color = "text-slate-100", accent = "border-slate-700/50" }) {
  return (
    <div
      className={`
        bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
        border ${accent}
        rounded-2xl
        p-4
        min-w-[140px]
        shadow-sm
        hover:bg-slate-700/30
        transition-all
      `}
    >
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className={`text-2xl font-semibold ${color}`}>
        {value}
      </h2>
    </div>
  );
}