import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import BaseCard from "../../../../components/UI/Card";
import { useDispatch } from "react-redux";
import { updateApplicantStatus } from "../../../../store/HrSlices/Hiring/hiringSlice";

const statusOptions = {
  Applied: ["Interviewing", "Rejected"],
  Interviewing: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

const CandidateProfileCard = ({ applicant, loading }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
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
    dispatch(updateApplicantStatus({ id: _id, status: newStatus }));
  };

  const handleConfirmReject = () => {
    dispatch(updateApplicantStatus({ id: _id, status: "Rejected", rejectionReason }));
    setRejectModal(false);
    setRejectionReason("");
  };

  if (loading) {
    return (
      <BaseCard className="flex items-center justify-center py-10">
        <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
      </BaseCard>
    );
  }

  return (
    <>
      <BaseCard className="flex flex-col items-center text-center gap-4">
        <img
          src={personalInfo?.avatar}
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500/30"
        />

        <div>
          <p className="font-semibold text-lg" style={{ color: 'var(--text-main)' }}>{fullName || "—"}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{personalInfo?.department || "—"}</p>
        </div>

        {options.length > 0 ? (
          <>
            <button
              ref={btnRef}
              onClick={handleOpen}
              style={{ background: 'var(--tab-inactive-bg)', color: 'var(--text-main)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:opacity-80 text-sm transition-all"
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
                className="border rounded-xl overflow-hidden shadow-2xl min-w-[160px]"
              >
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStatusChange(opt)}
                    style={{ color: opt === "Rejected" ? "#EC3A76" : 'var(--text-muted)' }}
                    className="w-full px-4 py-2.5 text-sm transition-all text-left hover:opacity-70"
                  >
                    {opt}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </>
        ) : (
          <span className={`px-4 py-1.5 rounded-full text-xs font-medium border
            ${status === "Hired" ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40" : ""}
            ${status === "Rejected" ? "text-[#EC3A76] bg-[#EC3A76]/20 border-[#EC3A76]/20" : ""}
          `}>
            {status}
          </span>
        )}
      </BaseCard>

      {/* ── Rejection Reason Modal ── */}
      {rejectModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            style={{
              background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
            }}
            className="rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EC3A76]/15 mx-auto mb-4">
              <i className="fas fa-circle-xmark text-[#EC3A76] text-xl" />
            </div>

            <h3 className="text-center font-semibold text-lg mb-1" style={{ color: 'var(--text-main)' }}>Reject Applicant</h3>
            <p className="text-center text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Please provide a reason for rejection to notify the applicant.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. We are looking for someone with more experience..."
              rows={3}
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EC3A76]/50 placeholder:text-slate-500 resize-none mb-4 transition-all"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(false); setRejectionReason(""); }}
                style={{ background: 'var(--tab-inactive-bg)', color: 'var(--tab-inactive-text)' }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: "rgba(236,58,118,0.15)", color: "#EC3A76", border: "1px solid rgba(236,58,118,0.3)" }}
              >
                Confirm Reject
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CandidateProfileCard;