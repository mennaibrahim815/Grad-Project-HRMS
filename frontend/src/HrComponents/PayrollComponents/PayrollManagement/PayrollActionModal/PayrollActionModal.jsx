import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FileText,
    CircleCheck,
    CreditCard,
    X,
    Check,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import {
    generateDraft,
    approvePayroll,
    bulkPayPayroll,
    paySinglePayroll,
    fetchAllPayrolls,
    clearActionResult,
} from "../../../../store/HrSlices/payroll/payrollSlice";

// ─── Per-action config ────────────────────────────────────────────────────────
// Colors reference your palette:
//   Draft  → Blue  500 #0293FA / Blue  900 #013256
//   Approve→ Orange 600 #F68018 / Orange 900 #673204
//   Pay    → Green 500 #4BFFB2 / Green 900 #00331E

const ACTION_CONFIGS = {
    draft: {
        Icon: FileText,
        title: "Generate payroll draft",
        description:
            "This will calculate net salaries for all active employees based on attendance, delays, and approved leaves.",
        warning:
            "If a draft already exists for this month, the system will return a message — no duplicate will be created.",
        confirmText: "Generate draft",
        thunk: generateDraft,
        // icon wrapper
        iconWrapCls: "bg-[#013256]",
        iconColor: "#62BDFE",
        // confirm button
        confirmCls: "bg-[#0293FA] text-[#121417] hover:bg-[#35AAFD]",
        // result
        successTitle: "Draft generated successfully",
        errorTitle: "Could not generate draft",
    },
    approve: {
        Icon: CircleCheck,
        title: "Approve payroll",
        description:
            "This will approve all draft payrolls and mark attendance records as processed.",
        warning:
            "Approval cannot be executed before the cutoff day. This action cannot be undone.",
        confirmText: "Approve",
        thunk: approvePayroll,
        iconWrapCls: "bg-[#673204]",
        iconColor: "#FBCCA2",
        confirmCls: "bg-[#F68018] text-[#FCFCFD] hover:bg-[#FAB97F]",
        successTitle: "Payroll approved",
        errorTitle: "Approval failed",
    },
    pay: {
        Icon: CreditCard,
        title: "Bulk pay employees",
        description:
            'This will mark all "Pending" payroll records as Paid for the selected month.',
        warning:
            "Only payrolls with status Pending will be processed. Already paid records are skipped.",
        confirmText: "Pay all",
        thunk: bulkPayPayroll,
        iconWrapCls: "bg-[#00331E]",
        iconColor: "#A8FFDA",
        confirmCls: "bg-[#4BFFB2] text-[#121417] hover:bg-[#80FFC8]",
        successTitle: "Payment processed",
        errorTitle: "Payment failed",
    },
    singlePay: {
        Icon: CreditCard,
        title: "Process employee payment",
        description: "You are about to mark this specific employee's payroll as Paid.",
        warning: "This action will update the status to 'Paid' and cannot be reversed easily.",
        confirmText: "Confirm Payment",
        thunk: paySinglePayroll, // الأكشن الجديد
        iconWrapCls: "bg-[#00331E]",
        iconColor: "#A8FFDA",
        confirmCls: "bg-[#4BFFB2] text-[#121417] hover:bg-[#80FFC8]",
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
/**
 * PayrollActionModal
 *
 * @param {("draft"|"approve"|"pay")} action
 * @param {() => void} onClose
 *
 * Reads month & year from Redux — no prop drilling needed.
 * After a successful action, auto-dispatches fetchAllPayrolls.
 */
export function PayrollActionModal({ action, onClose, targetId }) {
    const dispatch = useDispatch();


    const { managementSelectedMonth, actionState } = useSelector(
        (state) => state.payroll
    );

    // managementSelectedMonth stored as "YYYY-MM"
    const [yearStr, monthStr] = managementSelectedMonth.split("-");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const config = ACTION_CONFIGS[action];

    const isLoading = actionState.loading;
    const result = actionState.result; // null | { ok: bool, message: string, data: any }
    const phase = isLoading ? "loading" : result ? "result" : "confirm";

    // Clear result on unmount so next open is always fresh
    useEffect(() => {
        return () => {
            dispatch(clearActionResult());
        };
    }, [dispatch]);

    // After success → refresh table
    useEffect(() => {
        if (result?.ok) {
            dispatch(fetchAllPayrolls({ month, year }));
        }
    }, [result, dispatch, month, year]);

    if (!config) return null;

    const { Icon } = config;
    const handleConfirm = () => {
        if (action === "singlePay") {

            dispatch(config.thunk({
                id: targetId,
                month,
                year
            }));
        } else {

            dispatch(config.thunk({ month, year }));
        }
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#121417]/75 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#383D47] bg-[#1B1E22] overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#383D47]">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconWrapCls}`}>
                            <Icon size={18} color={config.iconColor} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#FCFCFD] m-0">{config.title}</p>
                            <p className="text-xs text-[#697386] mt-0.5 m-0">{monthLabel(month, year)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#383D47] text-[#A1A7B5] hover:bg-[#383D47] transition-colors cursor-pointer bg-transparent"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* ── Confirm phase ── */}
                {phase === "confirm" && (
                    <>
                        <div className="px-5 py-4 space-y-3">
                            <p className="text-sm text-[#A1A7B5] leading-relaxed m-0">
                                {config.description}
                            </p>
                            <div className="flex gap-2 rounded-xl border border-[#984A06] bg-[#673204] px-3 py-2.5">
                                <AlertTriangle
                                    size={15}
                                    color="#F68018"
                                    className="flex-shrink-0 mt-0.5"
                                />
                                <p className="text-xs text-[#FBCCA2] leading-relaxed m-0">
                                    {config.warning}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#383D47]">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm border border-[#383D47] text-[#A1A7B5] bg-transparent hover:bg-[#383D47] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-0 ${config.confirmCls}`}
                            >
                                <Check size={14} />
                                {config.confirmText}
                            </button>
                        </div>
                    </>
                )}

                {/* ── Loading phase ── */}
                {phase === "loading" && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <Loader2 size={26} color="#A1A7B5" className="animate-spin" />
                        <p className="text-sm text-[#697386] m-0">Processing request…</p>
                    </div>
                )}

                {/* ── Result phase ── */}
                {phase === "result" && result && (
                    <>
                        <div
                            className={`flex gap-3 px-5 py-4 border-y ${result.ok
                                ? "bg-[#00331E] border-[#00522F]"
                                : "bg-[#34141F] border-[#6B0A2B]"
                                }`}
                        >
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${result.ok ? "bg-[#00522F]" : "bg-[#6B0A2B]"
                                    }`}
                            >
                                {result.ok ? (
                                    <CheckCircle2 size={18} color="#4BFFB2" />
                                ) : (
                                    <XCircle size={18} color="#EC3A76" />
                                )}
                            </div>
                            <div>
                                <p
                                    className={`text-sm font-medium m-0 mb-1 ${result.ok ? "text-[#A8FFDA]" : "text-[#F598B7]"
                                        }`}
                                >
                                    {result.ok ? config.successTitle : config.errorTitle}
                                </p>
                                {/* Backend message shown as-is */}
                                <p
                                    className={`text-xs leading-relaxed m-0 ${result.ok ? "text-[#4BFFB2]" : "text-[#EC3A76]"
                                        } opacity-85`}
                                >
                                    {result.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 py-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg text-sm border border-[#383D47] text-[#A1A7B5] bg-transparent hover:bg-[#383D47] transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}