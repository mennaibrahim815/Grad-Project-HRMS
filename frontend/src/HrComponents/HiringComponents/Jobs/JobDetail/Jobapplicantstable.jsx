import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=80&bold=true&rounded=true`;

const StatusBadge = ({ status }) => {
    const styles = {
        Applied:      "bg-slate-800 text-cyan-400 border-cyan-400/20",
        Interviewing: "bg-sky-500/15 text-sky-400 border-sky-400/40",
        Hired:        "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
        Rejected:     "bg-red-500/20 text-red-400 border-red-400/20",
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                          text-xs font-medium border ${styles[status] || ""}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
};

const JobApplicantsTable = () => {
    const navigate = useNavigate();
    const { jobApplicants, jobApplicantsLoading } = useSelector((state) => state.hiring);

    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-base">
                    Applicants
                    {jobApplicants.length > 0 && (
                        <span className="ml-2 text-xs text-slate-500 font-normal">
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
                    <i className="fas fa-users text-slate-600 text-3xl" />
                    <p className="text-slate-400 text-sm">No applicants yet for this job.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/8">
                                {["Applicant", "Department", "Experience", "Applied At", "Status", ""].map((h) => (
                                    <th key={h} className="text-left text-xs text-slate-500 font-medium
                                                           uppercase tracking-wider pb-3 pr-4">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {jobApplicants.map((applicant) => {
                                const info = applicant.personalInfo;
                                const fullName = `${info?.firstName || ""} ${info?.lastName || ""}`.trim();
                                const avatar = info?.avatar?.startsWith("/uploads/default")
                                    ? getAvatarUrl(fullName)
                                    : info?.avatar;

                                return (
                                    <tr key={applicant._id}
                                        className="hover:bg-white/3 transition-colors">

                                        {/* Applicant */}
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <img src={avatar || getAvatarUrl(fullName)}
                                                    alt={fullName}
                                                    className="w-9 h-9 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-100">{fullName}</p>
                                                    <p className="text-xs text-slate-500">{info?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Department */}
                                        <td className="py-4 pr-4 text-sm text-slate-400">
                                            {info?.department || "—"}
                                        </td>

                                        {/* Experience */}
                                        <td className="py-4 pr-4 text-sm text-slate-400">
                                            {info?.experienceLevel || "—"}
                                        </td>

                                        {/* Applied At */}
                                        <td className="py-4 pr-4 text-sm text-slate-400">
                                            {applicant.createdAt
                                                ? new Date(applicant.createdAt).toLocaleDateString("en-GB")
                                                : "—"}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 pr-4">
                                            <StatusBadge status={applicant.status} />
                                        </td>

                                        {/* See Details */}
                                        <td className="py-4">
                                            <button
                                                onClick={() => navigate(`/hiring/${applicant._id}`)}
                                                className="flex items-center gap-1.5 text-xs text-slate-400
                                                           hover:text-blue-400 transition-colors"
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
        </div>
    );
};

export default JobApplicantsTable;