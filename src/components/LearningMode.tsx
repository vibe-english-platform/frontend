import { useState } from "react";
import { Collection } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";
import ReviewDashboard from "./ReviewDashboard";

interface LearningModeProps {
    collections: Collection[];
    onStartReview: (collectionIds: string[], mode: "due" | "all") => void;
}

function LearningMode({ collections, onStartReview }: LearningModeProps) {
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

    const toggleCollection = (collectionId: string) => {
        setSelectedCollectionIds((prev) =>
            prev.includes(collectionId) ? prev.filter((id) => id !== collectionId) : [...prev, collectionId]
        );
    };

    const selectAll = () => {
        setSelectedCollectionIds(collections.map((c) => c.id));
    };

    const deselectAll = () => {
        setSelectedCollectionIds([]);
    };

    const selectedCollections = collections.filter((c) => selectedCollectionIds.includes(c.id));
    const totalCards = selectedCollections.reduce((sum, col) => sum + (col.cards?.length || 0), 0);
    const dueCards = selectedCollections.reduce(
        (sum, col) => sum + (col.cards?.filter((card) => new Date(card.nextReviewDate) <= new Date()).length || 0),
        0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center bg-white rounded-2xl p-6 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    <h3 className="text-3xl font-black text-gray-800">Choose Your Study Set</h3>
                </div>
                <p className="text-gray-600 font-semibold text-lg">Pick collections and start learning!</p>
            </div>

            {/* Selection Controls */}
            <div className="flex flex-col gap-4 rounded-2xl border-3 border-gray-300 bg-gray-50 p-5 shadow-lg md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={selectAll}
                        className="flex items-center gap-2 px-5 py-2 font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-full border-2 border-black shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:shadow-[0_1px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                        Select All
                    </Button>
                    <Button
                        onClick={deselectAll}
                        className="flex items-center gap-2 px-5 py-2 font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full border-2 border-gray-400 shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 transition-all">
                        <Circle className="w-4 h-4" />
                        Clear
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 font-semibold">
                        Click cards below to build your study set! ✨
                    </p>
                    {selectedCollectionIds.length > 0 && (
                        <div className="px-4 py-2 bg-purple-100 text-purple-800 font-bold text-sm rounded-full border-2 border-purple-400">
                            {selectedCollectionIds.length} collection{selectedCollectionIds.length !== 1 ? "s" : ""} • {totalCards} cards • {dueCards} due
                        </div>
                    )}
                </div>
            </div>

            {/* Collection Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => {
                    const isSelected = selectedCollectionIds.includes(collection.id);
                    const cardCount = collection.cards?.length || 0;
                    const dueCount =
                        collection.cards?.filter((card) => new Date(card.nextReviewDate) <= new Date()).length || 0;

                    return (
                        <Card
                            key={collection.id}
                            className={`cursor-pointer transition-all duration-200 rounded-2xl border-3 shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 ${
                                isSelected
                                    ? "bg-purple-50 border-purple-500 ring-4 ring-purple-300"
                                    : "bg-white border-gray-300 hover:border-purple-300"
                            }`}
                            onClick={() => toggleCollection(collection.id)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div
                                                className="w-5 h-5 rounded-full border-2 border-white shadow-md flex-shrink-0"
                                                style={{ backgroundColor: collection.color }}
                                            />
                                            <h4 className="font-black text-gray-800 truncate">{collection.name}</h4>
                                        </div>
                                        {collection.description && (
                                            <p className="text-sm text-gray-600 font-semibold line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                    {isSelected ? (
                                        <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 ml-2" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-gray-300 flex-shrink-0 ml-2" />
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full border-2 border-blue-300">
                                        {cardCount} 📄
                                    </span>
                                    {dueCount > 0 && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full border-2 border-green-400">
                                            {dueCount} due! ⏰
                                        </span>
                                    )}
                                </div>

                                {/* Tags */}
                                {collection.flags && collection.flags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 border-t-2 border-gray-200 pt-3">
                                        {collection.flags.slice(0, 3).map((flag) => (
                                            <span
                                                key={flag}
                                                className="px-2 py-1 bg-purple-100 text-purple-700 font-semibold text-xs rounded-full border border-purple-300">
                                                {flag}
                                            </span>
                                        ))}
                                        {collection.flags.length > 3 && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 font-semibold text-xs rounded-full border border-purple-300">
                                                +{collection.flags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* No collections message */}
            {collections.length === 0 && (
                <Card className="bg-gray-50 border-dashed border-3 border-gray-300 rounded-2xl">
                    <CardContent className="p-12 text-center space-y-4">
                        <div className="text-6xl">📚</div>
                        <p className="text-gray-800 font-black text-2xl">No Collections Yet!</p>
                        <p className="text-gray-600 font-semibold text-lg">
                            Create collections and save cards to start learning! 🚀
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Review Dashboard for Selected Collections */}
            {selectedCollectionIds.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                    <ReviewDashboard
                        collectionIds={selectedCollectionIds}
                        onStartReview={() => onStartReview(selectedCollectionIds, "due")}
                    />
                </div>
            )}

            {/* Start Learning Button (if no due cards, show anyway) */}
            {selectedCollectionIds.length > 0 && dueCards === 0 && totalCards > 0 && (
                <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-2xl shadow-lg">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="text-4xl">🎓</div>
                        <p className="text-gray-800 font-black text-xl">All Caught Up!</p>
                        <p className="text-gray-700 font-bold">No cards due right now, but you can still practice!</p>
                        <Button
                            onClick={() => onStartReview(selectedCollectionIds, "all")}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black px-8 py-4 rounded-full border-3 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Practice All {totalCards} Cards
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default LearningMode;
