import BaseCard from  "../../../../Components/UI/Card"
import { motion } from "framer-motion";

const TimeWorkedCard = ({ timeWorked }) => {
  const { hours, minutes, activeTime, pauseTime, extraTime } = timeWorked || {}

  return (
    <BaseCard>
      <h3 className="text-white font-semibold text-lg mb-4">Total time worked</h3>

      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-4xl font-bold text-white">{hours}</span>
        <span className="text-slate-400 text-lg">hours</span>
        <span className="text-3xl font-bold text-white ml-2">{minutes}</span>
        <span className="text-slate-400 text-lg">min</span>
      </div>

     
      <div className="flex h-3 rounded-full overflow-hidden mb-4">

  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${activeTime}%` }}
    transition={{ duration: 1 }}
    className="bg-[#0095ff]"
  />

  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${pauseTime}%` }}
    transition={{ duration: 1, delay: 0.2 }}
    className="bg-emerald-500"
  />

  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${extraTime}%` }}
    transition={{ duration: 1, delay: 0.4 }}
    className="bg-slate-500"
    style={{
      backgroundImage:
        'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
    }}
  />

</div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0095ff]" />
          <span className="text-white font-medium">{activeTime}%</span>
          <span className="text-slate-500">Active time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-white font-medium">{pauseTime}%</span>
          <span className="text-slate-500">Pause time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span className="text-white font-medium">{extraTime}%</span>
          <span className="text-slate-500">Extra time</span>
        </div>
      </div>
    </BaseCard>
  )
}

export default TimeWorkedCard;
