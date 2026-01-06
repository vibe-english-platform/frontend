import { PlusCircle, Save, Share2, Book, Lightbulb, Check } from "lucide-react";
import { LearningCard as LearningCardType, Collection } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
            {/* Success Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Learning Card Created!
                </div>
            </div>

            <Card className="overflow-hidden shadow-xl">
                {/* Image Section */}
                <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200">
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
                        <h1 className="text-4xl md:text-5xl font-bold text-white capitalize drop-shadow-lg">
                            {card.word}
                        </h1>
                    </div>
                </div>

                <CardContent className="p-6 space-y-6">
                    {/* Meaning */}
                    <div className="flex gap-4 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Book className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wide mb-1">
                                Definition
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{card.meaning}</p>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="flex gap-4 p-5 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide mb-1">
                                Example
                            </h3>
                            <p className="text-gray-700 leading-relaxed italic">&ldquo;{card.example}&rdquo;</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={handleSaveClick}
                            disabled={saved}
                            className={`flex-1 h-12 ${
                                saved ? "bg-green-600 hover:bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}>
                            {saved ? (
                                <>
                                    <Check className="mr-2 w-4 h-4" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 w-4 h-4" />
                                    Save to Collection
                                </>
                            )}
                        </Button>
                        <Button variant="outline" className="flex-1 h-12">
                            <Share2 className="mr-2 w-4 h-4" />
                            Share
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* New Word Button */}
            <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg" className="px-8">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    Learn Another Word
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
