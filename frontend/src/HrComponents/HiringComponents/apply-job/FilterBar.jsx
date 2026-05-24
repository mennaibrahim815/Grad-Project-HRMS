import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchJobs } from "../../../store/HrSlices/careersSlice/careersSlice";

const FILTERS = [
    {
        key: "department",
        label: "Department",
        icon: "fas fa-table-cells-large",
        options: ["All", "UI Design", "Marketing", "Social Media"],
    },
    {
        key: "experienceLevel",
        label: "Experience Level",
        icon: "fas fa-chart-simple",
        options: ["All", "Junior", "Mid", "Senior"],
    },
    {
        key: "jobType",
        label: "Job Type",
        icon: "fas fa-briefcase",
        options: ["All", "Full-time", "Part-time", "Contract", "Internship"],
    },
];

const FilterBar = () => {
    const dispatch = useDispatch();
    const { activeFilters } = useSelector((state) => state.careers);

    const handleChange = (key, value) => {
        const updated = { ...activeFilters, [key]: value };
        dispatch(setFilters({ [key]: value }));
        dispatch(fetchJobs({ ...updated, page: 1 }));
    };

    const handleReset = () => {
        const defaults = { department: "All", experienceLevel: "All", jobType: "All" };
        dispatch(setFilters(defaults));
        dispatch(fetchJobs({ page: 1 }));
    };

    const isActive = Object.values(activeFilters).some((v) => v !== "All");

    return (
        <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-slate-400 text-sm">Filters:</span>

            {FILTERS.map(({ key, label, icon, options }) => (
                <div key={key} className="relative">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl
                                    bg-white/5 border border-white/10 hover:border-white/20
                                    transition-all cursor-pointer">
                        <i className={`${icon} text-slate-400 text-xs`} />
                        <select
                            value={activeFilters[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="bg-transparent text-slate-300 text-sm outline-none cursor-pointer
                                       appearance-none pr-5"
                        >
                            {options.map((opt) => (
                                <option key={opt} value={opt} className="bg-[#1e2a3a] text-slate-100">
                                    {opt === "All" ? label : opt}
                                </option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down text-slate-500 text-xs pointer-events-none" />
                    </div>
                </div>
            ))}

            {/* Reset — بتظهر بس لو في filter نشط */}
            {isActive && (
                <button
                    onClick={handleReset}
                    className="text-slate-400 text-sm hover:text-slate-200 transition-colors"
                >
                    Reset all
                </button>
            )}
        </div>
    );
};

export default FilterBar;