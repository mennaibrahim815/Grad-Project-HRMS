import { useState } from "react";
import AddEmployeeModal from "../AddEmployee/AddEmployeeModal";
import SuccessCard from "../AddEmployee/SuccessCard";
import { motion, AnimatePresence } from "framer-motion";
import ReusableCalendar from "../../../Components/UI/ReusableCalendar";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDate } from "../../../store/HrSlices/attendance/attendanceSlice";

const EmployeeHeader = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { selectedDate: appliedDate } = useSelector(
    (state) => state.attendance,
  );
  const handleDateSave = (newDateValue) => {
    dispatch(setSelectedDate(newDateValue));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-10  bg-transparent p-4 rounded-2xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Employees
        </h1>

        {/* Add Employee Button */}
        <div className="flex items-center gap-3 relative">
          {/* Calender button */}
          <ReusableCalendar
            mode="single"
            value={appliedDate}
            onSave={handleDateSave}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <i className="fas fa-plus text-sm"></i>
            <span> Add Employee </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      <AddEmployeeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setIsSuccess(true);
        }}
      />

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
            >
              <SuccessCard onDone={() => setIsSuccess(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmployeeHeader;
