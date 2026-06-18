import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicantById } from "../../store/HrSlices/Hiring/hiringSlice";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CandidateProfileCard from "../../HrComponents/HiringComponents/HiringDetails/cards/CandidateProfileCard";
import CandidateInfoCard from "../../HrComponents/HiringComponents/HiringDetails/cards/CandidateInfoCard";
import HiringProgressBar from "../../HrComponents/HiringComponents/HiringDetails/cards/HiringProgressBar";
import ProfessionalInfoCard from "../../HrComponents/HiringComponents/HiringDetails/cards/ProfessionalInfoCard ";
import DocumentsCard from "../../HrComponents/HiringComponents/HiringDetails/cards/DocumentsCard";
import SkillsCard from "../../HrComponents/HiringComponents/HiringDetails/cards/SkillsCard";
import AdditionalInfoCard from "../../HrComponents/HiringComponents/HiringDetails/cards/AdditionalInfoCard";
import { ATSScoreCard, AppliedJobCard } from "../../HrComponents/HiringComponents/HiringDetails/cards/ATSScoreCard"; // ✅

function HiringDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedApplicant, detailsLoading } = useSelector((state) => state.hiring);

    useEffect(() => {
        if (id) dispatch(fetchApplicantById(id));
    }, [id, dispatch]);

    if (detailsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
            </div>
        );
    }

    if (!selectedApplicant) return null;

    return (
        <div className="min-h-screen">
            <main className="px-4 md:px-6 py-6">
                {/* Page title */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <h1 className="text-white text-xl font-semibold">Detail candidate</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_220px] gap-5">

                    {/* Col 1 */}
                    <div className="flex flex-col gap-5">
                        <CandidateProfileCard applicant={selectedApplicant} />
                        <CandidateInfoCard applicant={selectedApplicant} />
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-5">
                        <HiringProgressBar status={selectedApplicant?.status} />
                        <ProfessionalInfoCard applicant={selectedApplicant} />
                        <DocumentsCard applicant={selectedApplicant} />
                    </div>

                    {/* Col 3 ✅ */}
                    <div className="flex flex-col gap-5">
                        <ATSScoreCard applicant={selectedApplicant} />
                        <AppliedJobCard applicant={selectedApplicant} />
                        <SkillsCard applicant={selectedApplicant} />
                        {/* <AdditionalInfoCard applicant={selectedApplicant} /> */}
                    </div>

                </div>
            </main>
        </div>
    );
}

export default HiringDetail;