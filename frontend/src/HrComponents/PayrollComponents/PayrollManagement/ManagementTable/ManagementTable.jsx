import { useState, useEffect } from 'react';
import { fetchAllPayrolls, searchPayrolls, setManagementMonth } from "../../../../store/HrSlices/payroll/payrollSlice";
import { useDispatch, useSelector } from 'react-redux'
//Components
import DataTable from "../../../../components/table/DataTable";
import Pagination from "../../../../components/table/Pagination";
import TableControls from "../../../../components/table/TableControls";
import RowActionMenu from "../../../../components/UI/RowActionMenu";
import BaseCard from "../../../../components/UI/Card";
import { Eye, Trash2, CreditCard, Download, Search, FileText } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import { PayrollActionModal } from '../PayrollActionModal/PayrollActionModal';
import { PayrollDetailsModal } from '../PayrollDetailsModal/PayrollDetailsModal';
import { EditDraftModal } from '../EditDraftModal/EditDraftModal';
import { generatePayslip } from "../../../../services/Generatepayslip";

// Generate avatar URL using UI Avatars
const getAvatarUrl = (name, background = '0D8ABC', color = 'fff') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`
};


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
    const [editFormValues, setEditFormValues] = useState({});
    const handlePayAction = (row) => {
        setSelectedEmployeeId(row._id);
        setActiveModal("singlePay");
    };

    const handleOpenEdit = (row) => {
        setEditRow(row);
        if (!editFormValues[row._id]) {
            setEditFormValues(prev => ({
                ...prev,
                [row._id]: {
                    manualAdditions: row.manualAdditions ?? 0,
                    manualDeductions: row.manualDeductions ?? 0,
                    adjustmentReason: row.adjustmentReason ?? "",
                }
            }));
        }
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
                                    onClick: () => handleOpenEdit(row)
                                },
                            ];



                        case "Paid":
                            return [
                                ...baseActions,
                                {
                                    label: "Download Payslip",
                                    icon: Download, // من lucide-react
                                    variant: "success",
                            
                                        // handle download
                                    onClick: () => generatePayslip(row),
                                
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
        setActiveFilter("All");
        setSearchQuery("");
    }, [managementSelectedMonth]);
    
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

    const NoDataCard = () => (
        <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30 flex flex-col items-center justify-center gap-5 py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                <FileText size={28} className="text-slate-500" />
            </div>
            <div className="text-center">
                <p className="text-slate-200 font-semibold text-base mb-1">
                    No payroll draft for this month
                </p>
                <p className="text-slate-500 text-sm">
                    Generate a draft first to see payroll data
                </p>
            </div>
            <button
                onClick={() => setActiveModal("draft")}
                className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
                <FileText size={15} />
                <span>Generate Draft</span>
            </button>
        </div>
    );

    // Empty State 
    const NoFilterResults = () => (
        <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <Search size={20} className="text-slate-500" />
            </div>
            <div className="text-center">
                <p className="text-slate-300 font-medium text-sm mb-1">No results found</p>
                <p className="text-slate-500 text-xs">
                    No employees with{" "}
                    <span className="text-slate-400 font-medium">"{activeFilter}"</span>{" "}
                    status this month
                </p>
            </div>
            <button
                onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
                className="px-4 py-2 border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-sm rounded-xl transition-colors"
            >
                Clear filters
            </button>
        </div>
    );
    const hasNoData = payrollList.length === 0 && activeFilter === "All" && !searchQuery.trim();
    const hasNoFilterResults = payrollList.length === 0 && (activeFilter !== "All" || searchQuery.trim());

    return (
        <>
            {tableLoading ? (
                <BaseCard padding="p-0">
                    <div className="flex items-center justify-center py-20">
                        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                    </div>
                </BaseCard>

            ) : hasNoData ? (

                <NoDataCard />

            ) : (

                <BaseCard padding="p-0">
                    <TableControls
                        searchTerm={searchQuery}
                        setSearchTerm={setSearchQuery}
                        filterValue={activeFilter}
                        setFilterValue={setActiveFilter}
                        filterOptions={["All", "Paid", "Pending", "Draft"]}
                        setCurrentPage={() => { }}
                    />

                    {hasNoFilterResults ? (
                        <NoFilterResults />
                    ) : (
                        <DataTable columns={columns} data={payrollList} />
                    )}

                    <Pagination
                        pagination={pagination}
                        handlePageChange={handlePageChange}
                        handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                        currentDataLength={payrollList.length}
                        recordsPerPage={recordsPerPage}
                        entityName="payrolls"
                    />
                </BaseCard>
            )}

            {/* Modals */}
            {activeModal && (
                <PayrollActionModal
                    action={activeModal}
                    targetId={selectedEmployeeId}
                    onClose={() => { setActiveModal(null); setSelectedEmployeeId(null); }}
                />
            )}
            {detailsId && (
                <PayrollDetailsModal
                    payrollId={detailsId}
                    onClose={() => setDetailsId(null)}
                />
            )}
            {editRow && (
                <EditDraftModal
                    payrollRow={editRow}
                    formValues={editFormValues[editRow._id]}
                    onFormChange={(values) =>
                        setEditFormValues(prev => ({ ...prev, [editRow._id]: values }))
                    }
                    onClose={() => setEditRow(null)}
                />
            )}
        </>
    );
}

export default ManagementTable;