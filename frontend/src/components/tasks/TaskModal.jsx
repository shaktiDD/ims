import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Calendar, ClipboardList } from 'lucide-react';
import axios from 'axios';

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    // Form State
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'med',
        dueDate: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
            setSelectedStudentIds([]); // Reset selection
        }
    }, [isOpen]);

    const fetchStudents = async () => {
        try {
            // Only fetch students who are hired or have an offer
            const res = await axios.get('http://localhost:5000/api/students?status=hired,offered');
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students");
        }
    };

    const toggleStudent = (id) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedStudentIds.length === 0) {
            alert("Please select at least one intern.");
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/tasks', {
                studentIds: selectedStudentIds,
                ...formData,
                dueDate: formData.dueDate || null
            });
            onTaskCreated();
            onClose();
            // Reset form
            setFormData({ title: '', description: '', priority: 'med', dueDate: '' });
            setSelectedStudentIds([]);
        } catch (err) {
            alert("Failed to create tasks");
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
                        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">Assign New Task</h2>
                            <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">

                            {/* Assignee Selection (Multi-Select) */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                    Assign To ({selectedStudentIds.length} Selected)
                                </label>
                                <div className="max-h-40 overflow-y-auto border border-white/10 rounded-lg p-2 bg-black/20 space-y-1">
                                    {students.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => toggleStudent(s.id)}
                                            className={`
                                                flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                                                ${selectedStudentIds.includes(s.id) ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}
                                            `}
                                        >
                                            <div className={`
                                                w-4 h-4 rounded border flex items-center justify-center
                                                ${selectedStudentIds.includes(s.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}
                                            `}>
                                                {selectedStudentIds.includes(s.id) && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-300">{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                    placeholder="e.g. Complete Onboarding Docs"
                                />
                            </div>

                            {/* Priority & Due Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="med">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white [color-scheme:dark] focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Task details..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 mt-2 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <ClipboardList className="w-4 h-4" />}
                                Assign to {selectedStudentIds.length} Interns
                            </button>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskModal;
