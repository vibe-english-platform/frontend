import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { CollectionCard } from "../types";
import { apiService } from "../lib/api";
import { useEffect, useState } from "react";
import { useToast } from "../lib/toast";

interface CardDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card: CollectionCard;
    collectionId: string;
    collectionName: string;
    onUpdated: () => void;
    onDeleted: () => void;
}

function CardDetailDialog({
    open,
    onOpenChange,
    card,
    collectionId,
    collectionName,
    onUpdated,
    onDeleted,
}: CardDetailDialogProps) {
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
            <DialogContent className="bg-gray-900 border-gray-700 max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center justify-between">
                        <span>Saved Card • {card.word}</span>
                        <Badge className="bg-emerald-100 text-emerald-700">Saved</Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-[250px_1fr]">
                        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-600">
                            <img
                                src={formData.imageUrl}
                                alt={card.word}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    const target = event.target as HTMLImageElement;
                                    target.src = `https://via.placeholder.com/400x250/4f46e5/ffffff?text=${encodeURIComponent(
                                        card.word
                                    )}`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-xs text-white/80">
                                {collectionName}
                            </div>
                        </div>
                        <Card className="bg-white/5 border border-white/10">
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-white/60">Meanings</p>
                                    <Textarea
                                        value={formData.meaning}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, meaning: event.target.value }))}
                                        rows={3}
                                        className="bg-gray-800 border-gray-600 text-white"
                                    />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-white/60">Example</p>
                                    <Textarea
                                        value={formData.example}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, example: event.target.value }))}
                                        rows={3}
                                        className="bg-gray-800 border-gray-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white text-[11px] uppercase tracking-wide">Image URL</Label>
                                    <Input
                                        value={formData.imageUrl}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, imageUrl: event.target.value }))}
                                        className="bg-gray-800 border-gray-600 text-white"
                                    />
                                    <p className="text-[11px] text-white/60 mt-1">
                                        Future storage integration (Cloudinary, S3, etc.) can hook here.
                                    </p>
                                </div>
                                <div className="text-[13px] text-white/60">
                                    Saved on {new Date(card.savedAt).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 flex-1"
                        >
                            {isSaving ? "Saving…" : "Update Card"}
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            variant="outline"
                            className="text-red-400 hover:text-red-300 border-red-400"
                        >
                            {isDeleting ? "Deleting…" : "Delete Card"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CardDetailDialog;

