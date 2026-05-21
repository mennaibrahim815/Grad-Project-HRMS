import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../../store/HrSlices/careersSlice/careersSlice";
import Pagination from "../../HrComponents/HiringComponents/apply-job/Pagination";
import icon from "../../assets/icons/Icon.svg";

// Components
import HeroSection from "../../HrComponents/HiringComponents/apply-job/HeroSection";
import SearchBar from "../../HrComponents/HiringComponents/apply-job/SearchBar";
import FilterBar from "../../HrComponents/HiringComponents/apply-job/FilterBar";
import JobGrid from "../../HrComponents/HiringComponents/apply-job/JobGrid";

function ApplyJob() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchJobs({ page: 1 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col">

            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-8 py-4
                            border-b border-white/8 backdrop-blur-sm sticky top-0 z-50">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src={icon} alt="Staffly" className="w-8 h-8" />
                    <span className="text-xl text-white font-bold italic">
                        Staf<span className="text-blue-500">fly</span>
                    </span>
                </div>

                {/* Login Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                               border border-white/10 bg-white/5 hover:bg-white/10
                               text-slate-300 text-sm font-medium transition-all"
                >
                    Login (Employees/HR)
                    <i className="fas fa-arrow-right text-xs" />
                </button>
            </nav>

            {/* Page Content */}
            <div className="flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto w-full">
                <HeroSection />
                <SearchBar />
                <FilterBar />
                <JobGrid />
                <Pagination />
            </div>
        </div>
    );
}

export default ApplyJob;