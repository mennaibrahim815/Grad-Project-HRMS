import { useState } from 'react';
//Components
import DataTable from "../../../../components/table/DataTable";
import Pagination from "../../../../components/table/Pagination";
import TableControls from "../../../../components/table/TableControls";
import useTableController from "../../../../hooks/useTableController";
import RowActionMenu from "../../../../components/UI/RowActionMenu";
import BaseCard from "../../../../components/UI/Card";
import { Eye, Trash2 } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

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

   case 'Unpaid':
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
//Mock Data
const data=[
    {
      "id": "ID00021290",
      "name": "Ryan Henry",
      "start_date": "2025-02-01",
      "end_date": "2025-03-02",
      "status": "Paid",
      "Total_days":"30",
      "Total_hours":"132h 39m",
      "department":"SMM"
    },
    {
      "id": "ID00021291",
      "name": "Isabella Chloe",
      "start_date": "2025-02-01",
      "end_date": "2025-03-02",
      "status": "Pending",
      "Total_days":"30",
      "Total_hours":"127h 39m",
      "department":"Developer"
    },
    {
      "id": "ID00021294",
      "name": "Bessie Cooper",
      "start_date": "2025-02-01",
      "end_date": "2025-03-02",
      "status": "Unpaid",
      "Total_days":"28",
      "Total_hours":"132h 39m",
      "department":"Marketing"
    },
    {
      "id": "ID000266010",
      "name": "Robert Fox",
      "start_date": "2025-02-01",
      "end_date": "2025-03-02",
      "status": "Paid",
      "Total_days":"29",
      "Total_hours":"132h 39m",
      "department":"Design"
    },
  ]
function PayrollTable() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const columns = [
  {
    header: "Employee",
    accessor: "name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.image || getAvatarUrl(row.name)}
          alt={row.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-slate-100">
            {row.name}
          </p>
          <p className="text-xs text-slate-500">
            {row.id}
          </p>
        </div>
      </div>
    ),
  },
  { header: "Department", accessor: "department" },
  { header: "Start date", accessor: "start_date" },
  { header: "End date", accessor: "end_date" },
  { header: "Total days", accessor: "Total_days" },
  { header: "Total hours", accessor: "Total_hours" },

  {
    header: "Status",
    accessor: "status",
    render: (row) => <AttendanceBadge status={row.status} />,
  },

  {
    header: "Action",
    accessor: "action",
    render: (row) => (
      <div className="relative">
        <button
          onClick={() =>
            setOpenMenuId(openMenuId === row.id ? null : row.id)
          }
          className="p-2 text-slate-400 hover:text-slate-200"
        >
          <EditIcon />
        </button>

        <RowActionMenu
          isOpen={openMenuId === row.id}
          onClose={() => setOpenMenuId(null)}
          actions={[
            {
              label: "See Details",
              icon: Eye,
              onClick: () => handleDetails(row.id),
            },
            {
              label: "Delete",
              variant: "danger",
              icon: Trash2,
              onClick: () => console.log("Delete", row.id),
            },
          ]}
        />
      </div>
    ),
  },
];
const {
  currentData,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  recordsPerPage,
  setRecordsPerPage,
  currentPage,
  setCurrentPage,
  totalRecords,
  totalPages
  
} = useTableController({
  data: data,
  searchKeys: ["name","department"],
  filterKey: "status",
  
})
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page)
  }
}

const handleRecordsPerPageChange = (value) => {
  setRecordsPerPage(value)
  setCurrentPage(1)
}
  return (
      <BaseCard padding="p-0" >
       <TableControls
      searchTerm={searchQuery}
      setSearchTerm={setSearchQuery}
      filterValue={activeFilter}
      setFilterValue={setActiveFilter}
      filterOptions={["All", "Paid", "Pending","Unpaid",]}
      setCurrentPage={setCurrentPage}

      />
    
      <DataTable columns={columns} data={currentData} />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        recordsPerPage={recordsPerPage}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        totalRecords={totalRecords}
        currentDataLength={currentData.length}
      />
    </BaseCard>
  );
}

export default PayrollTable;