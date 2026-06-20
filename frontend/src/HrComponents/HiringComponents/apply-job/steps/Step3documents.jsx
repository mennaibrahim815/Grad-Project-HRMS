import { useRef } from "react";
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
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
            >
                <i className="fas fa-circle-exclamation text-[10px]" />
                {errors[field]}
            </motion.p>
        )}
    </AnimatePresence>
);

const Step3Documents = ({
    formData, handleChange, handleBlur, errors, touched,
    setFormData, onSubmit, onBack, loading, apiError,
}) => {
    const fileRef = useRef();
    const fieldStyle = { background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-main)" };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, resume: file }));
    };

    return (
        <div style={{ background: "var(--bg-card)", borderColor: "var(--border-main)" }} className="border rounded-2xl p-6 flex flex-col gap-5">

            <div>
                <h2 className="font-bold text-xl" style={{ color: "var(--text-main)" }}>Documents & Final Steps</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Almost there — upload your resume and answer a few questions</p>
            </div>

            {/* Resume Upload */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Resume / CV <span className="text-red-400">*</span>
                </label>
                <div
                    onClick={() => fileRef.current.click()}
                    style={
                        touched.resume && errors.resume
                            ? { borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.05)" }
                            : formData.resume
                            ? { borderColor: "rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.05)" }
                            : { borderColor: "var(--border-main)", background: "var(--input-bg)" }
                    }
                    className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:opacity-90"
                >
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    {formData.resume ? (
                        <>
                            <i className="fas fa-file-check text-blue-400 text-2xl" />
                            <p className="text-blue-400 text-sm font-medium">{formData.resume.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Click to replace</p>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-cloud-arrow-up text-2xl" style={{ color: "var(--text-muted)" }} />
                            <p className="text-sm" style={{ color: "var(--text-main)" }}>Click to upload your resume</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>PDF, DOC, DOCX supported</p>
                        </>
                    )}
                </div>
                <FieldError field="resume" errors={errors} touched={touched} />
            </div>

            {/* Portfolio */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Portfolio URL</label>
                <input
                    name="portfolio" value={formData.portfolio} onChange={handleChange}
                    placeholder="https://your-portfolio.com"
                    style={fieldStyle} className={inputCls("portfolio", errors, touched)}
                />
            </div>

            {/* Work Preference */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Work Preference <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                    {["Remote", "On-site", "Hybrid"].map((opt) => (
                        <label
                            key={opt}
                            style={
                                formData.workPreference === opt
                                    ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }
                                    : { background: "var(--input-bg)", borderColor: "var(--border-main)" }
                            }
                            className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-pointer border transition-all hover:opacity-90"
                        >
                            <input
                                type="radio" name="workPreference" value={opt}
                                checked={formData.workPreference === opt} onChange={handleChange}
                                className="accent-blue-500"
                            />
                            <span
                                className="text-sm"
                                style={{ color: formData.workPreference === opt ? "#3b82f6" : "var(--text-muted)" }}
                            >
                                {opt}
                            </span>
                        </label>
                    ))}
                </div>
                <FieldError field="workPreference" errors={errors} touched={touched} />
            </div>

            {/* Earliest Start Date */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Earliest Start Date <span className="text-red-400">*</span>
                </label>
                <input
                    name="earliestStartDate" type="date" value={formData.earliestStartDate}
                    onChange={handleChange} onBlur={() => handleBlur("earliestStartDate")}
                    style={fieldStyle}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500/50"
                />
                <FieldError field="earliestStartDate" errors={errors} touched={touched} />
            </div>

            {/* Motivation */}
            <div>
                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Why do you want this job? <span className="text-red-400">*</span>
                </label>
                <textarea
                    name="motivation" value={formData.motivation} onChange={handleChange}
                    onBlur={() => handleBlur("motivation")} rows={4}
                    placeholder="Share your motivation and why you're a great fit..."
                    style={fieldStyle} className={`resize-none ${inputCls("motivation", errors, touched)}`}
                />
                <FieldError field="motivation" errors={errors} touched={touched} />
            </div>

            {/* API Error */}
            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                        <i className="fas fa-circle-exclamation text-red-400 text-sm" />
                        <p className="text-red-400 text-sm">{apiError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-1">
                <button
                    type="button" onClick={onBack} disabled={loading}
                    style={{ background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                    className="flex-1 py-3 rounded-xl border text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-all"
                >
                    <i className="fas fa-arrow-left mr-1 text-xs" /> Back
                </button>
                <button
                    type="button" onClick={onSubmit} disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                               text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className="fas fa-spinner fa-spin text-sm" /> Submitting...
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