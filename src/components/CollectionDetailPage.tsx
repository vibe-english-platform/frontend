import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collection, CollectionCard } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import CardDetailDialog from "./CardDetailDialog";
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";

interface CollectionDetailPageProps {
    collections: Collection[];
    onCollectionsChange?: () => void;
}

function CollectionDetailPage({ collections, onCollectionsChange }: CollectionDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCardInfo, setSelectedCardInfo] = useState<{
        card: CollectionCard;
        collectionId: string;
        collectionName: string;
    } | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const cardsPerPage = 12;

    useEffect(() => {
        if (id && collections.length > 0) {
            const foundCollection = collections.find((c) => c.id === id);
            if (foundCollection) {
                setCollection(foundCollection);
            } else {
                // Collection not found, redirect back
                navigate("/collections");
            }
            setLoading(false);
        }
    }, [id, collections, navigate]);

    const handleCollectionsChange = () => {
        onCollectionsChange?.();
        // Refresh current collection data
        if (id) {
            const updatedCollection = collections.find((c) => c.id === id);
            if (updatedCollection) {
                setCollection(updatedCollection);
            }
        }
    };

    const openCardDialog = (card: CollectionCard) => {
        if (collection) {
            setSelectedCardInfo({
                card,
                collectionId: collection.id,
                collectionName: collection.name,
            });
        }
    };

    const closeCardDialog = () => {
        setSelectedCardInfo(null);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white border-3 border-gray-300 rounded-2xl p-4 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-xl mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">Collection Not Found</h1>
                <p className="text-gray-600 font-semibold mb-6">
                    The collection you&apos;re looking for doesn&apos;t exist.
                </p>
                <Button
                    onClick={() => navigate("/collections")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black px-6 py-3 rounded-full border-3 border-black">
                    ← Back to Collections
                </Button>
            </div>
        );
    }

    const totalCards = collection.cards?.length || 0;
    const totalPages = Math.ceil(totalCards / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = collection.cards?.slice().reverse().slice(startIndex, endIndex) || [];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate("/collections")}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-4 py-2 rounded-full border-3 border-gray-400 shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 transition-all">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div
                                    className="w-6 h-6 rounded-full border-3 border-white shadow-lg flex-shrink-0"
                                    style={{ backgroundColor: collection.color || "#3B82F6" }}
                                />
                                <h1 className="text-3xl font-black text-gray-800">{collection.name}</h1>
                            </div>
                            {collection.description && (
                                <p className="text-gray-600 font-semibold">{collection.description}</p>
                            )}
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-full border-3 border-gray-300 p-1">
                        <Button
                            onClick={() => setViewMode("grid")}
                            size="icon"
                            className={`p-2 rounded-full transition-all ${
                                viewMode === "grid"
                                    ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg"
                                    : "text-gray-900 bg-gray-200 hover:bg-gray-100"
                            }`}>
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => setViewMode("list")}
                            size="icon"
                            className={`p-2 rounded-full transition-all ${
                                viewMode === "list"
                                    ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg"
                                    : "text-gray-900 bg-gray-200 hover:bg-gray-100"
                            }`}>
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="bg-blue-100 text-blue-800 font-black px-4 py-2 rounded-full border-2 border-blue-400">
                        {totalCards} Total Cards
                    </div>
                    {collection.flags && collection.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {collection.flags.map((flag) => (
                                <span
                                    key={flag}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-full border-2 border-purple-300">
                                    {flag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cards Display */}
            {totalCards === 0 ? (
                <Card className="border-dashed border-3 border-gray-300 bg-gray-50 text-center py-16 rounded-2xl">
                    <CardContent>
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-600 font-bold text-xl">No cards in this collection yet!</p>
                        <p className="text-gray-500 font-medium text-lg mt-2">
                            Start adding words to build your collection! ✨
                        </p>
                    </CardContent>
                </Card>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentCards.map((card) => (
                        <Card
                            key={`${card.word}-${card.savedAt}`}
                            className="overflow-hidden border-3 border-black bg-white shadow-[0_6px_0_rgba(0,0,0,0.2)] rounded-2xl cursor-pointer transition-all hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] hover:-translate-y-1"
                            onClick={() => openCardDialog(card)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => event.key === "Enter" && openCardDialog(card)}>
                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 border-b-3 border-black">
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
                                <div className="absolute left-3 bottom-3 text-xl font-black text-white capitalize drop-shadow-lg">
                                    {card.word}
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full border border-green-400">
                                            ✓ Saved
                                        </span>
                                        <span className="text-xs text-gray-500 font-semibold">
                                            {new Date(card.savedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-semibold line-clamp-2 leading-relaxed">
                                        <span className="text-purple-600 font-bold">Meaning:</span> {card.meaning}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium line-clamp-2 italic">
                                        <span className="text-yellow-600 font-bold">Example:</span> &quot;{card.example}
                                        &quot;
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4 mb-8">
                    {currentCards.map((card) => (
                        <Card
                            key={`${card.word}-${card.savedAt}`}
                            className="overflow-hidden border-3 border-black bg-white shadow-[0_6px_0_rgba(0,0,0,0.2)] rounded-2xl cursor-pointer transition-all hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] hover:-translate-y-1"
                            onClick={() => openCardDialog(card)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => event.key === "Enter" && openCardDialog(card)}>
                            <CardContent className="p-6">
                                <div className="flex gap-5">
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
                                        {/* Top Row: Badge & Date */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full border-2 border-green-400">
                                                ✓ Saved
                                            </span>
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(card.savedAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Meaning */}
                                        <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
                                            <p className="text-[10px] font-black uppercase tracking-wide text-purple-600 mb-1">
                                                📖 Meaning
                                            </p>
                                            <p className="text-sm text-gray-800 font-semibold leading-relaxed line-clamp-2">
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
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-4 py-2 rounded-full border-3 border-gray-400 disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-semibold">Page</span>
                        <span className="bg-purple-100 text-purple-800 font-black px-3 py-1 rounded-full border-2 border-purple-400">
                            {currentPage} of {totalPages}
                        </span>
                    </div>

                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-4 py-2 rounded-full border-3 border-gray-400 disabled:opacity-50">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Card Detail Dialog */}
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

export default CollectionDetailPage;
