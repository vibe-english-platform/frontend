import { Collection } from "../types";
import { Button } from "./ui/button";
import LearningMode from "./LearningMode";

interface LearningCenterPageProps {
    collections: Collection[];
    onBack: () => void;
    onCollectionsChange?: () => void;
}

function LearningCenterPage({ collections, onBack, onCollectionsChange }: LearningCenterPageProps) {
    return (
        <div className="space-y-6 max-w-6xl mx-auto py-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={onBack}>
                    ← Back to collections
                </Button>
                <div className="text-center flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Learning Center</p>
                    <h1 className="text-3xl font-semibold text-white">Practice with your collections</h1>
                </div>
                <div className="w-24" />
            </div>

            <LearningMode collections={collections} onCollectionsChange={onCollectionsChange} />
        </div>
    );
}

export default LearningCenterPage;


