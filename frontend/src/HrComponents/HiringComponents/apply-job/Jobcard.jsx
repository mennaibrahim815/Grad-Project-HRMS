import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const DEPT_COLORS = {
    "UI Design":    "text-blue-400 bg-blue-500/10",
    "Marketing":    "text-yellow-400 bg-yellow-500/10",
    "Social Media": "text-pink-400 bg-pink-500/10",
    "Engineering":  "text-emerald-400 bg-emerald-500/10",
    "Product":      "text-purple-400 bg-purple-500/10",
    "People Ops":   "text-orange-400 bg-orange-500/10",
};

const getDeptColor = (dept) => DEPT_COLORS[dept] || "text-slate-400 bg-white/10";

const TAG_ICON = {
    experienceLevel: "fas fa-circle-half-stroke",
    workLocation:    "fas fa-location-dot",
    jobType:         "fas fa-clock",
};

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const { _id, title, description, department, experienceLevel, jobType, workLocation, createdAt } = job;

    const postedAgo = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : "";

    const tags = [
        { key: "experienceLevel", value: experienceLevel },
        { key: "workLocation",    value: workLocation },
        { key: "jobType",         value: jobType },
    ].filter((t) => t.value);

    return (
        // ← hover animation على الـ card نفسها
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex flex-col justify-between gap-4 p-5 rounded-2xl
                       bg-[#111c2b] border border-white/8
                       hover:border-white/15 hover:bg-[#13202f]
                       transition-colors duration-200 group h-full"
        >
            {/* Top */}
            <div>
                <span className={`inline-block text-[10px] font-bold tracking-widest uppercase
                                  px-2.5 py-1 rounded-md mb-3 ${getDeptColor(department)}`}>
                    {department}
                </span>

                <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-blue-100 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map(({ key, value }) => (
                    <span key={key}
                        className="flex items-center gap-1.5 text-slate-400 text-xs
                                   bg-white/5 border border-white/8 rounded-full px-3 py-1">
                        <i className={`${TAG_ICON[key]} text-[10px]`} />
                        {value}
                    </span>
                ))}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-slate-500 text-xs">Posted {postedAgo}</span>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/careers/apply/${_id}`)}
                    className="text-sm font-semibold text-white
                               bg-white/10 hover:bg-[#0095ff] border border-white/10 hover:border-[#0095ff]
                               px-4 py-2 rounded-xl transition-all duration-200"
                >
                    Apply Now
                </motion.button>
            </div>
        </motion.div>
    );
};

export default JobCard;