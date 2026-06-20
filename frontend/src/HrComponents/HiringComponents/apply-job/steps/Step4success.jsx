import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetApply } from "../../../../store/HrSlices/careersSlice/careersSlice";

const Step4Success = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(resetApply());
        navigate("/apply-job");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ background: "var(--bg-card)", borderColor: "var(--border-main)" }}
            className="flex flex-col items-center text-center gap-6 border rounded-2xl p-10"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
                <i className="fas fa-check text-blue-400 text-3xl" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col gap-2"
            >
                <h2 className="font-bold text-2xl" style={{ color: "var(--text-main)" }}>Application Submitted!</h2>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
                    Your application has been received. We'll review it and get back to you
                    as soon as possible. Good luck!
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleBack}
                className="px-8 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0081dd]
                           text-white text-sm font-semibold transition-all active:scale-95"
            >
                <i className="fas fa-arrow-left mr-2 text-xs" />
                Back to Jobs
            </motion.button>
        </motion.div>
    );
};

export default Step4Success;