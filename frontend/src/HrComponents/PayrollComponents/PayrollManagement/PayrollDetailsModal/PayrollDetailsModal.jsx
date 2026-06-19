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
  const styleMap = {
    Paid:    { background: 'var(--pill-green-bg)', borderColor: 'var(--pill-green-border)', color: 'var(--pill-green-text)' },
    Pending: { background: 'var(--pill-blue-bg)', borderColor: 'var(--pill-blue-border)', color: 'var(--pill-blue-text)' },
    Draft:   { background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' },
  };
  const dotColorMap = {
    Paid:    'var(--pill-green-text)',
    Pending: 'var(--pill-blue-text)',
    Draft:   'var(--text-muted)',
  };
  const style = styleMap[status] ?? styleMap.Draft;
  const dotColor = dotColorMap[status] ?? dotColorMap.Draft;

  return (
    <span style={style} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border">
      <span style={{ background: dotColor }} className="w-1.5 h-1.5 rounded-full" />
      {status === "Pending" ? "Pending Approval" : status}
    </span>
  );
};

// ─── Period helper ────────────────────────────────────────────────────────────
function getPeriod(month, year) {
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0);
  const fmt   = (d) =>
    d.toLocaleString("en-US", { month: "short", day: "2-digit" });
  return `${fmt(start)} - ${fmt(end)}, ${year}`;
}

// ─── Avatar fallback ──────────────────────────────────────────────────────────
function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0168B1&color=fff&size=80&bold=true&rounded=true`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const emp     = data?.employee ?? {};
  const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim();

  const bonus =
    data ? data.netSalary - (data.baseSalary - data.deductions) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{ borderColor: 'var(--border-main)', background: 'var(--modal-bg)' }}
        className="w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl border overflow-hidden"
      >

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} color="#697386" className="animate-spin" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading payroll details…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-[#EC3A76]">{error}</p>
            <button
              onClick={onClose}
              style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
              className="mt-4 px-5 py-2 rounded-lg border text-sm bg-transparent cursor-pointer hover:opacity-70 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && data && (
          <>
            {/* ── Employee header ── */}
            <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: 'var(--border-main)' }}>
              <div className="flex items-start justify-between gap-4">

                {/* Avatar + PAYROLL label */}
                <div className="relative flex-shrink-0">
                  <img
                    src={emp.avatar || getAvatarUrl(fullName)}
                    alt={fullName}
                    style={{ borderColor: 'var(--border-main)' }}
                    className="w-[72px] h-[72px] rounded-2xl object-cover border"
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0095ff] text-[#121417] text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase">
                    Payroll
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 mt-1">
                  <p className="text-lg font-bold leading-tight" style={{ color: 'var(--text-main)' }}>{fullName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{emp.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Building2 size={12} color="#697386" />
                      {emp.department}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
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
              <div style={{ borderColor: 'var(--border-main)', background: 'var(--bg-deep)' }} className="rounded-2xl border p-5">

                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                    Payment Summary
                  </span>
                  <CreditCard size={16} color="#383D47" />
                </div>

                {/* Rows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Base Salary</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                      ${data.baseSalary.toLocaleString()}
                    </span>
                  </div>

                  {bonus > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Performance Bonus</span>
                      <span className="text-sm font-semibold text-[#4BFFB2]">
                        +${bonus.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {data.deductions > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Deductions</span>
                      <span className="text-sm font-semibold text-[#EC3A76]">
                        -${data.deductions.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="my-4 border-t" style={{ borderColor: 'var(--border-main)' }} />

                {/* Total */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                      Total Net Salary
                    </p>
                    <p className="text-3xl font-black text-[#0095ff] leading-none">
                      ${data.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>Period</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {getPeriod(data.month, data.year)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Days row */}
              <div className="grid grid-cols-2 gap-3">

                {/* Days Present */}
                <div style={{ borderColor: 'var(--border-main)', background: 'var(--bg-deep)' }} className="flex items-center gap-4 rounded-2xl border px-4 py-4">
                  <div style={{ background: 'var(--icon-green-bg)' }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarCheck size={18} color="#4BFFB2" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Days Present</p>
                    <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                      {data.daysPresent}
                    </p>
                  </div>
                </div>

                {/* Days Absent */}
                <div style={{ borderColor: 'var(--border-main)', background: 'var(--bg-deep)' }} className="flex items-center gap-4 rounded-2xl border px-4 py-4">
                  <div style={{ background: 'var(--icon-pink-bg)' }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarX size={18} color="#EC3A76" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Days Absent</p>
                    <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
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
                style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                           border hover:opacity-80 transition-colors cursor-pointer"
              >
                <Download size={14} />
                Download Payslip
              </button>

              {/* Dismiss */}
              <button
                onClick={onClose}
                style={{ color: 'var(--text-muted)' }}
                className="flex items-center gap-1 px-3 py-2.5 text-xs hover:opacity-70 transition-colors bg-transparent border-0 cursor-pointer"
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