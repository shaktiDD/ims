import { useDroppable } from '@dnd-kit/core';
import CandidateCard from './CandidateCard';

const Column = ({ id, title, candidates = [], count }) => {
    const { setNodeRef } = useDroppable({
        id: id.toString()
    });

    return (
        <div className="flex flex-col h-full bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                <h3 className="font-bold text-gray-300 text-sm uppercase tracking-wider">{title}</h3>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white font-mono">{count}</span>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[#0a0a0a]/50">
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.entry_id}
                        candidate={candidate}
                    />
                ))}
                {candidates.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                        <p className="text-gray-600 text-xs italic">Drop here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
