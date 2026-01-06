import { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import { LearningCard as LearningCardType, Collection } from "../types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
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
            <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Save &quot;{card.word}&quot; to Collection
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!showCreateForm ? (
                        <>
                            {/* Collection Selection */}
                            <div>
                                <Label className="text-white mb-2 block">Select Collection</Label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {collections.map((collection) => (
                                        <button
                                            key={collection.id}
                                            onClick={() => setSelectedCollectionId(collection.id)}
                                            className={`w-full p-3 rounded-lg border text-left transition-colors ${
                                                selectedCollectionId === collection.id
                                                    ? "border-indigo-500 bg-indigo-500/20"
                                                    : "border-gray-600 bg-gray-800 hover:bg-gray-700"
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: collection.color || "#3B82F6" }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white font-medium truncate">
                                                        {collection.name}
                                                    </div>
                                                    {collection.description && (
                                                        <div className="text-gray-400 text-sm truncate">
                                                            {collection.description}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-1 mt-1">
                                                        {collection.flags.slice(0, 3).map((flag) => (
                                                            <Badge key={flag} variant="outline" className="text-xs">
                                                                {flag}
                                                            </Badge>
                                                        ))}
                                                        {collection.flags.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{collection.flags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    {collection.cards.length} cards
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button onClick={() => setShowCreateForm(true)} variant="outline" className="flex-1">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New
                                </Button>
                                <Button
                                    onClick={handleSaveToCollection}
                                    disabled={!selectedCollectionId || isSaving}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Create New Collection Form */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowCreateForm(false)}
                                        className="text-gray-400 hover:text-white">
                                        <X className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <span className="text-white font-medium">Create New Collection</span>
                                </div>

                                <div>
                                    <Label htmlFor="name" className="text-white">
                                        Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newCollection.name}
                                        onChange={(e) =>
                                            setNewCollection((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        className="bg-gray-800 border-gray-600 text-white mt-1"
                                        placeholder="e.g., Vocabulary Basics"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-white">
                                        Description (optional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={newCollection.description}
                                        onChange={(e) =>
                                            setNewCollection((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        className="bg-gray-800 border-gray-600 text-white mt-1"
                                        placeholder="Brief description"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label className="text-white">Tags/Flags</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            value={newFlag}
                                            onChange={(e) => setNewFlag(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addFlag()}
                                            className="bg-gray-800 border-gray-600 text-white"
                                            placeholder="e.g., beginner"
                                        />
                                        <Button onClick={addFlag} variant="outline" size="sm">
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newCollection.flags.map((flag) => (
                                            <Badge key={flag} variant="secondary" className="flex items-center gap-1">
                                                {flag}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-red-400"
                                                    onClick={() => removeFlag(flag)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-white">Color</Label>
                                    <div className="flex gap-2 mt-1">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    newCollection.color === color ? "border-white" : "border-gray-600"
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewCollection((prev) => ({ ...prev, color }))}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setShowCreateForm(false)}
                                        variant="outline"
                                        className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateCollection}
                                        disabled={!newCollection.name.trim() || isCreating}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700">
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
