import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPayrollHistory } from "../../store/EmployeeSlices/payroll/empPayrollSlice";
import { FileText, Search } from "lucide-react";

import DataTable from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";
import TableControls from "../../components/table/TableControls";
import BaseCard from "../../components/UI/Card";

const PayrollBadge = ({ status }) => {
    const styles = {
        Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
        Pending: "bg-[#F89B49]/15 text-[#F89B49] border-[#F89B49]/40",
        Draft: "bg-slate-500/20 text-slate-400 border-slate-400/40",
    };
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] || ""}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
};

const NoDataCard = () => (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 transition-all hover:border-blue-500/30 flex flex-col items-center justify-center gap-5 py-16">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <FileText size={28} className="text-slate-500" />
        </div>
        <div className="text-center">
            <p className="text-slate-200 font-semibold text-base mb-1">
                No payroll records yet
            </p>
            <p className="text-slate-500 text-sm">
                Your payroll history will appear here once processed
            </p>
        </div>
    </div>
);

const NoFilterResults = ({ activeFilter, onClear }) => (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <Search size={20} className="text-slate-500" />
        </div>
        <div className="text-center">
            <p className="text-slate-300 font-medium text-sm mb-1">No results found</p>
            <p className="text-slate-500 text-xs">
                No payroll records with{" "}
                <span className="text-slate-400 font-medium">"{activeFilter}"</span>{" "}
                status
            </p>
        </div>
        <button
            onClick={onClear}
            className="px-4 py-2 border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-sm rounded-xl transition-colors"
        >
            Clear filters
        </button>
    </div>
);

function EmployeePayrollTable() {
    const dispatch = useDispatch();
    const { myPayrollHistory, historyLoading } = useSelector((state) => state.empPayroll);

    const [activeFilter, setActiveFilter] = useState("All");
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchMyPayrollHistory({
            status: activeFilter,
            page: 1,
            limit: recordsPerPage,
        }));
    }, [dispatch, activeFilter, recordsPerPage]);

    const handlePageChange = (newPage) => {
        dispatch(fetchMyPayrollHistory({
            status: activeFilter,
            page: newPage,
            limit: recordsPerPage,
        }));
    };

    const columns = [
        {
            header: "Period",
            accessor: "month",
            render: (row) => {
                const date = new Date(row.year, row.month - 1);
                return (
                    <span className="text-slate-200 font-medium">
                        {date.toLocaleString("en-US", { month: "long", year: "numeric" })}
                    </span>
                );
            },
        },
        {
            header: "Base Salary",
            accessor: "baseSalary",
            render: (row) => `$${row.baseSalary?.toLocaleString()}`,
        },
        {
            header: "Deductions",
            accessor: "deductions",
            render: (row) => (
                <span className="text-pink-400">${row.deductions?.toLocaleString()}</span>
            ),
        },
        {
            header: "Net Salary",
            accessor: "netSalary",
            render: (row) => (
                <span className="text-emerald-400 font-bold">${row.netSalary?.toLocaleString()}</span>
            ),
        },
        {
            header: "Days Present",
            accessor: "daysPresent",
            render: (row) => (
                <span className="text-emerald-400">{row.daysPresent} days</span>
            ),
        },
        {
            header: "Days Absent",
            accessor: "daysAbsent",
            render: (row) => (
                <span className="text-pink-400">{row.daysAbsent} days</span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => <PayrollBadge status={row.status} />,
        },
    ];

    const list = myPayrollHistory.list || [];
    const hasNoData = list.length === 0 && activeFilter === "All";
    const hasNoFilterResults = list.length === 0 && activeFilter !== "All";

    if (historyLoading) {
        return (
            <BaseCard padding="p-0">
                <div className="flex items-center justify-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                </div>
            </BaseCard>
        );
    }

    if (hasNoData) return <NoDataCard />;

    return (
        <BaseCard padding="p-0">
            <TableControls
                filterValue={activeFilter}
                setFilterValue={setActiveFilter}
                filterOptions={["All", "Paid", "Pending"]}
                setCurrentPage={() => { }}
                showSearch={false} 
            />

            {hasNoFilterResults ? (
                <NoFilterResults
                    activeFilter={activeFilter}
                    onClear={() => setActiveFilter("All")}
                />
            ) : (
                <DataTable columns={columns} data={list} />
            )}

            <Pagination
                pagination={myPayrollHistory.pagination}
                handlePageChange={handlePageChange}
                handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
                currentDataLength={list.length}
                recordsPerPage={recordsPerPage}
                entityName="payrolls"
            />
        </BaseCard>
    );
}

export default EmployeePayrollTable;