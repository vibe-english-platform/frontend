import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Eye, EyeOff, Sparkles, Rocket } from "lucide-react";

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (email: string, username: string, password: string) => Promise<void>;
    loading: boolean;
}

function AuthDialog({ open, onOpenChange, onLogin, onRegister, loading }: AuthDialogProps) {
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (authMode === "register") {
            const username = formData.get("username") as string;
            await onRegister(email, username, password);
        } else {
            await onLogin(email, password);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-black shadow-[0_8px_0_rgba(0,0,0,0.2)]">
                <DialogHeader>
                    {/* Fun emoji header */}
                    <div className="text-6xl text-center mb-2">
                        {authMode === "login" ? "👋" : "🎉"}
                    </div>
                    
                    <DialogTitle className="text-3xl font-black text-center text-gray-800">
                        {authMode === "login" ? "Welcome Back! 🌟" : "Join The Fun! 🚀"}
                    </DialogTitle>
                    
                    <DialogDescription className="text-center text-gray-700 font-bold text-base">
                        {authMode === "login"
                            ? "Sign in and continue your learning adventure!"
                            : "Create an account and start learning NOW! 🎊"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-gray-800">
                            📧 Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                            className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                        />
                    </div>

                    {authMode === "register" && (
                        <div className="space-y-2">
                            <Label htmlFor="username" className="font-bold text-gray-800">
                                🎨 Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Pick a cool name!"
                                required
                                disabled={loading}
                                className="border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                            />
                        </div>
                    )}

                    <div className="space-y-2 relative">
                        <Label htmlFor="password" className="font-bold text-gray-800">
                            🔒 Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Super secret! 🤫"
                            required
                            disabled={loading}
                            className="pr-10 border-3 border-gray-800 rounded-xl font-semibold focus:ring-4 focus:ring-purple-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg py-6 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Loading...
                            </span>
                        ) : authMode === "login" ? (
                            <span className="flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                Let&apos;s Go! 🎯
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Start Learning! 🎊
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                        className="text-gray-700 font-bold hover:text-purple-600 transition-colors underline decoration-2 underline-offset-4"
                    >
                        {authMode === "login" 
                            ? "New here? Create account! ✨" 
                            : "Already have account? Sign in! 👋"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AuthDialog;
