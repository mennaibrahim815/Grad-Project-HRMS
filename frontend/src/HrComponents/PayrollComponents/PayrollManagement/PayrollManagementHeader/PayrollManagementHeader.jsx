import React from 'react'
import { useState } from 'react';
import ReusableCalendar from '../../../../Components/UI/ReusableCalendar'
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
        <div className="flex justify-between items-center mb-10 bg-transparent p-4 rounded-2xl">
            
            {/* الجزء الأيسر: العنوان والتقويم مع بعض */}
            <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Payroll Management
                </h1>
                
                <ReusableCalendar
                    mode="month"
                    value={managementSelectedMonth}
                    onSave={handleMonthSave}
                />
            </div>

          
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setActiveModal("pay")}
                    className="font-bold bg-[#142129] border border-gray-800 px-5 py-2.5 rounded-xl flex items-center gap-3 text-gray-300 hover:bg-[#1c2e38] transition-all min-w-[140px]"
                >
                    <CreditCard size={15} />
                    <span>Pay All (This Month)</span>
                </button>

                <button
                    onClick={() => setActiveModal("approve")}
                    className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                     <CircleCheck size={15} />
                    <span>Approve Payroll </span>
                </button>

                <button
                    onClick={() => setActiveModal("draft")}
                    className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    <FileText size={15} />
                    <span>Generate Draft</span>
                </button>
            </div>
        {activeModal && (
        <PayrollActionModal
          action={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
        </div>
    )
}

export default PayrollManagementHeader;