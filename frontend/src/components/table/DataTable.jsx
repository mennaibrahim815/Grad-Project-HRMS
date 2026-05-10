const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full  text-slate-100">
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
          {data.map((row, index) => (
            <tr
              key={`${row._id}-${index}`}
              className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
            >
              {columns.map((col) => (
                <td 
                  key={col.accessor} 
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default DataTable;


