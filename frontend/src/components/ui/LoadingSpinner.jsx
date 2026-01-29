import { motion } from "framer-motion";

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full gap-6">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-500 shadow-lg shadow-blue-500/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner pulsing circle */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/20 rounded-full blur-md"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Loading Text */}
            <motion.p
                className="text-gray-400 font-medium tracking-wide text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                {text}
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
