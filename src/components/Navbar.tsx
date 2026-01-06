import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { User } from "../types";

interface NavbarProps {
    isAuthenticated: boolean;
    user: User | null;
    onLogout: () => void;
    onSignIn: () => void;
    onViewCollection: () => void;
    onViewLearningCenter: () => void;
}

function Navbar({ isAuthenticated, user, onLogout, onSignIn, onViewCollection, onViewLearningCenter }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <span className="text-white font-semibold text-lg hidden sm:block">English Learning</span>
                </div>

                {isAuthenticated && user ? (
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={onViewLearningCenter}>
                            Learning Center
                        </Button>
                        <Button variant="outline" size="sm" onClick={onViewCollection}>
                            My Collection
                        </Button>
                        <div className="hidden sm:flex items-center gap-2 text-white/90 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <span>{user.username}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onLogout}
                            className="text-white/80 hover:text-white hover:bg-white/10">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button onClick={onSignIn} className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg">
                        Sign In
                    </Button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
