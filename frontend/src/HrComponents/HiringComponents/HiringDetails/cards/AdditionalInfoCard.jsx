import BaseCard from "../../../../components/UI/Card";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-200 text-sm">{value || "—"}</span>
  </div>
);

const AdditionalInfoCard = ({ applicant}) => {


  const { additionalQuestions } = applicant || {};

  const startDate = additionalQuestions?.earliestStartDate
    ? new Date(additionalQuestions.earliestStartDate).toLocaleDateString("en-GB")
    : null;

  return (
    <BaseCard className="flex flex-col gap-4">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
        Additional Info
      </p>

      {/* Info Rows */}
      <div>
        <InfoRow label="Work Preference" value={additionalQuestions?.workPreference} />
        <InfoRow label="Earliest Start"  value={startDate}                           />
      </div>

      {/* Motivation */}
      {additionalQuestions?.motivation && (
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Motivation</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {additionalQuestions.motivation}
          </p>
        </div>
      )}
    </BaseCard>
  );
};

export default AdditionalInfoCard;