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

// ─── Per-action config ────────────────────────────────────────────────────────
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
        // pill
        pillCls: "bg-[#0E2A45] border border-[#1A4870] text-[#62BDFE]",
        // warning strip
        warnCls: "bg-[#0E2A45] border border-[#1A4870] text-[#62BDFE]",
        // confirm button
        confirmCls: "bg-[#0293FA] text-[#0D1117] hover:bg-[#35AAFD]",
        // result
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
        pillCls: "bg-[#3A1E06] border border-[#6B3710] text-[#F89B49]",
        warnCls: "bg-[#3A1E06] border border-[#6B3710] text-[#F89B49]",
        confirmCls: "bg-[#F89B49] text-[#0D1117] hover:bg-[#FAB97F]",
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
        pillCls: "bg-[#0A2918] border border-[#144D2E] text-[#4BFFB2]",
        warnCls: "bg-[#0A2918] border border-[#144D2E] text-[#4BFFB2]",
        confirmCls: "bg-[#4BFFB2] text-[#0D1117] hover:bg-[#80FFC8]",
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
        pillCls: "bg-[#0A2918] border border-[#144D2E] text-[#4BFFB2]",
        warnCls: "bg-[#0A2918] border border-[#144D2E] text-[#4BFFB2]",
        confirmCls: "bg-[#4BFFB2] text-[#0D1117] hover:bg-[#80FFC8]",
        successTitle: "Payment successful",
        errorTitle: "Payment failed",
    },
};

function monthLabel(month, year) {
    return new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <BaseCard
                padding="p-0"
                className="w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden bg-[#161B22] border border-[#30363D] rounded-2xl"
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#30363D]">
                    <div className="flex items-center gap-2.5">
                        {/* Action pill — icon + label */}
                        <span
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.pillCls}`}
                        >
                            <Icon size={12} />
                            {config.actionLabel}
                        </span>
                        {/* Title + month */}
                        <div>
                            <p className="text-[13px] font-medium text-[#E6EDF3] m-0 leading-none">
                                {config.title}
                            </p>
                            <p className="text-[11px] text-[#5C6370] mt-0.5 m-0 leading-none">
                                {monthLabel(month, year)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#30363D] text-[#5C6370] hover:bg-[#30363D] hover:text-[#8B949E] transition-colors cursor-pointer bg-transparent"
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* ── Confirm phase ── */}
                {phase === "confirm" && (
                    <>
                        <div className="px-4 pt-3.5 pb-0 space-y-2.5">
                            <p className="text-[12.5px] text-[#8B949E] leading-relaxed m-0">
                                {config.description}
                            </p>
                            {/* Inline warning strip */}
                            <div
                                className={`flex items-start gap-2 px-2.5 py-2 rounded-lg ${config.warnCls}`}
                            >
                                <WarningIcon size={13} className="flex-shrink-0 mt-0.5" />
                                <p className="text-[11.5px] leading-snug m-0">
                                    {config.warning}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#30363D] mt-3.5">
                            <button
                                onClick={onClose}
                                className="px-3.5 py-1.5 rounded-lg text-[12.5px] border border-[#30363D] text-[#8B949E] bg-transparent hover:bg-[#30363D] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors cursor-pointer border-0 ${config.confirmCls}`}
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
                        <p className="text-[12.5px] text-[#5C6370] m-0">Processing request…</p>
                    </div>
                )}

                {/* ── Result phase ── */}
                {phase === "result" && result && (
                    <>
                        <div
                            className={`flex gap-3 px-4 py-3.5 border-y ${
                                result.ok
                                    ? "bg-[#0A2918] border-[#144D2E]"
                                    : "bg-[#1E0A12] border-[#4D1428]"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    result.ok ? "bg-[#144D2E]" : "bg-[#4D1428]"
                                }`}
                            >
                                {result.ok ? (
                                    <CheckCircle2 size={16} color="#4BFFB2" />
                                ) : (
                                    <XCircle size={16} color="#EC3A76" />
                                )}
                            </div>
                            <div>
                                <p
                                    className={`text-[13px] font-medium m-0 mb-1 ${
                                        result.ok ? "text-[#A8FFDA]" : "text-[#F598B7]"
                                    }`}
                                >
                                    {result.ok ? config.successTitle : config.errorTitle}
                                </p>
                                <p
                                    className={`text-[11.5px] leading-relaxed m-0 ${
                                        result.ok ? "text-[#4BFFB2]" : "text-[#EC3A76]"
                                    } opacity-80`}
                                >
                                    {result.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end px-4 py-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 rounded-lg text-[12.5px] border border-[#30363D] text-[#8B949E] bg-transparent hover:bg-[#30363D] transition-colors cursor-pointer"
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