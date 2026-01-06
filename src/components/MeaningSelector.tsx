import { useState } from "react";
import { ArrowLeft, Edit3, Sparkles, Loader2 } from "lucide-react";
import { WordMeaning } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    disabled={loading}
                    className="text-white/80 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            <Card className="relative overflow-hidden shadow-xl">
                {/* Word Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <h2 className="text-2xl font-bold text-white">
                        Select a meaning for <span className="capitalize">&quot;{word}&quot;</span>
                    </h2>
                    <p className="text-white/70 mt-1">Choose the definition that fits your learning context</p>
                </div>

                <CardContent className="p-6 space-y-4">
                    {/* Meanings List */}
                    <div className="max-h-[350px] space-y-3 overflow-y-auto pr-2">
                        {meanings.slice(0, 6).map((meaning, index) => (
                            <button
                                key={index}
                                onClick={() => handleMeaningClick(meaning.definition)}
                                disabled={loading}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md cursor-pointer"
                                } border-gray-100`}>
                                <Badge className="mb-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                    {meaning.partOfSpeech}
                                </Badge>
                                <p className="text-gray-700 leading-relaxed">{meaning.definition}</p>
                                {meaning.example && (
                                    <p className="text-gray-500 text-sm mt-2 italic border-l-2 border-indigo-200 pl-3">
                                        &quot;{meaning.example}&quot;
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Custom Meaning */}
                    <div className="pt-4 border-t">
                        {!showCustomInput ? (
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={() => setShowCustomInput(true)}
                                disabled={loading}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Or type your own meaning
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <Textarea
                                    value={customMeaning}
                                    onChange={(e) => setCustomMeaning(e.target.value)}
                                    placeholder="Enter your own meaning or context..."
                                    disabled={loading}
                                    rows={3}
                                    className="resize-none"
                                />
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleCustomSubmit}
                                        disabled={loading || !customMeaning.trim()}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Create Learning Card
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowCustomInput(false);
                                            setCustomMeaning("");
                                        }}
                                        disabled={loading}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                        <p className="text-lg font-medium text-gray-700">Creating your learning card...</p>
                        <p className="text-sm text-gray-500">This may take a few seconds</p>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default MeaningSelector;
