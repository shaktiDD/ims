import { useDraggable } from '@dnd-kit/core';
import { User, Code, Brain } from 'lucide-react';

const CandidateCard = ({ candidate }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: candidate.entry_id.toString(),
        data: candidate
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing shadow-lg mb-3 group"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {candidate.name[0]}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">{candidate.name}</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold">{candidate.email}</p>
                    </div>
                </div>
                {candidate.ai_score && (
                    <div className={`
                        px-2 py-1 rounded-lg text-xs font-bold
                        ${candidate.ai_score >= 80 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}
                    `}>
                        {candidate.ai_score}%
                    </div>
                )}
            </div>

            {candidate.skills && candidate.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {candidate.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5">
                            {skill}
                        </span>
                    ))}
                    {candidate.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] text-gray-500">+{candidate.skills.length - 3}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CandidateCard;
