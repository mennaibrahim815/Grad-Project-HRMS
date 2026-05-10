// import { Search } from "lucide-react";

// export default function SearchInput({ searchTerm, setSearchTerm }) {
//   return (
//     <div className="flex items-center bg-[#1B1E22] border border-white/10 rounded-xl px-3 py-2 w-80">
//       <Search size={16} className="text-gray-400" />
//       <input
//         type="text"
//         placeholder="Search here..."
//         className="bg-transparent outline-none text-sm ml-2 text-white w-full"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>
//   );
// }
import { Search } from "lucide-react";

export default function SearchInput({ searchTerm, setSearchTerm }) {
  return (
    <div
      className="
        flex items-center
        bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
        border border-slate-700/50
        rounded-xl
        px-3 py-2
        w-80
        focus-within:border-cyan-500/50
        focus-within:ring-1
        focus-within:ring-cyan-500/30
        transition-all
      "
    >
      <Search size={16} className="text-slate-400" />

      <input
        type="text"
        placeholder="Search here..."
        className="
          bg-transparent
          outline-none
          text-sm
          ml-2
          text-slate-200
          placeholder-slate-500
          w-full
        "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}