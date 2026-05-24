import BaseCard from "../../../../components/UI/Card";

const SkillsCard = ({ applicant}) => {
 

  const skills = applicant?.professionalInfo?.skills || [];

  return (
    <BaseCard className="flex flex-col gap-4">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
        Skills
      </p>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No skills added.</p>
      )}
    </BaseCard>
  );
};

export default SkillsCard;