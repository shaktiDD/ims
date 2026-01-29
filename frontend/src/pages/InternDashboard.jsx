import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { Circle, Clock, CheckCircle2, User, LogOut } from 'lucide-react'; // Added LogOut
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskCard from '../components/tasks/TaskCard';

const InternDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [tasks, setTasks] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [stats, setStats] = useState({ completed: 0, avgScore: 0 });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Fetch Tasks on Mount (using logged in user.id)
    useEffect(() => {
        if (user?.id) {
            fetchMyTasks();
        }
    }, [user]);

    const fetchMyTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tasks?studentId=${user.id}`);
            const myTasks = res.data;
            setTasks(myTasks);

            // Calculate Stats
            const completed = myTasks.filter(t => t.status === 'done').length;
            const scoredTasks = myTasks.filter(t => t.score != null);
            const totalScore = scoredTasks.reduce((acc, t) => acc + t.score, 0);
            const avgScore = scoredTasks.length ? (totalScore / scoredTasks.length).toFixed(1) : 0;

            setStats({ completed, avgScore });
        } catch (err) { console.error(err); }
    };

    const handleDragStart = (e) => setActiveId(e.active.id);

    const handleDragEnd = async (e) => {
        const { active, over } = e;
        if (!over) { setActiveId(null); return; }

        const activeTaskId = active.id;
        const targetStatus = over.id;
        const activeTask = tasks.find(t => t.id === activeTaskId);

        if (activeTask && activeTask.status !== targetStatus) {
            const oldStatus = activeTask.status;
            setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, status: targetStatus } : t));

            try {
                await axios.put('http://localhost:5000/api/tasks/status', {
                    taskId: activeTaskId,
                    status: targetStatus
                });
                fetchMyTasks();
            } catch (err) {
                setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, status: oldStatus } : t));
            }
        }
        setActiveId(null);
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);
    const getActiveTask = () => tasks.find(t => t.id === activeId);

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 font-outfit text-white">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-end bg-[#111] p-6 rounded-2xl border border-white/5">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Welcome, {user?.name.split(' ')[0]}
                        </h1>
                        <p className="text-gray-400 mt-1">Here is your mission update.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Stats Pills */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-green-500/10 border border-green-500/20 px-5 py-3 rounded-xl flex flex-col items-center">
                                <span className="text-2xl font-bold text-green-400">{stats.completed}</span>
                                <span className="text-[10px] uppercase text-green-500/60 font-bold tracking-wider">Completed</span>
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 px-5 py-3 rounded-xl flex flex-col items-center">
                                <span className="text-2xl font-bold text-yellow-400">{stats.avgScore}</span>
                                <span className="text-[10px] uppercase text-yellow-500/60 font-bold tracking-wider">Avg Score</span>
                            </div>
                        </div>

                        {/* Profile & Logout */}
                        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white">{user?.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task Board */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                        <TaskColumn id="todo" title="To Do" tasks={getTasksByStatus('todo')} icon={Circle} colorClass="text-gray-400" />
                        <TaskColumn id="in_progress" title="In Progress" tasks={getTasksByStatus('in_progress')} icon={Clock} colorClass="text-blue-400" />
                        <TaskColumn id="done" title="Done" tasks={getTasksByStatus('done')} icon={CheckCircle2} colorClass="text-green-400" />
                    </div>
                    <DragOverlay>
                        {activeId ? <TaskCard task={getActiveTask()} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default InternDashboard;
