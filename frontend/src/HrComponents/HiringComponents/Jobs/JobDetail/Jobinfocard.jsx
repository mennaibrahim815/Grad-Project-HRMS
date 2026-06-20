import { useState } from "react";
import { useSelector } from "react-redux";
import EditJobModal from "./Editjobmodal";
import BaseCard from "../../../../components/UI/Card";

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-slate-500 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-slate-100 text-sm font-medium">{value || "—"}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = status === "Open"
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"
        :"bg-[#EC3A76]/20 text-[#EC3A76] border-[#EC3A76]/20";

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                          text-xs font-medium border ${styles}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
};

const JobInfoCard = () => {
    const { selectedJob } = useSelector((state) => state.hiring);
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (!selectedJob) return null;

    return (
        <>
            <EditJobModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                job={selectedJob}
            />

            <BaseCard padding="p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-semibold text-base">Job Information</h2>

                    {/* Edit pencil */}
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl
                                   bg-white/5 border border-white/10 text-slate-400
                                   hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400
                                   transition-all"
                    >
                        <i className="fas fa-pen text-xs" />
                    </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <InfoRow label="Department" value={selectedJob.department} />
                    <InfoRow label="Experience Level" value={selectedJob.experienceLevel} />
                    <InfoRow label="Job Type" value={selectedJob.jobType} />
                    <InfoRow label="Work Location" value={selectedJob.workLocation} />
                    <InfoRow
                        label="Posted At"
                        value={selectedJob.createdAt
                            ? new Date(selectedJob.createdAt).toLocaleDateString("en-GB")
                            : "—"}
                    />
                    <div className="flex flex-col gap-1 items-start">
                        <span className="text-slate-500 text-xs uppercase tracking-wider">Status</span>
                        <StatusBadge status={selectedJob.status} />
                    </div>
                </div>

                {/* Description */}
                {selectedJob.description && (
                    <div className="mt-6 pt-6 border-t border-white/8">
                        <span className="text-slate-500 text-xs uppercase tracking-wider block mb-2">
                            Description
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {selectedJob.description}
                        </p>
                    </div>
                )}
            </BaseCard>
        </>
    );
};

export default JobInfoCard;