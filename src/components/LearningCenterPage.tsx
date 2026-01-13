import { Collection } from "../types";
import { Button } from "./ui/button";
import LearningMode from "./LearningMode";

interface LearningCenterPageProps {
    collections: Collection[];
    onBack: () => void;
    onStartReview: (collectionIds: string[], mode: "due" | "all") => void;
    onCollectionsChange?: () => void;
}

function LearningCenterPage({ collections, onBack, onStartReview }: LearningCenterPageProps) {
    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-block">
                    <h1
                        className="text-5xl font-black text-gray-800"
                        style={{ textShadow: "3px 3px 0 rgba(255,200,0,0.3)" }}>
                        🎯 Learning Center
                    </h1>
                    <p className="text-gray-600 font-bold text-lg mt-2">Practice and master your vocabulary! 🚀</p>
                </div>

                {/* Back Button */}
                <Button
                    onClick={onBack}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-6 py-3 rounded-full border-3 border-gray-400 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 transition-all">
                    ← Back to Collections
                </Button>
            </div>

            <LearningMode collections={collections} onStartReview={onStartReview} />
        </div>
    );
}

export default LearningCenterPage;
