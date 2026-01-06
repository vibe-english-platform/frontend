import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Eye, EyeOff } from "lucide-react";

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        {authMode === "login" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {authMode === "login"
                            ? "Sign in to track your learning progress"
                            : "Create an account to save your vocabulary"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    {authMode === "register" && (
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Choose a username"
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="space-y-2 relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-2/3 -translate-y-2/3 text-muted-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Button
                        variant="link"
                        onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                        className="text-sm">
                        {authMode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AuthDialog;
