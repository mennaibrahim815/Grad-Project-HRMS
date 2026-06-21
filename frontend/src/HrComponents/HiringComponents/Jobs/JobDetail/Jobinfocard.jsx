import { useState } from "react";
import { useSelector } from "react-redux";
import EditJobModal from "./Editjobmodal";
import BaseCard from "../../../../components/UI/Card";

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
        <span className="text-sm font-medium" style={{ color: "var(--text-main)" }}>{value || "—"}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const s = status === "Open"
        ? { bg: "rgba(16,185,129,0.15)", border: "rgba(52,211,153,0.4)", text: "#34d399" }
        : { bg: "var(--pill-red-bg)", border: "var(--pill-red-border)", text: "var(--pill-red-text)" };

    return (
        <span
            style={{ background: s.bg, borderColor: s.border, color: s.text }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
        >
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

                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-base" style={{ color: "var(--text-main)" }}>Job Information</h2>

                    <button
                        onClick={() => setIsEditOpen(true)}
                        style={{ background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border
                                   hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400
                                   transition-all"
                    >
                        <i className="fas fa-pen text-xs" />
                    </button>
                </div>

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
                        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</span>
                        <StatusBadge status={selectedJob.status} />
                    </div>
                </div>

                {selectedJob.description && (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--border-main)" }}>
                        <span className="text-xs uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
                            Description
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-main)" }}>
                            {selectedJob.description}
                        </p>
                    </div>
                )}
            </BaseCard>
        </>
    );
};

export default JobInfoCard;