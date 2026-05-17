import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../../store/HrSlices/careersSlice/careersSlice";

const Pagination = () => {
    const dispatch = useDispatch();
    const { pagination, activeFilters, isSearchMode } = useSelector((state) => state.careers);
    const { currentPage, totalPages, totalRecords } = pagination;

    // مفيش pagination في وضع الـ search
    if (isSearchMode || totalPages <= 1) return null;

    const handlePage = (page) => {
        if (page < 1 || page > totalPages) return;
        dispatch(fetchJobs({ ...activeFilters, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // بنعمل array للأرقام اللي هتتعرض
    const getPages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = [];
        pages.push(1);

        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");

        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex items-center justify-between mt-4">

            {/* Total records */}
            <span className="text-slate-500 text-sm">
                {totalRecords} position{totalRecords !== 1 ? "s" : ""} available
            </span>

            {/* Controls */}
            <div className="flex items-center gap-2">

                {/* Prev */}
                <button
                    onClick={() => handlePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl
                               bg-white/5 border border-white/10 text-slate-400
                               hover:bg-white/10 hover:text-white
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all"
                >
                    <i className="fas fa-chevron-left text-xs" />
                </button>

                {/* Page numbers */}
                {getPages().map((page, idx) =>
                    page === "..." ? (
                        <span key={`dots-${idx}`} className="text-slate-600 text-sm px-1">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
                                        border transition-all
                                        ${currentPage === page
                                    ? "bg-[#0095ff] border-[#0095ff] text-white"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => handlePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl
                               bg-white/5 border border-white/10 text-slate-400
                               hover:bg-white/10 hover:text-white
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all"
                >
                    <i className="fas fa-chevron-right text-xs" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;