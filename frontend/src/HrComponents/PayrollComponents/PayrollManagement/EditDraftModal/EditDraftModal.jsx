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

export function EditDraftModal({ payrollRow, onClose }) {
    const dispatch = useDispatch();
    const { managementSelectedMonth, actionState } = useSelector((s) => s.payroll);

    const [yearStr, monthStr] = managementSelectedMonth.split("-");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    
    const [manualAdditions, setManualAdditions] = useState(
        payrollRow?.manualAdditions ?? 0
    );
    const [manualDeductions, setManualDeductions] = useState(
        payrollRow?.manualDeductions ?? 0
    );
    const [adjustmentReason, setAdjustmentReason] = useState(
        payrollRow?.adjustmentReason ?? ""
    );

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
                    <div className="px-6 py-4 flex items-center gap-3 border-b border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-[#013256] flex items-center justify-center flex-shrink-0">
                            <FileText size={18} color="#62BDFE" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#FCFCFD] m-0">{fullName}</p>
                            <p className="text-xs text-[#697386] m-0 mt-0.5">
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
                            <label className="block text-xs text-[#A1A7B5] mb-1.5 font-medium">
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
                                    onChange={(e) => setManualAdditions(e.target.value)}
                                    className="w-full bg-[#1B1E22] border border-[#383D47] rounded-xl
                                               pl-9 pr-4 py-2.5 text-sm text-[#FCFCFD]
                                               focus:outline-none focus:border-[#4BFFB2]/60
                                               transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Manual Deductions */}
                        <div>
                            <label className="block text-xs text-[#A1A7B5] mb-1.5 font-medium">
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
                                    onChange={(e) => setManualDeductions(e.target.value)}
                                    className="w-full bg-[#1B1E22] border border-[#383D47] rounded-xl
                                               pl-9 pr-4 py-2.5 text-sm text-[#FCFCFD]
                                               focus:outline-none focus:border-[#EC3A76]/60
                                               transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Adjustment Reason */}
                        <div>
                            <label className="block text-xs text-[#A1A7B5] mb-1.5 font-medium">
                                Adjustment Reason
                            </label>
                            <textarea
                                value={adjustmentReason}
                                onChange={(e) => setAdjustmentReason(e.target.value)}
                                rows={3}
                                placeholder="Explain the reason for this adjustment..."
                                className="w-full bg-[#1B1E22] border border-[#383D47] rounded-xl
                                           px-4 py-2.5 text-sm text-[#FCFCFD] resize-none
                                           focus:outline-none focus:border-[#0293FA]/60
                                           transition-colors placeholder:text-[#697386]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 px-6 py-3 border-t border-white/10">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm border border-[#383D47]
                                       text-[#A1A7B5] bg-transparent hover:bg-[#383D47]
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
                    <p className="text-sm text-[#697386] m-0">Saving changes…</p>
                </div>
            )}

            {/* ── Result phase ── */}
            {phase === "result" && result && (
                <>
                    <div className={`flex gap-3 px-6 py-5 border-y ${result.ok
                            ? "bg-[#00331E] border-[#00522F]"
                            : "bg-[#34141F] border-[#6B0A2B]"
                        }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${result.ok ? "bg-[#00522F]" : "bg-[#6B0A2B]"
                            }`}>
                            {result.ok
                                ? <CheckCircle2 size={18} color="#4BFFB2" />
                                : <XCircle size={18} color="#EC3A76" />
                            }
                        </div>
                        <div>
                            <p className={`text-sm font-medium m-0 mb-1 ${result.ok ? "text-[#A8FFDA]" : "text-[#F598B7]"
                                }`}>
                                {result.ok ? "Draft updated successfully" : "Update failed"}
                            </p>
                            <p className={`text-xs leading-relaxed m-0 opacity-85 ${result.ok ? "text-[#4BFFB2]" : "text-[#EC3A76]"
                                }`}>
                                {result.message}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end px-6 py-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl text-sm border border-[#383D47]
                                       text-[#A1A7B5] bg-transparent hover:bg-[#383D47]
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