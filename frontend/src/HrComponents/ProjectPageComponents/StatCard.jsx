
export default function StatCard({ title, value, color, accent }) {
  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
        borderColor: accent ? undefined : 'var(--card-border)',
        border: `1px solid ${accent ? 'var(--card-border)' : 'var(--card-border)'}`,
      }}
      className={`rounded-2xl p-4 min-w-[140px] shadow-sm transition-all ${accent || ''}`}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)'}
    >
      <p style={{ color: 'var(--text-muted)' }} className="text-sm">
        {title}
      </p>
      <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-semibold">
        {value}
      </h2>
    </div>
  );
}