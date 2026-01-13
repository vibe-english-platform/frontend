import { PlusCircle, Save, Share2, Book, Lightbulb, Check } from "lucide-react";
import { LearningCard as LearningCardType, Collection } from "../types";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import SaveToCollectionDialog from "./SaveToCollectionDialog";

interface LearningCardProps {
    card: LearningCardType;
    onReset: () => void;
    onSaved?: () => void | Promise<void>;
    collections?: Collection[];
    onCollectionsChange?: () => void;
}

function LearningCard({ card, onReset, onSaved, collections, onCollectionsChange }: LearningCardProps) {
    const [saved, setSaved] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    useEffect(() => {
        setSaved(false);
    }, [card]);

    useEffect(() => {
        if (!saved) return;
        const timer = setTimeout(() => setSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [saved]);

    const handleSaveClick = () => {
        if (saved) return;
        setShowSaveDialog(true);
    };

    const handleSaved = async () => {
        setSaved(true);
        await onSaved?.();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Success Header - Cartoon Style */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-full font-black shadow-lg border-3 border-black">
                    <Check className="w-5 h-5" />
                    CARD CREATED! 🎉
                </div>
            </div>

            <div className="overflow-hidden shadow-[0_12px_0_rgba(0,0,0,0.2)] border-4 border-black rounded-3xl bg-white">
                {/* Image Section */}
                <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-purple-200 to-pink-200 border-b-4 border-black">
                    <img
                        src={card.imageUrl}
                        alt={card.word}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(
                                card.word
                            )}`;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Word Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h1
                            className="text-5xl md:text-6xl font-black text-white capitalize"
                            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
                            {card.word}
                        </h1>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Meaning - Cartoon Style */}
                    <div className="flex gap-4 p-5 bg-purple-50 rounded-2xl border-3 border-purple-300">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center border-2 border-white shadow-lg">
                            <Book className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-purple-900 mb-2">📖 DEFINITION</h3>
                            <p className="text-gray-700 leading-relaxed font-semibold">{card.meaning}</p>
                        </div>
                    </div>

                    {/* Example - Cartoon Style */}
                    <div className="flex gap-4 p-5 bg-yellow-50 rounded-2xl border-3 border-yellow-300">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-white shadow-lg">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-yellow-900 mb-2">💡 EXAMPLE</h3>
                            <p className="text-gray-700 leading-relaxed font-semibold italic">
                                &ldquo;{card.example}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Actions - Cartoon Buttons */}
                    <div className="flex gap-3 pt-4 border-t-3 border-gray-200">
                        <Button
                            onClick={handleSaveClick}
                            disabled={saved}
                            className={`flex-1 h-14 font-black text-lg rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all ${
                                saved
                                    ? "bg-green-500 hover:bg-green-500 text-white"
                                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            }`}>
                            {saved ? (
                                <>
                                    <Check className="mr-2 w-5 h-5" />
                                    SAVED! ✅
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 w-5 h-5" />
                                    Save Card! 💾
                                </>
                            )}
                        </Button>
                        <Button className="flex-1 h-14 bg-gray-200 text-gray-800 hover:bg-gray-300 font-black text-lg rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                            <Share2 className="mr-2 w-5 h-5" />
                            Share 🔗
                        </Button>
                    </div>
                </div>
            </div>

            {/* New Word Button - Cartoon Style */}
            <div className="text-center">
                <Button
                    onClick={onReset}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black text-lg px-10 py-6 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                    <PlusCircle className="mr-2 w-5 h-5" />
                    Learn Another Word! 🚀
                </Button>
            </div>

            {/* Save to Collection Dialog */}
            <SaveToCollectionDialog
                open={showSaveDialog}
                onOpenChange={setShowSaveDialog}
                card={card}
                collections={collections || []}
                onCollectionsChange={onCollectionsChange || (() => {})}
                onSaved={handleSaved}
            />
        </div>
    );
}

export default LearningCard;
