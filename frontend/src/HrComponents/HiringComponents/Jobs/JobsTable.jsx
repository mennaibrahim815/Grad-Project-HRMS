import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye, MapPin, Briefcase, Clock, Building2, GraduationCap, CalendarDays, Tags } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
    fetchAllJobs,
    searchJobsHR,
    deleteJob,
} from "../../../store/HrSlices/Hiring/hiringSlice";

import TableControls from "../../../components/table/TableControls";
import Pagination from "../../../components/table/Pagination";
import RowActionMenu from "../../../components/UI/RowActionMenu";
import BaseCard from "../../../components/UI/Card";
import EditIcon from "@mui/icons-material/Edit";

const ICON_COLOR = "#0293FA";

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles =
        status === "Open"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"
            : "bg-[#EC3A76]/20 text-[#EC3A76] border-[#EC3A76]/20"

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                          text-xs font-medium border backdrop-blur-sm ${styles}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
};

// ── Animation Variants ───────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
};

// ── Job Card ──────────────────────────────────────────────────
const JobCard = ({ job, openMenuId, setOpenMenuId, navigate, setConfirmModal }) => {
    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ y: -4 }}
        >
            <BaseCard className="flex flex-col gap-4 hover:border-blue-500/30 transition-colors h-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-base font-semibold text-slate-100 truncate">
                            {job.title || "—"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{job._id?.slice(-6)}</p>
                    </div>

                    <div className="relative shrink-0">
                        <button
                            onClick={() => setOpenMenuId(openMenuId === job._id ? null : job._id)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            style={{ color: ICON_COLOR }}
                        >
                            <EditIcon fontSize="small" />
                        </button>
                        <RowActionMenu
                            isOpen={openMenuId === job._id}
                            onClose={() => setOpenMenuId(null)}
                            actions={[
                                {
                                    label: "See Details",
                                    icon: Eye,
                                    onClick: () => navigate(`/hiring/jobs/${job._id}`),
                                },
                                {
                                    label: "Delete",
                                    variant: "danger",
                                    icon: Trash2,
                                    onClick: () => setConfirmModal({ open: true, jobId: job._id }),
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <StatusBadge status={job.status || "—"} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Building2 size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">{job.department || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Briefcase size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">{job.experienceLevel || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">{job.jobType || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">{job.workLocation || "—"}</span>
                    </div>

                    {/* ✅ حقلين جدد */}
                    <div className="flex items-center gap-2 text-slate-400">
                        <GraduationCap size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">{job.requiredEducationLevel || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays size={15} style={{ color: ICON_COLOR }} className="shrink-0" />
                        <span className="truncate">
                            {job.requiredExperienceYears != null ? `${job.requiredExperienceYears} yrs` : "—"}
                        </span>
                    </div>
                </div>

                {/* ✅ Required Skills */}
                {job.requiredSkills?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Tags size={13} style={{ color: ICON_COLOR }} />
                            <span>Required Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {job.requiredSkills.slice(0, 4).map((skill) => (
                                <span
                                    key={skill}
                                    className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.requiredSkills.length > 4 && (
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                    +{job.requiredSkills.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString("en-GB")
                            : "—"}
                    </span>
                    <button
                        onClick={() => navigate(`/hiring/jobs/${job._id}`)}
                        className="text-xs font-medium transition-colors hover:opacity-80"
                        style={{ color: ICON_COLOR }}
                    >
                        View Details →
                    </button>
                </div>
            </BaseCard>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────
const JobsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { jobs, jobsPagination, jobsLoading, jobsSearchLoading, jobDeleteLoading } =
        useSelector((state) => state.hiring);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [recordsPerPage, setRecordsPerPage] = useState(6);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null });

    // ── Fetch on change ───────────────────────────────────────
    useEffect(() => {
        if (searchQuery.trim()) {
            dispatch(searchJobsHR(searchQuery));
        } else {
            dispatch(fetchAllJobs({
                ...(activeFilter !== "All" && { jobType: activeFilter }),
                page: 1,
                limit: recordsPerPage,
            }));
        }
    }, [dispatch, searchQuery, activeFilter, recordsPerPage]);

    // ── Pagination ────────────────────────────────────────────
    const handlePageChange = (newPage) => {
        if (searchQuery.trim()) {
            dispatch(searchJobsHR(searchQuery));
        } else {
            dispatch(fetchAllJobs({
                ...(activeFilter !== "All" && { jobType: activeFilter }),
                page: newPage,
                limit: recordsPerPage,
            }));
        }
    };

    // ── Delete ────────────────────────────────────────────────
    const handleDelete = () => {
        dispatch(deleteJob(confirmModal.jobId)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                setConfirmModal({ open: false, jobId: null });
            }
        });
    };

    const jobsList = Array.isArray(jobs) ? jobs : [];

    return (
        <div className="flex flex-col gap-5">

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-br from-[#1e2a3a] to-[#162231] border border-slate-700
                                        rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full
                                            bg-red-500/15 mx-auto mb-4">
                                <Trash2 size={22} className="text-pink-400" />
                            </div>
                            <h3 className="text-white text-center font-semibold text-lg mb-1">Delete Job</h3>
                            <p className="text-slate-400 text-center text-sm mb-6">
                                Are you sure you want to delete this job post? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ open: false, jobId: null })}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600
                                               text-slate-300 text-sm font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={jobDeleteLoading}
                                    className="flex-1 py-2.5 rounded-xl bg-pink-400/12 text-pink-400
                                               hover:bg-pink-400/10 text-sm font-medium transition-all
                                               disabled:opacity-60"
                                >
                                    {jobDeleteLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <i className="fas fa-spinner fa-spin text-sm" />
                                            Deleting...
                                        </span>
                                    ) : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <TableControls
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery}
                filterValue={activeFilter}
                setFilterValue={setActiveFilter}
                filterOptions={["All", "Full-time", "Part-time", "Contract", "Internship"]}
                setCurrentPage={() => {}}
            />

            {/* Cards Grid */}
            {jobsLoading || jobsSearchLoading ? (
                <div className="flex items-center justify-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl" style={{ color: ICON_COLOR }} />
                </div>
            ) : jobsList.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
                    No jobs found
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {jobsList.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                openMenuId={openMenuId}
                                setOpenMenuId={setOpenMenuId}
                                navigate={navigate}
                                setConfirmModal={setConfirmModal}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            <Pagination
                pagination={jobsPagination}
                handlePageChange={handlePageChange}
                handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                currentDataLength={jobsList.length}
                recordsPerPage={recordsPerPage}
                entityName="jobs"
            />

        </div>
    );
};

export default JobsTable;