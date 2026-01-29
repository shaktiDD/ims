import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Sparkles } from 'lucide-react';
import ReportModal from '../components/reports/ReportModal';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/gamification/leaderboard');
            setLeaderboard(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
        if (index === 2) return <Award className="w-6 h-6 text-orange-400" />;
        return <span className="font-bold text-gray-500">#{index + 1}</span>;
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Intern Leaderboard
            </h1>
            <p className="text-gray-400 mb-8">Top performers based on task completion and quality.</p>

            <div className="space-y-4">
                {leaderboard.map((student, index) => (
                    <div
                        key={student.id}
                        className={`
                            p-4 rounded-xl flex items-center justify-between
                            ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/30' : 'bg-[#1a1a1a] border border-white/5'}
                        `}
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 flex justify-center">{getRankIcon(index)}</div>

                            <div>
                                <h3 className={`text-lg font-bold ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                                    {student.name}
                                </h3>
                                <p className="text-xs text-gray-500">{student.completed_tasks} Tasks Completed</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{student.average_score || 0}</div>
                                <div className="text-[10px] uppercase text-gray-500 font-bold">Avg Score</div>
                            </div>

                            <button
                                onClick={() => setSelectedStudent(student)}
                                className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2"
                                title="Generate Performance Report"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-bold">Report</span>
                            </button>
                        </div>
                    </div>
                ))}

                {leaderboard.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No graded tasks yet. Start grading to populate the leaderboard!
                    </div>
                )}
            </div>

            {selectedStudent && (
                <ReportModal
                    isOpen={!!selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                />
            )}
        </div>
    );
};

export default Leaderboard;
