import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, UserPlus, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import axios from 'axios';

const ResumeUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [parsedCandidates, setParsedCandidates] = useState(null); // Array of { originalName, data: { name, score, ... } }
    const [onboarding, setOnboarding] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setParsedCandidates(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const handleParse = async () => {
        if (files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('resumes', file));

        try {
            // Real API Call
            const res = await axios.post('http://localhost:5000/api/intake/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setParsedCandidates(res.data.results);
        } catch (err) {
            console.error(err);
            alert("Failed to parse resumes. Check console.");
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmOnboard = async () => {
        if (!parsedCandidates) return;
        setOnboarding(true);
        try {
            const candidatesToSave = parsedCandidates.map(c => c.data);
            await axios.post('http://localhost:5000/api/intake/confirm', { candidates: candidatesToSave });
            alert("Candidates successfully onboarded to the Pipeline!");
            setFiles([]);
            setParsedCandidates(null);
        } catch (err) {
            console.error(err);
            alert("Failed to onboard candidates.");
        } finally {
            setOnboarding(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Import Talent
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Upload resumes to automatically parse and screen candidates.
                    </p>
                </div>
                <div className="text-gray-500 text-sm">
                    Supported: PDF, DOCX
                </div>
            </div>

            {/* Upload Zone (Hide if we have results to review) */}
            {!parsedCandidates && (
                <motion.div
                    {...getRootProps()}
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                        "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer overflow-hidden group",
                        isDragActive
                            ? "border-blue-400 bg-blue-500/10"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5 bg-black/20"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col items-center justify-center text-center relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            {isDragActive ? "Drop files here..." : "Drag & Drop Resumes"}
                        </h3>
                        <p className="text-gray-400 max-w-md">
                            or click to browse from your computer. Supports batch processing of up to 50 files at once.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Parsing Loading State */}
            {uploading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-400 animate-pulse">Analyzing with Gemini AI...</p>
                </div>
            )}

            {/* Staged Files List (Pre-Parsing) */}
            {!parsedCandidates && files.length > 0 && !uploading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-white/10">
                        <span>{files.length} Files Selected</span>
                        <button onClick={() => setFiles([])} className="text-red-400 hover:text-red-300 text-sm">Clear All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {files.map((file, idx) => (
                            <div key={idx} className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-white truncate">{file.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleParse}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                            <BrainCircuit className="w-5 h-5" />
                            Analyze Resumes
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Parsed Results Review */}
            {parsedCandidates && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Review Candidates</h2>
                        <button onClick={() => setParsedCandidates(null)} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {parsedCandidates.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {item.data.name}
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.data.wissen_score >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            Score: {item.data.wissen_score}/100
                                        </span>
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">{item.data.email} • {item.data.phone}</p>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {item.data.skills?.slice(0, 5).map((skill, sIdx) => (
                                            <span key={sIdx} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-gray-500 mb-1">Status</div>
                                    <div className="text-blue-400 font-medium">Ready to Screen</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 gap-4">
                        <button
                            onClick={handleConfirmOnboard}
                            disabled={onboarding}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                            {onboarding ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            Confirm & Onboard {parsedCandidates.length} Candidates
                        </button>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default ResumeUpload;
