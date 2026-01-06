import { useState } from "react";
import { Plus, Edit, Trash2, X, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";
import { Collection } from "../types";

interface CollectionManagerProps {
    collections: Collection[];
    onCollectionsChange: () => void;
}

function CollectionManager({ collections, onCollectionsChange }: CollectionManagerProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        flags: [] as string[],
        color: "#3B82F6",
    });
    const [newFlag, setNewFlag] = useState("");
    const { showToast } = useToast();

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            flags: [],
            color: "#3B82F6",
        });
        setNewFlag("");
    };

    const openCreateDialog = () => {
        resetForm();
        setIsCreateDialogOpen(true);
    };

    const openEditDialog = (collection: Collection) => {
        setFormData({
            name: collection.name,
            description: collection.description || "",
            flags: [...collection.flags],
            color: collection.color || "#3B82F6",
        });
        setEditingCollection(collection);
        setIsEditDialogOpen(true);
    };

    const addFlag = () => {
        if (newFlag.trim() && !formData.flags.includes(newFlag.trim())) {
            setFormData(prev => ({
                ...prev,
                flags: [...prev.flags, newFlag.trim()]
            }));
            setNewFlag("");
        }
    };

    const removeFlag = (flagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            flags: prev.flags.filter(flag => flag !== flagToRemove)
        }));
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            showToast("Collection name is required", "error");
            return;
        }

        try {
            await apiService.createCollection(formData.name, formData.description, formData.flags, formData.color);
            showToast("Collection created successfully", "success");
            setIsCreateDialogOpen(false);
            onCollectionsChange();
        } catch (error) {
            showToast("Failed to create collection", "error");
        }
    };

    const handleUpdate = async () => {
        if (!editingCollection || !formData.name.trim()) {
            showToast("Collection name is required", "error");
            return;
        }

        try {
            await apiService.updateCollection(editingCollection.id, {
                name: formData.name,
                description: formData.description,
                flags: formData.flags,
                color: formData.color,
            });
            showToast("Collection updated successfully", "success");
            setIsEditDialogOpen(false);
            setEditingCollection(null);
            onCollectionsChange();
        } catch (error) {
            showToast("Failed to update collection", "error");
        }
    };

    const handleDelete = async (collection: Collection) => {
        if (!confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await apiService.deleteCollection(collection.id);
            showToast("Collection deleted successfully", "success");
            onCollectionsChange();
        } catch (error) {
            showToast("Failed to delete collection", "error");
        }
    };

    const predefinedColors = [
        "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
        "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
    ];

    const handleClone = async (collection: Collection) => {
        const defaultName = `Copy of ${collection.name}`;
        const cloneName = window.prompt("Name for the new collection", defaultName)?.trim();
        if (!cloneName) return;

        try {
            await apiService.cloneCollection(collection.id, cloneName);
            showToast("Collection cloned successfully", "success");
            onCollectionsChange();
        } catch (error) {
            showToast("Failed to clone collection", "error");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Manage Collections</h3>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Collection
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create New Collection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-white">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-gray-800 border-gray-600 text-white"
                                    placeholder="e.g., Vocabulary Basics"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-white">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-gray-800 border-gray-600 text-white"
                                    placeholder="Brief description of this collection"
                                />
                            </div>
                            <div>
                                <Label className="text-white">Flags/Tags</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newFlag}
                                        onChange={(e) => setNewFlag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addFlag()}
                                        className="bg-gray-800 border-gray-600 text-white"
                                        placeholder="e.g., beginner, grammar"
                                    />
                                    <Button onClick={addFlag} variant="outline">Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.flags.map((flag) => (
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
                                <div className="flex gap-2 mt-2">
                                    {predefinedColors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full border-2 ${
                                                formData.color === color ? 'border-white' : 'border-gray-600'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
                                    Create Collection
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Collections List */}
            <div className="space-y-2">
                {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: collection.color || '#3B82F6' }}
                            />
                            <div>
                                <h4 className="text-white font-medium">{collection.name}</h4>
                                {collection.description && (
                                    <p className="text-sm text-white/70">{collection.description}</p>
                                )}
                                <div className="flex gap-2 mt-1">
                                    {collection.flags.map((flag) => (
                                        <Badge key={flag} variant="outline" className="text-xs">
                                            {flag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">
                                {collection.cards.length} cards
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(collection)}
                                className="text-white/80 hover:text-white"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleClone(collection)}
                            className="text-white/80 hover:text-white"
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(collection)}
                            className="text-red-400 hover:text-red-300"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name" className="text-white">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-gray-800 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description" className="text-white">Description (optional)</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="bg-gray-800 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-white">Flags/Tags</Label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={newFlag}
                                    onChange={(e) => setNewFlag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addFlag()}
                                    className="bg-gray-800 border-gray-600 text-white"
                                    placeholder="Add a flag"
                                />
                                <Button onClick={addFlag} variant="outline">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.flags.map((flag) => (
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
                            <div className="flex gap-2 mt-2">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full border-2 ${
                                            formData.color === color ? 'border-white' : 'border-gray-600'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700">
                                Update Collection
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CollectionManager;
