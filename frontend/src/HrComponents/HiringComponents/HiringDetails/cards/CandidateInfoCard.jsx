import BaseCard from "../../../../components/UI/Card";
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-200 text-sm">{value || "—"}</span>
  </div>
);

const CandidateInfoCard = ({ applicant }) => {
  const { personalInfo } = applicant || {};

  return (
    <BaseCard>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">
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