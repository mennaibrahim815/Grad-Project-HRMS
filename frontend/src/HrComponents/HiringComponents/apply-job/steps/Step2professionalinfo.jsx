import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const inputCls = (field, errors, touched) =>
    `w-full bg-white/5 border rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none
     transition-all placeholder:text-slate-600
     ${touched[field] && errors[field]
        ? "border-red-500/50 focus:border-red-500/80"
        : "border-white/10 focus:border-blue-500/50"}`;

const FieldError = ({ field, errors, touched }) => (
    <AnimatePresence>
        {touched[field] && errors[field] && (
            <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
            >
                <i className="fas fa-circle-exclamation text-[10px]" />
                {errors[field]}
            </motion.p>
        )}
    </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────
const Step2ProfessionalInfo = ({
    formData, handleChange, handleBlur, errors, touched,
    setFormData, onNext, onBack,
}) => {
    const [skillInput, setSkillInput] = useState("");

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (!trimmed || formData.skills.includes(trimmed)) return;
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput("");
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
    };

    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col gap-5">

            <div>
                <h2 className="text-white font-bold text-xl">Professional Information</h2>
                <p className="text-slate-400 text-sm mt-1">Your experience and qualifications</p>
            </div>

            {/* Education Level */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">
                    Education Level <span className="text-red-400">*</span>
                </label>
                <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    onBlur={() => handleBlur("educationLevel")}
                    className={`w-full bg-[#1e2a3a] border rounded-xl px-4 py-2.5 text-slate-100 text-sm
                                outline-none cursor-pointer transition-all
                                ${touched.educationLevel && errors.educationLevel
                                    ? "border-red-500/50" : "border-white/10"}`}
                >
                    <option>High School</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                    <option>PhD</option>
                </select>
                <FieldError field="educationLevel" errors={errors} touched={touched} />
            </div>

            {/* Years of Experience + Current Job Title */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-slate-400 text-xs block mb-1.5">Years of Experience</label>
                    <input
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        className={inputCls("yearsOfExperience", errors, touched)}
                    />
                </div>
                <div>
                    <label className="text-slate-400 text-xs block mb-1.5">Current Job Title</label>
                    <input
                        name="currentJobTitle"
                        value={formData.currentJobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Developer"
                        className={inputCls("currentJobTitle", errors, touched)}
                    />
                </div>
            </div>

            {/* Current Company */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">Current Company</label>
                <input
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    placeholder="e.g. Tech Corp"
                    className={inputCls("currentCompany", errors, touched)}
                />
            </div>

            {/* Skills tag input */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">Skills</label>

                {/* Tags */}
                {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        <AnimatePresence>
                            {formData.skills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full
                                               bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="text-blue-400/60 hover:text-blue-300 transition-colors"
                                    >
                                        <i className="fas fa-xmark text-[10px]" />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Type a skill and press Enter or Add"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                                   text-slate-100 text-sm outline-none focus:border-blue-500/50
                                   transition-all placeholder:text-slate-600"
                    />
                    <button
                        onClick={addSkill}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                                   text-slate-300 text-sm hover:bg-white/10 transition-all"
                    >
                        Add
                    </button>
                </div>
                <p className="text-slate-600 text-xs mt-1.5">Press Enter or click Add to add each skill</p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-1">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10
                               text-slate-400 text-sm font-medium hover:bg-white/10 transition-all"
                >
                    <i className="fas fa-arrow-left mr-1 text-xs" /> Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                               text-white text-sm font-semibold transition-all active:scale-95"
                >
                    Continue <i className="fas fa-arrow-right ml-1 text-xs" />
                </button>
            </div>
        </div>
    );
};

export default Step2ProfessionalInfo;