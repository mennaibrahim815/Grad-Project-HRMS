import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../../../../components/UI/Card";
import { useDispatch } from "react-redux";
import { updateApplicantStatus, onboardApplicant } from "../../../../store/HrSlices/Hiring/hiringSlice";

const statusOptions = {
  Applied: ["Interviewing", "Rejected"],
  Interviewing: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};


const CustomModal = ({ open, onClose, children, maxWidth = "max-w-[420px]" }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{ background: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--border-main)' }}
            className={`relative w-full ${maxWidth} rounded-3xl shadow-2xl border p-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CandidateProfileCard = ({ applicant, loading }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // ── Onboarding Form States ──
  const [onboardModal, setOnboardModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "EMPLOYEE",
    rfidTag: "",
    phone: "",
    gender: "Male",
    address: "",
    avatar: "",
    expCompany: "",
    expPosition: "",
    expJobType: "Full-time",
    expBaseSalary: "",
    expStartDate: "",
    expEndDate: "",
    jobTitle: "",
    department: "",
    workLocation: "cairo",
    jobType: "Full-time",
    workingHours: 8,
    joiningDate: "",
    baseSalary: "",
    status: "Active",
    annualLeaves: 21,
    sickLeaves: 30,
    casualLeaves: 6,
  });

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const { personalInfo, status, _id } = applicant || {};
  const fullName = `${personalInfo?.firstName || ""} ${personalInfo?.lastName || ""}`.trim();
  const options = statusOptions[status] || [];

  const handleOpen = () => {
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const close = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleStatusChange = (newStatus) => {
    setOpen(false);
    if (newStatus === "Rejected") {
      setRejectModal(true);
      return;
    }
    
    if (newStatus === "Hired") {
      setFormData({
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
        email: personalInfo?.email || "", 
        role: "EMPLOYEE",
        rfidTag: "", 
        phone: personalInfo?.phone || "",
        gender: personalInfo?.gender || "Male",
        address: personalInfo?.address || "",
        avatar: personalInfo?.avatar || "",
        expCompany: applicant?.experience?.company || "",
        expPosition: applicant?.experience?.position || "",
        expJobType: applicant?.experience?.jobType || "Full-time",
        expBaseSalary: applicant?.experience?.baseSalary || "",
        expStartDate: applicant?.experience?.startDate ? applicant.experience.startDate.substring(0, 10) : "",
        expEndDate: applicant?.experience?.endDate ? applicant.experience.endDate.substring(0, 10) : "",
        jobTitle: personalInfo?.position || personalInfo?.jobTitle || "",
        department: personalInfo?.department || "",
        workLocation: "cairo",
        jobType: personalInfo?.jobType || "Full-time",
        workingHours: 8,
        joiningDate: new Date().toISOString().substring(0, 10),
        baseSalary: personalInfo?.expectedSalary || "", 
        status: "Active",
        annualLeaves: 21,
        sickLeaves: 30,
        casualLeaves: 6,
      });
      setOnboardModal(true);
      return;
    }

    dispatch(updateApplicantStatus({ id: _id, status: newStatus }));
  };

  const handleConfirmReject = () => {
    dispatch(updateApplicantStatus({ id: _id, status: "Rejected", rejectionReason }));
    setRejectModal(false);
    setRejectionReason("");
  };

  const handleConfirmOnboard = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    data.append("general[firstName]", formData.firstName);
    data.append("general[lastName]", formData.lastName);
    data.append("general[email]", formData.email);
    data.append("general[role]", formData.role);
    data.append("general[rfidTag]", formData.rfidTag);
    data.append("general[phone]", formData.phone);
    data.append("general[gender]", formData.gender);
    data.append("general[address]", formData.address);
    if(formData.avatar) data.append("general[avatar]", formData.avatar);

    if(formData.expCompany) data.append("experience[company]", formData.expCompany);
    if(formData.expPosition) data.append("experience[position]", formData.expPosition);
    if(formData.expJobType) data.append("experience[jobType]", formData.expJobType);
    if(formData.expBaseSalary) data.append("experience[baseSalary]", formData.expBaseSalary);
    if(formData.expStartDate) data.append("experience[startDate]", formData.expStartDate);
    if(formData.expEndDate) data.append("experience[endDate]", formData.expEndDate);

    data.append("employee[jobTitle]", formData.jobTitle);
    data.append("employee[department]", formData.department);
    data.append("employee[workLocation]", formData.workLocation);
    data.append("employee[jobType]", formData.jobType);
    data.append("employee[workingHours]", formData.workingHours);
    data.append("employee[joiningDate]", formData.joiningDate);
    data.append("employee[baseSalary]", formData.baseSalary);
    data.append("employee[status]", formData.status);
    data.append("employee[leaveBalance][annual]", formData.annualLeaves);
    data.append("employee[leaveBalance][sick]", formData.sickLeaves);
    data.append("employee[leaveBalance][casual]", formData.casualLeaves);

    dispatch(onboardApplicant({ id: _id, onboardData: data }));
    setOnboardModal(false);
  };

  if (loading) {
    return (
      <BaseCard className="flex items-center justify-center py-10">
        <i className="fas fa-spinner fa-spin text-2xl" style={{ color: "#0293FA" }}></i>
      </BaseCard>
    );
  }

  return (
    <>
      <BaseCard className="flex flex-col items-center text-center gap-4">
        <img
          src={personalInfo?.avatar || "/uploads/default-avatar.png"}
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover ring-2"
          style={{ ringColor: "#0293FA" }}
        />

        <div>
          <p className="font-semibold text-lg" style={{ color: 'var(--text-main)' }}>{fullName || "—"}</p>
          <p className="text-sm mt-1" style={{ color: '#B0B4B4' }}>{personalInfo?.department || "—"}</p>
        </div>

        {options.length > 0 ? (
          <>
            <button
              ref={btnRef}
              onClick={handleOpen}
              style={{ background: 'var(--tab-inactive-bg)', color: 'var(--text-main)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:opacity-80 text-sm transition-all border"
            >
              {status}
              <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}></i>
            </button>

            {open && createPortal(
              <div
                ref={menuRef}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-main)',
                }}
                className="border rounded-2xl overflow-hidden shadow-2xl min-w-[160px]"
              >
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStatusChange(opt)}
                    style={{ color: opt === "Rejected" ? "#EC3A76" : opt === "Hired" ? "#4BFFB2" : "#0293FA" }}
                    className="w-full px-4 py-2.5 text-sm transition-all text-left hover:bg-white/5 font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </>
        ) : (
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: status === "Hired" ? "rgba(75, 255, 178, 0.12)" : "rgba(236, 58, 118, 0.12)",
              color: status === "Hired" ? "#4BFFB2" : "#EC3A76",
              borderColor: status === "Hired" ? "rgba(75, 255, 178, 0.3)" : "rgba(236, 58, 118, 0.3)",
            }}
          >
            {status}
          </span>
        )}
      </BaseCard>

    
      {createPortal(
        <CustomModal open={rejectModal} onClose={() => { setRejectModal(false); setRejectionReason(""); }}>
          <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4" style={{ backgroundColor: "rgba(236, 58, 118, 0.15)" }}>
            <i className="fas fa-circle-xmark text-xl" style={{ color: "#EC3A76" }} />
          </div>
          <h3 className="text-center font-bold text-xl mb-1">Reject Applicant</h3>
          <p className="text-center text-sm mb-4" style={{ color: '#B0B4B4' }}>Please provide a reason for rejection.</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Write the reason here..."
            rows={3}
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
            className="w-full border rounded-2xl px-4 py-3 text-sm outline-none resize-none mb-4 focus:border-[#EC3A76] transition-all"
          />
          <div className="flex gap-3">
            <button type="button" onClick={() => { setRejectModal(false); setRejectionReason(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-600 hover:bg-white/5 transition-all">Cancel</button>
            <button type="button" onClick={handleConfirmReject} disabled={!rejectionReason.trim()} style={{ backgroundColor: "#EC3A76" }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-40">Confirm Reject</button>
          </div>
        </CustomModal>,
        document.body
      )}

      
      {createPortal(
        <CustomModal open={onboardModal} onClose={() => setOnboardModal(false)} maxWidth="max-w-3xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3" style={{ backgroundColor: "rgba(75, 255, 178, 0.15)" }}>
            <i className="fas fa-user-plus text-xl" style={{ color: "#4BFFB2" }} />
          </div>
          <h3 className="text-center font-bold text-2xl mb-1">Employee Onboarding</h3>
          <p className="text-center text-xs mb-6" style={{ color: '#B0B4B4' }}>Verify details before registering the applicant into the system.</p>

          <form onSubmit={handleConfirmOnboard} className="space-y-6 text-left">
            
            {/* 1. General Info */}
            <div>
              <h4 className="text-sm font-bold border-b pb-1 mb-3" style={{ color: "#0293FA", borderColor: "rgba(2, 147, 250, 0.2)" }}>1. General Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0293FA]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0293FA]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "#4BFFB2" }}>Official Email *</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#4BFFB2]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "#4BFFB2" }}>RFID Tag ID *</label>
                  <input required type="text" value={formData.rfidTag} onChange={(e) => setFormData({...formData, rfidTag: e.target.value})} placeholder="e.g. A1B2C3D4" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#4BFFB2]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Phone *</label>
                  <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0293FA]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0293FA]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold block mb-1">Residential Address *</label>
                  <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0293FA]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
              </div>
            </div>

            {/* 2. Deployment Details */}
            <div>
              <h4 className="text-sm font-bold border-b pb-1 mb-3" style={{ color: "#F89B49", borderColor: "rgba(248, 155, 73, 0.2)" }}>2. Deployment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Job Title *</label>
                  <input required type="text" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Department *</label>
                  <input required type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Work Location *</label>
                  <input required type="text" value={formData.workLocation} onChange={(e) => setFormData({...formData, workLocation: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Job Type</label>
                  <select value={formData.jobType} onChange={(e) => setFormData({...formData, jobType: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Working Hours *</label>
                  <input required type="number" min={4} max={12} value={formData.workingHours} onChange={(e) => setFormData({...formData, workingHours: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Base Salary (EGP) *</label>
                  <input required type="number" value={formData.baseSalary} onChange={(e) => setFormData({...formData, baseSalary: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Joining Date *</label>
                  <input required type="date" value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#F89B49]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
              </div>
            </div>

            {/* 3. Initial Leave Balance */}
            <div>
              <h4 className="text-sm font-bold border-b pb-1 mb-3" style={{ color: "#4BFFB2", borderColor: "rgba(75, 255, 178, 0.2)" }}>3. Initial Leave Balance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Annual</label>
                  <input type="number" value={formData.annualLeaves} onChange={(e) => setFormData({...formData, annualLeaves: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#4BFFB2]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Sick</label>
                  <input type="number" value={formData.sickLeaves} onChange={(e) => setFormData({...formData, sickLeaves: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#4BFFB2]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Casual</label>
                  <input type="number" value={formData.casualLeaves} onChange={(e) => setFormData({...formData, casualLeaves: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#4BFFB2]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
              </div>
            </div>

            {/* 4. Previous Experience */}
            <div>
              <h4 className="text-sm font-bold border-b pb-1 mb-3" style={{ color: "#B0B4B4", borderColor: "rgba(176, 180, 180, 0.2)" }}>4. Previous Experience</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Company</label>
                  <input type="text" value={formData.expCompany} onChange={(e) => setFormData({...formData, expCompany: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Position</label>
                  <input type="text" value={formData.expPosition} onChange={(e) => setFormData({...formData, expPosition: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Job Type</label>
                  <select value={formData.expJobType} onChange={(e) => setFormData({...formData, expJobType: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Previous Salary</label>
                  <input type="number" value={formData.expBaseSalary} onChange={(e) => setFormData({...formData, expBaseSalary: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Start Date</label>
                  <input type="date" value={formData.expStartDate} onChange={(e) => setFormData({...formData, expStartDate: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">End Date</label>
                  <input type="date" value={formData.expEndDate} onChange={(e) => setFormData({...formData, expEndDate: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B0B4B4]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }} />
                </div>
              </div>
            </div>

          
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setOnboardModal(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-gray-600 hover:bg-white/5 transition-all text-center">
                Cancel
              </button>
              <button type="submit" style={{ backgroundColor: "#0293FA" }} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-blue-500/10 hover:opacity-90 transition-all text-center">
                Confirm & Onboard
              </button>
            </div>

          </form>
        </CustomModal>,
        document.body
      )}
    </>
  );
};

export default CandidateProfileCard;