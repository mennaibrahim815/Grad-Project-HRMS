import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FileText,
    CircleCheck,
    CreditCard,
    X,
    Check,
    Info,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import BaseCard from "../../../../components/UI/Card";
import {
    generateDraft,
    approvePayroll,
    bulkPayPayroll,
    paySinglePayroll,
    fetchAllPayrolls,
    clearActionResult,
} from "../../../../store/HrSlices/payroll/payrollSlice";

const ACTION_CONFIGS = {
    draft: {
        Icon: FileText,
        actionLabel: "Generate draft",
        title: "Payroll draft",
        description:
            "Calculates net salaries for all active employees based on attendance, delays, and approved leaves.",
        warning:
            "If a draft already exists for this month, the system returns a message — no duplicate will be created.",
        WarningIcon: Info,
        confirmText: "Generate draft",
        thunk: generateDraft,
        pillVar: "blue",
        confirmStyle: { background: '#0293FA', color: '#0D1117' },
        successTitle: "Draft generated successfully",
        errorTitle: "Could not generate draft",
    },
    approve: {
        Icon: CircleCheck,
        actionLabel: "Approve",
        title: "Approve payroll",
        description:
            "Approves all draft payrolls and marks attendance records as processed.",
        warning:
            "Cannot be executed before the cutoff day. This action cannot be undone.",
        WarningIcon: AlertTriangle,
        confirmText: "Approve",
        thunk: approvePayroll,
        pillVar: "orange",
        confirmStyle: { background: '#F89B49', color: '#0D1117' },
        successTitle: "Payroll approved",
        errorTitle: "Approval failed",
    },
    pay: {
        Icon: CreditCard,
        actionLabel: "Pay all",
        title: "Bulk pay employees",
        description:
            'Marks all "Pending" payroll records as Paid for the selected month.',
        warning:
            "Only payrolls with status Pending will be processed. Already paid records are skipped.",
        WarningIcon: Info,
        confirmText: "Pay all",
        thunk: bulkPayPayroll,
        pillVar: "green",
        confirmStyle: { background: '#4BFFB2', color: '#0D1117' },
        successTitle: "Payment processed",
        errorTitle: "Payment failed",
    },
    singlePay: {
        Icon: CreditCard,
        actionLabel: "Confirm payment",
        title: "Process payment",
        description: "You are about to mark this specific employee's payroll as Paid.",
        warning: "This will update the status to 'Paid' and cannot be reversed easily.",
        WarningIcon: AlertTriangle,
        confirmText: "Confirm payment",
        thunk: paySinglePayroll,
        pillVar: "green",
        confirmStyle: { background: '#4BFFB2', color: '#0D1117' },
        successTitle: "Payment successful",
        errorTitle: "Payment failed",
    },
};

// helper بيرجع الـ style بتاع أي pill variant
const pillStyle = (variant) => ({
    background: `var(--pill-${variant}-bg)`,
    borderColor: `var(--pill-${variant}-border)`,
    color: `var(--pill-${variant}-text)`,
});

function monthLabel(month, year) {
    return new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export function PayrollActionModal({ action, onClose, targetId }) {
    const dispatch = useDispatch();

    const { managementSelectedMonth, actionState } = useSelector(
        (state) => state.payroll
    );

    const [yearStr, monthStr] = managementSelectedMonth.split("-");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const config = ACTION_CONFIGS[action];

    const isLoading = actionState.loading;
    const result = actionState.result;
    const phase = isLoading ? "loading" : result ? "result" : "confirm";

    useEffect(() => {
        return () => { dispatch(clearActionResult()); };
    }, [dispatch]);

    useEffect(() => {
        if (result?.ok) {
            dispatch(fetchAllPayrolls({ month, year }));
        }
    }, [result, dispatch, month, year]);

    if (!config) return null;

    const { Icon, WarningIcon } = config;

    const handleConfirm = () => {
        if (action === "singlePay") {
            dispatch(config.thunk({ id: targetId, month, year }));
        } else {
            dispatch(config.thunk({ month, year }));
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <BaseCard
                padding="p-0"
                style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-main)' }}
                className="w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden border rounded-2xl"
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-main)' }}>
                    <div className="flex items-center gap-2.5">
                        <span
                            style={pillStyle(config.pillVar)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                        >
                            <Icon size={12} />
                            {config.actionLabel}
                        </span>
                        <div>
                            <p className="text-[13px] font-medium m-0 leading-none" style={{ color: 'var(--text-main)' }}>
                                {config.title}
                            </p>
                            <p className="text-[11px] mt-0.5 m-0 leading-none" style={{ color: 'var(--text-muted)' }}>
                                {monthLabel(month, year)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                        className="flex items-center justify-center w-7 h-7 rounded-lg border hover:opacity-70 transition-colors cursor-pointer bg-transparent"
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* ── Confirm phase ── */}
                {phase === "confirm" && (
                    <>
                        <div className="px-4 pt-3.5 pb-0 space-y-2.5">
                            <p className="text-[12.5px] leading-relaxed m-0" style={{ color: 'var(--text-muted)' }}>
                                {config.description}
                            </p>
                            {/* Inline warning strip */}
                            <div
                                style={pillStyle(config.pillVar)}
                                className="flex items-start gap-2 px-2.5 py-2 rounded-lg border"
                            >
                                <WarningIcon size={13} className="flex-shrink-0 mt-0.5" />
                                <p className="text-[11.5px] leading-snug m-0">
                                    {config.warning}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-4 py-3 border-t mt-3.5" style={{ borderColor: 'var(--border-main)' }}>
                            <button
                                onClick={onClose}
                                style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                                className="px-3.5 py-1.5 rounded-lg text-[12.5px] border bg-transparent hover:opacity-70 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={config.confirmStyle}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors cursor-pointer border-0 hover:opacity-90"
                            >
                                <Check size={13} />
                                {config.confirmText}
                            </button>
                        </div>
                    </>
                )}

                {/* ── Loading phase ── */}
                {phase === "loading" && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <Loader2 size={22} color="#5C6370" className="animate-spin" />
                        <p className="text-[12.5px] m-0" style={{ color: 'var(--text-muted)' }}>Processing request…</p>
                    </div>
                )}

                {/* ── Result phase ── */}
                {phase === "result" && result && (
                    <>
                        <div
                            style={pillStyle(result.ok ? "green" : "red")}
                            className="flex gap-3 px-4 py-3.5 border-y"
                        >
                            <div
                                style={{
                                    background: result.ok ? 'var(--pill-green-border)' : 'var(--pill-red-border)',
                                }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            >
                                {result.ok ? (
                                    <CheckCircle2 size={16} color="#4BFFB2" />
                                ) : (
                                    <XCircle size={16} color="#EC3A76" />
                                )}
                            </div>
                            <div>
                                <p
                                    style={{ color: result.ok ? 'var(--pill-green-text)' : 'var(--pill-red-text)' }}
                                    className="text-[13px] font-medium m-0 mb-1"
                                >
                                    {result.ok ? config.successTitle : config.errorTitle}
                                </p>
                                <p
                                    style={{ color: result.ok ? 'var(--pill-green-text)' : 'var(--pill-red-text)', opacity: 0.85 }}
                                    className="text-[11.5px] leading-relaxed m-0"
                                >
                                    {result.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end px-4 py-3">
                            <button
                                onClick={onClose}
                                style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                                className="px-4 py-1.5 rounded-lg text-[12.5px] border bg-transparent hover:opacity-70 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </BaseCard>
        </div>
    );
}