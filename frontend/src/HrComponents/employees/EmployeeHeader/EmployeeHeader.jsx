import { useState } from "react";
import AddEmployeeModal from "../AddEmployee/AddEmployeeModal";
import SuccessCard from "../../../components/UI/SuccessCard";
import { motion, AnimatePresence } from "framer-motion";
import ReusableCalendar from "../../../components/UI/ReusableCalendar";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDate } from "../../../store/HrSlices/attendance/attendanceSlice";

const EmployeeHeader = ({title, addButtonNAme}) => {
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
      <div className="flex items-center justify-between mb-6 sm:mb-10 bg-transparent p-3 sm:p-4 rounded-2xl gap-2 sm:gap-5">

        {/* Title */}
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight shrink-0">
          {title}
        </h1>

        {/* Controls Container */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Calendar */}
          <div className="relative sm:w-auto">
            <ReusableCalendar
              mode="single"
              value={appliedDate}
              onSave={handleDateSave}
            />
          </div>

          {/* Add Employee Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0095ff] hover:bg-[#0081dd] text-white rounded-full sm:rounded-xl flex items-center justify-center font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 shrink-0 w-9 h-9 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5"
          >
            <i className="fas fa-plus text-sm"></i>
            <span className="hidden sm:inline ml-1.5">{addButtonNAme}</span>
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
              <SuccessCard
                onDone={() => setIsSuccess(false)}
                description="Employee data has been successfully added to the system. You can return to the employee list to see the latest data."
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmployeeHeader;