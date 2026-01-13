import { useState, useEffect, memo } from "react";
import { ReviewStats } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Brain, TrendingUp, Target, Zap, Award, AlertCircle, AlertTriangle, BookCheck } from "lucide-react";
import { apiService } from "../lib/api";

interface ReviewDashboardProps {
    collectionId?: string;
    collectionIds?: string[];
    onStartReview?: () => void;
}

const ReviewDashboard = memo(({ collectionId, collectionIds, onStartReview }: ReviewDashboardProps) => {
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, [collectionId, collectionIds]);

    const loadStats = async () => {
        setLoading(true);
        try {
            // Use collectionIds if provided, otherwise use single collectionId
            const data = await apiService.getReviewStats(collectionId, collectionIds);
            setStats(data);
        } catch (error) {
            console.error("Failed to load review stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48"></div>
                        <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-64"></div>
                    </div>
                    <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse w-40 border-3 border-gray-300"></div>
                </div>

                {/* Main Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Skeleton Cards */}
                    {[...Array(4)].map((_, i) => (
                        <Card
                            key={i}
                            className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300 shadow-[0_6px_0_rgba(0,0,0,0.2)] rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <div className="h-4 bg-white/60 rounded animate-pulse w-20"></div>
                                        <div className="h-12 bg-white/60 rounded animate-pulse w-16"></div>
                                    </div>
                                    <div className="p-3 bg-white/40 rounded-xl border-2 border-white/60 animate-pulse">
                                        <div className="w-7 h-7 bg-white/60 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-white/40 rounded animate-pulse w-32 mt-4"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Learning Analytics Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Learning Progress Skeleton */}
                    <Card className="bg-white border-3 border-gray-300 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                        <div className="p-6 border-b-2 border-gray-100">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
                        </div>
                        <CardContent className="space-y-5">
                            {/* Progress bars skeleton */}
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-gray-200 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
                                            style={{ width: `${60 + Math.random() * 30}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Needs Focus Skeleton */}
                    <Card className="bg-white border-3 border-gray-300 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                        <div className="p-6 border-b-2 border-gray-100">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                        </div>
                        <CardContent className="space-y-4">
                            {/* Problem areas skeleton */}
                            <div className="space-y-3">
                                <div className="h-5 bg-gray-200 rounded animate-pulse w-36"></div>
                                <div className="space-y-2">
                                    {[...Array(2)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border-2 border-gray-200">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header with Action Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                <div>
                    <h3 className="text-3xl font-black text-gray-800">📊 Your Progress</h3>
                    <p className="text-gray-600 font-bold">Keep track of your learning journey!</p>
                </div>
                {stats.dueToday > 0 && onStartReview && (
                    <Button
                        onClick={onStartReview}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black px-8 py-4 rounded-full border-3 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        <Brain className="w-5 h-5 mr-2" />
                        Start Review ({stats.dueToday} cards)
                    </Button>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Cards Due */}
                <Card className="bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.3)] rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white text-sm font-bold">⏰ Due Today</p>
                                <p className="text-5xl font-black text-white mt-3">{stats.dueToday}</p>
                            </div>
                            <div className="p-3 bg-white/30 rounded-xl border-2 border-white">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <p className="text-white/90 font-semibold text-sm mt-4">
                            {stats.reviewedToday > 0 ? `✓ ${stats.reviewedToday} done today!` : "Let's start! 🚀"}
                        </p>
                    </CardContent>
                </Card>

                {/* Success Rate */}
                <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.3)] rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white text-sm font-bold">📈 Success</p>
                                <p className="text-5xl font-black text-white mt-3">{stats.successRate}%</p>
                            </div>
                            <div className="p-3 bg-white/30 rounded-xl border-2 border-white">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <p className="text-white/90 font-semibold text-sm mt-4">Ease: {stats.averageEase}</p>
                    </CardContent>
                </Card>

                {/* Current Streak */}
                <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.3)] rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white text-sm font-bold">🔥 Streak</p>
                                <p className="text-5xl font-black text-white mt-3">{stats.currentStreak}</p>
                            </div>
                            <div className="p-3 bg-white/30 rounded-xl border-2 border-white">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <p className="text-white/90 font-semibold text-sm mt-4">
                            Best: {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
                        </p>
                    </CardContent>
                </Card>

                {/* Mastered Cards */}
                <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.3)] rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white text-sm font-bold">🏆 Mastered</p>
                                <p className="text-5xl font-black text-white mt-3">
                                    {stats.learningDistribution?.mastered || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-white/30 rounded-xl border-2 border-white">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <p className="text-white/90 font-semibold text-sm mt-4">
                            {stats.totalCards > 0
                                ? `${Math.round(
                                      ((stats.learningDistribution?.mastered || 0) / stats.totalCards) * 100
                                  )}% complete`
                                : "Start learning!"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Learning Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Learning Progress */}
                <Card className="bg-white border-3 border-black rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                    <CardHeader>
                        <CardTitle className="text-gray-800 flex items-center gap-2 text-2xl font-black">
                            <BookCheck className="w-6 h-6 text-purple-600" />
                            Learning Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-bold">🆕 New Cards</span>
                                <span className="text-gray-800 font-black text-lg">
                                    {stats.learningDistribution?.new || 0}
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                                    style={{
                                        width: `${
                                            ((stats.learningDistribution?.new || 0) / (stats.totalCards || 1)) * 100
                                        }%`,
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-bold">📚 Learning</span>
                                <span className="text-gray-800 font-black text-lg">
                                    {stats.learningDistribution?.learning || 0}
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                                    style={{
                                        width: `${
                                            ((stats.learningDistribution?.learning || 0) / (stats.totalCards || 1)) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-bold">🔄 Review</span>
                                <span className="text-gray-800 font-black text-lg">
                                    {stats.learningDistribution?.review || 0}
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                    style={{
                                        width: `${
                                            ((stats.learningDistribution?.review || 0) / (stats.totalCards || 1)) * 100
                                        }%`,
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-bold">⭐ Mastered</span>
                                <span className="text-gray-800 font-black text-lg">
                                    {stats.learningDistribution?.mastered || 0}
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                                    style={{
                                        width: `${
                                            ((stats.learningDistribution?.mastered || 0) / (stats.totalCards || 1)) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Problem Areas */}
                <Card className="bg-white border-3 border-black rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                    <CardHeader>
                        <CardTitle className="text-gray-800 flex items-center gap-2 text-2xl font-black">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            Needs Focus
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Frequently Forgotten */}
                            {stats.mostForgotten && stats.mostForgotten.length > 0 && (
                                <div>
                                    <h4 className="text-base font-black text-gray-700 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        Often Forgotten
                                    </h4>
                                    <div className="space-y-3">
                                        {stats.mostForgotten.slice(0, 3).map((card) => (
                                            <div
                                                key={card.id}
                                                className="flex items-center justify-between bg-orange-50 p-3 rounded-xl border-2 border-orange-300">
                                                <span className="text-gray-800 font-bold">{card.word}</span>
                                                <span className="px-3 py-1 bg-orange-200 text-orange-800 font-bold text-xs rounded-full border-2 border-orange-400">
                                                    {card.lapseCount} lapses
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Difficult Words */}
                            {stats.difficultWords && stats.difficultWords.length > 0 && (
                                <div>
                                    <h4 className="text-base font-black text-gray-700 mb-3">⚠️ Difficult Words</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {stats.difficultWords.slice(0, 5).map((card) => (
                                            <span
                                                key={card.id}
                                                className="px-3 py-2 bg-red-100 text-red-800 font-bold text-sm rounded-full border-2 border-red-300">
                                                {card.word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!stats.mostForgotten?.length && !stats.difficultWords?.length && (
                                <div className="text-center py-10">
                                    <div className="text-5xl mb-3">✨</div>
                                    <p className="text-gray-600 font-bold">Looking great!</p>
                                    <p className="text-gray-500 font-semibold text-sm mt-1">No problem areas yet! 🎉</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Motivational Message */}
            {stats.dueToday === 0 && stats.totalCards > 0 && (
                <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 rounded-2xl shadow-lg">
                    <CardContent className="p-8 text-center space-y-3">
                        <div className="text-5xl">🎉</div>
                        <p className="text-3xl text-gray-800 font-black">All Caught Up!</p>
                        <p className="text-gray-700 font-bold text-lg">Amazing work! No cards due right now! 🌟</p>
                    </CardContent>
                </Card>
            )}

            {stats.totalCards === 0 && (
                <Card className="bg-gray-50 border-dashed border-3 border-gray-300 rounded-2xl">
                    <CardContent className="p-12 text-center space-y-4">
                        <Brain className="w-16 h-16 text-gray-400 mx-auto" />
                        <p className="text-gray-800 font-black text-2xl">No Cards Yet!</p>
                        <p className="text-gray-600 font-semibold text-lg">
                            Start adding words to begin your journey! 🚀
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
});

ReviewDashboard.displayName = "ReviewDashboard";

export default ReviewDashboard;
