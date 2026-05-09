import BaseCard from "../../../../Components/UI/Card"

const ProjectProgressItem = ({ name, progress, color }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <span className="text-white text-sm">{name}</span>
      <span className="text-slate-400 text-sm">{progress}%</span>
    </div>
    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
    </div>
  </div>
)

const ProjectCompletionCard = ({projects = [] }) => {
  return (
    <BaseCard>
      <h3 className="text-white font-semibold text-lg mb-5">Project completion</h3>

      <div>
        {projects.map(project => (
          <ProjectProgressItem
            key={project.id}
            name={project.name}
            progress={project.progress}
            color={project.color}
          />
        ))}
      </div>
    </BaseCard>
  )
}

export default ProjectCompletionCard