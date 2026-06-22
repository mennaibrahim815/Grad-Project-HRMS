import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../../store/HrSlices/careersSlice/careersSlice";
import Pagination from "../../HrComponents/HiringComponents/apply-job/Pagination";
import icon from "../../assets/icons/Icon.svg";
import { motion } from "framer-motion";

// Components
import HeroSection from "../../HrComponents/HiringComponents/apply-job/HeroSection";
import SearchBar from "../../HrComponents/HiringComponents/apply-job/SearchBar";
import FilterBar from "../../HrComponents/HiringComponents/apply-job/FilterBar";
import JobGrid from "../../HrComponents/HiringComponents/apply-job/Jobgrid";
import ThemeToggle from "../../components/NavbarComponents/ThemeToggle";
// ── Variants ──────────────────────────────────────────────────────────────────


const pageVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};


const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// ── Component ─────────────────────────────────────────────────────────────────

function ApplyJob() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchJobs({ page: 1 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col">

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
                className="fixed top-0 left-0 w-full z-50 bg-opacity-60 backdrop-blur-md border-b"
            >
                <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img src={icon} alt="Staffly" className="w-8 h-8" />
                        <span className="text-xl font-bold italic" style={{ color: 'var(--text-main)' }}>
                            Staf<span className="text-blue-500">fly</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/login")}
                            style={{ borderColor: 'var(--border-main)', color: 'var(--accent-cyan)' }}
                            className="px-6 py-2 border rounded-lg text-sm font-semibold hover:bg-white/5 transition-all"
                        >
                            Login (Employees/HR)
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Page Content - الـ container بتاع الـ stagger */}
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto w-full"
            >
                <motion.div variants={sectionVariants}>
                    <HeroSection />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <SearchBar />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <FilterBar />
                </motion.div>

                
                <motion.div variants={sectionVariants}>
                    <JobGrid />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <Pagination />
                </motion.div>
            </motion.div>
        </div>
    );
}

export default ApplyJob;