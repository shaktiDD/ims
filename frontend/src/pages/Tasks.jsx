import { useState, useEffect } from 'react';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import TaskModal from '../components/tasks/TaskModal';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskCard from '../components/tasks/TaskCard';
import GradingModal from '../components/grading/GradingModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    // Grading State
    const [gradingTask, setGradingTask] = useState(null);
    const [gradingOpen, setGradingOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTaskId = active.id;
        const targetStatus = over.id;

        const activeTask = tasks.find(t => t.id === activeTaskId);

        if (activeTask && activeTask.status !== targetStatus) {
            const oldStatus = activeTask.status;
            setTasks(prev => prev.map(t =>
                t.id === activeTaskId ? { ...t, status: targetStatus } : t
            ));

            try {
                await axios.put('http://localhost:5000/api/tasks/status', {
                    taskId: activeTaskId,
                    status: targetStatus
                });
            } catch (err) {
                console.error("Move failed, reverting...", err);
                setTasks(prev => prev.map(t =>
                    t.id === activeTaskId ? { ...t, status: oldStatus } : t
                ));
            }
        }
        setActiveId(null);
    };

    const handleTaskClick = (task) => {
        if (task.status === 'done') {
            setGradingTask(task);
            setGradingOpen(true);
        }
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);
    const getActiveTask = () => tasks.find(t => t.id === activeId);

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Task Board
                    </h1>
                    <p className="text-gray-500 text-sm">Manage intern assignments</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {/* Read-Only Manager View */}
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                <TaskColumn
                    id="todo"
                    title="To Do"
                    tasks={getTasksByStatus('todo')}
                    icon={Circle}
                    colorClass="text-gray-400"
                />
                <TaskColumn
                    id="in_progress"
                    title="In Progress"
                    tasks={getTasksByStatus('in_progress')}
                    icon={Clock}
                    colorClass="text-blue-400"
                />
                <TaskColumn
                    id="done"
                    title="Done"
                    tasks={getTasksByStatus('done').filter(t => t.score == null)}
                    icon={CheckCircle2}
                    colorClass="text-green-400"
                    onTaskClick={handleTaskClick}
                />
            </div>

            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onTaskCreated={fetchTasks}
            />

            {gradingTask && (
                <GradingModal
                    isOpen={gradingOpen}
                    onClose={() => setGradingOpen(false)}
                    task={gradingTask}
                    onGraded={fetchTasks}
                />
            )}
        </div>
    );
};

export default Tasks;
