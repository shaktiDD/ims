import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Briefcase, Settings, LogOut, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['manager'] },
        { icon: Users, label: 'Recruitment', path: '/recruitment', roles: ['manager'] },
        { icon: FileText, label: 'Resume Import', path: '/import', roles: ['manager'] },
        { icon: Briefcase, label: 'Intern Tasks', path: '/tasks', roles: ['manager'] }, // Manager view of tasks
        { icon: User, label: 'Intern Portal', path: '/intern', roles: ['intern', 'manager'] }, // Manager can view for debugging, but user asked to hide it.
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', roles: ['manager', 'intern'] },
    ];

    // Filter items based on user role
    // User asked to REMOVE Intern Portal from dashboard view, so I will restrict it to 'intern' only, 
    // or maybe add a specific condition.
    // Let's stick to the user's request: "why i am stil getting th eoption of intern portal in the sidebar"

    const menuItems = allMenuItems.filter(item => {
        if (!user) return false;
        // Specific fix: Hide 'Intern Portal' for managers if they don't want it.
        if (user.role === 'manager' && item.path === '/intern') return false;

        return item.roles.includes(user.role);
    });

    return (
        <div className="h-screen w-64 flex flex-col justify-between p-4 border-r border-white/10 bg-black/40 backdrop-blur-xl z-50 flex-shrink-0">

            {/* Logo Area */}
            <div className="flex items-center gap-3 px-4 py-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Wissen IMS
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-8 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.button
                            key={item.path}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-50"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'group-hover:text-white transition-colors'}`} />
                            <span className="font-medium z-10">{item.label}</span>
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="mt-auto space-y-2 pt-8 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
