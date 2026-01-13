import { useState, useEffect } from "react";
import { CollectionCard, ReviewRating, QuestionData } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, RotateCcw, Check, Volume2, Mic, Sparkles, Brain, Zap } from "lucide-react";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface EnhancedReviewSessionProps {
    collectionId?: string;
    collectionIds?: string[];
    mode?: "due" | "all";
    isPage?: boolean;
    onClose: () => void;
    onComplete: () => void;
}

function EnhancedReviewSession({
    collectionId,
    collectionIds,
    mode = "due",
    isPage = false,
    onClose,
    onComplete,
}: EnhancedReviewSessionProps) {
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

    const loadDueCards = async () => {
        setLoading(true);
        try {
            const response = await apiService.getCardsForReview(collectionId, collectionIds, mode);
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

    useEffect(() => {
        loadDueCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionId, collectionIds, mode]);

    useEffect(() => {
        if (cards.length > 0 && currentIndex < cards.length) {
            loadQuestion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, cards]);

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
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                            <Zap className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xl font-bold text-gray-800">{question}</p>
                        </div>
                        <div className="grid gap-3">
                            {options?.map((option, idx) => (
                                <Button
                                    key={idx}
                                    variant={userAnswer === option ? "default" : "outline"}
                                    className={`justify-start text-left h-auto py-4 px-5 text-base font-semibold transition-all duration-200 ${
                                        userAnswer === option
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-700 shadow-lg scale-105"
                                            : "hover:bg-indigo-50 hover:border-indigo-300 hover:scale-[1.02] border-2"
                                    }`}
                                    onClick={() => {
                                        setUserAnswer(option);
                                        setTimeout(() => handleShowAnswer(), 500);
                                    }}
                                    disabled={showAnswer}>
                                    <span
                                        className={`font-black mr-3 text-lg ${
                                            userAnswer === option ? "text-white" : "text-indigo-600"
                                        }`}>
                                        {String.fromCharCode(65 + idx)}.
                                    </span>
                                    <span className={userAnswer === option ? "text-white" : "text-gray-700"}>
                                        {option}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case "true-false":
                return (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                            <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xl font-bold text-gray-800">{question}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={userAnswer === "true" ? "default" : "outline"}
                                size="lg"
                                className={`h-20 text-xl font-black transition-all duration-200 ${
                                    userAnswer === "true"
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-700 shadow-xl scale-105"
                                        : "hover:bg-green-50 hover:border-green-300 hover:scale-[1.02] border-2"
                                }`}
                                onClick={() => {
                                    setUserAnswer("true");
                                    setTimeout(() => handleShowAnswer(), 500);
                                }}
                                disabled={showAnswer}>
                                <Check className="w-6 h-6 mr-2" />
                                True
                            </Button>
                            <Button
                                variant={userAnswer === "false" ? "default" : "outline"}
                                size="lg"
                                className={`h-20 text-xl font-black transition-all duration-200 ${
                                    userAnswer === "false"
                                        ? "bg-gradient-to-br from-red-500 to-pink-600 border-2 border-red-700 shadow-xl scale-105"
                                        : "hover:bg-red-50 hover:border-red-300 hover:scale-[1.02] border-2"
                                }`}
                                onClick={() => {
                                    setUserAnswer("false");
                                    setTimeout(() => handleShowAnswer(), 500);
                                }}
                                disabled={showAnswer}>
                                <X className="w-6 h-6 mr-2" />
                                False
                            </Button>
                        </div>
                    </div>
                );

            case "fill-blank":
            case "short-answer":
                return (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                            <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xl font-bold text-gray-800 whitespace-pre-wrap">{question}</p>
                        </div>
                        <div className="relative">
                            <Input
                                placeholder="Type your answer..."
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={showAnswer}
                                className="text-lg font-semibold py-6 px-5 border-2 focus:border-amber-400 focus:ring-amber-300 transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && userAnswer.trim()) {
                                        handleShowAnswer();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        {!showAnswer && userAnswer.trim() && (
                            <Button
                                onClick={handleShowAnswer}
                                className="w-full py-6 text-lg font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                <Check className="w-5 h-5 mr-2" />
                                Check Answer
                            </Button>
                        )}
                        {hints && !showAnswer && (
                            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-2">
                                {hints.map((hint, idx) => (
                                    <p key={idx} className="text-sm font-semibold text-blue-800 flex items-start gap-2">
                                        <span className="text-lg">💡</span>
                                        <span>{hint}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "write-sentence":
            case "paraphrase":
                return (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{question}</p>
                        </div>
                        <Textarea
                            placeholder="Write your response..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showAnswer}
                            className="min-h-[140px] text-base font-medium border-2 focus:border-purple-400 focus:ring-purple-300 p-4 transition-all"
                            rows={5}
                            autoFocus
                        />
                        {!showAnswer && userAnswer.trim().length > 10 && (
                            <Button
                                onClick={handleShowAnswer}
                                className="w-full py-6 text-lg font-black bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                <Check className="w-5 h-5 mr-2" />
                                Show Example Answer
                            </Button>
                        )}
                        {hints && hints.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-2">
                                {hints.slice(0, 2).map((hint, idx) => (
                                    <p key={idx} className="text-sm font-semibold text-blue-800 flex items-start gap-2">
                                        <span className="text-lg">💡</span>
                                        <span>{hint}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "speak-sentence":
                return (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
                            <Mic className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5 animate-pulse" />
                            <p className="text-xl font-bold text-gray-800 whitespace-pre-wrap">{question}</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-3 border-purple-300 shadow-inner">
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black px-10 py-8 text-xl rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-110 border-4 border-white/50"
                                        onClick={() => {
                                            showToast("Great! Speak your sentence aloud! 🎤", "default");
                                            setUserAnswer("spoken");
                                            setTimeout(() => handleShowAnswer(), 2000);
                                        }}>
                                        <Mic className="w-8 h-8 mr-3" />
                                        Start Speaking
                                    </Button>
                                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse -z-10" />
                                </div>
                                <p className="text-center text-base font-bold text-purple-800 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5" />
                                    Practice saying the sentence out loud
                                </p>
                            </div>
                        </div>
                        {hints && (
                            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-2">
                                {hints.slice(0, 2).map((hint, idx) => (
                                    <p key={idx} className="text-sm font-semibold text-blue-800 flex items-start gap-2">
                                        <span className="text-lg">💡</span>
                                        <span>{hint}</span>
                                    </p>
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
            <div className="space-y-5 animate-fadeIn">
                {/* Correct Answer */}
                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-3 border-green-300 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-sm uppercase tracking-wide text-green-700 font-black">
                            {currentQuestion.type === "write-sentence" || currentQuestion.type === "paraphrase"
                                ? "Example Answer"
                                : "Correct Answer"}
                        </p>
                    </div>
                    <p className="text-xl font-bold text-green-900">{currentQuestion.correctAnswer}</p>
                </div>

                {/* User Answer (for production stages) */}
                {!isRecognitionStage && userAnswer && (
                    <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-3 border-blue-300 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <p className="text-sm uppercase tracking-wide text-blue-700 font-black">Your Answer</p>
                        </div>
                        <p className="text-lg font-semibold text-blue-900">{userAnswer}</p>
                    </div>
                )}

                {/* Confidence Rating */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 space-y-3">
                    <p className="text-base font-black text-gray-800 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        How confident are you with this word?
                    </p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                                key={level}
                                variant={confidence === level ? "default" : "outline"}
                                size="lg"
                                onClick={() => setConfidence(level)}
                                className={`flex-1 text-xl font-black h-14 transition-all duration-200 ${
                                    confidence === level
                                        ? "bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-700 shadow-lg scale-110"
                                        : "hover:bg-purple-100 hover:border-purple-300 hover:scale-105 border-2"
                                }`}>
                                {level}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-600 text-center font-semibold">
                        1 = Not confident → 5 = Very confident
                    </p>
                </div>

                {/* Rating Buttons */}
                <div className="pt-4 border-t-4 border-gray-200">
                    <p className="text-lg font-black text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        How well did you recall this?
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                            onClick={() => handleRating(1)}
                            disabled={reviewing}
                            className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex flex-col items-center gap-2 h-auto py-5 border-3 border-red-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                            <RotateCcw className="w-6 h-6" />
                            <span className="text-sm font-black">Again</span>
                            <span className="text-xs opacity-90">&lt;1min</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(2)}
                            disabled={reviewing}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex flex-col items-center gap-2 h-auto py-5 border-3 border-orange-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                            <span className="text-2xl">😕</span>
                            <span className="text-sm font-black">Hard</span>
                            <span className="text-xs opacity-90">Soon</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(3)}
                            disabled={reviewing}
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex flex-col items-center gap-2 h-auto py-5 border-3 border-green-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                            <Check className="w-6 h-6" />
                            <span className="text-sm font-black">Good</span>
                            <span className="text-xs opacity-90">Normal</span>
                        </Button>
                        <Button
                            onClick={() => handleRating(4)}
                            disabled={reviewing}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center gap-2 h-auto py-5 border-3 border-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                            <span className="text-2xl">🚀</span>
                            <span className="text-sm font-black">Easy</span>
                            <span className="text-xs opacity-90">Later</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div
                className={`${
                    isPage
                        ? "w-full max-w-3xl mx-auto px-4"
                        : "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                }`}>
                <Card
                    className={`${
                        isPage ? "w-full" : "w-full max-w-2xl mx-4"
                    } border-4 border-purple-500/50 shadow-2xl overflow-hidden`}>
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-black text-gray-800">Preparing Your Cards...</p>
                            <p className="text-gray-600 font-semibold">Get ready to learn! 🚀</p>
                        </div>
                        <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[shimmer_1.5s_ease-in-out_infinite]"
                                style={{ width: "100%", animation: "shimmer 1.5s ease-in-out infinite" }}
                            />
                        </div>
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

    const content = (
        <div className={`w-full max-w-4xl space-y-6 ${isPage ? "mx-auto px-4 animate-fadeIn" : ""}`}>
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 p-4 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                            <Badge className="bg-white/90 text-gray-800 font-black text-base px-4 py-1.5 border-2 border-white/50">
                                {currentIndex + 1} / {cards.length}
                            </Badge>
                        </div>
                        <Badge
                            className={`${stage.color} font-bold px-4 py-1.5 text-white border-2 border-white/30 shadow-lg`}>
                            <Brain className="w-4 h-4 mr-1.5" />
                            {stage.label}
                        </Badge>
                        <div className="hidden md:flex flex-1 max-w-xs h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:text-white hover:bg-white/20 border-2 border-white/30 rounded-full transition-all hover:scale-110">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                {/* Mobile Progress Bar */}
                <div className="md:hidden mt-3 h-2 bg-white/20 rounded-full overflow-hidden border border-white/30">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <Card className="overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm transform transition-all duration-300">
                {/* Card Image */}
                <div className="relative h-64 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
                    <img
                        src={currentCard.imageUrl}
                        alt={currentCard.word}
                        className="w-full h-full object-cover transition-transform duration-300"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/800x300/667eea/ffffff?text=${encodeURIComponent(
                                currentCard.word
                            )}`;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Word and Audio Button */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="text-white hover:bg-white/30 border-2 border-white/50 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-xl"
                            onClick={() => {
                                const utterance = new SpeechSynthesisUtterance(currentCard.word);
                                utterance.lang = "en-US";
                                window.speechSynthesis.speak(utterance);
                            }}>
                            <Volume2 className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Card Stats Badge */}
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-2 border-white/50 px-3 py-1.5 font-bold shadow-lg">
                            Review #{currentCard.reviewCount + 1}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-8 space-y-6 bg-gradient-to-br from-white to-gray-50">
                    {!showAnswer ? renderQuestion() : renderAnswerFeedback()}
                </CardContent>
            </Card>
        </div>
    );

    if (isPage) {
        return content;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {content}
        </div>
    );
}

export default EnhancedReviewSession;
