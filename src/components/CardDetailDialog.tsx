import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CollectionCard } from "../types";
import { apiService } from "../lib/api";
import { useEffect, useState } from "react";
import { useToast } from "../lib/toast";
import { Edit3, Trash2 } from "lucide-react";

interface CardDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card: CollectionCard;
    collectionId: string;
    collectionName: string;
    onUpdated: () => void;
    onDeleted: () => void;
}

function CardDetailDialog({ open, onOpenChange, card, collectionId, onUpdated, onDeleted }: CardDetailDialogProps) {
    const [formData, setFormData] = useState({
        meaning: card.meaning,
        example: card.example,
        imageUrl: card.imageUrl,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (open) {
            setFormData({
                meaning: card.meaning,
                example: card.example,
                imageUrl: card.imageUrl,
            });
        }
    }, [card, open]);

    const handleUpdate = async () => {
        if (!formData.meaning.trim() || !formData.example.trim()) {
            showToast("Meaning and example cannot be empty", "error");
            return;
        }

        setIsSaving(true);
        try {
            await apiService.updateCollectionCard(collectionId, card.id, {
                meaning: formData.meaning.trim(),
                example: formData.example.trim(),
                imageUrl: formData.imageUrl.trim(),
            });
            showToast("Card updated", "success");
            onUpdated();
        } catch (error) {
            showToast("Failed to update card", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this card from the collection? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            await apiService.deleteCollectionCard(collectionId, card.id);
            showToast("Card removed from collection", "success");
            onDeleted();
        } catch (error) {
            showToast("Failed to delete card", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle className="text-3xl font-black text-gray-800 capitalize">{card.word}</DialogTitle>
            </DialogHeader>
            <DialogContent className="bg-white border-4 border-black max-w-3xl shadow-[0_12px_0_rgba(0,0,0,0.3)]">
                <div className="space-y-6">
                    {/* Card Image */}
                    <div className="relative h-64 w-full overflow-hidden rounded-2xl border-4 border-black bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg">
                        <img
                            src={formData.imageUrl}
                            alt={card.word}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                const target = event.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/800x600/FFD700/8B4513?text=${encodeURIComponent(
                                    card.word
                                )}`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <p className="text-white text-2xl font-black drop-shadow-lg capitalize">{card.word}</p>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <Card className="bg-gray-50 border-3 border-gray-300 rounded-2xl shadow-lg">
                        <CardContent className="space-y-4 p-6">
                            {/* Meaning */}
                            <div>
                                <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                    📖 Meaning
                                </Label>
                                <Textarea
                                    value={formData.meaning}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, meaning: event.target.value }))
                                    }
                                    rows={3}
                                    className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                />
                            </div>

                            {/* Example */}
                            <div>
                                <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                    💡 Example
                                </Label>
                                <Textarea
                                    value={formData.example}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, example: event.target.value }))
                                    }
                                    rows={3}
                                    className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                    🖼️ Image URL
                                </Label>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, imageUrl: event.target.value }))
                                    }
                                    className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                />
                                <p className="text-xs text-gray-500 font-medium mt-2">
                                    💡 Tip: You can update the image URL for this card
                                </p>
                            </div>

                            {/* Saved Date */}
                            <div className="pt-3 border-t-2 border-gray-200">
                                <p className="text-sm text-gray-500 font-semibold">
                                    📅 Saved on {new Date(card.savedAt).toLocaleDateString()} at{" "}
                                    {new Date(card.savedAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all disabled:opacity-50">
                            <Edit3 className="w-5 h-5 mr-2" />
                            {isSaving ? "Saving..." : "Update Card"}
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all disabled:opacity-50">
                            <Trash2 className="w-5 h-5 mr-2" />
                            {isDeleting ? "Deleting..." : "Delete Card"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CardDetailDialog;
