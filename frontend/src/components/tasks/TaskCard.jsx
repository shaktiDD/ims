import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`
                bg-[#1a1a1a] p-4 rounded-xl border border-white/5 
                hover:border-blue-500/30 transition-all mb-3 group cursor-grab active:cursor-grabbing
                ${isDragging ? 'opacity-50 z-50 ring-2 ring-blue-500' : 'opacity-100'}
            `}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-sm">{task.title}</h4>
                <div className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider 
                    ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'med' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'}`}>
                    {task.priority}
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {task.student_name ? task.student_name[0] : '?'}
                    </div>
                    <span className="truncate max-w-[80px]">{task.student_name}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
