import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ReportModal = ({ isOpen, onClose, studentId, studentName }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/reports/generate', { studentId });
            setReport(res.data.report);
        } catch (error) {
            console.error("Failed to generate report", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        if (!email) return;
        try {
            await axios.post('http://localhost:5000/api/reports/email', { email, report });
            setEmailSent(true);
            setTimeout(() => {
                onClose();
                setReport(null);
                setEmailSent(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to send email", error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">AI Performance Review</h2>
                                <p className="text-gray-400 text-sm">Generating report for {studentName}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        {!report && !loading && (
                            <div className="text-center py-12">
                                <Sparkles className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
                                <p className="text-gray-400 mb-6">Ready to generate a comprehensive performance analysis using Gemini AI.</p>
                                <button
                                    onClick={handleGenerate}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate Report
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-purple-400 animate-pulse">Analyzing task history & feedback...</p>
                            </div>
                        )}

                        {report && (
                            <div className="prose prose-invert max-w-none">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-300">
                                    <ReactMarkdown>{report}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Email Action */}
                    {report && (
                        <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
                            {!emailSent ? (
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            placeholder="Enter recipient email..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={!email}
                                        className="px-6 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Report
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold animate-in fade-in slide-in-from-bottom-2">
                                    <Send className="w-4 h-4" />
                                    Email Sent Successfully!
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReportModal;
