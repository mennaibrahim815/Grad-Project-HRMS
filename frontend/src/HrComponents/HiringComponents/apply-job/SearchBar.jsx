import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchJobs, clearSearch } from "../../../store//HrSlices/careersSlice/careersSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
    const { searchLoading } = useSelector((state) => state.careers);
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) { handleClear(); return; }
        dispatch(searchJobs(trimmed));
    };

    const handleClear = () => {
        setQuery("");
        dispatch(clearSearch());
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="flex items-center w-full max-w-2xl mx-auto
                        bg-white/5 border border-white/10 rounded-2xl px-4 py-3 gap-3
                        focus-within:border-blue-500/50 transition-all duration-200">

            <i className="fas fa-magnifying-glass text-slate-500 text-sm flex-shrink-0" />

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by job title"
                className="flex-1 bg-transparent text-slate-100 text-sm placeholder:text-slate-600 outline-none"
            />

            {query && (
                <button onClick={handleClear} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                    <i className="fas fa-xmark text-sm" />
                </button>
            )}

            <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="flex-shrink-0 bg-[#0095ff] hover:bg-[#0081dd] disabled:opacity-60
                           text-white text-sm font-semibold px-5 py-2 rounded-xl
                           transition-all active:scale-95"
            >
                {searchLoading ? (
                    <span className="flex items-center gap-2">
                        <i className="fas fa-spinner fa-spin text-xs" />
                        Searching...
                    </span>
                ) : "Search"}
            </button>
        </div>
    );
};

export default SearchBar;