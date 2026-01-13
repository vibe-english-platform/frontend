import { useState } from "react";
import { ArrowLeft, Edit3, Sparkles, Loader2 } from "lucide-react";
import { WordMeaning } from "../types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MeaningSelectorProps {
    word: string;
    meanings: WordMeaning[];
    onMeaningSelect: (meaning: string) => void;
    loading: boolean;
    onBack: () => void;
}

function MeaningSelector({ word, meanings, onMeaningSelect, loading, onBack }: MeaningSelectorProps) {
    const [customMeaning, setCustomMeaning] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

    const handleMeaningClick = (meaning: string) => {
        if (!loading) {
            onMeaningSelect(meaning);
        }
    };

    const handleCustomSubmit = () => {
        if (customMeaning.trim() && !loading) {
            onMeaningSelect(customMeaning.trim());
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={onBack}
                    disabled={loading}
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg border-3 border-black">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="relative overflow-hidden bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black">
                {/* Word Header - Cartoon Style */}
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 border-b-4 border-black">
                    <h2 className="text-3xl font-black text-white" style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
                        Choose Meaning for <span className="capitalize">&quot;{word}&quot;</span>! 🎯
                    </h2>
                    <p className="text-white/90 mt-1 font-bold">Pick the one that fits best!</p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Meanings List - Cartoon Style */}
                    <div className="max-h-[350px] space-y-3 overflow-y-auto pr-2">
                        {meanings.slice(0, 6).map((meaning, index) => (
                            <button
                                key={index}
                                onClick={() => handleMeaningClick(meaning.definition)}
                                disabled={loading}
                                className={`w-full text-left p-4 rounded-2xl border-3 transition-all ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:border-purple-400 hover:bg-purple-50 hover:scale-105 cursor-pointer border-gray-300"
                                }`}>
                                <span className="inline-block mb-2 px-3 py-1 bg-purple-200 text-purple-800 font-bold text-xs rounded-full border-2 border-purple-400">
                                    {meaning.partOfSpeech}
                                </span>
                                <p className="text-gray-700 leading-relaxed font-semibold">{meaning.definition}</p>
                                {meaning.example && (
                                    <p className="text-gray-600 text-sm mt-2 italic border-l-4 border-purple-300 pl-3">
                                        &quot;{meaning.example}&quot;
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Custom Meaning - Cartoon Style */}
                    <div className="pt-4 border-t-3 border-gray-200">
                        {!showCustomInput ? (
                            <Button
                                className="w-full h-12 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold rounded-full border-3 border-gray-800"
                                onClick={() => setShowCustomInput(true)}
                                disabled={loading}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Or type your own meaning! ✏️
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <Textarea
                                    value={customMeaning}
                                    onChange={(e) => setCustomMeaning(e.target.value)}
                                    placeholder="Enter your own meaning or context..."
                                    disabled={loading}
                                    rows={3}
                                    className="resize-none border-3 border-gray-800 rounded-xl font-semibold"
                                />
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleCustomSubmit}
                                        disabled={loading || !customMeaning.trim()}
                                        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Create Card! 🎨
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowCustomInput(false);
                                            setCustomMeaning("");
                                        }}
                                        disabled={loading}
                                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold rounded-full border-3 border-gray-800">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading Overlay - Cartoon Style */}
                {loading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="h-16 w-16 text-purple-600 animate-spin mb-4" />
                        <p className="text-2xl font-black text-gray-800">Creating your card...</p>
                        <p className="text-sm text-gray-600 font-bold mt-2">This is gonna be awesome! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MeaningSelector;
