import { useState, useEffect } from "react";
import { ReviewStats } from "../types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, TrendingUp, Target, Zap, Calendar, Award } from "lucide-react";
import { apiService } from "../lib/api";

interface ReviewDashboardProps {
    collectionId?: string;
    collectionIds?: string[];
    onStartReview?: () => void;
}

function ReviewDashboard({ collectionId, collectionIds, onStartReview }: ReviewDashboardProps) {
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
            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                    <p className="text-white/60 text-center">Loading statistics...</p>
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header with Action Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white">Review Dashboard</h3>
                    <p className="text-white/70 text-sm">Track your learning progress</p>
                </div>
                {stats.dueToday > 0 && onStartReview && (
                    <Button
                        onClick={onStartReview}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        Review {stats.dueToday} Cards
                    </Button>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cards Due */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Due Today</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.dueToday}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-white/70 text-xs mt-4">
                            {stats.reviewedToday > 0 ? `${stats.reviewedToday} reviewed today` : "Start reviewing!"}
                        </p>
                    </CardContent>
                </Card>

                {/* Success Rate */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Success Rate</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.successRate}%</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-white/70 text-xs mt-4">Average ease: {stats.averageEase}</p>
                    </CardContent>
                </Card>

                {/* Current Streak */}
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Current Streak</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.currentStreak}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-white/70 text-xs mt-4">
                            Longest: {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
                        </p>
                    </CardContent>
                </Card>

                {/* Total Cards */}
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Total Cards</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.totalCards}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-white/70 text-xs mt-4">In your collection</p>
                    </CardContent>
                </Card>
            </div>

            {/* Card Status Breakdown */}
            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Card Status Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/70">New Cards</span>
                                <Badge className="bg-blue-500">New</Badge>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.newCards}</p>
                            <p className="text-xs text-white/60 mt-1">
                                {stats.totalCards > 0
                                    ? Math.round((stats.newCards / stats.totalCards) * 100)
                                    : 0}
                                % of total
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/70">Learning</span>
                                <Badge className="bg-yellow-500">Learning</Badge>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.learningCards}</p>
                            <p className="text-xs text-white/60 mt-1">
                                {stats.totalCards > 0
                                    ? Math.round((stats.learningCards / stats.totalCards) * 100)
                                    : 0}
                                % of total
                            </p>
                        </div>

                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/70">Review</span>
                                <Badge className="bg-green-500">Review</Badge>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.reviewCards}</p>
                            <p className="text-xs text-white/60 mt-1">
                                {stats.totalCards > 0
                                    ? Math.round((stats.reviewCards / stats.totalCards) * 100)
                                    : 0}
                                % of total
                            </p>
                        </div>

                        <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/70">Reviewed Today</span>
                                <Badge className="bg-indigo-500">Today</Badge>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.reviewedToday}</p>
                            <p className="text-xs text-white/60 mt-1">Keep it up!</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Motivational Message */}
            {stats.dueToday === 0 && stats.totalCards > 0 && (
                <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
                    <CardContent className="p-6 text-center">
                        <p className="text-2xl text-white font-semibold">🎉 All caught up!</p>
                        <p className="text-white/70 mt-2">No cards due for review right now. Great job!</p>
                    </CardContent>
                </Card>
            )}

            {stats.totalCards === 0 && (
                <Card className="bg-white/5 border-white/10 border-dashed">
                    <CardContent className="p-8 text-center">
                        <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">No cards in your collection yet.</p>
                        <p className="text-white/50 text-sm mt-2">
                            Start adding words to begin your learning journey!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default ReviewDashboard;

