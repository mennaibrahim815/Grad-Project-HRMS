import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateJob } from "../../../../store/HrSlices/Hiring/hiringSlice";
import Modal from "../../../../components/UI/Modal/Modal";
import ModalHeader from "../../../../components/UI/Modal/ModalHeader";
import SuccessCard from "../../../../components/UI/SuccessCard";

const EditJobModal = ({ isOpen, onClose, job }) => {
    const dispatch = useDispatch();
    const { updateJobLoading } = useSelector((state) => state.hiring);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "UI Design",
        experienceLevel: "Junior",
        jobType: "Full-time",
        workLocation: "On-site",
        status: "Open",
    });

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                description: job.description || "",
                department: job.department || "UI Design",
                experienceLevel: job.experienceLevel || "Junior",
                jobType: job.jobType || "Full-time",
                workLocation: job.workLocation || "On-site",
                status: job.status || "Open",
            });
        }
    }, [job]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        setError(null);
        dispatch(updateJob({ id: job._id, data: formData }))
            .unwrap()
            .then(() => setSuccess(true))
            .catch((err) => {
                const msg = Array.isArray(err)
                    ? err[0]?.message
                    : err?.message || "Something went wrong.";
                setError(msg);
            });
    };

    const handleDone = () => {
        setSuccess(false);
        onClose();
    };

    const fieldStyle = { background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-main)" };

    return (
        <Modal open={isOpen} onClose={onClose}>
            {success ? (
                <div className="p-6">
                    <SuccessCard
                        onDone={handleDone}
                        title="Job Updated Successfully!"
                        description="The job post has been updated."
                        buttonText="Back to Job"
                    />
                </div>
            ) : (
                <>
                    <ModalHeader title="Edit Job Post" onClose={onClose} />

                    <div className="flex flex-col gap-4 px-6 py-5">

                        {/* Title */}
                        <div>
                            <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Job Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                style={fieldStyle}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                style={fieldStyle}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 resize-none"
                            />
                        </div>

                        {/* Department + Experience */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Department</label>
                                <select name="department" value={formData.department} onChange={handleChange}
                                    style={fieldStyle}
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer">
                                    <option>UI Design</option>
                                    <option>Social Media</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Experience Level</label>
                                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                                    style={fieldStyle}
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer">
                                    <option>Junior</option>
                                    <option>Mid</option>
                                    <option>Senior</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Type + Work Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Job Type</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange}
                                    style={fieldStyle}
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Work Location</label>
                                <select name="workLocation" value={formData.workLocation} onChange={handleChange}
                                    style={fieldStyle}
                                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer">
                                    <option>On-site</option>
                                    <option>Remote</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Status</label>
                            <div className="flex gap-3">
                                {["Open", "Closed"].map((s) => (
                                    <label
                                        key={s}
                                        style={
                                            formData.status === s
                                                ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }
                                                : { background: "var(--input-bg)", borderColor: "var(--border-main)" }
                                        }
                                        className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-pointer border transition-all"
                                    >
                                        <input type="radio" name="status" value={s}
                                            checked={formData.status === s}
                                            onChange={handleChange}
                                            className="accent-blue-500" />
                                        <span
                                            className="text-sm"
                                            style={{ color: formData.status === s ? "#3b82f6" : "var(--text-muted)" }}
                                        >
                                            {s}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                            >
                                <i className="fas fa-circle-exclamation text-red-400 text-sm" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 mt-2">
                            <button
                                type="button" onClick={onClose}
                                style={{ background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                                className="flex-1 py-3 rounded-xl border text-sm font-medium hover:opacity-80 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="button" onClick={handleSubmit} disabled={updateJobLoading}
                                className="flex-1 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                                           text-white text-sm font-semibold transition-all
                                           active:scale-95 disabled:opacity-60">
                                {updateJobLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <i className="fas fa-spinner fa-spin text-sm" />
                                        Saving...
                                    </span>
                                ) : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default EditJobModal;