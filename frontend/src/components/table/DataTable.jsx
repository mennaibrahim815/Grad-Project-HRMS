const DataTable = ({ columns, data, emptyState }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-slate-100">
        <thead>
          <tr className="border-b border-slate-700/50">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="text-left px-6 py-4 text-sm font-medium text-slate-400 whitespace-nowrap"
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
                {/* لو في custom empty state استخدميه، غيره default */}
                {emptyState ?? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No data available</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={`${row._id}-${index}`}
                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
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