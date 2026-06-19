import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editDraftPayroll, fetchAllPayrolls, clearActionResult } from "../../../../store/HrSlices/payroll/payrollSlice";
import Modal from "../../../../components/UI/Modal/Modal";
import ModalHeader from "../../../../components/UI/Modal/ModalHeader";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    PlusCircle,
    MinusCircle,
    FileText,
} from "lucide-react";

export function EditDraftModal({ payrollRow, formValues, onFormChange, onClose }) {
    const dispatch = useDispatch();
    const { managementSelectedMonth, actionState } = useSelector((s) => s.payroll);

    const [yearStr, monthStr] = managementSelectedMonth.split("-");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const [manualAdditions, setManualAdditions] = useState(formValues?.manualAdditions ?? 0);
    const [manualDeductions, setManualDeductions] = useState(formValues?.manualDeductions ?? 0);
    const [adjustmentReason, setAdjustmentReason] = useState(formValues?.adjustmentReason ?? "");

    const handleAdditionsChange = (val) => {
        setManualAdditions(val);
        onFormChange({ manualAdditions: val, manualDeductions, adjustmentReason });
    };

    const handleDeductionsChange = (val) => {
        setManualDeductions(val);
        onFormChange({ manualAdditions, manualDeductions: val, adjustmentReason });
    };

    const handleReasonChange = (val) => {
        setAdjustmentReason(val);
        onFormChange({ manualAdditions, manualDeductions, adjustmentReason: val });
    };

    const isLoading = actionState.loading;
    const result = actionState.result;
    const phase = isLoading ? "loading" : result ? "result" : "form";

    useEffect(() => {
        return () => { dispatch(clearActionResult()); };
    }, [dispatch]);

    useEffect(() => {
        if (result?.ok) {
            const updated = result.data?.updatedPayroll;
            if (updated) {
                setManualAdditions(updated.manualAdditions ?? 0);
                setManualDeductions(updated.manualDeductions ?? 0);
                setAdjustmentReason(updated.adjustmentReason ?? "");

                onFormChange({
                    manualAdditions: updated.manualAdditions ?? 0,
                    manualDeductions: updated.manualDeductions ?? 0,
                    adjustmentReason: updated.adjustmentReason ?? "",
                });
            }
            dispatch(fetchAllPayrolls({ month, year }));
        }
    }, [result, dispatch, month, year]);

    const handleSubmit = () => {
        dispatch(editDraftPayroll({
            id: payrollRow._id,
            manualAdditions: Number(manualAdditions),
            manualDeductions: Number(manualDeductions),
            adjustmentReason,
        }));
    };

    const fullName = `${payrollRow?.employee?.firstName || ""} ${payrollRow?.employee?.lastName || ""}`;

    return (
        <Modal open onClose={onClose}>
            <ModalHeader title="Edit Draft Payroll" onClose={onClose} />

            {/* ── Form phase ── */}
            {phase === "form" && (
                <>
                    {/* Employee info */}
                    <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border-main)' }}>
                        <div style={{ background: 'var(--icon-blue-bg)' }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText size={18} color="#62BDFE" />
                        </div>
                        <div>
                            <p className="text-sm font-medium m-0" style={{ color: 'var(--text-main)' }}>{fullName}</p>
                            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {new Date(payrollRow.year, payrollRow.month - 1)
                                    .toLocaleString("en-US", { month: "long", year: "numeric" })}
                                {" · "}
                                <span className="text-[#4BFFB2]">
                                    Net: ${payrollRow?.netSalary?.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        {/* Manual Additions */}
                        <div>
                            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                                Manual Additions ($)
                            </label>
                            <div className="relative">
                                <PlusCircle
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4BFFB2]"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={manualAdditions}
                                    onChange={(e) => handleAdditionsChange(e.target.value)}
                                    style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                                    className="w-full border rounded-xl
                                               pl-9 pr-4 py-2.5 text-sm
                                               focus:outline-none focus:border-[#4BFFB2]/60
                                               transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Manual Deductions */}
                        <div>
                            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                                Manual Deductions ($)
                            </label>
                            <div className="relative">
                                <MinusCircle
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EC3A76]"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={manualDeductions}
                                    onChange={(e) => handleDeductionsChange(e.target.value)}
                                    style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                                    className="w-full border rounded-xl
                                               pl-9 pr-4 py-2.5 text-sm
                                               focus:outline-none focus:border-[#EC3A76]/60
                                               transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Adjustment Reason */}
                        <div>
                            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                                Adjustment Reason
                            </label>
                            <textarea
                                value={adjustmentReason}
                                onChange={(e) => handleReasonChange(e.target.value)}
                                rows={3}
                                placeholder="Explain the reason for this adjustment..."
                                style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                                className="w-full border rounded-xl
                                           px-4 py-2.5 text-sm resize-none
                                           focus:outline-none focus:border-[#0293FA]/60
                                           transition-colors placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 px-6 py-3 border-t" style={{ borderColor: 'var(--border-main)' }}>
                        <button
                            onClick={onClose}
                            style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                            className="px-4 py-2 rounded-xl text-sm border
                                       bg-transparent hover:opacity-70
                                       transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!adjustmentReason.trim()}
                            className="px-5 py-2 rounded-xl text-sm font-medium
                                       bg-[#0293FA] text-[#121417] hover:bg-[#35AAFD]
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-colors cursor-pointer border-0"
                        >
                            Save Changes
                        </button>
                    </div>
                </>
            )}

            {/* ── Loading phase ── */}
            {phase === "loading" && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 size={26} color="#A1A7B5" className="animate-spin" />
                    <p className="text-sm m-0" style={{ color: 'var(--text-muted)' }}>Saving changes…</p>
                </div>
            )}

            {/* ── Result phase ── */}
            {phase === "result" && result && (
                <>
                    <div
                        style={result.ok
                            ? { background: 'var(--pill-green-bg)', borderColor: 'var(--pill-green-border)' }
                            : { background: 'var(--pill-red-bg)', borderColor: 'var(--pill-red-border)' }
                        }
                        className="flex gap-3 px-6 py-5 border-y"
                    >
                        <div
                            style={{ background: result.ok ? 'var(--pill-green-border)' : 'var(--pill-red-border)' }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        >
                            {result.ok
                                ? <CheckCircle2 size={18} color="#4BFFB2" />
                                : <XCircle size={18} color="#EC3A76" />
                            }
                        </div>
                        <div>
                            <p
                                style={{ color: result.ok ? 'var(--pill-green-text)' : 'var(--pill-red-text)' }}
                                className="text-sm font-medium m-0 mb-1"
                            >
                                {result.ok ? "Draft updated successfully" : "Update failed"}
                            </p>
                            <p
                                style={{ color: result.ok ? 'var(--pill-green-text)' : 'var(--pill-red-text)', opacity: 0.85 }}
                                className="text-xs leading-relaxed m-0"
                            >
                                {result.message}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end px-6 py-3">
                        <button
                            onClick={onClose}
                            style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                            className="px-5 py-2 rounded-xl text-sm border
                                       bg-transparent hover:opacity-70
                                       transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}