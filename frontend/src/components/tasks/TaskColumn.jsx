import { useDroppable } from '@dnd-kit/core';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskColumn = ({ id, title, tasks, icon: Icon, colorClass, onTaskClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full bg-[#111] rounded-2xl p-4 border border-white/5">
            <div className={`flex items-center gap-2 mb-4 text-sm font-medium uppercase tracking-wider ${colorClass}`}>
                <Icon className="w-4 h-4" /> {title} ({tasks.length})
            </div>

            <div
                ref={setNodeRef}
                className={`
                    flex-1 overflow-y-auto custom-scrollbar pr-2 rounded-xl transition-colors
                    ${isOver ? 'bg-blue-500/5 ring-1 ring-blue-500/20' : ''}
                `}
            >
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick && onTaskClick(task)}
                    />
                ))}

                {tasks.length === 0 && !isOver && (
                    <div className="h-20 flex items-center justify-center text-gray-600/50 text-xs italic border-2 border-dashed border-white/5 rounded-lg mt-2">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;
