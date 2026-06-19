import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { fetchAllApplicants, searchHiring, deleteApplicant } from "../../../store/HrSlices/Hiring/hiringSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import TableControls from "../../../components/table/TableControls";
import Pagination from "../../../components/table/Pagination";
import RowActionMenu from "../../../components/UI/RowActionMenu";
import BaseCard from "../../../components/UI/Card";
import EditIcon from "@mui/icons-material/Edit";
import { Eye, Trash2, Mail, Briefcase, Building2, CalendarDays } from "lucide-react";

const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1274F3&color=fff&size=80&bold=true&rounded=true`;

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        Applied:      "bg-slate-800 text-[#B0B4B4] border-[#B0B4B4]/20",
        Interviewing: "bg-[#0293FA]/15 text-[#0293FA] border-[#0293FA]/40",
        Rejected:     "bg-[#EC3A76]/20 text-[#EC3A76] border-[#EC3A76]/20",
        Hired:        "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] || styles.Applied}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
};

// ── ATS Score Bar ─────────────────────────────────────────────
const ATSBar = ({ score }) => {
    const pct = Math.max(0, Math.min(100, score ?? 0));

    const fillGradient =
        pct >= 70
            ? "linear-gradient(90deg, #00A860, #4BFFB2)"
            : pct >= 40
            ? "linear-gradient(90deg, #1274F3, #4BFFB2)"
            : "linear-gradient(90deg, #EC3A76, #f97316)";

    const textColor =
        pct >= 70 ? "#4BFFB2" : pct >= 40 ? "#4BFFB2" : "#EC3A76";

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>ATS Score</span>
                <span className="text-xs font-semibold" style={{ color: textColor }}>
                    {pct}%
                </span>
            </div>

            {/* Track with Crisp Stripes */}
            <div
                className="relative h-2 w-full rounded-full border overflow-hidden"
                style={{
                    borderColor: 'var(--border-main)',
                    backgroundImage: `linear-gradient(
                        -45deg,
                        var(--bg-deep) 25%,
                        var(--bg-card) 25%,
                        var(--bg-card) 50%,
                        var(--bg-deep) 50%,
                        var(--bg-deep) 75%,
                        var(--bg-card) 75%,
                        var(--bg-card)
                    )`,
                    backgroundSize: '8px 8px'
                }}
            >
                {/* Fill */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: fillGradient }}
                />
                {/* Shine */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-30"
                    style={{
                        width: `${pct}%`,
                        background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
                    }}
                />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-0.5">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(90deg,#1274F3,#4BFFB2)" }} />
                    Active
                </span>
                <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="w-2 h-2 rounded-full border"
                        style={{
                            borderColor: 'var(--border-main)',
                            backgroundImage: `linear-gradient(-45deg, var(--bg-deep) 25%, var(--bg-card) 25%, var(--bg-card) 50%, var(--bg-deep) 50%, var(--bg-deep) 75%, var(--bg-card) 75%, var(--bg-card))`,
                            backgroundSize: '3px 3px'
                        }}
                    />
                    Remaining
                </span>
            </div>
        </div>
    );
};

// ── Animation Variants ────────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
    exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

// ── Applicant Card ────────────────────────────────────────────
const ApplicantCard = ({ row, openMenuId, setOpenMenuId, navigate, setConfirmModal }) => {
    const firstName = row.personalInfo?.firstName || "";
    const lastName  = row.personalInfo?.lastName  || "";
    const fullName  = `${firstName} ${lastName}`.trim();
    const avatar    = row.personalInfo?.avatar;

    return (
        <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="exit" whileHover={{ y: -3 }}>
            <BaseCard className="flex flex-col gap-4 hover:border-blue-500/30 transition-colors h-full">

                {/* Header: avatar + name + menu */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src={avatar || getAvatarUrl(fullName)}
                            alt={fullName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{fullName || "—"}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{row._id?.slice(-6)}</p>
                        </div>
                    </div>

                    <div className="relative shrink-0 flex items-center gap-2">
                        <StatusBadge status={row.status || "Applied"} />
                        <button
                            onClick={() => setOpenMenuId(openMenuId === row._id ? null : row._id)}
                            className="p-1.5 hover:opacity-70 rounded-lg transition-colors text-[#0293FA]"
                        >
                            <EditIcon fontSize="small" />
                        </button>
                        <RowActionMenu
                            isOpen={openMenuId === row._id}
                            onClose={() => setOpenMenuId(null)}
                            actions={[
                                { label: "See Details", icon: Eye,   onClick: () => navigate(`/hiring/${row._id}`) },
                                { label: "Delete", variant: "danger", icon: Trash2, onClick: () => setConfirmModal({ open: true, userId: row._id }) },
                            ]}
                        />
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5 truncate">
                        <Building2 size={13} className="text-[#0293FA] shrink-0" />
                        <span className="truncate">{row.personalInfo?.department || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                        <Briefcase size={13} className="text-[#0293FA] shrink-0" />
                        <span className="truncate">{row.personalInfo?.experienceLevel || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate col-span-2">
                        <Mail size={13} className="text-[#0293FA] shrink-0" />
                        <span className="truncate">{row.personalInfo?.email || "—"}</span>
                    </div>
                    {row.jobDetails?.title && (
                        <div className="flex items-center gap-1.5 truncate col-span-2">
                            <CalendarDays size={13} className="text-[#0293FA] shrink-0" />
                            <span className="truncate">{row.jobDetails.title}</span>
                        </div>
                    )}
                </div>

                {/* ATS Score Bar */}
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-main)' }}>
                    <ATSBar score={row.atsScore} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-GB") : "—"}
                    </span>
                    <button
                        onClick={() => navigate(`/hiring/${row._id}`)}
                        className="text-xs font-medium text-[#0293FA] hover:opacity-75 transition-opacity"
                    >
                        View Details →
                    </button>
                </div>

            </BaseCard>
        </motion.div>
    );
};

// ── Main Component ────────────────────────────────────────────
const HiringTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, pagination, searchLoading, loading, deleteLoading } = useSelector((state) => state.hiring);

    const [searchQuery,    setSearchQuery]    = useState("");
    const [activeFilter,   setActiveFilter]   = useState("All");
    const [recordsPerPage, setRecordsPerPage] = useState(6);
    const [openMenuId,     setOpenMenuId]     = useState(null);
    const [confirmModal,   setConfirmModal]   = useState({ open: false, userId: null });

    useEffect(() => {
        if (searchQuery.trim()) {
            dispatch(searchHiring({
                name: searchQuery,
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: 1, limit: recordsPerPage,
            }));
        } else {
            dispatch(fetchAllApplicants({
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: 1, limit: recordsPerPage,
            }));
        }
    }, [dispatch, searchQuery, activeFilter, recordsPerPage]);

    const handlePageChange = (newPage) => {
        if (searchQuery.trim()) {
            dispatch(searchHiring({ name: searchQuery, status: activeFilter !== "All" ? activeFilter : undefined, page: newPage, limit: recordsPerPage }));
        } else {
            dispatch(fetchAllApplicants({ status: activeFilter !== "All" ? activeFilter : undefined, page: newPage, limit: recordsPerPage }));
        }
    };

    const handleDelete = () => {
        dispatch(deleteApplicant(confirmModal.userId)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                setConfirmModal({ open: false, userId: null });
                dispatch(fetchAllApplicants({ page: pagination.currentPage, limit: recordsPerPage }));
            }
        });
    };

    const applicants = Array.isArray(list) ? list : [];

    return (
        <div className="flex flex-col gap-5">

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'linear-gradient(to bottom right, var(--menu-gradient-from), var(--menu-gradient-to))',
                                borderColor: 'var(--border-main)',
                            }}
                            className="border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
                                <Trash2 size={22} className="text-pink-400" />
                            </div>
                            <h3 className="text-center font-semibold text-lg mb-1" style={{ color: 'var(--text-main)' }}>Delete Applicant</h3>
                            <p className="text-center text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                                Are you sure you want to delete this applicant? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmModal({ open: false, userId: null })}
                                    style={{ background: 'var(--tab-inactive-bg)', color: 'var(--tab-inactive-text)' }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={deleteLoading}
                                    className="flex-1 py-2.5 rounded-xl bg-pink-400/12 text-pink-400 hover:bg-pink-400/20 text-sm font-medium transition-all disabled:opacity-60">
                                    {deleteLoading ? (
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
                filterOptions={["All", "Applied", "Interviewing", "Hired", "Rejected"]}
                setCurrentPage={() => {}}
            />

            {/* Cards Grid */}
            {searchLoading || loading ? (
                <div className="flex items-center justify-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl text-[#0293FA]" />
                </div>
            ) : applicants.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>
                    No applicants found
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {applicants.map((row) => (
                            <ApplicantCard
                                key={row._id}
                                row={row}
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
                pagination={pagination}
                handlePageChange={handlePageChange}
                handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                currentDataLength={applicants.length}
                recordsPerPage={recordsPerPage}
                entityName="applicants"
            />
        </div>
    );
};

export default HiringTable;