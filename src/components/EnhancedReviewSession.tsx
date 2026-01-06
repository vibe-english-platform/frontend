import { useState, useEffect } from "react";
import { CollectionCard, ReviewRating, QuestionData } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, RotateCcw, Check, Volume2, Mic } from "lucide-react";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface EnhancedReviewSessionProps {
    collectionId?: string;
    collectionIds?: string[];
    onClose: () => void;
    onComplete: () => void;
}

function EnhancedReviewSession({ collectionId, collectionIds, onClose, onComplete }: EnhancedReviewSessionProps) {
    const [cards, setCards] = useState<CollectionCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [confidence, setConfidence] = useState(3);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const { showToast } = useToast();

    useEffect(() => {
        loadDueCards();
    }, [collectionId, collectionIds]);

    useEffect(() => {
        if (cards.length > 0 && currentIndex < cards.length) {
            loadQuestion();
        }
    }, [currentIndex, cards]);

    const loadDueCards = async () => {
        setLoading(true);
        try {
            const response = await apiService.getCardsForReview(collectionId, collectionIds);
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

    const loadQuestion = async () => {
        if (currentIndex >= cards.length) return;

        const currentCard = cards[currentIndex];
        try {
            const question = await apiService.getCardQuestion(currentCard.collectionId, currentCard.id);
            setCurrentQuestion(question);
            setStartTime(Date.now());
            setShowAnswer(false);
            setUserAnswer("");
            setConfidence(3);
        } catch (error) {
            showToast("Failed to load question", "error");
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleRating = async (rating: ReviewRating) => {
        if (reviewing || currentIndex >= cards.length || !currentQuestion) return;

        const currentCard = cards[currentIndex];
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setReviewing(true);

        try {
            await apiService.recordCardReview(
                currentCard.collectionId,
                currentCard.id,
                rating,
                confidence,
                currentQuestion.type,
                timeSpent
            );

            // Move to next card
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
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

    const renderQuestion = () => {
        if (!currentQuestion) return null;

        const { type, question, options, hints } = currentQuestion;

        switch (type) {
            case "multiple-choice":
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800">{question}</p>
                        <div className="grid gap-2">
                            {options?.map((option, idx) => (
                                <Button
                                    key={idx}
                                    variant={userAnswer === option ? "default" : "outline"}
                                    className="justify-start text-left h-auto py-3 px-4"
                                    onClick={() => {
                                        setUserAnswer(option);
                                        setTimeout(() => handleShowAnswer(), 500);
                                    }}
                                    disabled={showAnswer}>
                                    <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case "true-false":
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800">{question}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={userAnswer === "true" ? "default" : "outline"}
                                size="lg"
                                onClick={() => {
                                    setUserAnswer("true");
                                    setTimeout(() => handleShowAnswer(), 500);
                                }}
                                disabled={showAnswer}>
                                ✓ True
                            </Button>
                            <Button
                                variant={userAnswer === "false" ? "default" : "outline"}
                                size="lg"
                                onClick={() => {
                                    setUserAnswer("false");
                                    setTimeout(() => handleShowAnswer(), 500);
                                }}
                                disabled={showAnswer}>
                                ✗ False
                            </Button>
                        </div>
                    </div>
                );

            case "fill-blank":
            case "short-answer":
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800 whitespace-pre-wrap">{question}</p>
                        <Input
                            placeholder="Type your answer..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showAnswer}
                            className="text-lg"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && userAnswer.trim()) {
                                    handleShowAnswer();
                                }
                            }}
                        />
                        {!showAnswer && userAnswer.trim() && (
                            <Button onClick={handleShowAnswer} className="w-full">
                                Check Answer
                            </Button>
                        )}
                        {hints && !showAnswer && (
                            <div className="text-sm text-gray-600 space-y-1">
                                {hints.map((hint, idx) => (
                                    <p key={idx}>💡 {hint}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "write-sentence":
            case "paraphrase":
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800 whitespace-pre-wrap">{question}</p>
                        <Textarea
                            placeholder="Write your response..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showAnswer}
                            className="min-h-[120px] text-base"
                            rows={4}
                        />
                        {!showAnswer && userAnswer.trim().length > 10 && (
                            <Button onClick={handleShowAnswer} className="w-full">
                                Show Example Answer
                            </Button>
                        )}
                        {hints && hints.length > 0 && (
                            <div className="text-sm text-gray-600 space-y-1">
                                {hints.slice(0, 2).map((hint, idx) => (
                                    <p key={idx}>💡 {hint}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "speak-sentence":
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800 whitespace-pre-wrap">{question}</p>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={() => {
                                        // In real implementation, this would use Web Speech API
                                        showToast("Speak your sentence aloud!", "default");
                                        setUserAnswer("spoken");
                                        setTimeout(() => handleShowAnswer(), 2000);
                                    }}>
                                    <Mic className="w-5 h-5 mr-2" />
                                    Start Speaking
                                </Button>
                            </div>
                            <p className="text-center text-sm text-purple-700 mt-4">
                                Practice saying the sentence out loud
                            </p>
                        </div>
                        {hints && (
                            <div className="text-sm text-gray-600 space-y-1">
                                {hints.slice(0, 2).map((hint, idx) => (
                                    <p key={idx}>💡 {hint}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return <p>Unknown question type</p>;
        }
    };

    const renderAnswerFeedback = () => {
        if (!showAnswer || !currentQuestion) return null;

        const isRecognitionStage = ["multiple-choice", "true-false"].includes(currentQuestion.type);

        return (
            <div className="space-y-4">
                {/* Correct Answer */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs uppercase tracking-wide text-green-700 font-semibold mb-1">
                        {currentQuestion.type === "write-sentence" || currentQuestion.type === "paraphrase"
                            ? "Example Answer"
                            : "Correct Answer"}
                    </p>
                    <p className="text-lg text-green-900">{currentQuestion.correctAnswer}</p>
                </div>

                {/* User Answer (for production stages) */}
                {!isRecognitionStage && userAnswer && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold mb-1">Your Answer</p>
                        <p className="text-base text-blue-900">{userAnswer}</p>
                    </div>
                )}

                {/* Confidence Rating */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">How confident are you with this word?</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                                key={level}
                                variant={confidence === level ? "default" : "outline"}
                                size="sm"
                                onClick={() => setConfidence(level)}
                                className="flex-1">
                                {level}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">1 = Not confident → 5 = Very confident</p>
                </div>

                {/* Rating Buttons */}
                <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-3 text-center">How well did you recall this?</p>
                    <div className="grid grid-cols-4 gap-2">
                        <Button
                            onClick={() => handleRating(1)}
                            disabled={reviewing}
                            className="bg-red-500 hover:bg-red-600 text-white flex flex-col items-center gap-1 h-auto py-3">
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-xs font-semibold">Again</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(2)}
                            disabled={reviewing}
                            className="bg-orange-500 hover:bg-orange-600 text-white flex flex-col items-center gap-1 h-auto py-3">
                            <span className="text-sm">😕</span>
                            <span className="text-xs font-semibold">Hard</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(3)}
                            disabled={reviewing}
                            className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center gap-1 h-auto py-3">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-semibold">Good</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(4)}
                            disabled={reviewing}
                            className="bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center gap-1 h-auto py-3">
                            <span className="text-sm">🚀</span>
                            <span className="text-xs font-semibold">Easy</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
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

    // Stage info for display
    const stageInfo = {
        recognition: { color: "bg-blue-500", label: "Recognition" },
        recall: { color: "bg-yellow-500", label: "Recall" },
        production: { color: "bg-purple-500", label: "Production" },
    };

    const stage = stageInfo[currentCard.learningStage] || stageInfo.recognition;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-white border-white/30">
                            {currentIndex + 1} / {cards.length}
                        </Badge>
                        <Badge className={stage.color}>{stage.label}</Badge>
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

                {/* Question Card */}
                <Card className="overflow-hidden shadow-2xl">
                    {/* Card Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
                        <img
                            src={currentCard.imageUrl}
                            alt={currentCard.word}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/800x300/667eea/ffffff?text=${encodeURIComponent(
                                    currentCard.word
                                )}`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-white drop-shadow-lg capitalize">
                                {currentCard.word}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={() => {
                                    // Text-to-speech (browser API)
                                    const utterance = new SpeechSynthesisUtterance(currentCard.word);
                                    utterance.lang = "en-US";
                                    window.speechSynthesis.speak(utterance);
                                }}>
                                <Volume2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {!showAnswer ? renderQuestion() : renderAnswerFeedback()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default EnhancedReviewSession;
