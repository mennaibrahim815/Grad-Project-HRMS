import { useRef } from "react";
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
const Step3Documents = ({
    formData, handleChange, handleBlur, errors, touched,
    setFormData, onSubmit, onBack, loading, apiError,
}) => {
    const fileRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, resume: file }));
        if (errors.resume) {
            // clear resume error
        }
    };

    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col gap-5">

            <div>
                <h2 className="text-white font-bold text-xl">Documents & Final Steps</h2>
                <p className="text-slate-400 text-sm mt-1">Almost there — upload your resume and answer a few questions</p>
            </div>

            {/* Resume Upload */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">
                    Resume / CV <span className="text-red-400">*</span>
                </label>

                <div
                    onClick={() => fileRef.current.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed
                                cursor-pointer transition-all
                                ${touched.resume && errors.resume
                                    ? "border-red-500/40 bg-red-500/5"
                                    : formData.resume
                                    ? "border-blue-500/40 bg-blue-500/5"
                                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"}`}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {formData.resume ? (
                        <>
                            <i className="fas fa-file-check text-blue-400 text-2xl" />
                            <p className="text-blue-400 text-sm font-medium">{formData.resume.name}</p>
                            <p className="text-slate-500 text-xs">Click to replace</p>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-cloud-arrow-up text-slate-500 text-2xl" />
                            <p className="text-slate-300 text-sm">Click to upload your resume</p>
                            <p className="text-slate-600 text-xs">PDF, DOC, DOCX supported</p>
                        </>
                    )}
                </div>
                <FieldError field="resume" errors={errors} touched={touched} />
            </div>

            {/* Portfolio */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">Portfolio URL</label>
                <input
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://your-portfolio.com"
                    className={inputCls("portfolio", errors, touched)}
                />
            </div>

            {/* Work Preference */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">
                    Work Preference <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                    {["Remote", "On-site", "Hybrid"].map((opt) => (
                        <label
                            key={opt}
                            className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5
                                        cursor-pointer border transition-all
                                        ${formData.workPreference === opt
                                            ? "bg-blue-500/10 border-blue-500/30"
                                            : "bg-white/3 border-white/10 hover:bg-white/5"}`}
                        >
                            <input
                                type="radio"
                                name="workPreference"
                                value={opt}
                                checked={formData.workPreference === opt}
                                onChange={handleChange}
                                className="accent-blue-500"
                            />
                            <span className={`text-sm ${formData.workPreference === opt ? "text-blue-400" : "text-slate-400"}`}>
                                {opt}
                            </span>
                        </label>
                    ))}
                </div>
                <FieldError field="workPreference" errors={errors} touched={touched} />
            </div>

            {/* Earliest Start Date */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">
                    Earliest Start Date <span className="text-red-400">*</span>
                </label>
                <input
                    name="earliestStartDate"
                    type="date"
                    value={formData.earliestStartDate}
                    onChange={handleChange}
                    onBlur={() => handleBlur("earliestStartDate")}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-slate-100 text-sm
                                outline-none transition-all [color-scheme:dark]
                                ${touched.earliestStartDate && errors.earliestStartDate
                                    ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50"}`}
                />
                <FieldError field="earliestStartDate" errors={errors} touched={touched} />
            </div>

            {/* Motivation */}
            <div>
                <label className="text-slate-400 text-xs block mb-1.5">
                    Why do you want this job? <span className="text-red-400">*</span>
                </label>
                <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    onBlur={() => handleBlur("motivation")}
                    rows={4}
                    placeholder="Share your motivation and why you're a great fit..."
                    className={`resize-none ${inputCls("motivation", errors, touched)}`}
                />
                <FieldError field="motivation" errors={errors} touched={touched} />
            </div>

            {/* API Error */}
            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl
                                   bg-red-500/10 border border-red-500/20"
                    >
                        <i className="fas fa-circle-exclamation text-red-400 text-sm" />
                        <p className="text-red-400 text-sm">{apiError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-1">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10
                               text-slate-400 text-sm font-medium hover:bg-white/10
                               disabled:opacity-50 transition-all"
                >
                    <i className="fas fa-arrow-left mr-1 text-xs" /> Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                               text-white text-sm font-semibold transition-all
                               active:scale-95 disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className="fas fa-spinner fa-spin text-sm" />
                            Submitting...
                        </span>
                    ) : (
                        <>Submit Application <i className="fas fa-paper-plane ml-1 text-xs" /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Step3Documents;