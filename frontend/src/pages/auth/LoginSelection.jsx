import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginSelection = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
                        Welcome to WIMS
                    </h1>
                    <p className="text-gray-400">Select your role to continue</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Manager Card */}
                    <Link to="/login/manager">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-[#121212] border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Briefcase className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Manager</h2>
                            <p className="text-gray-400 text-sm">
                                Access the recruitment board, manage tasks, and view analytics.
                            </p>
                        </motion.div>
                    </Link>

                    {/* Intern Card */}
                    <Link to="/login/intern">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-[#121212] border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <User className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Intern</h2>
                            <p className="text-gray-400 text-sm">
                                View your tasks, track progress, and see your leaderboard rank.
                            </p>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginSelection;
