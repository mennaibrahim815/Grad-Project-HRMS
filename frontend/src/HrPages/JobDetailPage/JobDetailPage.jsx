import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById, fetchApplicantsByJob } from "../../store/HrSlices/Hiring/hiringSlice";

import JobInfoCard from "../../HrComponents/HiringComponents/Jobs/JobDetail/Jobinfocard";
import JobApplicantsTable from "../../HrComponents/HiringComponents/Jobs/JobDetail/Jobapplicantstable";

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedJob, jobDetailLoading } = useSelector((state) => state.hiring);

    useEffect(() => {
        dispatch(fetchJobById(id));
        dispatch(fetchApplicantsByJob(id));
    }, [dispatch, id]);

    if (jobDetailLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">

            {/* Back */}
            <button
                onClick={() => navigate("/hiring/jobs")}
                className="flex items-center gap-2 text-slate-400 hover:text-white
                           transition-colors w-fit text-sm"
            >
                <i className="fas fa-arrow-left text-xs" />
                Back to Jobs
            </button>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white">
                {selectedJob?.title || "Job Details"}
            </h1>

            {/* Job Info Card */}
            <JobInfoCard />

            {/* Applicants Table */}
            <JobApplicantsTable jobId={id} />
        </div>
    );
};

export default JobDetailPage;