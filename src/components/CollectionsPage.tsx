import { useState } from "react";
import { Collection, CollectionCard } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import CollectionManager from "./CollectionManager";
import CardDetailDialog from "./CardDetailDialog";
import ReviewDashboard from "./ReviewDashboard";

interface CollectionsPageProps {
    collections: Collection[];
    onBack: () => void;
    onCollectionsChange?: () => void;
    onOpenLearningCenter?: () => void;
    onViewCollection?: (collectionId: string) => void;
    onStartReview?: (collectionIds: string[], mode: "due" | "all") => void;
}

function CollectionsPage({
    collections,
    onBack,
    onCollectionsChange,
    onOpenLearningCenter,
    onViewCollection,
    onStartReview,
}: CollectionsPageProps) {
    const [showManager, setShowManager] = useState(false);
    const [selectedCardInfo, setSelectedCardInfo] = useState<{
        card: CollectionCard;
        collectionId: string;
        collectionName: string;
    } | null>(null);

    const handleCollectionsChange = () => {
        onCollectionsChange?.();
    };

    const openCardDialog = (collection: Collection, card: CollectionCard) => {
        setSelectedCardInfo({
            card,
            collectionId: collection.id,
            collectionName: collection.name,
        });
    };

    const closeCardDialog = () => {
        setSelectedCardInfo(null);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-block">
                    <h1
                        className="text-5xl font-black text-gray-800"
                        style={{ textShadow: "3px 3px 0 rgba(255,200,0,0.3)" }}>
                        📚 My Collection
                    </h1>
                    <p className="text-gray-600 font-bold text-lg mt-2">Your personalized learning library! 🎉</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                        onClick={onBack}
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-6 py-3 rounded-full border-3 border-gray-400 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 transition-all">
                        ← Back
                    </Button>
                    {onOpenLearningCenter && (
                        <Button
                            onClick={onOpenLearningCenter}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black px-6 py-3 rounded-full border-3 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                            Learning Center
                        </Button>
                    )}
                    <Button
                        onClick={() => setShowManager((prev) => !prev)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black px-6 py-3 rounded-full border-3 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        {showManager ? "View Cards" : "Manage Collections"}
                    </Button>
                </div>
            </div>

            {showManager ? (
                <CollectionManager collections={collections} onCollectionsChange={handleCollectionsChange} />
            ) : (
                <>
                    {collections.length === 0 ? (
                        <Card className="border-dashed border-4 border-gray-300 bg-gray-50 text-center py-16 rounded-3xl">
                            <CardContent className="space-y-4">
                                <div className="text-7xl">📖</div>
                                <p className="text-gray-800 font-black text-2xl">No Collections Yet!</p>
                                <p className="text-gray-600 font-semibold text-lg max-w-md mx-auto">
                                    Start your learning journey by creating cards and saving them to collections! ✨
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            <ReviewDashboard
                                collectionIds={collections.map((collection) => collection.id)}
                                onStartReview={() =>
                                    onStartReview?.(
                                        collections.map((c) => c.id),
                                        "due"
                                    )
                                }
                            />

                            {collections.map((collection) => (
                                <div key={collection.id} className="space-y-4">
                                    {/* Collection Header */}
                                    <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-2xl border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                                        <div
                                            className="w-8 h-8 rounded-full border-3 border-white shadow-lg flex-shrink-0"
                                            style={{ backgroundColor: collection.color || "#3B82F6" }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl font-black text-gray-800">{collection.name}</h3>
                                            {collection.description && (
                                                <p className="text-gray-600 font-semibold mt-1">
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {(collection.flags || []).map((flag) => (
                                                <span
                                                    key={flag}
                                                    className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-full border-2 border-purple-300">
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="bg-yellow-100 text-yellow-800 font-black px-4 py-2 rounded-full border-2 border-yellow-400 text-sm">
                                            {(collection.cards || []).length} 📄
                                        </div>
                                    </div>

                                    {!(collection.cards || []).length ? (
                                        <Card className="border-dashed border-3 border-gray-300 bg-gray-50 text-center py-10 rounded-2xl">
                                            <CardContent>
                                                <div className="text-4xl mb-3">📝</div>
                                                <p className="text-gray-600 font-bold text-lg">No cards yet!</p>
                                                <p className="text-gray-500 font-medium text-sm mt-1">
                                                    Start adding words to this collection! ✨
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Show only first 3 cards */}
                                            {collection.cards
                                                .slice()
                                                .reverse()
                                                .slice(0, 2)
                                                .map((card) => (
                                                    <Card
                                                        key={`${card.word}-${card.savedAt}`}
                                                        className="overflow-hidden border-3 border-black bg-white shadow-[0_6px_0_rgba(0,0,0,0.2)] rounded-2xl cursor-pointer transition-all hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] hover:-translate-y-1"
                                                        onClick={() => openCardDialog(collection, card)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(event) =>
                                                            event.key === "Enter" && openCardDialog(collection, card)
                                                        }>
                                                        <div className="flex gap-5 p-5">
                                                            {/* Card Image */}
                                                            <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg flex-shrink-0 border-3 border-black">
                                                                <img
                                                                    src={card.imageUrl}
                                                                    alt={card.word}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(event) => {
                                                                        const target = event.target as HTMLImageElement;
                                                                        target.src = `https://via.placeholder.com/400x250/FFD700/8B4513?text=${encodeURIComponent(
                                                                            card.word
                                                                        )}`;
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                                                <div className="absolute left-2 bottom-2 text-lg font-black text-white capitalize drop-shadow-lg">
                                                                    {card.word}
                                                                </div>
                                                            </div>

                                                            {/* Card Content */}
                                                            <div className="flex-1 space-y-3 min-w-0">
                                                                {/* Top Row: Badge & Collection */}
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full border-2 border-green-400">
                                                                        ✓ Saved
                                                                    </span>
                                                                    <span className="text-xs font-bold text-gray-500 truncate">
                                                                        {collection.name}
                                                                    </span>
                                                                </div>

                                                                {/* Meaning */}
                                                                <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
                                                                    <p className="text-[10px] font-black uppercase tracking-wide text-purple-600 mb-1">
                                                                        📖 Meaning
                                                                    </p>
                                                                    <p className="text-sm text-gray-800 font-semibold leading-snug line-clamp-2">
                                                                        {card.meaning}
                                                                    </p>
                                                                </div>

                                                                {/* Example */}
                                                                <div className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
                                                                    <p className="text-[10px] font-black uppercase tracking-wide text-yellow-700 mb-1">
                                                                        💡 Example
                                                                    </p>
                                                                    <p className="text-sm text-gray-700 font-medium italic line-clamp-2">
                                                                        &quot;{card.example}&quot;
                                                                    </p>
                                                                </div>

                                                                {/* Footer */}
                                                                <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-1">
                                                                    <span>
                                                                        {new Date(card.savedAt).toLocaleDateString()}
                                                                    </span>
                                                                    <span className="text-gray-400">
                                                                        Click to view details →
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}

                                            {/* View All Button */}
                                            {(collection.cards || []).length > 2 && (
                                                <div className="text-center pt-4">
                                                    <Button
                                                        onClick={() => onViewCollection?.(collection.id)}
                                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-black px-6 py-3 rounded-full border-3 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                                                        👀 View All Cards
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {selectedCardInfo && (
                <CardDetailDialog
                    open={Boolean(selectedCardInfo)}
                    onOpenChange={(open) => {
                        if (!open) closeCardDialog();
                    }}
                    card={selectedCardInfo.card}
                    collectionId={selectedCardInfo.collectionId}
                    collectionName={selectedCardInfo.collectionName}
                    onUpdated={() => {
                        handleCollectionsChange();
                    }}
                    onDeleted={() => {
                        handleCollectionsChange();
                        closeCardDialog();
                    }}
                />
            )}
        </div>
    );
}

export default CollectionsPage;
