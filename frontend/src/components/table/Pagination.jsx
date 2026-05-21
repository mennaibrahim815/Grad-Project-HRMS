import { useState } from "react"

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)
const Pagination = ({
  pagination, 
  handlePageChange,
  handleRecordsPerPageChange,
  currentDataLength ,
  entityName = "records"
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

 
 const { 
  currentPage = 1, 
  totalPages = 1, 
  totalRecords = 0, 
  limit = 5,
} = pagination || {};


  return (
    <div className="p-4 md:p-6 border-t border-slate-700/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Showing info: */}
        <p className="text-sm text-slate-400">
          Showing: <span className="text-cyan-400 font-medium">{currentDataLength}</span> of {totalRecords} {entityName}
        </p>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft />
          </button>

        
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 3) {
              pageNum = i + 1;
            } else if (currentPage === 1) {
              pageNum = i + 1;
            } else if (currentPage === totalPages) {
              pageNum = totalPages - 2 + i;
            } else {
              pageNum = currentPage - 1 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#0095ff] text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Records per page */}
        <div className="flex items-center gap-3">
          
          <span className="text-sm text-slate-400">Show {limit} records per page</span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-600/50 transition-all"
            >
              {limit}
              <ChevronDown />
            </button>
            
            {showDropdown && (
              <div className="absolute bottom-full mb-2 right-0 bg-slate-800 border border-slate-600/50 rounded-lg shadow-xl overflow-hidden z-20">
                {[5, 10, 20, 50].map(value => (
                  <button
                    key={value}
                    onClick={() => {
                      handleRecordsPerPageChange(value);
                      setShowDropdown(false); // قفل الدروب داون بعد الاختيار
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-700/50 transition-colors ${
                      limit === value ? 'text-cyan-400 bg-slate-700/30' : 'text-slate-300'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
