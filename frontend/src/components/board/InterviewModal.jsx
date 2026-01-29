import { X, Calendar, Clock, Link } from 'lucide-react';

const InterviewModal = ({ isOpen, onClose, candidate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Schedule Interview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-6">
                        <p className="text-sm text-blue-300 font-bold mb-1">Candidate</p>
                        <p className="text-white text-lg">{candidate?.name}</p>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Date</label>
                        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                            <input type="date" className="bg-transparent text-white w-full focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Time</label>
                        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
                            <Clock className="w-4 h-4 text-gray-500 mr-2" />
                            <input type="time" className="bg-transparent text-white w-full focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Meeting Link</label>
                        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
                            <Link className="w-4 h-4 text-gray-500 mr-2" />
                            <input type="text" placeholder="e.g. Zoom / Meet Link" className="bg-transparent text-white w-full focus:outline-none placeholder-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => { alert('Scheduled!'); onClose(); }} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewModal;
