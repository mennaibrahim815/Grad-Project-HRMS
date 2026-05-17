import { motion } from "framer-motion";

const FormProgress = ({ currentStep, steps }) => {
    return (
        <div className="w-full">
            {/* Steps row */}
            <div className="flex items-center justify-between relative">

                {/* Background line */}
                <div className="absolute top-4 left-0 right-0 h-px bg-white/10 z-0" />

                {/* Animated progress line */}
                <motion.div
                    className="absolute top-4 left-0 h-px bg-blue-500 z-0 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (currentStep - 1) / (steps.length - 2) }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ width: "100%" }}
                />

                {steps.slice(0, -1).map((label, idx) => {
                    const stepNum = idx + 1;
                    const isDone = currentStep > stepNum;
                    const isActive = currentStep === stepNum;

                    return (
                        <div key={label} className="flex flex-col items-center gap-2 z-10">
                            <motion.div
                                animate={{
                                    backgroundColor: isDone
                                        ? "#0095ff"
                                        : isActive
                                        ? "#0095ff"
                                        : "rgba(255,255,255,0.05)",
                                    borderColor: isDone || isActive
                                        ? "#0095ff"
                                        : "rgba(255,255,255,0.15)",
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                            >
                                {isDone ? (
                                    <i className="fas fa-check text-white text-xs" />
                                ) : (
                                    <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                                        {stepNum}
                                    </span>
                                )}
                            </motion.div>

                            <span className={`text-xs font-medium transition-colors ${
                                isActive ? "text-blue-400" : isDone ? "text-slate-400" : "text-slate-600"
                            }`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormProgress;