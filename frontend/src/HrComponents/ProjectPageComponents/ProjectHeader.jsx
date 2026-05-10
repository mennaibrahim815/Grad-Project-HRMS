
import { Plus } from "lucide-react";
import { useState } from "react";
import StatCard from "../ProjectPageComponents/StatCard.jsx";
import SearchBar from "../ProjectPageComponents/SearchInput.jsx";
import AddProjectModal from "./AddProjectModel.jsx";


const stats = [
  { title: "All Project", value: 12 },
  { title: "On-going", value: 4 },
  { title: "Pending", value: 2 },
  { title: "Completed", value: 4 },
];

export default function ProjectHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-4 gap-4">
         <h1 className="text-2xl font-bold text-white tracking-tight">
          Projects
        </h1>

        <div className="flex gap-3 items-center flex-wrap">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}

          <SearchBar />

          <button
            onClick={() => setOpen(true)}
            className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Plus size={16} />
            Add project
          </button>
        </div>
      </div>

      {open && <AddProjectModal onClose={() => setOpen(false)} />}
    </>
  );
}

