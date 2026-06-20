// const NavSearchTrigger = ({ onClick }) => (
//   <div className="relative hidden lg:block w-72">
//     <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
//     <input
//       type="text"
//       placeholder="Search here..."
//       onClick={onClick}
//       readOnly
//       className="w-full bg-[#142129] border border-gray-700/30 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white cursor-pointer hover:bg-[#1c2e38] transition-all"
//     />
//   </div>
// );

// export default NavSearchTrigger;




const NavSearchTrigger = ({ onClick }) => (
  <div className="relative hidden lg:block w-72">
    <i 
      style={{ color: 'var(--text-muted)' }} 
      className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm"
    ></i>
    <input
      type="text"
      placeholder="Search here..."
      onClick={onClick}
      readOnly
      style={{ 
        backgroundColor: 'var(--card-border)', 
        borderColor: 'var(--border-main)', 
        color: 'var(--text-main)' 
      }}
      className="w-full border rounded-2xl pl-12 pr-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--hover-bg)] transition-all outline-none"
    />
  </div>
);

export default NavSearchTrigger;