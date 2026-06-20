
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