import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { fetchAllApplicants, searchHiring, deleteApplicant, fetchApplicantById } from "../../../store/HrSlices/Hiring/hiringSlice";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../components/table/DataTable";
import TableControls from "../../../components/table/TableControls";
import Pagination from "../../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../../components/UI/RowActionMenu";
import BaseCard from "../../../components/UI/Card";
import { Eye, Trash2 } from "lucide-react";

// Generate avatar URL using UI Avatars
const getAvatarUrl = (name, background = "0D8ABC", color = "fff") => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`;
};

const AttendanceBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Applied':
        return 'bg-slate-800 text-cyan-400 border-cyan-400/20'

      case 'Interviewing':
        return 'bg-sky-500/15 text-sky-400 border-sky-400/40'

      case 'Rejected':
        return 'text-red-400 bg-red-500/20 rounded-full'

      case 'Hired':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40'

    }
  }
  return (
    <span className={`
    inline-flex items-center gap-2
    px-3 py-1
    rounded-full
    text-xs font-medium
    border
    backdrop-blur-sm" ${getStatusStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  )
}

const HiringTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, pagination, searchLoading, loading, deleteLoading } = useSelector((state) => state.hiring);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });
  // Delete Function
  const handleDelete = () => {
    const userId = confirmModal.userId;
    dispatch(deleteApplicant(userId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setConfirmModal({ open: false, userId: null });
        dispatch(fetchAllApplicants({ page: pagination.currentPage, limit: recordsPerPage }));
      }
    });
  };
  useEffect(() => {

    if (searchQuery.trim()) {
      dispatch(searchHiring({
        name: searchQuery,
        status: activeFilter !== "All" ? activeFilter : undefined,
        page: 1,
        limit: recordsPerPage,
      }));
    } else {
      dispatch(fetchAllApplicants({
        status: activeFilter !== "All" ? activeFilter : undefined,
        page: 1,
        limit: recordsPerPage,
      }));
    }
  }, [dispatch, searchQuery, activeFilter, recordsPerPage]);
  const handleDetails = (id) => {
    dispatch(fetchEmployeeSummary(id));
    navigate(`/employee/${id}`);
  };
  const handlePageChange = (newPage) => {
    if (searchQuery.trim()) {
      dispatch(searchHiring({
        name: searchQuery,
        status: activeFilter !== "All" ? activeFilter : undefined,
        page: newPage,
        limit: recordsPerPage,
      }));
    } else {
      dispatch(fetchAllApplicants({
        status: activeFilter !== "All" ? activeFilter : undefined,
        page: newPage,
        limit: recordsPerPage,
      }));
    }
  };


  const [openMenuId, setOpenMenuId] = useState(null);
  const columns = [
    {
      header: "Employee",
      accessor: "firstName",
      render: (row) => {
        const firstName = row.personalInfo?.firstName || row.firstName || "";
        const lastName = row.personalInfo?.lastName || row.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const avatar = row.personalInfo?.avatar || row.avatar;

        return (
          <div className="flex items-center gap-3">
            <img
              src={avatar || getAvatarUrl(fullName)}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-slate-100">{fullName || "—"}</p>
              <p className="text-xs text-slate-500">{row._id?.slice(-6)}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Department",
      accessor: "department",
      render: (row) => row.personalInfo?.department || row.department || "—",
    },
    {
      header: "Email",
      accessor: "email",
      render: (row) => row.personalInfo?.email || row.email || "—",
    },
    {
      header: "Level",
      accessor: "experienceLevel",
      render: (row) => row.personalInfo?.experienceLevel || row.experienceLevel || "—",
    },
    {
      header: "Applied At",
      accessor: "createdAt",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-GB")
          : "—",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <AttendanceBadge status={row.status || "—"} />,
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
                onClick: () => navigate(`/hiring/${row._id}`),
              },
              {
                label: "Delete",
                variant: "danger",
                icon: Trash2,
                onClick: () => setConfirmModal({ open: true, userId: row._id }),
              },
            ]}
          />
        </div>
      ),
    },
  ];




  return (

    <BaseCard padding="p-0" >
      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#1e2a3a] to-[#162231]  border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
              <Trash2 size={22} className="text-pink-400 hover:bg-pink-400/10" />
            </div>

            {/* Text */}
            <h3 className="text-white text-center font-semibold text-lg mb-1">
              Delete Employee
            </h3>
            <p className="text-slate-400 text-center text-sm mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, userId: null })}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-pink-400/12 text-pink-400 hover:bg-pink-400/10 text-sm font-medium transition-all disabled:opacity-60"
              >
                {deleteLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
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
        filterOptions={["All", "Applied", "Interviewing", "Hired", "Rejected"]}
        setCurrentPage={() => { }}

      />

      {searchLoading || loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
      ) : (
        <DataTable columns={columns} data={Array.isArray(list) ? list : []} />
      )}
      <Pagination
        pagination={pagination}
        handlePageChange={handlePageChange}
        handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
        currentDataLength={list.length}
        recordsPerPage={recordsPerPage}
        entityName="applicants"
      />
    </BaseCard>





  );


};

export default HiringTable;
