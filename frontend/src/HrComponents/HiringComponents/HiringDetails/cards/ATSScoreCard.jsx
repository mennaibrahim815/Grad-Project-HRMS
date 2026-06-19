import { useNavigate } from "react-router-dom";
import { Briefcase, ExternalLink } from "lucide-react";
import BaseCard from "../../../../components/UI/Card";

// ── ATS Score Card ─────────────────────────────────────────────
export const ATSScoreCard = ({ applicant }) => {
    const score = applicant?.atsScore ?? 0;

    const gradient =
    score >= 70
        ? "linear-gradient(90deg, #00A860, #4BFFB2)"
        : score >= 40
        ? "linear-gradient(90deg, #0293FA, #4BFFB2)"
        : "linear-gradient(90deg, #EC3A76, #f97316)";

    const glowColor =
        score >= 70 ? "rgba(0,168,96,0.3)" : "rgba(2,147,250,0.3)";

    const label =
        score >= 70 ? "Excellent Match" : score >= 40 ? "Good Match" : "Low Match";

    const labelColor =
        score >= 70 ? "#4BFFB2" : score >= 40 ? "#0293FA" : "#EC3A76";

    return (
        <BaseCard>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>ATS Score</h3>
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full border"
                        style={{
                            color: labelColor,
                            borderColor: `${labelColor}40`,
                            background: `${labelColor}15`,
                        }}
                    >
                        {label}
                    </span>
                </div>

                {/* Big Score Circle */}
                <div className="flex flex-col items-center gap-3 py-2">
                    <div
                        className="relative w-28 h-28 rounded-full flex items-center justify-center"
                        style={{
                            background: `conic-gradient(${score >= 70 ? "#00A860" : score >= 40 ? "#0293FA" : "#EC3A76"} ${score * 3.6}deg, var(--border-main) 0deg)`,
                            boxShadow: `0 0 24px ${glowColor}`,
                        }}
                    >
                        <div style={{ background: 'var(--bg-deep)' }} className="w-20 h-20 rounded-full flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold" style={{ color: labelColor }}>
                                {score}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <span>Match Rate</span>
                        <span style={{ color: labelColor }}>{score}%</span>
                    </div>
                    <div style={{ background: 'var(--tab-inactive-bg)' }} className="relative h-2 w-full rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                            style={{ width: `${score}%`, background: gradient }}
                        />
                        <div
                            className="absolute inset-y-0 left-0 rounded-full opacity-30"
                            style={{
                                width: `${score}%`,
                                background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
                            }}
                        />
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-main)' }}>
                    {[
                        { label: "Low",  range: "0–39",  color: "#EC3A76" },
                        { label: "Good", range: "40–69", color: "#0293FA" },
                        { label: "Best", range: "70+",   color: "#4BFFB2" },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                            <span className="text-[10px]" style={{ color: item.color }}>{item.range}</span>
                        </div>
                    ))}
                </div>
            </div>
        </BaseCard>
    );
};

// ── Applied Job Card ───────────────────────────────────────────
export const AppliedJobCard = ({ applicant }) => {
    const navigate = useNavigate();
    const job = applicant?.jobId;

    if (!job) return null;

    return (
        <BaseCard>
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Applied Job</h3>

                <div className="flex items-start gap-2">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(2,147,250,0.15)", border: "1px solid rgba(2,147,250,0.2)" }}
                    >
                        <Briefcase size={16} style={{ color: "#0293FA" }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{job.title || "—"}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{job.department || "—"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {job.jobType && (
                        <span style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)' }} className="px-2.5 py-1 rounded-lg border truncate">
                            {job.jobType}
                        </span>
                    )}
                    {job.workLocation && (
                        <span style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)' }} className="px-2.5 py-1 rounded-lg border truncate">
                            {job.workLocation}
                        </span>
                    )}
                    {job.experienceLevel && (
                        <span style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)' }} className="px-2.5 py-1 rounded-lg border truncate col-span-2">
                            {job.experienceLevel}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/hiring/jobs/${job._id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-80 mt-1"
                    style={{
                        background: "rgba(2,147,250,0.1)",
                        border: "1px solid rgba(2,147,250,0.25)",
                        color: "#0293FA",
                    }}
                >
                    <ExternalLink size={13} />
                    View Job Details
                </button>
            </div>
        </BaseCard>
    );
};