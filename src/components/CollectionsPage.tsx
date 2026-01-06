import { useState } from "react";
import { Collection, CollectionCard } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import CollectionManager from "./CollectionManager";
import CardDetailDialog from "./CardDetailDialog";
import ReviewDashboard from "./ReviewDashboard";
import EnhancedReviewSession from "./EnhancedReviewSession";

interface CollectionsPageProps {
    collections: Collection[];
    onBack: () => void;
    onCollectionsChange?: () => void;
    onOpenLearningCenter?: () => void;
}

function CollectionsPage({ collections, onBack, onCollectionsChange, onOpenLearningCenter }: CollectionsPageProps) {
    const [showManager, setShowManager] = useState(false);
    const [showReviewSession, setShowReviewSession] = useState(false);
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        onClick={onBack}>
                        ← Back to learning
                    </Button>
                    {onOpenLearningCenter && (
                        <Button variant="outline" size="sm" onClick={onOpenLearningCenter} className="text-white/80">
                            Launch Learning Center
                        </Button>
                    )}
                </div>
                <div className="text-center flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Your curated collections</p>
                    <h2 className="text-2xl font-semibold text-white">Saved Learning Cards</h2>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => setShowManager((prev) => !prev)}
                    className="text-white/80 hover:text-white hover:bg-white/10">
                    {showManager ? "View Cards" : "Manage Collections"}
                </Button>
            </div>

            {showManager ? (
                <CollectionManager collections={collections} onCollectionsChange={handleCollectionsChange} />
            ) : (
                <>
                    {collections.length === 0 ? (
                        <Card className="border-dashed border-white/30 bg-white/5 text-center py-12">
                            <CardContent>
                                <p className="text-white/80">You haven&apos;t created any collections yet.</p>
                                <p className="text-white/60 text-sm mt-2">
                                    Generate a learning card and tap &quot;Save to Collection&quot; to build your
                                    personalized collections.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            <ReviewDashboard
                                collectionIds={collections.map((collection) => collection.id)}
                                onStartReview={() => setShowReviewSession(true)}
                            />

                            {collections.map((collection) => (
                                <div key={collection.id} className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: collection.color || "#3B82F6" }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                                            {collection.description && (
                                                <p className="text-sm text-white/70">{collection.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {(collection.flags || []).map((flag) => (
                                                <Badge key={flag} variant="secondary" className="text-xs">
                                                    {flag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {(collection.cards || []).length} cards
                                        </span>
                                    </div>

                                    {!(collection.cards || []).length ? (
                                        <Card className="border-dashed border-white/20 bg-white/5 text-center py-8">
                                            <CardContent>
                                                <p className="text-white/60">No cards in this collection yet.</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-3">
                                            {collection.cards
                                                .slice()
                                                .reverse()
                                                .map((card) => (
                                                    <Card
                                                        key={`${card.word}-${card.savedAt}`}
                                                        className="overflow-hidden border border-white/10 bg-white/5 shadow-md cursor-pointer transition hover:-translate-y-0.5"
                                                        onClick={() => openCardDialog(collection, card)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(event) =>
                                                            event.key === "Enter" && openCardDialog(collection, card)
                                                        }>
                                                        <div className="flex gap-4 p-4">
                                                            <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner flex-shrink-0">
                                                                <img
                                                                    src={card.imageUrl}
                                                                    alt={card.word}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(event) => {
                                                                        const target = event.target as HTMLImageElement;
                                                                        target.src = `https://via.placeholder.com/400x250/4f46e5/ffffff?text=${encodeURIComponent(
                                                                            card.word
                                                                        )}`;
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                                <div className="absolute left-3 bottom-3 text-sm text-white/90">
                                                                    {card.word}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Badge className="bg-emerald-100 text-emerald-700">
                                                                        Saved
                                                                    </Badge>
                                                                    <span className="text-xs uppercase text-white/60">
                                                                        {collection.name}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] uppercase tracking-wide text-white/50">
                                                                        Meaning
                                                                    </p>
                                                                    <p className="text-sm text-white/90 leading-snug max-h-14 overflow-hidden">
                                                                        {card.meaning}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] uppercase tracking-wide text-white/50">
                                                                        Example
                                                                    </p>
                                                                    <p className="text-sm text-white/70 italic max-h-14 overflow-hidden">
                                                                        &quot;{card.example}&quot;
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[11px] text-white/60">
                                                                    <span>
                                                                        {new Date(card.savedAt).toLocaleDateString()} •{" "}
                                                                        {new Date(card.savedAt).toLocaleTimeString()}
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-[10px] uppercase">
                                                                        {collection.cards.length} cards
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
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

            {showReviewSession && (
                <EnhancedReviewSession
                    collectionIds={collections.map((collection) => collection.id)}
                    onClose={() => setShowReviewSession(false)}
                    onComplete={() => {
                        setShowReviewSession(false);
                        handleCollectionsChange();
                    }}
                />
            )}
        </div>
    );
}

export default CollectionsPage;
