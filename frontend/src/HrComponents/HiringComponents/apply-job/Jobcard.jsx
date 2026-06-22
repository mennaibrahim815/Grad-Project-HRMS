import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import BaseCard from "../../../components/UI/Card";

const MotionBaseCard = motion(BaseCard);

const DEPT_COLORS = {
    "UI Design":    "text-[var(--pill-blue-text)] bg-[var(--pill-blue-bg)] border-[var(--pill-blue-border)]",
    "Marketing":    "text-[var(--pill-orange-text)] bg-[var(--pill-orange-bg)] border-[var(--pill-orange-border)]",
    "Social Media": "text-[var(--pill-red-text)] bg-[var(--pill-red-bg)] border-[var(--pill-red-border)]",
    "Engineering":  "text-[var(--pill-green-text)] bg-[var(--pill-green-bg)] border-[var(--pill-green-border)]",
    "Product":      "text-[var(--pill-blue-text)] bg-[var(--pill-blue-bg)] border-[var(--pill-blue-border)]",
    "People Ops":   "text-[var(--pill-orange-text)] bg-[var(--pill-orange-bg)] border-[var(--pill-orange-border)]",
};

const getDeptColor = (dept) => DEPT_COLORS[dept] || "text-[var(--text-muted)] bg-[var(--input-bg)] border-[var(--border-subtle)]";

const TAG_ICON = {
    experienceLevel: "fas fa-circle-half-stroke",
    workLocation:    "fas fa-location-dot",
    jobType:         "fas fa-clock",
    education:       "fas fa-graduation-cap",
    experienceYears: "fas fa-briefcase",
};

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const { 
        _id, 
        title, 
        description, 
        department, 
        experienceLevel, 
        jobType, 
        workLocation, 
        createdAt,
        requiredSkills,
        requiredExperienceYears,
        requiredEducationLevel
    } = job;

    const postedAgo = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : "";

    const tags = [
        { key: "experienceLevel", value: experienceLevel },
        { key: "workLocation",    value: workLocation },
        { key: "jobType",         value: jobType },
        { key: "education",       value: requiredEducationLevel },
        { key: "experienceYears", value: requiredExperienceYears ? `+${requiredExperienceYears} Years` : null },
    ].filter((t) => t.value);

    return (
        
        <MotionBaseCard
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            padding="p-0"
            className="flex flex-col justify-between h-full group
                       hover:border-[#0293FA] hover:shadow-[0_4px_20px_rgba(2,147,250,0.15)]
                       transition-all duration-300 overflow-hidden"
        >
            <div className="flex flex-col justify-between gap-4 p-5 h-full">
                
                {/* Top Section */}
                <div>
                    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase
                                      px-2.5 py-1 rounded-md mb-3 border ${getDeptColor(department)}`}>
                        {department}
                    </span>

                   
                    <h3 className="text-[var(--text-main)] font-bold text-lg leading-snug mb-2 group-hover:text-[#0293FA] transition-colors duration-300">
                        {title}
                    </h3>

                    <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>

                    {/* Skills */}
                    {requiredSkills && requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {requiredSkills.slice(0, 4).map((skill, index) => (
                                <span 
                                    key={index} 
                                    className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--input-bg)] border border-[var(--border-subtle)] px-2 py-0.5 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                            {requiredSkills.length > 4 && (
                                <span className="text-[10px] font-medium text-[var(--text-muted)] px-1 py-0.5">
                                    +{requiredSkills.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {tags.map(({ key, value }) => (
                        <span key={key}
                            className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs
                                       bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-full px-3 py-1">
                            <i className={`${TAG_ICON[key]} text-[10px]`} />
                            {value}
                        </span>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-[var(--border-main)] group-hover:border-[#0293FA]/30 transition-colors duration-300">
                    <span className="text-[var(--text-muted)] text-xs">Posted {postedAgo}</span>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/careers/apply/${_id}`)}
                        className="text-sm font-semibold text-[var(--pill-blue-text)]
                                   bg-[var(--pill-blue-bg)] border border-[var(--pill-blue-border)]
                                   hover:bg-[#0293FA] hover:text-white hover:border-[#0293FA]
                                   px-4 py-2 rounded-xl transition-all duration-300"
                    >
                        Apply Now
                    </motion.button>
                </div>
            </div>
        </MotionBaseCard>
    );
};

export default JobCard;