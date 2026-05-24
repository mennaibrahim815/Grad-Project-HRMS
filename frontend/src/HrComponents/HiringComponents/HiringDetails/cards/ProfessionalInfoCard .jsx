import BaseCard from "../../../../components/UI/Card";

const InfoCell = ({ label, value }) => (
  <div className="bg-white/5 rounded-xl p-3">
    <p className="text-slate-500 text-xs mb-1">{label}</p>
    <p className="text-slate-200 text-sm font-medium">{value || "—"}</p>
  </div>
);

const ProfessionalInfoCard = ({ applicant}) => {

  const { professionalInfo, additionalQuestions } = applicant || {};

  return (
    <BaseCard className="flex flex-col gap-5">

      {/* Motivation */}
      {additionalQuestions?.motivation && (
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            Overview
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {additionalQuestions.motivation}
          </p>
        </div>
      )}

      <div className="border-t border-white/5" />

      {/* Professional Info Grid */}
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">
          Professional Info
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InfoCell
            label="Years of Experience"
            value={professionalInfo?.yearsOfExperience
              ? `${professionalInfo.yearsOfExperience} yr(s)`
              : null}
          />
          <InfoCell label="Current Title"   value={professionalInfo?.currentJobTitle} />
          <InfoCell label="Current Company" value={professionalInfo?.currentCompany}  />
          <InfoCell label="Education"       value={professionalInfo?.educationLevel}  />
        </div>
      </div>

    

    </BaseCard>
  );
};

export default ProfessionalInfoCard;