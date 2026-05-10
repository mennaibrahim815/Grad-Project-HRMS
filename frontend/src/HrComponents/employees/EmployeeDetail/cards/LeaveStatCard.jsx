import BaseCard from "../../../../Components/UI/Card"

const LeaveStatCard = ({ title, value, description }) => {
  return (
    <BaseCard className="flex flex-col justify-between h-full min-h-[120px] transition-all hover:border-blue-500/30">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <div className="mt-2">
        <span className="text-4xl font-bold text-white">{value}</span>
      </div>
      <p className="text-slate-500 text-xs mt-2 leading-relaxed">{description}</p>
    </BaseCard>
  )
}

export default LeaveStatCard