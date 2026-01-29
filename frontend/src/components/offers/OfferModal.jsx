import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, DollarSign, Briefcase, Calendar } from 'lucide-react';
import axios from 'axios';
import { cn } from '../../lib/utils';

const OfferModal = ({ isOpen, onClose, candidate, onOfferSent }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        stipend: '',
        role: 'Full Stack Intern',
        startDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/offers/create', {
                studentId: candidate.student_id,
                stipend: formData.stipend,
                role: formData.role,
                startDate: formData.startDate
            });
            onOfferSent();
            onClose();
            alert(`Offer sent to ${candidate.name}!`);
        } catch (err) {
            console.error("Offer Error:", err);
            alert("Failed to send offer.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-blue-500/10"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Generate Offer</h2>
                                    <p className="text-gray-400 text-sm">for {candidate?.name}</p>
                                </div>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">

                                {/* Role Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        Role Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                        placeholder="e.g. Software Engineer Intern"
                                    />
                                </div>

                                {/* Stipend Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        Monthly Stipend (INR)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stipend}
                                        onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                        placeholder="e.g. 25000"
                                    />
                                </div>

                                {/* Start Date Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Send Offer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OfferModal;
