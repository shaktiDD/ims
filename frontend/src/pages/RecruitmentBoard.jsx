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
import Column from '../components/board/Column';
import CandidateCard from '../components/board/CandidateCard';
import InterviewModal from '../components/board/InterviewModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OfferModal from '../components/offers/OfferModal';

const RecruitmentBoard = () => {
    const [stages, setStages] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null); // For Interview
    const [offerCandidate, setOfferCandidate] = useState(null); // For Offer

    // Sensors for better drag control
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        fetchBoardData();
    }, []);

    const fetchBoardData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/board');
            setStages(res.data.stages);
            setCandidates(res.data.entries);
        } catch (err) {
            console.error("Failed to load board", err);
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

        const candidateId = active.id;
        const stageId = over.id;

        const candidate = candidates.find(c => c.entry_id.toString() === candidateId);

        if (candidate && candidate.stage_id.toString() !== stageId) {
            const oldStageId = candidate.stage_id;

            // Optimistic Update
            setCandidates(prev => prev.map(c =>
                c.entry_id.toString() === candidateId
                    ? { ...c, stage_id: parseInt(stageId) }
                    : c
            ));

            // Check if dropped into 'Hired'
            const targetStage = stages.find(s => s.id.toString() === stageId);
            if (targetStage && targetStage.stage_name === 'Hired') {
                setOfferCandidate({ ...candidate, student_id: candidate.student_id });
            }

            try {
                await axios.put('http://localhost:5000/api/board/move', {
                    entryId: candidate.entry_id,
                    targetStageId: parseInt(stageId)
                });
            } catch (err) {
                console.error("Move failed", err);
                setCandidates(prev => prev.map(c =>
                    c.entry_id.toString() === candidateId
                        ? { ...c, stage_id: oldStageId }
                        : c
                ));
            }
        }
        setActiveId(null);
    };

    const getActiveCandidate = () => {
        return candidates.find(c => c.entry_id.toString() === activeId);
    };

    if (loading) return <LoadingSpinner text="Loading Pipeline..." />;

    return (
        <div className="h-full overflow-x-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Recruitment Pipeline</h1>
                <div className="text-sm text-gray-500">Drag candidates between stages</div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 h-[calc(100vh-140px)] min-w-[1000px]">
                    {stages.map(stage => {
                        const stageCandidates = candidates.filter(c => c.stage_id === stage.id);
                        return (
                            <div key={stage.id} className="w-80 flex-shrink-0 h-full">
                                <Column
                                    id={stage.id}
                                    title={stage.stage_name}
                                    candidates={stageCandidates}
                                    count={stageCandidates.length}
                                />
                            </div>
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeId ? <CandidateCard candidate={getActiveCandidate()} /> : null}
                </DragOverlay>
            </DndContext>

            <InterviewModal
                isOpen={!!selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                candidate={selectedCandidate}
            />

            <OfferModal
                isOpen={!!offerCandidate}
                onClose={() => setOfferCandidate(null)}
                candidate={offerCandidate}
                onOfferSent={() => {
                    // Refresh data or update status if needed
                    fetchBoardData(); // Simplest way to ensure sync
                }}
            />
        </div>
    );
};

export default RecruitmentBoard;
