import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import AuthDialog from "./components/AuthDialog";
import CollectionsPage from "./components/CollectionsPage";
import CollectionDetailPage from "./components/CollectionDetailPage";
import LearningCenterPage from "./components/LearningCenterPage";
import ReviewPage from "./components/ReviewPage";
import { User } from "./types";
import { apiService } from "./lib/api";
import { useToast } from "./lib/toast";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [showAuth, setShowAuth] = useState<boolean>(false);
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Authentication handlers
    const handleLogin = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            await apiService.login({ email, password });
            const userData = await apiService.getProfile();
            setUser(userData);
            setIsAuthenticated(true);
            setShowAuth(false);
        } catch (error) {
            showToast("Login failed: " + (error as Error).message, "error");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (email: string, username: string, password: string) => {
        setAuthLoading(true);
        try {
            await apiService.register({ email, username, password });
            const userData = await apiService.getProfile();
            setUser(userData);
            setIsAuthenticated(true);
            setShowAuth(false);
        } catch (error) {
            showToast("Registration failed: " + (error as Error).message, "error");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        apiService.logout();
        setIsAuthenticated(false);
        setUser(null);
        navigate("/");
    };

    // Navigation handlers
    const handleWordLearned = async (learnedWord: string, learnedMeaning: string) => {
        if (isAuthenticated && user) {
            try {
                await apiService.learnWord(learnedWord, learnedMeaning);
                const userData = await apiService.getProfile();
                setUser(userData);
            } catch (error) {
                console.error("Failed to track word learning:", error);
            }
        }
    };

    const handleGetStarted = () => {
        navigate("/search");
    };

    const handleHomeNavigation = () => {
        navigate("/search");
    };

    const handleViewCollection = () => {
        if (!isAuthenticated) {
            showToast("Sign in to view your collection", "error");
            setShowAuth(true);
            return;
        }
        navigate("/collections");
    };

    const handleViewLearningCenter = () => {
        if (!isAuthenticated) {
            showToast("Sign in to access the learning center", "error");
            setShowAuth(true);
            return;
        }
        navigate("/learning");
    };

    const handleBackFromCollections = () => {
        navigate("/search");
    };

    const handleBackFromLearningCenter = () => {
        navigate("/collections");
    };

    const handleViewSpecificCollection = (collectionId: string) => {
        if (!isAuthenticated) {
            showToast("Sign in to view collections", "error");
            setShowAuth(true);
            return;
        }
        navigate(`/collection/${collectionId}`);
    };

    const handleStartReview = (collectionIds: string[], mode: "due" | "all") => {
        const params = new URLSearchParams();
        if (collectionIds.length > 0) params.append("collections", collectionIds.join(","));
        params.append("mode", mode);
        navigate(`/review?${params.toString()}`);
    };

    const handleBackFromReview = () => {
        navigate("/learning");
    };

    // Auth check on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (apiService.isAuthenticated()) {
                try {
                    const userData = await apiService.getProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch {
                    apiService.removeToken();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        };
        checkAuth();
    }, []);

    // Get review params from URL
    const getReviewParams = () => {
        const urlParams = new URLSearchParams(location.search);
        const collections = urlParams.get("collections")?.split(",") ?? [];
        const mode = (urlParams.get("mode") as "due" | "all") ?? "due";
        return { collectionIds: collections, mode };
    };

    return (
        <div className="min-h-screen">
            <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                onSignIn={() => setShowAuth(true)}
                onViewCollection={handleViewCollection}
                onViewLearningCenter={handleViewLearningCenter}
                onGetStarted={handleHomeNavigation}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            onGetStarted={handleGetStarted}
                            onSignIn={() => setShowAuth(true)}
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
                <Route
                    path="/search"
                    element={
                        <SearchPage
                            isAuthenticated={isAuthenticated}
                            collections={user?.collections ?? []}
                            onLoginRequired={() => setShowAuth(true)}
                            onWordLearned={handleWordLearned}
                            onCollectionsChange={() => {
                                if (isAuthenticated && user) {
                                    apiService.getProfile().then(setUser).catch(console.error);
                                }
                            }}
                            onViewCollections={handleViewCollection}
                        />
                    }
                />
                <Route
                    path="/collections"
                    element={
                        isAuthenticated ? (
                            <CollectionsPage
                                collections={user?.collections ?? []}
                                onBack={handleBackFromCollections}
                                onViewCollection={handleViewSpecificCollection}
                                onCollectionsChange={() => {
                                    if (isAuthenticated && user) {
                                        apiService.getProfile().then(setUser).catch(console.error);
                                    }
                                }}
                                onOpenLearningCenter={handleViewLearningCenter}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/collection/:id"
                    element={
                        isAuthenticated ? (
                            <CollectionDetailPage
                                collections={user?.collections ?? []}
                                onCollectionsChange={() => {
                                    if (isAuthenticated && user) {
                                        apiService.getProfile().then(setUser).catch(console.error);
                                    }
                                }}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/learning"
                    element={
                        isAuthenticated ? (
                            <LearningCenterPage
                                collections={user?.collections ?? []}
                                onBack={handleBackFromLearningCenter}
                                onStartReview={handleStartReview}
                                onCollectionsChange={() => {
                                    if (isAuthenticated && user) {
                                        apiService.getProfile().then(setUser).catch(console.error);
                                    }
                                }}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/review"
                    element={
                        isAuthenticated ? (
                            <ReviewPage
                                collectionIds={getReviewParams().collectionIds}
                                mode={getReviewParams().mode}
                                onClose={handleBackFromReview}
                                onComplete={() => {
                                    handleBackFromReview();
                                    if (isAuthenticated && user) {
                                        apiService.getProfile().then(setUser).catch(console.error);
                                    }
                                }}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <AuthDialog
                open={showAuth}
                onOpenChange={setShowAuth}
                onLogin={handleLogin}
                onRegister={handleRegister}
                loading={authLoading}
            />
        </div>
    );
}

export default App;
