import { useState } from "react";
import { Collection } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";
import ReviewDashboard from "./ReviewDashboard";
import EnhancedReviewSession from "./EnhancedReviewSession";

interface LearningModeProps {
    collections: Collection[];
    onCollectionsChange?: () => void;
}

function LearningMode({ collections, onCollectionsChange }: LearningModeProps) {
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
    const [showReviewSession, setShowReviewSession] = useState(false);

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
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-2xl font-bold text-white">Learning Mode</h3>
                </div>
                <p className="text-white/70">Select collections to start your review session</p>
            </div>

            {/* Selection Controls */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-indigo-900/20 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={selectAll}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-white/10 border border-white/30 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                        <CheckCircle2 className="w-4 h-4" />
                        Select all
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={deselectAll}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-white/10 border border-white/30 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                        <Circle className="w-4 h-4" />
                        Deselect
                    </Button>
                </div>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <p className="text-xs text-white/70">
                        Tap a card to toggle selection and build the vocabulary mix you want to study.
                    </p>
                    {selectedCollectionIds.length > 0 && (
                        <Badge variant="outline" className="px-3 py-1">
                            {selectedCollectionIds.length} collection{selectedCollectionIds.length !== 1 ? "s" : ""}{" "}
                            selected ({totalCards} cards, {dueCards} due)
                        </Badge>
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
                            className={`cursor-pointer transition-all duration-200 ${
                                isSelected
                                    ? "bg-indigo-500/20 border-indigo-400 ring-2 ring-indigo-400"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                            onClick={() => toggleCollection(collection.id)}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: collection.color }}
                                            />
                                            <h4 className="font-semibold text-white">{collection.name}</h4>
                                        </div>
                                        {collection.description && (
                                            <p className="text-xs text-white/60 line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-3 text-xs">
                                    <Badge variant="outline" className="text-white/70 border-white/20">
                                        {cardCount} cards
                                    </Badge>
                                    {dueCount > 0 && (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                            {dueCount} due
                                        </Badge>
                                    )}
                                </div>

                                {/* Tags */}
                                {collection.flags && collection.flags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {collection.flags.slice(0, 3).map((flag) => (
                                            <Badge
                                                key={flag}
                                                variant="outline"
                                                className="text-xs text-white/50 border-white/20">
                                                {flag}
                                            </Badge>
                                        ))}
                                        {collection.flags.length > 3 && (
                                            <Badge variant="outline" className="text-xs text-white/50 border-white/20">
                                                +{collection.flags.length - 3}
                                            </Badge>
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
                <Card className="bg-white/5 border-white/10 border-dashed">
                    <CardContent className="p-8 text-center">
                        <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">No collections available.</p>
                        <p className="text-white/50 text-sm mt-2">Create collections to start learning!</p>
                    </CardContent>
                </Card>
            )}

            {/* Review Dashboard for Selected Collections */}
            {selectedCollectionIds.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                    <ReviewDashboard
                        collectionIds={selectedCollectionIds}
                        onStartReview={() => setShowReviewSession(true)}
                    />
                </div>
            )}

            {/* Start Learning Button (if no due cards, show anyway) */}
            {selectedCollectionIds.length > 0 && dueCards === 0 && totalCards > 0 && (
                <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
                    <CardContent className="p-6 text-center">
                        <p className="text-white font-semibold mb-3">No cards due for review in selected collections</p>
                        <Button
                            onClick={() => setShowReviewSession(true)}
                            className="bg-indigo-600 hover:bg-indigo-700">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Practice Anyway ({totalCards} cards)
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Enhanced Review Session */}
            {showReviewSession && (
                <EnhancedReviewSession
                    collectionIds={selectedCollectionIds}
                    onClose={() => setShowReviewSession(false)}
                    onComplete={() => {
                        setShowReviewSession(false);
                        onCollectionsChange?.();
                    }}
                />
            )}
        </div>
    );
}

export default LearningMode;
