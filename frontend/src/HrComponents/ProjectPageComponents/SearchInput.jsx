
// import { Search } from "lucide-react";

// export default function SearchInput({ onSearch }) {
//   return (
//     <div className="flex items-center bg-gradient-to-br from-transparent/20 to-45% to-[#182731] border border-slate-700/50 rounded-xl px-3 py-2 w-80 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
//       <Search size={16} className="text-slate-400" />
//       <input
//         type="text"
//         placeholder="Search here..."
//         className="bg-transparent outline-none text-sm ml-2 text-slate-200 placeholder-slate-500 w-full"
//         onChange={(e) => onSearch(e.target.value)} // بنبعت القيمة للأب فوراً
//       />
//     </div>
//   );
// }
import { Search } from "lucide-react";

export default function SearchInput({ onSearch }) {
  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
        border: '1px solid var(--border-main)',
      }}
      className="flex items-center rounded-xl px-3 py-2 w-80 transition-all
        focus-within:ring-1 focus-within:ring-cyan-500/30"
      onFocus={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
    >
      <Search size={16} style={{ color: 'var(--text-muted)' }} />
      <input
        type="text"
        placeholder="Search here..."
        style={{
          background: 'transparent',
          color: 'var(--text-main)',
        }}
        className="outline-none text-sm ml-2 w-full placeholder:text-[var(--text-muted)]"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}