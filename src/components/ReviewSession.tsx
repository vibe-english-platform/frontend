import { useState, useEffect } from "react";
import { CollectionCard, ReviewRating } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, RotateCcw, Check } from "lucide-react";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";

interface ReviewSessionProps {
    collectionId?: string;
    onClose: () => void;
    onComplete: () => void;
}

function ReviewSession({ collectionId, onClose, onComplete }: ReviewSessionProps) {
    const [cards, setCards] = useState<CollectionCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadDueCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionId]);

    const loadDueCards = async () => {
        setLoading(true);
        try {
            const response = await apiService.getCardsForReview(collectionId);
            setCards(response.cards);
            if (response.cards.length === 0) {
                showToast("No cards due for review!", "success");
                onComplete();
            }
        } catch (error) {
            showToast("Failed to load review cards", "error");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (rating: ReviewRating) => {
        if (reviewing || currentIndex >= cards.length) return;

        const currentCard = cards[currentIndex];
        setReviewing(true);

        try {
            await apiService.recordCardReview(currentCard.collectionId, currentCard.id, rating);

            // Move to next card
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setShowAnswer(false);
            } else {
                // Session complete
                showToast(`Review session complete! ${cards.length} cards reviewed`, "success");
                onComplete();
            }
        } catch (error) {
            showToast("Failed to record review", "error");
        } finally {
            setReviewing(false);
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Card className="w-full max-w-2xl mx-4">
                    <CardContent className="p-8 text-center">
                        <p className="text-lg">Loading review cards...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (cards.length === 0) {
        return null;
    }

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-white border-white/30">
                            {currentIndex + 1} / {cards.length}
                        </Badge>
                        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-white/80 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Flashcard */}
                <Card className="overflow-hidden shadow-2xl">
                    {/* Card Image */}
                    <div className="relative h-64 bg-gradient-to-br from-indigo-500 to-purple-600">
                        <img
                            src={currentCard.imageUrl}
                            alt={currentCard.word}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/800x400/667eea/ffffff?text=${encodeURIComponent(
                                    currentCard.word
                                )}`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h2 className="text-4xl font-bold text-white drop-shadow-lg capitalize">
                                {currentCard.word}
                            </h2>
                        </div>
                        <div className="absolute top-4 right-4">
                            <Badge
                                className={`${
                                    currentCard.status === "new"
                                        ? "bg-blue-500"
                                        : currentCard.status === "learning"
                                        ? "bg-yellow-500"
                                        : currentCard.status === "review"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}>
                                {currentCard.status}
                            </Badge>
                        </div>
                    </div>

                    <CardContent className="p-8 space-y-6">
                        {!showAnswer ? (
                            <div className="text-center space-y-6">
                                <p className="text-lg text-gray-600">Try to recall the meaning and example...</p>
                                <Button
                                    onClick={handleShowAnswer}
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
                                    Show Answer
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Meaning */}
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-2">
                                        Meaning
                                    </p>
                                    <p className="text-lg text-gray-800">{currentCard.meaning}</p>
                                </div>

                                {/* Example */}
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <p className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-2">
                                        Example
                                    </p>
                                    <p className="text-lg text-gray-800 italic">&quot;{currentCard.example}&quot;</p>
                                </div>

                                {/* Rating Buttons */}
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-600 mb-4 text-center">
                                        How well did you know this?
                                    </p>
                                    <div className="grid grid-cols-4 gap-3">
                                        <Button
                                            onClick={() => handleRating(1)}
                                            disabled={reviewing}
                                            className="bg-red-500 hover:bg-red-600 text-white flex flex-col items-center gap-1 h-auto py-4">
                                            <RotateCcw className="w-5 h-5" />
                                            <span className="text-sm font-semibold">Again</span>
                                            <span className="text-xs opacity-80">&lt;1m</span>
                                        </Button>
                                        <Button
                                            onClick={() => handleRating(2)}
                                            disabled={reviewing}
                                            className="bg-orange-500 hover:bg-orange-600 text-white flex flex-col items-center gap-1 h-auto py-4">
                                            <span className="text-lg">😕</span>
                                            <span className="text-sm font-semibold">Hard</span>
                                            <span className="text-xs opacity-80">
                                                {currentCard.interval > 0
                                                    ? `${Math.ceil(currentCard.interval * 1.2)}d`
                                                    : "1d"}
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() => handleRating(3)}
                                            disabled={reviewing}
                                            className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center gap-1 h-auto py-4">
                                            <Check className="w-5 h-5" />
                                            <span className="text-sm font-semibold">Good</span>
                                            <span className="text-xs opacity-80">
                                                {currentCard.reviewCount === 0
                                                    ? "1d"
                                                    : currentCard.reviewCount === 1
                                                    ? "6d"
                                                    : `${Math.ceil(currentCard.interval * currentCard.easeFactor)}d`}
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() => handleRating(4)}
                                            disabled={reviewing}
                                            className="bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center gap-1 h-auto py-4">
                                            <span className="text-lg">🚀</span>
                                            <span className="text-sm font-semibold">Easy</span>
                                            <span className="text-xs opacity-80">
                                                {currentCard.reviewCount === 0
                                                    ? "4d"
                                                    : `${Math.ceil(
                                                          currentCard.interval * currentCard.easeFactor * 1.3
                                                      )}d`}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Card Stats */}
                                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                    <span>Reviews: {currentCard.reviewCount}</span>
                                    <span>Ease: {currentCard.easeFactor.toFixed(2)}</span>
                                    <span>Lapses: {currentCard.lapseCount}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ReviewSession;
