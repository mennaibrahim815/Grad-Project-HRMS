import BaseCard from "../../../../components/UI/Card";

const InfoCell = ({ label, value }) => (
  <div style={{ background: 'var(--tab-inactive-bg)' }} className="rounded-xl p-3">
    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{value || "—"}</p>
  </div>
);

const ProfessionalInfoCard = ({ applicant}) => {

  const { professionalInfo, additionalQuestions } = applicant || {};

  return (
    <BaseCard className="flex flex-col gap-5">

      {/* Motivation */}
      {additionalQuestions?.motivation && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Overview
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {additionalQuestions.motivation}
          </p>
        </div>
      )}

      <div className="border-t" style={{ borderColor: 'var(--border-main)' }} />

      {/* Professional Info Grid */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
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