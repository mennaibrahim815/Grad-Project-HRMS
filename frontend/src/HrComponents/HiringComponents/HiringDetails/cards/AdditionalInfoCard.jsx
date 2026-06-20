import BaseCard from "../../../../components/UI/Card";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border-main)' }}>
    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{value || "—"}</span>
  </div>
);

const AdditionalInfoCard = ({ applicant}) => {

  const { additionalQuestions } = applicant || {};

  const startDate = additionalQuestions?.earliestStartDate
    ? new Date(additionalQuestions.earliestStartDate).toLocaleDateString("en-GB")
    : null;

  return (
    <BaseCard className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Additional Info
      </p>

      {/* Info Rows */}
      <div>
        <InfoRow label="Work Preference" value={additionalQuestions?.workPreference} />
        <InfoRow label="Earliest Start"  value={startDate}                           />
      </div>

      {/* Motivation */}
      {additionalQuestions?.motivation && (
        <div style={{ background: 'var(--tab-inactive-bg)' }} className="rounded-xl p-4">
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Motivation</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {additionalQuestions.motivation}
          </p>
        </div>
      )}
    </BaseCard>
  );
};

export default AdditionalInfoCard;