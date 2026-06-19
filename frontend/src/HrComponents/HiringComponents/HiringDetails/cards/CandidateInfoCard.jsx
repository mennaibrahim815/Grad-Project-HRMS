import BaseCard from "../../../../components/UI/Card";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border-main)' }}>
    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{value || "—"}</span>
  </div>
);

const CandidateInfoCard = ({ applicant }) => {
  const { personalInfo } = applicant || {};

  return (
    <BaseCard>
      <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        Contact Info
      </p>
      <InfoRow label="Email"      value={personalInfo?.email}           />
      <InfoRow label="Phone"      value={personalInfo?.phone}           />
      <InfoRow label="Gender"     value={personalInfo?.gender}          />
      <InfoRow label="Level"      value={personalInfo?.experienceLevel} />
      <InfoRow label="Department" value={personalInfo?.department}      />
    </BaseCard>
  );
};

export default CandidateInfoCard;