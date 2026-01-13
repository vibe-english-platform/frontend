import { useState, useEffect } from "react";
import { Search, Sparkles, Volume2, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { WordMeaning, EnhancedWordResponse } from "../types";
import { apiService } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const GUEST_API_LIMIT = 3;
const GUEST_API_COUNT_KEY = "guest_api_count";

// Utility functions for guest API management
const getGuestApiCount = (): number => {
    const storedCount = localStorage.getItem(GUEST_API_COUNT_KEY);
    return storedCount ? parseInt(storedCount, 10) : 0;
};

const isGuestLimitExceeded = (currentCount: number): boolean => {
    return currentCount >= GUEST_API_LIMIT;
};

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

// Sub-components for better organization
interface WordHeaderProps {
    wordData: EnhancedWordResponse;
    onPronunciationClick: () => void;
    onClickSuggestedWord: (word: string) => void;
}

function WordHeader({ wordData, onPronunciationClick, onClickSuggestedWord }: WordHeaderProps) {
    const analysis = wordData.analysis;

    return (
        <div className="overflow-hidden bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 text-white border-b-4 border-black">
                <div className="flex items-start justify-between">
                    <div>
                        <h2
                            className="text-4xl font-black capitalize mb-2"
                            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
                            {wordData.word}
                        </h2>
                        {analysis && (
                            <div className="flex items-center gap-3">
                                <button
                                    className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full"
                                    onClick={onPronunciationClick}>
                                    <Volume2 className="w-4 h-4" />
                                    <span className="font-mono text-sm font-bold">
                                        {analysis.pronunciation.phonetic}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                    {analysis && (
                        <div className="text-right">
                            <div
                                className={`px-4 py-2 rounded-full font-black text-white border-3 border-white shadow-lg ${
                                    analysis.difficulty === "beginner"
                                        ? "bg-green-500"
                                        : analysis.difficulty === "intermediate"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}>
                                {analysis.difficulty.toUpperCase()}!
                            </div>
                            <p className="text-white/90 text-xs mt-2 font-bold">Level: {analysis.difficultyScore}/10</p>
                        </div>
                    )}
                </div>
            </div>

            {analysis && (
                <div className="p-6 space-y-6">
                    {/* Quick Info - Cartoon Badges */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-3 py-2 bg-blue-100 text-blue-800 font-bold rounded-full border-2 border-blue-400">
                            {analysis.usage.formality}
                        </span>
                        <span className="px-3 py-2 bg-green-100 text-green-800 font-bold rounded-full border-2 border-green-400">
                            {analysis.usage.frequency}
                        </span>
                        {analysis.usage.contexts.slice(0, 2).map((ctx, i) => (
                            <span
                                key={i}
                                className="px-3 py-2 bg-purple-100 text-purple-800 font-bold rounded-full border-2 border-purple-400">
                                {ctx}
                            </span>
                        ))}
                    </div>

                    {/* Word Relationships - Cartoon Boxes */}
                    <WordRelationships analysis={analysis} onClickSuggestedWord={onClickSuggestedWord} />

                    {/* Example Sentences - Cartoon Style */}
                    <ExampleSentences analysis={analysis} />
                </div>
            )}
        </div>
    );
}

interface WordRelationshipsProps {
    analysis: any;
    onClickSuggestedWord: (word: string) => void;
}

function WordRelationships({ analysis, onClickSuggestedWord }: WordRelationshipsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border-3 border-emerald-400">
                <h4 className="text-sm font-black text-emerald-800 mb-3">✅ SYNONYMS</h4>
                <div className="flex flex-wrap gap-2">
                    {analysis.relationships.synonyms.slice(0, 4).map((s: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => onClickSuggestedWord(s)}
                            className="px-3 py-1 bg-white rounded-full text-sm text-emerald-700 font-bold border-2 border-emerald-300 hover:bg-emerald-50 active:bg-emerald-500">
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-3 border-rose-400">
                <h4 className="text-sm font-black text-rose-800 mb-3">❌ ANTONYMS</h4>
                <div className="flex flex-wrap gap-2">
                    {analysis.relationships.antonyms.slice(0, 3).map((a: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => onClickSuggestedWord(a)}
                            className="px-3 py-1 bg-white rounded-full text-sm text-rose-700 font-bold border-2 border-rose-300 hover:bg-rose-50 active:bg-rose-500">
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border-3 border-sky-400">
                <h4 className="text-sm font-black text-sky-800 mb-3">🔗 RELATED</h4>
                <div className="flex flex-wrap gap-2">
                    {analysis.relationships.related.slice(0, 4).map((r: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => onClickSuggestedWord(r)}
                            className="px-3 py-1 bg-white rounded-full text-sm text-sky-700 font-bold border-2 border-sky-300 hover:bg-sky-50 active:bg-sky-500">
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ExampleSentencesProps {
    analysis: any;
}

function ExampleSentences({ analysis }: ExampleSentencesProps) {
    return (
        <div className="space-y-3">
            <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Example Sentences 💬
            </h4>
            <div className="space-y-3">
                <div className="flex gap-3 items-start bg-green-50 p-3 rounded-xl border-2 border-green-300">
                    <span className="text-xs font-black text-green-700 bg-green-200 px-3 py-1 rounded-full shrink-0 border-2 border-green-400">
                        EASY
                    </span>
                    <p className="text-gray-700 font-semibold">{analysis.examples.basic}</p>
                </div>
                <div className="flex gap-3 items-start bg-yellow-50 p-3 rounded-xl border-2 border-yellow-300">
                    <span className="text-xs font-black text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full shrink-0 border-2 border-yellow-400">
                        MEDIUM
                    </span>
                    <p className="text-gray-700 font-semibold">{analysis.examples.intermediate}</p>
                </div>
                <div className="flex gap-3 items-start bg-red-50 p-3 rounded-xl border-2 border-red-300">
                    <span className="text-xs font-black text-red-700 bg-red-200 px-3 py-1 rounded-full shrink-0 border-2 border-red-400">
                        HARD
                    </span>
                    <p className="text-gray-700 font-semibold">{analysis.examples.advanced}</p>
                </div>
            </div>
        </div>
    );
}

interface MeaningSelectionProps {
    wordData: EnhancedWordResponse;
    selectedMeaning: string;
    customMeaning: string;
    useCustomMeaning: boolean;
    error: string;
    onSelectedMeaningChange: (meaning: string) => void;
    onUseCustomMeaningChange: (useCustom: boolean) => void;
    onCustomMeaningChange: (meaning: string) => void;
    onBackToSearch: () => void;
    onContinue: () => void;
}

function MeaningSelection({
    wordData,
    selectedMeaning,
    customMeaning,
    useCustomMeaning,
    error,
    onSelectedMeaningChange,
    onUseCustomMeaningChange,
    onCustomMeaningChange,
    onBackToSearch,
    onContinue,
}: MeaningSelectionProps) {
    return (
        <div className="bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-4">Choose Your Definition! 🎯</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {wordData.meanings.map((meaning, index) => (
                    <label
                        key={index}
                        className={`flex gap-3 p-4 rounded-2xl border-3 cursor-pointer transition-all ${
                            selectedMeaning === meaning.definition && !useCustomMeaning
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-300 hover:border-purple-300 hover:bg-gray-50"
                        }`}>
                        <input
                            type="radio"
                            name="meaning"
                            className="mt-1 w-5 h-5 accent-purple-600"
                            checked={selectedMeaning === meaning.definition && !useCustomMeaning}
                            onChange={() => {
                                onSelectedMeaningChange(meaning.definition);
                                onUseCustomMeaningChange(false);
                            }}
                        />
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 font-bold text-xs rounded-full border-2 border-purple-400 mb-2">
                                {meaning.partOfSpeech}
                            </span>
                            <p className="text-gray-700 font-semibold">{meaning.definition}</p>
                            {meaning.example && (
                                <p className="text-gray-600 text-sm mt-2 italic border-l-4 border-purple-300 pl-3">
                                    &quot;{meaning.example}&quot;
                                </p>
                            )}
                        </div>
                    </label>
                ))}
            </div>

            {/* Custom Meaning - Cartoon Style */}
            <div className="mt-4 pt-4 border-t-3 border-gray-200">
                <label
                    className={`flex gap-3 p-4 rounded-2xl border-3 cursor-pointer transition-all ${
                        useCustomMeaning ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-300"
                    }`}>
                    <input
                        type="radio"
                        name="meaning"
                        className="mt-1 w-5 h-5 accent-purple-600"
                        checked={useCustomMeaning}
                        onChange={() => {
                            onUseCustomMeaningChange(true);
                            onSelectedMeaningChange("");
                        }}
                    />
                    <div className="flex-1">
                        <p className="font-black text-gray-700">✏️ Use your own definition</p>
                        {useCustomMeaning && (
                            <Textarea
                                value={customMeaning}
                                onChange={(e) => onCustomMeaningChange(e.target.value)}
                                placeholder="Enter your understanding of this word..."
                                className="min-h-[80px] mt-3 border-3 border-gray-800 rounded-xl font-semibold"
                            />
                        )}
                    </div>
                </label>
            </div>

            {error && (
                <div className="mt-3 bg-red-100 border-3 border-red-400 rounded-xl p-3">
                    <p className="text-red-700 font-bold text-center">{error}</p>
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <Button
                    onClick={onBackToSearch}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold rounded-full border-3 border-gray-800">
                    ← Back
                </Button>
                <Button
                    onClick={onContinue}
                    disabled={!selectedMeaning && !customMeaning.trim()}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                    Create Card! 🎨
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
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
    const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
    const [suggestedWordsLoading, setSuggestedWordsLoading] = useState<boolean>(true);

    useEffect(() => {
        setGuestApiCount(getGuestApiCount());
    }, []);

    useEffect(() => {
        const fetchSuggestedWords = async () => {
            try {
                const response = await apiService.getRandomSuggestedWords(4);
                setSuggestedWords(response.words);
            } catch (error) {
                console.error("Error fetching suggested words:", error);
                // Fallback to hardcoded words if API fails
                setSuggestedWords(["serendipity", "ambitious", "explore", "creativity"]);
            } finally {
                setSuggestedWordsLoading(false);
            }
        };

        fetchSuggestedWords();
    }, []);

    const incrementGuestApiCount = () => {
        const newCount = guestApiCount + 1;
        setGuestApiCount(newCount);
        localStorage.setItem(GUEST_API_COUNT_KEY, newCount.toString());
    };

    const resetWordStates = () => {
        setWordData(null);
        setSelectedMeaning("");
        setCustomMeaning("");
        setUseCustomMeaning(false);
    };

    const handleApiError = async (err: unknown, wordToFetch: string) => {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        if (errorMessage === "AI_SERVICE_QUOTA_EXCEEDED") {
            try {
                const basicData = await apiService.getWordMeanings(wordToFetch);
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
    };

    const fetchWordData = async (wordToFetch: string) => {
        setLoading(true);
        setError("");
        resetWordStates();

        try {
            const data = await apiService.getEnhancedWordInfo(wordToFetch);
            setWordData(data);

            // Increment guest API count only on success
            if (!isAuthenticated) {
                incrementGuestApiCount();
            }
        } catch (err) {
            await handleApiError(err, wordToFetch);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!word.trim()) {
            setError("Please enter a word");
            return;
        }

        // Check guest API limit
        if (!isAuthenticated && isGuestLimitExceeded(guestApiCount)) {
            onLoginRequired();
            return;
        }

        await fetchWordData(word.trim());
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

    const handleBackToSearch = () => {
        resetWordStates();
    };

    const handlePronunciationClick = () => {
        if (!wordData) return;
        const utterance = new SpeechSynthesisUtterance(wordData.word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    const handleClickSuggestedWord = async (s: string) => {
        setWord(s);
        await fetchWordData(s);
    };
    // Word Analysis View
    if (wordData) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* Top Back Button */}
                <Button
                    onClick={handleBackToSearch}
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg border-3 border-black">
                    ← Search New Word
                </Button>

                {/* Word Header - Cartoon Style */}
                <WordHeader
                    wordData={wordData}
                    onPronunciationClick={handlePronunciationClick}
                    onClickSuggestedWord={handleClickSuggestedWord}
                />

                {/* Meaning Selection - Cartoon Style */}
                <MeaningSelection
                    wordData={wordData}
                    selectedMeaning={selectedMeaning}
                    customMeaning={customMeaning}
                    useCustomMeaning={useCustomMeaning}
                    error={error}
                    onSelectedMeaningChange={setSelectedMeaning}
                    onUseCustomMeaningChange={setUseCustomMeaning}
                    onCustomMeaningChange={setCustomMeaning}
                    onBackToSearch={handleBackToSearch}
                    onContinue={handleContinue}
                />
            </div>
        );
    }

    // Search View - Cartoon Style
    return (
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black transition-transform">
            <div className="text-center mb-8">
                <div className="text-7xl mb-4">🔍</div>
                <h2
                    className="text-3xl font-black text-gray-800 mb-2"
                    style={{ textShadow: "3px 3px 0 rgba(255,200,0,0.3)" }}>
                    Search Any Word!
                </h2>
                <p className="text-lg text-gray-700 font-bold">Get AI-powered learning cards instantly! ✨</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <Input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Type any English word... 📝"
                        disabled={loading}
                        className="h-16 pl-14 pr-4 text-lg font-semibold rounded-2xl border-3 border-gray-800 focus:ring-4 focus:ring-purple-400"
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border-3 border-red-400 rounded-xl p-3">
                        <p className="text-red-700 font-bold text-center">{error}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-lg font-black bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 w-6 h-6" />
                            Analyze Word! 🚀
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t-3 border-gray-200">
                <p className="text-sm text-gray-600 font-bold text-center mb-3">Try these examples:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {suggestedWordsLoading
                        ? // Loading skeleton
                          Array.from({ length: 4 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="px-4 py-2 bg-gray-200 text-gray-400 font-bold rounded-full border-2 border-gray-300 animate-pulse">
                                  Loading...
                              </div>
                          ))
                        : suggestedWords.map((suggestedWord) => (
                              <button
                                  key={suggestedWord}
                                  onClick={() => setWord(suggestedWord)}
                                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold rounded-full border-2 border-gray-800 hover:scale-105 transition-transform">
                                  {suggestedWord}
                              </button>
                          ))}
                </div>
            </div>
        </div>
    );
}

export default WordInput;
