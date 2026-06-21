import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BaseCard from "../../../../components/UI/Card";

const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=80&bold=true&rounded=true`;

const StatusBadge = ({ status }) => {
    const styleMap = {
        Applied: { bg: "var(--tab-inactive-bg)", border: "var(--border-main)", text: "var(--text-muted)" },
        Interviewing: { bg: "rgba(2,147,250,0.15)", border: "rgba(2,147,250,0.4)", text: "#0293FA" },
        Hired: { bg: "rgba(16,185,129,0.15)", border: "rgba(52,211,153,0.4)", text: "#34d399" },
        Rejected: { bg: "var(--pill-red-bg)", border: "var(--pill-red-border)", text: "var(--pill-red-text)" },
    };
    const s = styleMap[status] || styleMap.Applied;

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

const JobApplicantsTable = () => {
    const navigate = useNavigate();
    const { jobApplicants, jobApplicantsLoading } = useSelector((state) => state.hiring);

    return (
        <BaseCard padding="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-base" style={{ color: "var(--text-main)" }}>
                    Applicants
                    {jobApplicants.length > 0 && (
                        <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                            ({jobApplicants.length})
                        </span>
                    )}
                </h2>
            </div>

            {/* Loading */}
            {jobApplicantsLoading ? (
                <div className="flex items-center justify-center py-12">
                    <i className="fas fa-spinner fa-spin text-3xl text-blue-500" />
                </div>
            ) : jobApplicants.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <i className="fas fa-users text-3xl" style={{ color: "var(--text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No applicants yet for this job.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderColor: "var(--border-main)" }} className="border-b">
                                {["Applicant", "Department", "Experience", "Applied At", "Status", ""].map((h) => (
                                    <th
                                        key={h}
                                        style={{ color: "var(--text-muted)" }}
                                        className="text-left text-xs font-medium uppercase tracking-wider pb-3 pr-4"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {jobApplicants.map((applicant) => {
                                const info = applicant.personalInfo;
                                const fullName = `${info?.firstName || ""} ${info?.lastName || ""}`.trim();
                                const avatar = info?.avatar?.startsWith("/uploads/default")
                                    ? getAvatarUrl(fullName)
                                    : info?.avatar;

                                return (
                                    <tr
                                        key={applicant._id}
                                        style={{ borderColor: "var(--border-subtle)" }}
                                        className="border-b hover:opacity-90 transition-colors"
                                    >
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <img src={avatar || getAvatarUrl(fullName)}
                                                    alt={fullName}
                                                    className="w-9 h-9 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: "var(--text-main)" }}>{fullName}</p>
                                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{info?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 pr-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                            {info?.department || "—"}
                                        </td>

                                        <td className="py-4 pr-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                            {info?.experienceLevel || "—"}
                                        </td>

                                        <td className="py-4 pr-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                            {applicant.createdAt
                                                ? new Date(applicant.createdAt).toLocaleDateString("en-GB")
                                                : "—"}
                                        </td>

                                        <td className="py-4 pr-4">
                                            <StatusBadge status={applicant.status} />
                                        </td>

                                        <td className="py-4">
                                            <button
                                                onClick={() => navigate(`/hiring/${applicant._id}`)}
                                                style={{ color: "var(--text-muted)" }}
                                                className="flex items-center gap-1.5 text-xs hover:text-blue-400 transition-colors"
                                            >
                                                See Details
                                                <i className="fas fa-arrow-right text-[10px]" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </BaseCard>
    );
};

export default JobApplicantsTable;