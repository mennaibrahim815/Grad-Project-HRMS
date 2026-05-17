import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHiringSummary } from "../../../store/HrSlices/Hiring/hiringSlice";
const StatBadge = ({ count, label }) => (
    <div className="flex items-center gap-1.5 px-4 py-2 lg:px-6 lg:py-3 rounded-full bg-gradient-to-br from-white/5 to-[#182731] border backdrop-blur-sm">
        <span className="text-white font-bold text-sm lg:text-lg">{count}</span>
        <span className="text-slate-400 text-sm lg:text-lg">{label}</span>
    </div>
);

const HiringHeader = ({ onAddJob }) => {
    const dispatch = useDispatch();
    const { analytics, summaryLoading } = useSelector((state) => state.hiring);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchHiringSummary());
    }, [dispatch]);

    const stats = analytics?.data?.stats;

    return (
        <>
          

            <div className="mb-10 mt-6">

                <div className="flex flex-col gap-3 lg:hidden">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Hiring</h1>
                    </div>
                    {summaryLoading ? (
                        <i className="fas fa-spinner fa-spin text-slate-400"></i>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <StatBadge count={stats?.totalApplicants} label="Total Applicants" />
                            <StatBadge count={stats?.applied} label="Applied" />
                            <StatBadge count={stats?.interviewing} label="Interview" />
                            <StatBadge count={stats?.hired} label="Hired" />
                            <StatBadge count={stats?.rejected} label="Rejected" />
                        </div>
                    )}
                </div>


                <div className="hidden lg:flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white tracking-tight shrink-0">Hiring</h1>

                    {summaryLoading ? (
                        <i className="fas fa-spinner fa-spin text-slate-400 mx-auto"></i>
                    ) : (
                        <div className="flex items-center gap-3 flex-1 justify-center">
                            <StatBadge count={stats?.totalApplicants} label="Total Applicants" />
                            <StatBadge count={stats?.applied} label="Applied" />
                            <StatBadge count={stats?.interviewing} label="Interview" />
                            <StatBadge count={stats?.hired} label="Hired" />
                            <StatBadge count={stats?.rejected} label="Rejected" />
                        </div>
                    )}

                </div>

            </div>
        </>
    );

};

export default HiringHeader;