import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import BaseCard from "../../../../components/UI/Card";
import { useDispatch } from "react-redux";
import { updateApplicantStatus } from "../../../../store/HrSlices/Hiring/hiringSlice";

const statusOptions = {
  Applied:      ["Interviewing", "Rejected"],
  Interviewing: ["Hired", "Rejected"],
  Hired:        [],
  Rejected:     [],
};

const CandidateProfileCard = ({ applicant, loading }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const { personalInfo, status, _id } = applicant || {};
  const fullName = `${personalInfo?.firstName || ""} ${personalInfo?.lastName || ""}`.trim();
  const options = statusOptions[status] || [];

  const handleOpen = () => {
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top:  rect.bottom + window.scrollY + 8,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const close = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleStatusChange = (newStatus) => {
    dispatch(updateApplicantStatus({ id: _id, status: newStatus }));
    setOpen(false);
  };

  if (loading) {
    return (
      <BaseCard className="flex items-center justify-center py-10">
        <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
      </BaseCard>
    );
  }

  return (
    <BaseCard className="flex flex-col items-center text-center gap-4">
      <img
        src={personalInfo?.avatar}
        alt={fullName}
        className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500/30"
      />

      <div>
        <p className="text-white font-semibold text-lg">{fullName || "—"}</p>
        <p className="text-slate-400 text-sm mt-1">{personalInfo?.department || "—"}</p>
      </div>

      {options.length > 0 ? (
        <>
          <button
            ref={btnRef}
            onClick={handleOpen}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-sm transition-all"
          >
            {status}
            <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}></i>
          </button>

          {open && createPortal(
            <div style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
              className="bg-[#1e2a3a] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[160px]"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleStatusChange(opt)}
                  className="w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-all text-left"
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
          ${status === "Hired"    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40'    : ""}
          ${status === "Rejected" ? 'text-red-400 bg-red-500/20 rounded-full'     : ""}
        `}>
          {status}
        </span>
      )}
    </BaseCard>
  );
};

export default CandidateProfileCard;