import { useState, useEffect } from 'react';
import { fetchAllPayrolls, searchPayrolls, setManagementMonth } from "../../../../store/HrSlices/payroll/payrollSlice";
import { useDispatch, useSelector } from 'react-redux'
//Components
import DataTable from "../../../../components/table/DataTable";
import Pagination from "../../../../components/table/Pagination";
import TableControls from "../../../../components/table/TableControls";
import RowActionMenu from "../../../../components/UI/RowActionMenu";
import BaseCard from "../../../../components/UI/Card";
import { Eye, Trash2, CreditCard, Download } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import { PayrollActionModal } from '../PayrollActionModal/PayrollActionModal';
import { PayrollDetailsModal } from '../PayrollDetailsModal/PayrollDetailsModal';
import { EditDraftModal } from '../EditDraftModal/EditDraftModal';

// Generate avatar URL using UI Avatars
const getAvatarUrl = (name, background = '0D8ABC', color = 'fff') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`
}

const AttendanceBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'Paid':
                return 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40'

            case 'Pending':
                return 'bg-sky-500/15 text-sky-400 border-sky-400/40'

            case 'Draft,':
                return 'bg-slate-500/20 text-slate-400 border-slate-400/40'


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

function ManagementTable() {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [detailsId, setDetailsId] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const handlePayAction = (row) => {
        setSelectedEmployeeId(row._id);
        setActiveModal("singlePay");
    };
    const columns = [
        {
            header: "Employee",
            accessor: "employee.firstName",
            render: (row) => {
                const fullName = `${row.employee?.firstName || ""} ${row.employee?.lastName || ""}`;
                return (
                    <div className="flex items-center gap-3">
                        <img
                            src={row.employee?.avatar || getAvatarUrl(fullName)}
                            alt={fullName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium text-slate-100">{fullName}</p>
                            <p className="text-xs text-slate-500">{row._id?.slice(-6)}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Period",
            accessor: "month",
            render: (row) => {

                const date = new Date(row.year, row.month - 1);
                return date.toLocaleString("en-US", { month: "long", year: "numeric" });

            }
        },
        {
            header: "Base Salary",
            accessor: "baseSalary",
            render: (row) => `$${row.baseSalary?.toLocaleString()}`
        },
        {
            header: "Deductions",
            accessor: "deductions",
            render: (row) => `$${row.deductions?.toLocaleString()}`
        },
        {
            header: "Net Salary",
            accessor: "netSalary",
            render: (row) => `$${row.netSalary?.toLocaleString()}`
        },
        {
            header: "Days Present",
            accessor: "daysPresent",
            render: (row) => (
                <span className="text-emerald-400">{row.daysPresent} days</span>
            )
        },
        {
            header: "Days Absents",
            accessor: "daysAbsent",
            render: (row) => (
                <span className="text-pink-400">{row.daysAbsent} days</span>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => <AttendanceBadge status={row.status} />,
        },
        {
            header: "Action",
            accessor: "action",
            render: (row) => {
                const getStatusActions = (status) => {
                    const baseActions = [
                        {
                            label: "See Details",
                            icon: Eye,
                            onClick: () => setDetailsId(row._id),
                        },
                    ];

                    switch (status) {
                        case "Draft":
                            return [
                                ...baseActions,
                                {
                                    label: "Edit",
                                    icon: EditIcon,
                                    variant: "danger",
                                    onClick: () => setEditRow(row), // ← بنبعت الـ row كامل
                                },
                            ];



                        case "Paid":
                            return [
                                ...baseActions,
                                {
                                    label: "Download Payslip",
                                    icon: Download, // من lucide-react
                                    variant: "success",
                                    onClick: () => {
                                        // handle download
                                        console.log("Download Payslip", row._id);
                                    },
                                },
                            ];

                        case "Pending":
                            return [
                                ...baseActions,
                                {
                                    label: "Process Payment",
                                    icon: CreditCard,
                                    variant: "success",
                                    onClick: () => handlePayAction(row),
                                },
                            ];

                        default:
                            return baseActions;
                    }
                };

                return (
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenMenuId(openMenuId === row._id ? null : row._id)
                            }
                            className="p-2 text-slate-400 hover:text-slate-200"
                        >
                            <EditIcon />
                        </button>
                        <RowActionMenu
                            isOpen={openMenuId === row._id}
                            onClose={() => setOpenMenuId(null)}
                            actions={getStatusActions(row.status)}
                        />
                    </div>
                );
            },
        },
    ];
    const dispatch = useDispatch();
    const { payrollList, pagination, tableLoading, managementSelectedMonth } = useSelector((state) => state.payroll);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const getMonthYear = () => {
        const [year, month] = managementSelectedMonth.split("-");
        return { month: parseInt(month), year: parseInt(year) };
    };
    useEffect(() => {
        if (editRow) {
            const updatedRow = payrollList.find((r) => r._id === editRow._id);
            if (updatedRow) setEditRow(updatedRow);
        }
    }, [payrollList]);

    useEffect(() => {
        const { month, year } = getMonthYear();

        if (searchQuery.trim()) {
            dispatch(searchPayrolls({
                employeeName: searchQuery,
                month,
                year,
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: 1,
                limit: recordsPerPage,
            }));
        } else {
            dispatch(fetchAllPayrolls({
                month,
                year,
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: 1,
                limit: recordsPerPage,
            }));
        }
    }, [dispatch, managementSelectedMonth, searchQuery, activeFilter, recordsPerPage]);

    const handlePageChange = (newPage) => {
        const { month, year } = getMonthYear();
        if (searchQuery.trim()) {
            dispatch(searchPayrolls({
                employeeName: searchQuery,
                month,
                year,
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: newPage,
                limit: recordsPerPage,
            }));
        } else {
            dispatch(fetchAllPayrolls({
                month,
                year,
                status: activeFilter !== "All" ? activeFilter : undefined,
                page: newPage,
                limit: recordsPerPage,
            }));
        }
    };
    return (
        <BaseCard padding="p-0" >
            <TableControls
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery}
                filterValue={activeFilter}
                setFilterValue={setActiveFilter}
                filterOptions={["All", "Paid", "Pending", "Draft"]}
                setCurrentPage={() => { }}

            />
            {tableLoading ? (
                <div className="flex items-center justify-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                </div>
            ) : (
                <DataTable columns={columns} data={payrollList || []} />
            )}


            <Pagination
                pagination={pagination}
                handlePageChange={handlePageChange}
                handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                currentDataLength={payrollList.length}
                recordsPerPage={recordsPerPage}
                entityName="payrolls"
            />
            {activeModal && (
                <PayrollActionModal
                    action={activeModal}
                    targetId={selectedEmployeeId}
                    onClose={() => {
                        setActiveModal(null);
                        setSelectedEmployeeId(null);
                    }}
                />
            )}
            {detailsId && (
                <PayrollDetailsModal
                    payrollId={detailsId}
                    onClose={() => setDetailsId(null)}
                />
            )}

            {
                editRow && (
                    <EditDraftModal
                        payrollRow={editRow}
                        onClose={() => setEditRow(null)}
                    />
                )
            }
        </BaseCard>

    );
}

export default ManagementTable;