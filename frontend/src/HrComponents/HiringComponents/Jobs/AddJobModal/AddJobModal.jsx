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
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "UI Design",
        experienceLevel: "Junior",
        jobType: "Full-time",
        workLocation: "On-site",
        status: "Open",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setError(null);
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                    // { status: "fail", message: [{field, message}] }
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
        setFormData({
            title: "",
            description: "",
            department: "UI Design",
            experienceLevel: "Junior",
            jobType: "Full-time",
            workLocation: "On-site",
            status: "Open",
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

                    <div className="flex flex-col gap-4 px-6 py-5">
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
                                    <option>UI Design</option>
                                    <option>Social Media</option>
                                    <option>Marketing</option>
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
                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <i className="fas fa-circle-exclamation text-red-400 text-sm"></i>
                                <p className="text-red-400 text-sm">{error}</p>
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