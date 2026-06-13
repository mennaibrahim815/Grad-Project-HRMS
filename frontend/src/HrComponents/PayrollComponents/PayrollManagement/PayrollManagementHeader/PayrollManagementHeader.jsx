import React from 'react'
import { useState } from 'react';
import ReusableCalendar from '../../../../components/UI/ReusableCalendar'
import { setManagementMonth } from "../../../../store/HrSlices/payroll/payrollSlice";
import { useSelector, useDispatch } from "react-redux";
import { FileText, CircleCheck, CreditCard } from "lucide-react";
import { PayrollActionModal } from '../PayrollActionModal/PayrollActionModal';

const PayrollManagementHeader = () => {
    const dispatch = useDispatch();
    const { managementSelectedMonth } = useSelector((state) => state.payroll);
    const [activeModal, setActiveModal] = useState(null); // "draft"|"approve"|"pay"|null

    const handleMonthSave = (newMonth) => {
        dispatch(setManagementMonth(newMonth));
    };
    return (
        <div className="mb-10 bg-transparent p-4 rounded-2xl">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                        Payroll Management
                    </h1>
                    <ReusableCalendar
                        mode="month"
                        value={managementSelectedMonth}
                        onSave={handleMonthSave}
                    />
                </div>


                <div className="flex items-center gap-2 justify-end w-full lg:w-auto">
                    <button
                        onClick={() => setActiveModal("pay")}
                        className="font-bold bg-[#142129] border border-gray-800 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full sm:rounded-xl flex items-center justify-center sm:gap-2 text-gray-300 hover:bg-[#1c2e38] transition-all text-sm shrink-0"
                    >
                        <CreditCard size={15} />
                        <span className="hidden sm:inline whitespace-nowrap">Pay All</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("approve")}
                        className="bg-[#0095ff] hover:bg-[#0081dd] text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full sm:rounded-xl flex items-center justify-center sm:gap-2 font-bold shadow-lg transition-all active:scale-95 text-sm shrink-0"
                    >
                        <CircleCheck size={15} />
                        <span className="hidden sm:inline whitespace-nowrap">Approve Payroll</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("draft")}
                        className="bg-[#0095ff] hover:bg-[#0081dd] text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full sm:rounded-xl flex items-center justify-center sm:gap-2 font-bold shadow-lg transition-all active:scale-95 text-sm shrink-0"
                    >
                        <FileText size={15} />
                        <span className="hidden sm:inline whitespace-nowrap">Generate Draft</span>
                    </button>
                </div>
            </div>

            {activeModal && (
                <PayrollActionModal
                    action={activeModal}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div>
    );
}

export default PayrollManagementHeader;