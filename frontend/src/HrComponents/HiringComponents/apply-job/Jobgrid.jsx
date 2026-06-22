import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // إضافة AnimatePresence
import JobCard from "./Jobcard";

const CardSkeleton = () => (
    <div
        className="flex flex-col gap-4 p-5 rounded-2xl border animate-pulse
                   bg-[var(--bg-card)] border-[var(--border-main)]"
    >
        <div className="h-5 w-20 rounded-md bg-[var(--border-subtle)]" />
        <div className="h-6 w-3/4 rounded-md bg-[var(--border-subtle)]" />
        <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--input-bg)]" />
            <div className="h-4 w-5/6 rounded bg-[var(--input-bg)]" />
        </div>
        <div className="flex gap-2 mt-1">
            <div className="h-6 w-16 rounded-full bg-[var(--input-bg)]" />
            <div className="h-6 w-20 rounded-full bg-[var(--input-bg)]" />
            <div className="h-6 w-16 rounded-full bg-[var(--input-bg)]" />
        </div>
        <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)]">
            <div className="h-4 w-24 rounded bg-[var(--input-bg)]" />
            <div className="h-8 w-24 rounded-xl bg-[var(--border-subtle)]" />
        </div>
    </div>
);


const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 }
    },
    exit: { 
        opacity: 0,
        transition: { duration: 0.2 }
    }
};


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

    return (
        
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </motion.div>
            ) : error ? (
                <motion.div
                    key="error-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center gap-3 py-16 text-center"
                >
                    <i className="fas fa-circle-exclamation text-3xl text-[var(--pill-red-text)]" />
                    <p className="text-sm text-[var(--pill-red-text)]">{error}</p>
                </motion.div>
            ) : isSearchMode && searchResults?.length === 0 ? (
                <motion.div
                    key="empty-search"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-3 py-16 text-center"
                >
                    <i className="fas fa-magnifying-glass text-3xl text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">No jobs found for your search.</p>
                </motion.div>
            ) : !displayedJobs || displayedJobs.length === 0 ? (
                <motion.div
                    key="empty-jobs"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-3 py-16 text-center"
                >
                    <i className="fas fa-folder-open text-3xl text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">No open positions at the moment.</p>
                </motion.div>
            ) : (
                <motion.div
                    key="job-grid"
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {displayedJobs.map((job) => (
                        <motion.div 
                            key={job._id} 
                            variants={cardVariants}
                            layout 
                        >
                            <JobCard job={job} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JobGrid;