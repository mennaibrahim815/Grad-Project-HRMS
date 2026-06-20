const FilterTab = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={active ? {
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
      } : {
        background: 'var(--tab-inactive-bg)',
        color: 'var(--tab-inactive-text)',
      }}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:opacity-80"
    >
      {label}
    </button>
  );
};

const SearchIcon = () => (
  <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TableControls = ({
  searchTerm,
  setSearchTerm,
  filterValue,
  setFilterValue,
  filterOptions = [],
  setCurrentPage,
  extraRight,
  showSearch = true,
}) => {
  return (
    <div
      className="p-4 md:p-6 border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((filter) => (
            <FilterTab
              key={filter}
              label={filter}
              active={filterValue === filter}
              onClick={() => {
                setFilterValue(filter);
                setCurrentPage && setCurrentPage(1);
              }}
            />
          ))}
        </div>

        {/* Search + extraRight */}
        {(showSearch || extraRight) && (
          <div className="flex items-center gap-3">
            {extraRight && extraRight}

            {showSearch && (
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm || ""}
                  onChange={(e) => {
                    setSearchTerm && setSearchTerm(e.target.value);
                    setCurrentPage && setCurrentPage(1);
                  }}
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--border-main)',
                    color: 'var(--text-main)',
                  }}
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon />
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TableControls;