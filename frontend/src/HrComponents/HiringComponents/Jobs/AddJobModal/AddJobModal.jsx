import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJob } from "../../../../store/HrSlices/Hiring/hiringSlice";
import Modal from "../../../../components/UI/Modal/Modal";
import ModalHeader from "../../../../components/UI/Modal/ModalHeader";
import SuccessCard from "../../../../components/UI/SuccessCard";


const AddJobModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { createLoading } = useSelector((state) => state.hiring);
    const [success, setSuccess] = useState(false);
    const [skillInput, setSkillInput] = useState("");  // ✅ كانت ناقصة
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "UI Design",
        experienceLevel: "Junior",
        jobType: "Full-time",
        workLocation: "On-site",
        status: "Open",
        requiredEducationLevel: "Bachelor's",
        requiredExperienceYears: "",
        requiredSkills: [],
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setError(null);
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "requiredExperienceYears" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!formData.requiredSkills.includes(skillInput.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    requiredSkills: [...prev.requiredSkills, skillInput.trim()],
                }));
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
        }));
    };

    const handleSubmit = () => {
        setError(null);
        dispatch(createJob(formData))
            .unwrap()
            .then(() => setSuccess(true))
            .catch((err) => {
                console.log("err in component:", err);

                let message;

                if (Array.isArray(err?.message)) {
                    message = err.message[0]?.message || "Something went wrong.";
                } else if (typeof err?.message === "string") {
                    message = err.message;
                } else if (Array.isArray(err)) {
                    message = err[0]?.message || "Something went wrong.";
                } else {
                    message = "Something went wrong.";
                }

                if (message.includes("duplicate") || message.includes("E11000")) {
                    setError("A job with this title already exists.");
                } else {
                    setError(message);
                }
            });
    };

    const handleDone = () => {
        setSuccess(false);
        setError(null);
        setSkillInput("");
        setFormData({
            title: "",
            description: "",
            department: "UI Design",
            experienceLevel: "Junior",
            jobType: "Full-time",
            workLocation: "On-site",
            status: "Open",
            requiredEducationLevel: "Bachelor's",
            requiredExperienceYears: "",
            requiredSkills: [],
        });
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            {success ? (
                <div className="p-6">
                    <SuccessCard
                        onDone={handleDone}
                        title="Job Created Successfully!"
                        description="The job post has been added. Applicants can now apply."
                        buttonText="Back to Jobs"
                    />
                </div>
            ) : (
                <>
                    <ModalHeader title="Create Job Post" onClose={onClose} />

                    <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto max-h-[80vh] custom-scrollbar">
                        <div>
                            <label className="text-slate-400 text-xs block mb-1.5">Job Title</label>
                            <input name="title" value={formData.title} onChange={handleChange}
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none focus:border-blue-500/50 placeholder:text-slate-600" />
                        </div>

                        <div>
                            <label className="text-slate-400 text-xs block mb-1.5">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange}
                                placeholder="Describe the role and responsibilities..." rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none focus:border-blue-500/50 placeholder:text-slate-600 resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Department</label>
                                <select name="department" value={formData.department} onChange={handleChange}
                                    className="w-full bg-[#1e2a3a] border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer">
                                    <option>Software Engineering</option>
                                    <option>Marketing</option>
                                    <option>Design</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Experience Level</label>
                                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                                    className="w-full bg-[#1e2a3a] border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer">
                                    <option>Junior</option>
                                    <option>Mid</option>
                                    <option>Senior</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Job Type</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange}
                                    className="w-full bg-[#1e2a3a] border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Work Location</label>
                                <select name="workLocation" value={formData.workLocation} onChange={handleChange}
                                    className="w-full bg-[#1e2a3a] border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer">
                                    <option>On-site</option>
                                    <option>Remote</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {/* ✅ حقلين جدد */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Required Education</label>
                                <select name="requiredEducationLevel" value={formData.requiredEducationLevel} onChange={handleChange}
                                    className="w-full bg-[#1e2a3a] border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer">
                                    <option>High School</option>
                                    <option>Bachelor's</option>
                                    <option>Master's</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs block mb-1.5">Years of Experience</label>
                                <input type="number" min="0" name="requiredExperienceYears"
                                    value={formData.requiredExperienceYears} onChange={handleChange}
                                    placeholder="e.g. 3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none focus:border-blue-500/50 placeholder:text-slate-600" />
                            </div>
                        </div>

                        {/* ✅ حقل الـ Skills */}
                        <div>
                            <label className="text-slate-400 text-xs block mb-1.5">Required Skills</label>
                            <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-h-[42px] items-center">
                                {formData.requiredSkills.map((skill) => (
                                    <span key={skill} className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full">
                                        {skill}
                                        <i className="fas fa-times text-[10px] cursor-pointer" onClick={() => removeSkill(skill)}></i>
                                    </span>
                                ))}
                                <input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Add skill..."
                                    className="bg-transparent outline-none text-slate-100 text-sm flex-1 min-w-[80px] placeholder:text-slate-600"
                                />
                            </div>
                            <p className="text-slate-600 text-xs mt-1">Press Enter to add a skill</p>
                        </div>

                        <div>
                            <label className="text-slate-400 text-xs block mb-1.5">Status</label>
                            <div className="flex gap-3">
                                {["Open", "Closed"].map((s) => (
                                    <label key={s} className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-pointer border transition-all
                                        ${formData.status === s ? "bg-blue-500/10 border-blue-500/30" : "bg-white/3 border-white/10"}`}>
                                        <input type="radio" name="status" value={s}
                                            checked={formData.status === s} onChange={handleChange}
                                            className="accent-blue-500" />
                                        <span className={`text-sm ${formData.status === s ? "text-blue-400" : "text-slate-400"}`}>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* ✅ لون الـ error اتغير لـ #EC3A76 */}
                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                style={{ background: "rgba(236,58,118,0.1)", border: "1px solid rgba(236,58,118,0.2)" }}>
                                <i className="fas fa-circle-exclamation text-sm" style={{ color: "#EC3A76" }}></i>
                                <p className="text-sm" style={{ color: "#EC3A76" }}>{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={createLoading}
                                className="flex-1 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd] text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60">
                                {createLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <i className="fas fa-spinner fa-spin text-sm"></i>
                                        Creating...
                                    </span>
                                ) : "Create Job"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default AddJobModal;