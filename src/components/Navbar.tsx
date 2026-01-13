import { LogOut, User as UserIcon, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { User } from "../types";
import { Link, useLocation } from "react-router-dom";

// Desktop Navigation Component
function DesktopNav({
    isHomePage,
    isAuthenticated,
    user,
    onSignIn,
    onGetStarted,
    onViewLearningCenter,
    onViewCollection,
    onLogout,
}: {
    isHomePage: boolean;
    isAuthenticated: boolean;
    user: User | null;
    onSignIn: () => void;
    onGetStarted?: () => void;
    onViewLearningCenter: () => void;
    onViewCollection: () => void;
    onLogout: () => void;
}) {
    return (
        <>
            {isHomePage ? (
                /* Home Page - Marketing Buttons */
                <div className="flex items-center gap-4">
                    {!isAuthenticated && (
                        <Button
                            onClick={onSignIn}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black px-6 py-2 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all text-sm">
                            Sign In
                        </Button>
                    )}
                    <Button
                        onClick={onGetStarted}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black px-6 py-2 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all text-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started!
                    </Button>
                </div>
            ) : isAuthenticated && user ? (
                /* App Pages - Authenticated User */
                <div className="flex items-center gap-3">
                    {/* Learning Center Button */}
                    <Button
                        onClick={onViewLearningCenter}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all text-sm px-4 py-2">
                        Learning Center
                    </Button>

                    {/* Collection Button */}
                    <Button
                        onClick={onViewCollection}
                        className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all text-sm px-4 py-2">
                        Collections
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full border-2 border-purple-400">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-2 border-white shadow-lg">
                            <UserIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-purple-800 font-bold text-sm">{user.username}</span>
                    </div>

                    {/* Logout Button */}
                    <Button
                        onClick={onLogout}
                        className="bg-red-400 hover:bg-red-500 text-white font-bold rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all text-sm px-4 py-2">
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </Button>
                </div>
            ) : (
                /* App Pages - Not Authenticated */
                <Button
                    onClick={onSignIn}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all px-6 py-3 text-sm">
                    Sign In
                </Button>
            )}
        </>
    );
}

// Mobile Navigation Component
function MobileNav({
    isHomePage,
    isAuthenticated,
    user,
    onSignIn,
    onGetStarted,
    onViewLearningCenter,
    onViewCollection,
    onLogout,
    onCloseMenu,
}: {
    isHomePage: boolean;
    isAuthenticated: boolean;
    user: User | null;
    onSignIn: () => void;
    onGetStarted?: () => void;
    onViewLearningCenter: () => void;
    onViewCollection: () => void;
    onLogout: () => void;
    onCloseMenu: () => void;
}) {
    const handleAction = (action: () => void) => {
        action();
        onCloseMenu();
    };

    return (
        <div className="space-y-3 mt-4">
            {isHomePage ? (
                /* Home Page Mobile Menu */
                <div className="space-y-3">
                    {!isAuthenticated && (
                        <Button
                            onClick={() => handleAction(onSignIn)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                            Sign In
                        </Button>
                    )}
                    <Button
                        onClick={() => handleAction(onGetStarted!)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get Started!
                    </Button>
                </div>
            ) : isAuthenticated && user ? (
                /* App Pages - Authenticated User Mobile Menu */
                <div className="space-y-3">
                    {/* User Profile Mobile */}
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-2 border-white shadow-lg">
                            <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-purple-800 font-bold">{user.username}</p>
                            <p className="text-purple-600 text-sm">Logged in</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => handleAction(onViewLearningCenter)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        🎯 Learning Center
                    </Button>

                    <Button
                        onClick={() => handleAction(onViewCollection)}
                        className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        📖 Collections
                    </Button>

                    <Button
                        onClick={() => handleAction(onLogout)}
                        className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </Button>
                </div>
            ) : (
                /* App Pages - Not Authenticated Mobile Menu */
                <Button
                    onClick={() => handleAction(onSignIn)}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all">
                    Sign In
                </Button>
            )}
        </div>
    );
}

interface NavbarProps {
    isAuthenticated: boolean;
    user: User | null;
    onLogout: () => void;
    onSignIn: () => void;
    onViewCollection: () => void;
    onViewLearningCenter: () => void;
    onGetStarted?: () => void;
}

function Navbar({
    isAuthenticated,
    user,
    onLogout,
    onSignIn,
    onViewCollection,
    onViewLearningCenter,
    onGetStarted,
}: NavbarProps) {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="sticky top-0 z-40 bg-white shadow-[0_8px_0_rgba(0,0,0,0.2)] border-b-4 border-black">
            <div className="max-w-6xl mx-auto px-4 py-4">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link to="/">
                            <span className="text-4xl">📚</span>
                            <span
                                className="text-gray-800 font-black text-xl"
                                style={{ textShadow: "2px 2px 0 rgba(255,200,0,0.3)" }}>
                                WordMaster
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <DesktopNav
                        isHomePage={isHomePage}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        onSignIn={onSignIn}
                        onGetStarted={onGetStarted}
                        onViewLearningCenter={onViewLearningCenter}
                        onViewCollection={onViewCollection}
                        onLogout={onLogout}
                    />
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-between">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <span className="text-3xl">📚</span>
                            <span
                                className="text-gray-800 font-black text-lg"
                                style={{ textShadow: "2px 2px 0 rgba(255,200,0,0.3)" }}>
                                WordMaster
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu">
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-800" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-800" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t-2 border-gray-200">
                        <MobileNav
                            isHomePage={isHomePage}
                            isAuthenticated={isAuthenticated}
                            user={user}
                            onSignIn={onSignIn}
                            onGetStarted={onGetStarted}
                            onViewLearningCenter={onViewLearningCenter}
                            onViewCollection={onViewCollection}
                            onLogout={onLogout}
                            onCloseMenu={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
