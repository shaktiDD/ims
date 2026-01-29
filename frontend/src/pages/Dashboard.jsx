
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [funnel, setFunnel] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, funnelRes] = await Promise.all([
                axios.get('http://localhost:5000/api/dashboard/stats'),
                axios.get('http://localhost:5000/api/dashboard/funnel')
            ]);
            setStats(statsRes.data);
            setFunnel(funnelRes.data);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Fetching Dashboard Metrics..." />;
    if (!stats) return <div className="p-8 text-white">Failed to load dashboard data.</div>;

    return (
        <div className="p-6 space-y-8 h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Manager Dashboard</h1>
                <p className="text-gray-400">Welcome back. Here's what needs your attention.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Applicants"
                    value={stats.applicants}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Active Interns"
                    value={stats.activeInterns}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Tasks Pending Grade"
                    value={stats.pendingGrading}
                    icon={Clock}
                    color="bg-yellow-500"
                    alert={stats.pendingGrading > 0}
                />
                <StatsCard
                    title="Hired Candidates"
                    value={stats.hired}
                    icon={Trophy}
                    color="bg-purple-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recruitment Funnel */}
                <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-6">Recruitment Funnel</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnel} layout="horizontal">
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {funnel.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performers (Mini Leaderboard) */}
                <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                        <span>Top Performers</span>
                        <a href="/leaderboard" className="text-xs text-blue-400 hover:text-blue-300">View All</a>
                    </h2>
                    {/* Reusing Leaderboard logic would be ideal, but for now we link to it. 
                        We can fetch top 3 here if API supported it. 
                        Let's focus on the Funnel + Actions for this MVP.
                        We will put specific 'Action Items' list here instead. */}

                    <div className="space-y-4">
                        {stats.pendingGrading > 0 ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-4">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Grading Required</h4>
                                    <p className="text-gray-400 text-xs">You have {stats.pendingGrading} tasks waiting for review.</p>
                                </div>
                                <a href="/tasks" className="ml-auto px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-lg hover:bg-yellow-400">
                                    Grade Now
                                </a>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm italic">All caught up! No urgent actions.</div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Review New Applicants</h4>
                                <p className="text-gray-400 text-xs">Check recently uploaded resumes.</p>
                            </div>
                            <a href="/recruitment" className="ml-auto px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600">
                                View
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color, alert }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-[#111] border ${alert ? 'border-yellow-500 animate-pulse' : 'border-white/5'} p-6 rounded-2xl relative overflow-hidden`}
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4`} />

        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${color.replace('bg-', 'text-')}`}>
                <Icon className="w-6 h-6" />
            </div>
            {alert && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />}
        </div>

        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
    </motion.div>
);

export default Dashboard;
