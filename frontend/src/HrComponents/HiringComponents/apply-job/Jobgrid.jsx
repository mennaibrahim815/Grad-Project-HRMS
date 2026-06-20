import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import JobCard from "./Jobcard";

const CardSkeleton = () => (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#111c2b] border border-white/8 animate-pulse">
        <div className="h-5 w-20 bg-white/10 rounded-md" />
        <div className="h-6 w-3/4 bg-white/10 rounded-md" />
        <div className="space-y-2">
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
        </div>
        <div className="flex gap-2 mt-1">
            <div className="h-6 w-16 bg-white/5 rounded-full" />
            <div className="h-6 w-20 bg-white/5 rounded-full" />
            <div className="h-6 w-16 bg-white/5 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t border-white/5">
            <div className="h-4 w-24 bg-white/5 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded-xl" />
        </div>
    </div>
);

// ← stagger container للـ cards
const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 }
    }
};

// ← كل card بتيجي من تحت مع fade
const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const JobGrid = () => {
    const { jobs, searchResults, isSearchMode, loading, searchLoading, error } = useSelector(
        (state) => state.careers
    );

    const isLoading = loading || searchLoading;
    const displayedJobs = isSearchMode ? searchResults : jobs;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
                <i className="fas fa-circle-exclamation text-red-400 text-3xl" />
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    if (isSearchMode && searchResults?.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
                <i className="fas fa-magnifying-glass text-slate-600 text-3xl" />
                <p className="text-slate-400 text-sm">No jobs found for your search.</p>
            </div>
        );
    }

    if (!displayedJobs || displayedJobs.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
                <i className="fas fa-folder-open text-slate-600 text-3xl" />
                <p className="text-slate-400 text-sm">No open positions at the moment.</p>
            </div>
        );
    }

    return (
        // ← motion.div مع gridVariants عشان الـ stagger يشتغل
        <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
            {displayedJobs.map((job) => (
                // ← كل card بتاخد cardVariants من الـ parent
                <motion.div key={job._id} variants={cardVariants}>
                    <JobCard job={job} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default JobGrid;