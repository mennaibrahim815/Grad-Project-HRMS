import { motion } from "framer-motion";

const PageLoader = ({ message = "Preparing your dashboard..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-[#0b141a] flex flex-col items-center justify-center"
    >
     
      <div className="relative w-24 h-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-full blur-xl opacity-50"></div>
          <span className="text-blue-500 font-bold italic text-xl">S</span>
        </motion.div>
      </div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-6 text-gray-400 text-sm tracking-widest uppercase font-medium"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default PageLoader;
