
import { Plus } from "lucide-react";
import { useState } from "react";
import StatCard from "@/HrComponents/ProjectPageComponents/StatCard.jsx";
import SearchInput from "@/HrComponents/ProjectPageComponents/SearchInput.jsx";
import AddProjectModal from "@/HrComponents/ProjectPageComponents/AddProjectModel.jsx";

export default function ProjectHeader({ onProjectAdded, stats, onSearch }) {
  const [open, setOpen] = useState(false);

  const defaultStats = [
    { title: "All Project", value: 0 },
    { title: "On-going", value: 0 },
    { title: "Pending", value: 0 },
    { title: "Completed", value: 0 },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-4 gap-4">
        <h1 style={{ color: 'var(--text-main)' }} className="text-2xl font-bold tracking-tight">
          Projects
        </h1>
        <div className="flex gap-3 items-center flex-wrap">
          {displayStats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} />
          ))}

          <SearchInput onSearch={onSearch} />

          <button
            onClick={() => setOpen(true)}
            className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
          >
            <Plus size={16} />
            Add project
          </button>
        </div>
      </div>

      {open && (
        <AddProjectModal 
          onClose={() => setOpen(false)} 
          onSuccess={() => {
            setOpen(false); 
            if (onProjectAdded) onProjectAdded(); 
          }}
        />
      )}
    </>
  );
}