import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { LearningCard as LearningCardType, Collection } from "../types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";

interface SaveToCollectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card: LearningCardType;
    collections: Collection[];
    onCollectionsChange: () => void;
    onSaved: () => void;
}

function SaveToCollectionDialog({
    open,
    onOpenChange,
    card,
    collections,
    onCollectionsChange,
    onSaved,
}: SaveToCollectionDialogProps) {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newCollection, setNewCollection] = useState({
        name: "",
        description: "",
        flags: [] as string[],
        color: "#3B82F6",
    });
    const [newFlag, setNewFlag] = useState("");
    const { showToast } = useToast();

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            const defaultCollection = collections.find((c) => c.isDefault);
            setSelectedCollectionId(defaultCollection?.id || (collections.length > 0 ? collections[0].id : ""));
            setShowCreateForm(false);
            setIsSaving(false);
            setIsCreating(false);
            setNewCollection({
                name: "",
                description: "",
                flags: [],
                color: "#3B82F6",
            });
            setNewFlag("");
        }
    }, [open, collections]);

    const addFlag = () => {
        if (newFlag.trim() && !newCollection.flags.includes(newFlag.trim())) {
            setNewCollection((prev) => ({
                ...prev,
                flags: [...prev.flags, newFlag.trim()],
            }));
            setNewFlag("");
        }
    };

    const removeFlag = (flagToRemove: string) => {
        setNewCollection((prev) => ({
            ...prev,
            flags: prev.flags.filter((flag) => flag !== flagToRemove),
        }));
    };

    const handleCreateCollection = async () => {
        if (!newCollection.name.trim()) {
            showToast("Collection name is required", "error");
            return;
        }

        setIsCreating(true);
        try {
            await apiService.createCollection(
                newCollection.name,
                newCollection.description,
                newCollection.flags,
                newCollection.color
            );

            showToast("Collection created successfully", "success");
            onCollectionsChange();
            setShowCreateForm(false);

            // Refresh collections and select the new one
            setTimeout(() => {
                // This is a bit hacky, but we need to wait for the collections to update
                // In a real app, you'd want to return the new collection from the API
                onCollectionsChange();
            }, 500);
        } catch (error) {
            showToast("Failed to create collection", "error");
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveToCollection = async () => {
        if (!selectedCollectionId) {
            showToast("Please select a collection", "error");
            return;
        }

        setIsSaving(true);
        try {
            await apiService.saveLearningCard(card, selectedCollectionId);
            const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
            const collectionName = selectedCollection?.name || "collection";
            showToast(`${card.word} saved to ${collectionName}`, "success");
            onSaved();
            onOpenChange(false);
        } catch (error) {
            showToast("Failed to save card", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const predefinedColors = [
        "#3B82F6",
        "#EF4444",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
        "#F97316",
        "#6366F1",
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-4 border-black max-w-md shadow-[0_12px_0_rgba(0,0,0,0.3)]">
                <DialogHeader>
                    {/* Fun header with emoji */}
                    <div className="text-center mb-4">
                        <div className="text-5xl mb-2">💾</div>
                        <DialogTitle className="text-2xl font-black text-gray-800">
                            Save &quot;{card.word}&quot;!
                        </DialogTitle>
                        <p className="text-gray-600 font-bold">Choose where to keep your card! 📚</p>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {!showCreateForm ? (
                        <>
                            {/* Collection Selection */}
                            <div>
                                <Label className="text-gray-800 font-black mb-3 block text-lg">
                                    📁 Choose Collection
                                </Label>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    {collections.map((collection) => (
                                        <button
                                            key={collection.id}
                                            onClick={() => setSelectedCollectionId(collection.id)}
                                            className={`w-full p-4 rounded-2xl border-3 text-left transition-all ${
                                                selectedCollectionId === collection.id
                                                    ? "border-purple-500 bg-purple-50 shadow-lg"
                                                    : "border-gray-300 bg-gray-50 hover:bg-purple-50 hover:border-purple-300"
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full flex-shrink-0 border-2 border-white shadow-lg"
                                                    style={{ backgroundColor: collection.color || "#3B82F6" }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-gray-800 font-black truncate">
                                                        {collection.name}
                                                    </div>
                                                    {collection.description && (
                                                        <div className="text-gray-600 text-sm truncate font-semibold">
                                                            {collection.description}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-1 mt-2">
                                                        {collection.flags.slice(0, 3).map((flag) => (
                                                            <span
                                                                key={flag}
                                                                className="px-2 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full border border-purple-300">
                                                                {flag}
                                                            </span>
                                                        ))}
                                                        {collection.flags.length > 3 && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full border border-purple-300">
                                                                +{collection.flags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-gray-600 font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">
                                                    {collection.cards.length} 📄
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <Button
                                    onClick={() => setShowCreateForm(true)}
                                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create New
                                </Button>
                                <Button
                                    onClick={handleSaveToCollection}
                                    disabled={!selectedCollectionId || isSaving}
                                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all disabled:opacity-50">
                                    {isSaving ? "Saving..." : "Save Card"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Create New Collection Form */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Button
                                        onClick={() => setShowCreateForm(false)}
                                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-4 py-2 rounded-full border-2 border-gray-400">
                                        <X className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🆕</span>
                                        <span className="text-gray-800 font-black text-lg">Create New Collection!</span>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="name" className="text-gray-800 font-black text-base">
                                        📝 Collection Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newCollection.name}
                                        onChange={(e) =>
                                            setNewCollection((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        className="border-3 border-gray-800 rounded-xl font-semibold mt-2 focus:ring-4 focus:ring-purple-400"
                                        placeholder="e.g., My Awesome Words! ✨"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-gray-800 font-black text-base">
                                        📖 Description (optional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={newCollection.description}
                                        onChange={(e) =>
                                            setNewCollection((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        className="border-3 border-gray-800 rounded-xl font-semibold mt-2 focus:ring-4 focus:ring-purple-400"
                                        placeholder="Tell us about this collection! 🎯"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label className="text-gray-800 font-black text-base">🏷️ Tags/Flags</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            value={newFlag}
                                            onChange={(e) => setNewFlag(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addFlag()}
                                            className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                            placeholder="e.g., beginner, fun, animals 🐶"
                                        />
                                        <Button
                                            onClick={addFlag}
                                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 rounded-xl border-2 border-purple-600">
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {newCollection.flags.map((flag) => (
                                            <span
                                                key={flag}
                                                className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-full border-2 border-purple-300">
                                                {flag}
                                                <X
                                                    className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                                                    onClick={() => removeFlag(flag)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-gray-800 font-black text-base">🎨 Choose Color</Label>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                                                    newCollection.color === color
                                                        ? "border-black shadow-lg scale-110"
                                                        : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewCollection((prev) => ({ ...prev, color }))}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold py-3 rounded-full border-3 border-gray-400 hover:border-gray-500">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateCollection}
                                        disabled={!newCollection.name.trim() || isCreating}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all disabled:opacity-50">
                                        {isCreating ? "Creating..." : "Create & Save"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default SaveToCollectionDialog;
