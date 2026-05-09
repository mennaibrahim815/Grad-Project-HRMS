import { useEffect, useState } from "react";
import axios from "../../../../services/axios"; 
import {
  X,
  Building2,
  Briefcase,
  CalendarCheck,
  CalendarX,
  Download,
  CreditCard,
  Loader2,
} from "lucide-react"
import { PayrollActionModal } from '../PayrollActionModal/PayrollActionModal';
import { generatePayslip } from "../../../../services/Generatepayslip";

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Paid:    "bg-[#00331E] border-[#00522F] text-[#4BFFB2]",
    Pending: "bg-[#013256] border-[#014A7F] text-[#62BDFE]",
    Draft:   "bg-[#1B1E22] border-[#383D47] text-[#A1A7B5]",
  };
  const dot = {
    Paid:    "bg-[#4BFFB2]",
    Pending: "bg-[#0293FA]",
    Draft:   "bg-[#697386]",
  };
  const cls = map[status] ?? map.Draft;
  const dotCls = dot[status] ?? dot.Draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
      {status === "Pending" ? "Pending Approval" : status}
    </span>
  );
};

// ─── Period helper ────────────────────────────────────────────────────────────
function getPeriod(month, year) {
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0); // last day of month
  const fmt   = (d) =>
    d.toLocaleString("en-US", { month: "short", day: "2-digit" });
  return `${fmt(start)} - ${fmt(end)}, ${year}`;
}

// ─── Avatar fallback ──────────────────────────────────────────────────────────
function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0168B1&color=fff&size=80&bold=true&rounded=true`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * PayrollDetailsModal
 *
 * @param {string}   payrollId  - MongoDB _id from the table row
 * @param {()=>void} onClose    - called when user dismisses
 */
export function PayrollDetailsModal({ payrollId, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const handlePayAction = ( ) => {
        setSelectedEmployeeId(data._id);
        setActiveModal("singlePay");
    };
  
  useEffect(() => {
    if (!payrollId) return;
    setLoading(true);
    setError(null);

    axios
      .get(`/payroll/${payrollId}`)
      .then((res) => setData(res.data?.data?.formattedPayroll ?? null))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load payroll details.")
      )
      .finally(() => setLoading(false));
  }, [payrollId]);

  // Derived values
  const emp     = data?.employee ?? {};
  const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim();

  // bonus = netSalary - (baseSalary - deductions) — only show if > 0
  const bonus =
    data ? data.netSalary - (data.baseSalary - data.deductions) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121417]/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#383D47] bg-[#1B1E22] overflow-hidden">

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} color="#697386" className="animate-spin" />
            <p className="text-sm text-[#697386]">Loading payroll details…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-[#EC3A76]">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-lg border border-[#383D47] text-sm text-[#A1A7B5] bg-transparent cursor-pointer hover:bg-[#383D47] transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && data && (
          <>
            {/* ── Employee header ── */}
            <div className="px-6 pt-6 pb-5 border-b border-[#383D47]">
              <div className="flex items-start justify-between gap-4">

                {/* Avatar + PAYROLL label */}
                <div className="relative flex-shrink-0">
                  <img
                    src={emp.avatar || getAvatarUrl(fullName)}
                    alt={fullName}
                    className="w-[72px] h-[72px] rounded-2xl object-cover border border-[#383D47]"
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0095ff] text-[#121417] text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase">
                    Payroll
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 mt-1">
                  <p className="text-lg font-bold text-[#FCFCFD] leading-tight">{fullName}</p>
                  <p className="text-xs text-[#697386] mt-0.5">{emp.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-[#A1A7B5]">
                      <Building2 size={12} color="#697386" />
                      {emp.department}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#A1A7B5]">
                      <Briefcase size={12} color="#697386" />
                      {emp.jobTitle}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex-shrink-0 mt-1">
                  <StatusBadge status={data.status} />
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-5 space-y-4">

              {/* Payment Summary card */}
              <div className="rounded-2xl border border-[#383D47] bg-[#121417] p-5">

                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-[#697386] uppercase">
                    Payment Summary
                  </span>
                  <CreditCard size={16} color="#383D47" />
                </div>

                {/* Rows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A7B5]">Base Salary</span>
                    <span className="text-sm font-semibold text-[#FCFCFD]">
                      ${data.baseSalary.toLocaleString()}
                    </span>
                  </div>

                  {bonus > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#A1A7B5]">Performance Bonus</span>
                      <span className="text-sm font-semibold text-[#4BFFB2]">
                        +${bonus.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {data.deductions > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#A1A7B5]">Deductions</span>
                      <span className="text-sm font-semibold text-[#EC3A76]">
                        -${data.deductions.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-[#383D47]" />

                {/* Total */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-[#697386] uppercase mb-1">
                      Total Net Salary
                    </p>
                    <p className="text-3xl font-black text-[#0095ff]  leading-none">
                      ${data.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#697386] mb-0.5">Period</p>
                    <p className="text-xs text-[#A1A7B5]">
                      {getPeriod(data.month, data.year)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Days row */}
              <div className="grid grid-cols-2 gap-3">

                {/* Days Present */}
                <div className="flex items-center gap-4 rounded-2xl border border-[#383D47] bg-[#121417] px-4 py-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00331E] flex items-center justify-center flex-shrink-0">
                    <CalendarCheck size={18} color="#4BFFB2" />
                  </div>
                  <div>
                    <p className="text-xs text-[#697386]">Days Present</p>
                    <p className="text-2xl font-bold text-[#FCFCFD] leading-tight">
                      {data.daysPresent}
                    </p>
                  </div>
                </div>

                {/* Days Absent */}
                <div className="flex items-center gap-4 rounded-2xl border border-[#383D47] bg-[#121417] px-4 py-4">
                  <div className="w-10 h-10 rounded-xl bg-[#34141F] flex items-center justify-center flex-shrink-0">
                    <CalendarX size={18} color="#EC3A76" />
                  </div>
                  <div>
                    <p className="text-xs text-[#697386]">Days Absent</p>
                    <p className="text-2xl font-bold text-[#FCFCFD] leading-tight">
                      {data.daysAbsent}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center gap-3 px-6 pb-6 pt-1">

              {/* Pay Now — only when Pending */}
              {data.status === "Pending" && (
                <button
                  onClick={() => handlePayAction()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#121417] cursor-pointer border-0
                             bg-gradient-to-r from-[#0095ff] to-[#0293FA]
                             hover:opacity-90 transition-opacity active:scale-95"
                >
                  Pay Now
                </button>
              )}

              {/* Download Payslip */}
              <button
                onClick={() => generatePayslip(data)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                           text-[#A1A7B5] bg-[#121417] border border-[#383D47]
                           hover:bg-[#383D47] transition-colors cursor-pointer"
              >
                <Download size={14} />
                Download Payslip
              </button>

              {/* Dismiss */}
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-2.5 text-xs text-[#697386]
                           hover:text-[#A1A7B5] transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X size={12} />
                Dismiss
              </button>
            </div>
          </>
        )}
      </div>
       {activeModal && (
                      <PayrollActionModal
                          action={activeModal}
                          targetId={selectedEmployeeId}
                          onClose={() => {
                              setActiveModal(null);
                              setSelectedEmployeeId(null);
                          }}
                      />
                  )}
    </div>
  );
}


