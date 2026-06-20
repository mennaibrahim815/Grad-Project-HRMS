import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const inputCls = (field, errors, touched) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none
     transition-all
     ${touched[field] && errors[field]
        ? "border-red-500/50 focus:border-red-500/80"
        : "focus:border-blue-500/50"}`;

const selectCls = (field, errors, touched) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer
     transition-all
     ${touched[field] && errors[field] ? "border-red-500/50" : ""}`;

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

const Step1PersonalInfo = ({ formData, handleChange, handleBlur, errors, touched, onNext }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleChange({ target: { name: "avatar", value: file } });
        setPreview(URL.createObjectURL(file));
    };

    const fieldStyle = { background: "var(--input-bg)", borderColor: "var(--border-main)", color: "var(--text-main)" };

    return (
        <div
            style={{ background: "var(--bg-card)", borderColor: "var(--border-main)" }}
            className="border rounded-2xl p-6 flex flex-col gap-5"
        >
            <div>
                <h2 className="font-bold text-xl" style={{ color: "var(--text-main)" }}>Personal Information</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Tell us a bit about yourself</p>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{ background: "var(--input-bg)", borderColor: "var(--border-main)" }}
                    className="relative w-24 h-24 rounded-full border-2 border-dashed
                   hover:border-blue-500/60 transition-all cursor-pointer group overflow-hidden
                   flex items-center justify-center"
                >
                    {preview ? (
                        <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 transition-all" style={{ color: "var(--text-muted)" }}>
                            <i className="fas fa-camera text-xl" />
                            <span className="text-[10px]">Upload Photo</span>
                        </div>
                    )}
                    {preview && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                            transition-all flex items-center justify-center">
                            <i className="fas fa-camera text-white text-lg" />
                        </div>
                    )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {preview ? "Click to change photo" : "Profile photo (optional)"}
                </p>
            </div>

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="firstName" value={formData.firstName} onChange={handleChange}
                        onBlur={() => handleBlur("firstName")} placeholder="e.g. Amr"
                        style={fieldStyle} className={inputCls("firstName", errors, touched)}
                    />
                    <FieldError field="firstName" errors={errors} touched={touched} />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="lastName" value={formData.lastName} onChange={handleChange}
                        onBlur={() => handleBlur("lastName")} placeholder="e.g. Mohamed"
                        style={fieldStyle} className={inputCls("lastName", errors, touched)}
                    />
                    <FieldError field="lastName" errors={errors} touched={touched} />
                </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="email" type="email" value={formData.email} onChange={handleChange}
                        onBlur={() => handleBlur("email")} placeholder="you@example.com"
                        style={fieldStyle} className={inputCls("email", errors, touched)}
                    />
                    <FieldError field="email" errors={errors} touched={touched} />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="phone" value={formData.phone} onChange={handleChange}
                        onBlur={() => handleBlur("phone")} placeholder="010xxxxxxxx"
                        style={fieldStyle} className={inputCls("phone", errors, touched)}
                    />
                    <FieldError field="phone" errors={errors} touched={touched} />
                </div>
            </div>

            {/* Gender + Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Gender <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="gender" value={formData.gender} onChange={handleChange}
                        onBlur={() => handleBlur("gender")}
                        style={fieldStyle} className={selectCls("gender", errors, touched)}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <FieldError field="gender" errors={errors} touched={touched} />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Date of Birth</label>
                    <input
                        name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange}
                        style={fieldStyle}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm
                                   outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* City + Country */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>City</label>
                    <input
                        name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Cairo"
                        style={fieldStyle} className={inputCls("city", errors, touched)}
                    />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>Country</label>
                    <input
                        name="country" value={formData.country} onChange={handleChange} placeholder="e.g. Egypt"
                        style={fieldStyle} className={inputCls("country", errors, touched)}
                    />
                </div>
            </div>

            {/* Department + Experience Level */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Department <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="department" value={formData.department} onChange={handleChange}
                        onBlur={() => handleBlur("department")}
                        style={fieldStyle} className={selectCls("department", errors, touched)}
                    >
                        <option>UI Design</option>
                        <option>Marketing</option>
                        <option>Social Media</option>
                    </select>
                    <FieldError field="department" errors={errors} touched={touched} />
                </div>
                <div>
                    <label className="text-xs block mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Experience Level <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                        onBlur={() => handleBlur("experienceLevel")}
                        style={fieldStyle} className={selectCls("experienceLevel", errors, touched)}
                    >
                        <option>Junior</option>
                        <option value="Mid-Level">Mid</option>
                        <option>Senior</option>
                    </select>
                    <FieldError field="experienceLevel" errors={errors} touched={touched} />
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                           text-white text-sm font-semibold transition-all active:scale-95 mt-1"
            >
                Continue <i className="fas fa-arrow-right ml-1 text-xs" />
            </button>
        </div>
    );
};

export default Step1PersonalInfo;