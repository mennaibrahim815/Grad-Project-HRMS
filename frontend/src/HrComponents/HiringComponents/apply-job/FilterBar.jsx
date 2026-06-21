import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchJobs } from "../../../store/HrSlices/careersSlice/careersSlice";

const FILTERS = [
    { key: "department", label: "Department", icon: "fas fa-table-cells-large", options: ["All", "UI Design", "Marketing", "Social Media"] },
    { key: "experienceLevel", label: "Experience Level", icon: "fas fa-chart-simple", options: ["All", "Junior", "Mid", "Senior"] },
    { key: "jobType", label: "Job Type", icon: "fas fa-briefcase", options: ["All", "Full-time", "Part-time", "Contract", "Internship"] },
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
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Filters:</span>

            {FILTERS.map(({ key, label, icon, options }) => (
                <div key={key} className="relative">
                    <div
                        style={{ background: "var(--input-bg)", borderColor: "var(--border-main)" }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:opacity-90 transition-all cursor-pointer"
                    >
                        <i className={`${icon} text-xs`} style={{ color: "var(--text-muted)" }} />
                        <select
                            value={activeFilters[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            style={{ color: "var(--text-main)" }}
                            className="bg-transparent text-sm outline-none cursor-pointer appearance-none pr-5"
                        >
                            {options.map((opt) => (
                                <option key={opt} value={opt} style={{ background: "var(--dropdown-bg)", color: "var(--text-main)" }}>
                                    {opt === "All" ? label : opt}
                                </option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down text-xs pointer-events-none" style={{ color: "var(--text-muted)" }} />
                    </div>
                </div>
            ))}

            {isActive && (
                <button
                    onClick={handleReset}
                    className="text-sm hover:opacity-80 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                >
                    Reset all
                </button>
            )}
        </div>
    );
};

export default FilterBar;