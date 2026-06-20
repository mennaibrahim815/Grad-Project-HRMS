import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const inputCls = (field, errors, touched) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none
     transition-all
     ${touched[field] && errors[field]
        ? "border-red-500/50 focus:border-red-500/80"
        : "focus:border-blue-500/50"}`;

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
    const fieldStyle = { background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-main)" };

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
        <div
            style={{ background: "var(--bg-card)", borderColor: "var(--border-main)" }}
            className="border rounded-2xl p-6 flex flex-col gap-5"
        >
            <div>
                <h2 className="font-bold text-xl" style={{ color: "var(--text-main)" }}>Professional Information</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Your experience and qualifications</p>
            </div>

            {/* Education Level */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Education Level <span className="text-red-400">*</span>
                </label>
                <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    onBlur={() => handleBlur("educationLevel")}
                    style={fieldStyle}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm
                                outline-none cursor-pointer transition-all
                                ${touched.educationLevel && errors.educationLevel ? "border-red-500/50" : ""}`}
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
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Years of Experience</label>
                    <input
                        name="yearsOfExperience" type="number" min="0"
                        value={formData.yearsOfExperience} onChange={handleChange}
                        placeholder="e.g. 3"
                        style={fieldStyle} className={inputCls("yearsOfExperience", errors, touched)}
                    />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Current Job Title</label>
                    <input
                        name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange}
                        placeholder="e.g. Frontend Developer"
                        style={fieldStyle} className={inputCls("currentJobTitle", errors, touched)}
                    />
                </div>
            </div>

            {/* Current Company */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Current Company</label>
                <input
                    name="currentCompany" value={formData.currentCompany} onChange={handleChange}
                    placeholder="e.g. Tech Corp"
                    style={fieldStyle} className={inputCls("currentCompany", errors, touched)}
                />
            </div>

            {/* Skills tag input */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Skills</label>

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

                <div className="flex gap-2">
                    <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Type a skill and press Enter or Add"
                        style={fieldStyle}
                        className="flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all"
                    />
                    <button
                        onClick={addSkill}
                        style={{ background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                        className="px-4 py-2.5 rounded-xl border text-sm hover:opacity-80 transition-all"
                    >
                        Add
                    </button>
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>Press Enter or click Add to add each skill</p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-1">
                <button
                    onClick={onBack}
                    style={{ background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                    className="flex-1 py-3 rounded-xl border text-sm font-medium hover:opacity-80 transition-all"
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