import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye } from "lucide-react";

import {
    fetchAllJobs,
    searchJobsHR,
    deleteJob,
} from "../../../store/HrSlices/Hiring/hiringSlice";

import DataTable from "../../../components/table/DataTable";
import TableControls from "../../../components/table/TableControls";
import Pagination from "../../../components/table/Pagination";
import RowActionMenu from "../../../components/UI/RowActionMenu";
import BaseCard from "../../../components/UI/Card";
import EditIcon from "@mui/icons-material/Edit";

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles =
        status === "Open"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"
            : "bg-red-500/15 text-red-400 border-red-400/40";

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                          text-xs font-medium border backdrop-blur-sm ${styles}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
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
    const [recordsPerPage, setRecordsPerPage] = useState(5);
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

    // ── Columns ───────────────────────────────────────────────
    const columns = [
        {
            header: "Job Title",
            accessor: "title",
            render: (row) => (
                <div>
                    <p className="text-sm font-medium text-slate-100">{row.title || "—"}</p>
                    <p className="text-xs text-slate-500">{row._id?.slice(-6)}</p>
                </div>
            ),
        },
        {
            header: "Department",
            accessor: "department",
            render: (row) => row.department || "—",
        },
        {
            header: "Experience",
            accessor: "experienceLevel",
            render: (row) => row.experienceLevel || "—",
        },
        {
            header: "Job Type",
            accessor: "jobType",
            render: (row) => row.jobType || "—",
        },
        {
            header: "Location",
            accessor: "workLocation",
            render: (row) => row.workLocation || "—",
        },
        {
            header: "Posted At",
            accessor: "createdAt",
            render: (row) =>
                row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-GB")
                    : "—",
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => <StatusBadge status={row.status || "—"} />,
        },
        {
            header: "Action",
            accessor: "action",
            render: (row) => (
                <div className="relative">
                    <button
                        onClick={() => setOpenMenuId(openMenuId === row._id ? null : row._id)}
                        className="p-2 text-slate-400 hover:text-slate-200"
                    >
                        <EditIcon />
                    </button>
                    <RowActionMenu
                        isOpen={openMenuId === row._id}
                        onClose={() => setOpenMenuId(null)}
                        actions={[
                            {
                                label: "See Details",
                                icon: Eye,
                                onClick: () => navigate(`/hiring/jobs/${row._id}`),
                            },
                            {
                                label: "Delete",
                                variant: "danger",
                                icon: Trash2,
                                onClick: () => setConfirmModal({ open: true, jobId: row._id }),
                            },
                        ]}
                    />
                </div>
            ),
        },
    ];

    return (
        <BaseCard padding="p-0">

            {/* Delete Confirm Modal */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#1e2a3a] to-[#162231] border border-slate-700
                                    rounded-2xl p-6 w-full max-w-sm shadow-2xl">
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
                    </div>
                </div>
            )}

            <TableControls
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery}
                filterValue={activeFilter}
                setFilterValue={setActiveFilter}
                filterOptions={["All", "Full-time", "Part-time", "Contract", "Internship"]}
                setCurrentPage={() => {}}
            />

            {jobsLoading || jobsSearchLoading ? (
                <div className="flex items-center justify-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500" />
                </div>
            ) : (
                <DataTable columns={columns} data={Array.isArray(jobs) ? jobs : []} />
            )}

            <Pagination
                pagination={jobsPagination}
                handlePageChange={handlePageChange}
                handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                currentDataLength={jobs.length}
                recordsPerPage={recordsPerPage}
                entityName="jobs"
            />
        </BaseCard>
    );
};

export default JobsTable;