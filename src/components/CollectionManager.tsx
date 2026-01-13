import { useState } from "react";
import { Plus, Edit, Trash2, X, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
            setFormData((prev) => ({
                ...prev,
                flags: [...prev.flags, newFlag.trim()],
            }));
            setNewFlag("");
        }
    };

    const removeFlag = (flagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            flags: prev.flags.filter((flag) => flag !== flagToRemove),
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-gray-800">⚙️ Manage Collections</h3>
                        <p className="text-gray-600 font-bold mt-1">Create, edit, and organize your collections!</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={openCreateDialog}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black px-8 py-4 rounded-full border-3 border-black shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                                <Plus className="w-5 h-5 mr-2" />
                                New Collection
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-4 border-black max-w-lg shadow-[0_12px_0_rgba(0,0,0,0.3)]">
                            <DialogHeader>
                                {/* Fun header */}
                                <div className="text-center mb-4">
                                    <DialogTitle className="text-2xl font-black text-gray-800 capitalize">
                                        Create New Collection!
                                    </DialogTitle>
                                    <p className="text-gray-600 font-bold">Let&apos;s build something amazing! ✨</p>
                                </div>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                        📝 Collection Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                        placeholder="e.g., My Awesome Words! 🌟"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="description"
                                        className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                        📖 Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                        placeholder="Tell us about this collection! 🎯"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                        🏷️ Tags/Flags
                                    </Label>
                                    <div className="flex gap-2 mb-3">
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
                                    <div className="flex flex-wrap gap-2">
                                        {formData.flags.map((flag) => (
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
                                    <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                        🎨 Choose Color
                                    </Label>
                                    <div className="flex flex-wrap gap-3">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                                                    formData.color === color
                                                        ? "border-black shadow-lg scale-110"
                                                        : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <Button
                                        onClick={() => setIsCreateDialogOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold py-3 rounded-full border-3 border-gray-400 hover:border-gray-500">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black py-3 rounded-full border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                                        Create!
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Collections List */}
            <div className="space-y-4">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className="flex flex-wrap items-center justify-between p-5 bg-white rounded-2xl border-3 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_rgba(0,0,0,0.3)] transition-all">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div
                                className="w-8 h-8 rounded-full border-3 border-white shadow-lg flex-shrink-0"
                                style={{ backgroundColor: collection.color || "#3B82F6" }}
                            />
                            <div className="min-w-0 flex-1">
                                <h4 className="text-gray-800 font-black text-lg truncate">{collection.name}</h4>
                                {collection.description && (
                                    <p className="text-gray-600 font-semibold text-sm line-clamp-2">
                                        {collection.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {collection.flags.map((flag) => (
                                        <span
                                            key={flag}
                                            className="px-2 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full border border-purple-300">
                                            {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full border-2 border-blue-400 text-sm">
                                {collection.cards.length} 📄
                            </div>
                            <Button
                                onClick={() => openEditDialog(collection)}
                                size="icon"
                                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold p-2 rounded-full border-2 border-yellow-500 shadow-lg hover:shadow-xl transition-all">
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => handleClone(collection)}
                                size="icon"
                                className="bg-blue-400 hover:bg-blue-500 text-blue-900 font-bold p-2 rounded-full border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all">
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => handleDelete(collection)}
                                size="icon"
                                className="bg-red-400 hover:bg-red-500 text-red-900 font-bold p-2 rounded-full border-2 border-red-500 shadow-lg hover:shadow-xl transition-all">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white border-4 border-black max-w-lg shadow-[0_12px_0_rgba(0,0,0,0.3)]">
                    <DialogHeader>
                        {/* Fun header */}
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">✏️</div>
                            <DialogTitle className="text-2xl font-black text-gray-800 capitalize">
                                Edit Collection!
                            </DialogTitle>
                            <p className="text-gray-600 font-bold">Make it even better! ✨</p>
                        </div>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div>
                            <Label
                                htmlFor="edit-name"
                                className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                📝 Collection Name *
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="edit-description"
                                className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                📖 Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                🏷️ Tags/Flags
                            </Label>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    value={newFlag}
                                    onChange={(e) => setNewFlag(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addFlag()}
                                    className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                                    placeholder="Add a tag!"
                                />
                                <Button
                                    onClick={addFlag}
                                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 rounded-xl border-2 border-purple-600">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.flags.map((flag) => (
                                    <span
                                        key={flag}
                                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-full border-2 border-purple-300">
                                        <X
                                            className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                                            onClick={() => removeFlag(flag)}
                                        />
                                        {flag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-800 font-black text-base mb-2 flex items-center gap-2">
                                🎨 Choose Color
                            </Label>
                            <div className="flex flex-wrap gap-3">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                                            formData.color === color
                                                ? "border-black shadow-lg scale-110"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <Button
                                onClick={() => setIsEditDialogOpen(false)}
                                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold py-3 rounded-full border-3 border-gray-400 hover:border-gray-500">
                                Cancel 😔
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-3 rounded-full border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                                Update! 🚀
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CollectionManager;
