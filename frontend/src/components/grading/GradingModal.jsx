import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const GradingModal = ({ isOpen, onClose, task, onGraded }) => {
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(task?.score || 80);
    const [feedback, setFeedback] = useState(task?.feedback || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('http://localhost:5000/api/tasks/grade', {
                taskId: task.id,
                score: Number(score),
                feedback
            });
            onGraded();
            onClose();
        } catch (err) {
            alert("Failed to grade task");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-yellow-500/10 to-transparent">
                            <div>
                                <h2 className="text-xl font-bold text-white">Grade Task</h2>
                                <p className="text-gray-400 text-xs mt-1">{task.title}</p>
                            </div>
                            <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Score Input */}
                            <div className="text-center">
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Score (0-100)</label>
                                <div className="flex items-center justify-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={score}
                                        onChange={e => setScore(e.target.value)}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                    <span className="text-2xl font-bold text-yellow-500 w-12">{score}</span>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Manager Feedback</label>
                                <textarea
                                    rows="4"
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Great job on this task! Next time..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Star className="w-4 h-4 fill-current" />}
                                Submit Grade
                            </button>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GradingModal;
