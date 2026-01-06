import { useState, useEffect } from "react";
import { Search, Sparkles, Volume2, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { WordMeaning, EnhancedWordResponse } from "../types";
import { apiService } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

const GUEST_API_LIMIT = 3;
const GUEST_API_COUNT_KEY = "guest_api_count";

interface WordInputProps {
    onWordSubmit: (
        word: string,
        meanings: WordMeaning[],
        selectedMeaning?: string,
        customMeaning?: string,
        wordData?: EnhancedWordResponse
    ) => void;
    isAuthenticated: boolean;
    onLoginRequired: () => void;
}

function WordInput({ onWordSubmit, isAuthenticated, onLoginRequired }: WordInputProps) {
    const [word, setWord] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [wordData, setWordData] = useState<EnhancedWordResponse | null>(null);
    const [selectedMeaning, setSelectedMeaning] = useState<string>("");
    const [customMeaning, setCustomMeaning] = useState<string>("");
    const [useCustomMeaning, setUseCustomMeaning] = useState<boolean>(false);
    const [guestApiCount, setGuestApiCount] = useState<number>(0);

    useEffect(() => {
        const storedCount = localStorage.getItem(GUEST_API_COUNT_KEY);
        if (storedCount) {
            setGuestApiCount(parseInt(storedCount, 10));
        }
    }, []);

    const incrementGuestApiCount = () => {
        const newCount = guestApiCount + 1;
        setGuestApiCount(newCount);
        localStorage.setItem(GUEST_API_COUNT_KEY, newCount.toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!word.trim()) {
            setError("Please enter a word");
            return;
        }

        // Check guest API limit
        if (!isAuthenticated && guestApiCount >= GUEST_API_LIMIT) {
            onLoginRequired();
            return;
        }

        setLoading(true);
        setError("");
        setWordData(null);
        setSelectedMeaning("");
        setCustomMeaning("");
        setUseCustomMeaning(false);

        try {
            const data = await apiService.getEnhancedWordInfo(word.trim());
            setWordData(data);

            // Increment guest API count only on success
            if (!isAuthenticated) {
                incrementGuestApiCount();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            if (errorMessage === "AI_SERVICE_QUOTA_EXCEEDED") {
                try {
                    const basicData = await apiService.getWordMeanings(word.trim());
                    setWordData({
                        word: basicData.word,
                        meanings: basicData.meanings,
                        phonetic: "",
                    });

                    if (!isAuthenticated) {
                        incrementGuestApiCount();
                    }
                } catch {
                    setError("Word not found. Please try another word.");
                }
            } else {
                setError("Word not found. Please try another word.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!wordData) return;

        // Check authentication before creating learning card
        if (!isAuthenticated) {
            onLoginRequired();
            return;
        }

        const meaningToUse = useCustomMeaning ? customMeaning.trim() : selectedMeaning;
        if (!meaningToUse) {
            setError("Please select a meaning or enter your own.");
            return;
        }

        onWordSubmit(wordData.word, wordData.meanings, selectedMeaning, customMeaning, wordData);
    };

    const suggestedWords = ["serendipity", "ambitious", "explore", "creativity"];

    const handleBackToSearch = () => {
        setWordData(null);
        setSelectedMeaning("");
        setCustomMeaning("");
        setUseCustomMeaning(false);
    };

    // Word Analysis View
    if (wordData) {
        const analysis = wordData.analysis;

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* Top Back Button */}
                <Button
                    variant="ghost"
                    onClick={handleBackToSearch}
                    className="text-white/80 hover:text-white hover:bg-white/10">
                    ← Search New Word
                </Button>

                {/* Word Header */}
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-3xl font-bold capitalize mb-2">{wordData.word}</h2>
                                {analysis && (
                                    <div className="flex items-center gap-3 text-white/90">
                                        <span className="flex items-center gap-1.5">
                                            <Volume2 className="w-4 h-4" />
                                            <span className="font-mono text-sm">{analysis.pronunciation.phonetic}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                            {analysis && (
                                <div className="text-right">
                                    <Badge
                                        className={`text-sm px-3 py-1 ${
                                            analysis.difficulty === "beginner"
                                                ? "bg-green-500"
                                                : analysis.difficulty === "intermediate"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}>
                                        {analysis.difficulty}
                                    </Badge>
                                    <p className="text-white/70 text-xs mt-1">
                                        Difficulty: {analysis.difficultyScore}/10
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {analysis && (
                        <CardContent className="p-6 space-y-6">
                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-2 text-sm">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {analysis.usage.formality}
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {analysis.usage.frequency}
                                </Badge>
                                {analysis.usage.contexts.slice(0, 2).map((ctx, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200">
                                        {ctx}
                                    </Badge>
                                ))}
                            </div>

                            {/* Word Relationships */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">
                                        Synonyms
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysis.relationships.synonyms.slice(0, 4).map((s, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 bg-white rounded text-sm text-emerald-700">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                                    <h4 className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-2">
                                        Antonyms
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysis.relationships.antonyms.slice(0, 3).map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 bg-white rounded text-sm text-rose-700">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                                    <h4 className="text-xs font-semibold text-sky-800 uppercase tracking-wide mb-2">
                                        Related
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysis.relationships.related.slice(0, 4).map((r, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-white rounded text-sm text-sky-700">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Example Sentences */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Example Sentences
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded shrink-0">
                                            Basic
                                        </span>
                                        <p className="text-gray-600 text-sm">{analysis.examples.basic}</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded shrink-0">
                                            Medium
                                        </span>
                                        <p className="text-gray-600 text-sm">{analysis.examples.intermediate}</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded shrink-0">
                                            Advanced
                                        </span>
                                        <p className="text-gray-600 text-sm">{analysis.examples.advanced}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Meaning Selection */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Definition</h3>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {wordData.meanings.map((meaning, index) => (
                                <label
                                    key={index}
                                    className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        selectedMeaning === meaning.definition && !useCustomMeaning
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="meaning"
                                        className="mt-1 accent-indigo-600"
                                        checked={selectedMeaning === meaning.definition && !useCustomMeaning}
                                        onChange={() => {
                                            setSelectedMeaning(meaning.definition);
                                            setUseCustomMeaning(false);
                                        }}
                                    />
                                    <div className="flex-1">
                                        <Badge variant="secondary" className="text-xs mb-1">
                                            {meaning.partOfSpeech}
                                        </Badge>
                                        <p className="text-gray-700">{meaning.definition}</p>
                                        {meaning.example && (
                                            <p className="text-gray-500 text-sm mt-1 italic">
                                                &quot;{meaning.example}&quot;
                                            </p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Custom Meaning */}
                        <div className="mt-4 pt-4 border-t">
                            <label
                                className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    useCustomMeaning
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-gray-100 hover:border-indigo-200"
                                }`}>
                                <input
                                    type="radio"
                                    name="meaning"
                                    className="mt-1 accent-indigo-600"
                                    checked={useCustomMeaning}
                                    onChange={() => {
                                        setUseCustomMeaning(true);
                                        setSelectedMeaning("");
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-700">Use your own definition</p>
                                    {useCustomMeaning && (
                                        <Textarea
                                            value={customMeaning}
                                            onChange={(e) => setCustomMeaning(e.target.value)}
                                            placeholder="Enter your understanding of this word..."
                                            className="min-h-[80px] mt-2"
                                        />
                                    )}
                                </div>
                            </label>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" onClick={handleBackToSearch} className="flex-1">
                                ← Search New Word
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedMeaning && !customMeaning.trim()}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                Create Learning Card
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Search View
    return (
        <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Any Word</h2>
                    <p className="text-gray-500">Get AI-powered analysis, meanings, and create learning cards</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            placeholder="Type any English word..."
                            disabled={loading}
                            className="h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 w-5 h-5" />
                                Analyze Word
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-gray-500 text-center mb-3">Try these examples:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {suggestedWords.map((suggestedWord) => (
                            <button
                                key={suggestedWord}
                                onClick={() => setWord(suggestedWord)}
                                className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-sm transition-colors">
                                {suggestedWord}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default WordInput;
