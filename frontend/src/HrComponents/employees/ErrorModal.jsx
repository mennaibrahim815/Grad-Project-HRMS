import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../../components/UI/Card";

const ErrorModal = ({ isOpen, onClose, message, title = "Error" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <BaseCard padding="p-6" className="w-full max-w-sm">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full
                                            bg-red-500/15 mx-auto mb-4">
                                <i className="fas fa-exclamation-circle text-pink-400 text-xl" />
                            </div>

                            <h3 className="text-white text-center font-semibold text-lg mb-1">
                                {title}
                            </h3>

                            <p className="text-slate-400 text-center text-sm mb-6">
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-xl bg-[#0293FA]/15 text-[#0293FA]
                                           hover:bg-[#0293FA]/25 text-sm font-medium transition-all"
                            >
                                Okay
                            </button>
                        </BaseCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorModal;