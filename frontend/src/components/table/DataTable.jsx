const DataTable = ({ columns, data, emptyState }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full" style={{ color: 'var(--text-main)' }}>
        <thead>
          <tr style={{ borderColor: 'var(--border-main)' }} className="border-b">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="text-left px-6 py-4 text-sm font-medium whitespace-nowrap"
                style={{ color: 'var(--text-muted)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                {emptyState ?? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--bg-card)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No data available</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={`${row._id}-${index}`}
                className="border-b transition-colors hover:bg-[var(--bg-card)]"
                style={{ borderColor: 'var(--border-main)' }}
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;