import { useEffect, useState } from "react";
import WordInput from "./components/WordInput";
import MeaningSelector from "./components/MeaningSelector";
import LearningCard from "./components/LearningCard";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AuthDialog from "./components/AuthDialog";
import CollectionsPage from "./components/CollectionsPage";
import LearningCenterPage from "./components/LearningCenterPage";
import { WordMeaning, LearningCard as LearningCardType, User } from "./types";
import { apiService } from "./lib/api";
import { useToast } from "./lib/toast";

function App() {
    const getInitialView = (): "learn" | "collections" | "learning" => {
        if (typeof window === "undefined") return "learn";
        if (window.location.pathname === "/collections") return "collections";
        if (window.location.pathname === "/learning") return "learning";
        return "learn";
    };

    const [view, setView] = useState<"learn" | "collections" | "learning">(getInitialView);
    const [step, setStep] = useState<number>(1);
    const [word, setWord] = useState<string>("");
    const [meanings, setMeanings] = useState<WordMeaning[]>([]);
    const [learningCard, setLearningCard] = useState<LearningCardType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [showAuth, setShowAuth] = useState<boolean>(false);
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const { showToast } = useToast();
    const isCollectionsView = view === "collections";
    const isLearningCenterView = view === "learning";

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

    useEffect(() => {
        const handlePopState = () => {
            const pathname = window.location.pathname;
            if (pathname === "/collections") {
                setView("collections");
            } else if (pathname === "/learning") {
                setView("learning");
            } else {
                setView("learn");
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const pushState = (nextView: "learn" | "collections" | "learning") => {
        if (typeof window === "undefined") return;
        const nextPath =
            nextView === "collections" ? "/collections" : nextView === "learning" ? "/learning" : "/";
        window.history.pushState(null, "", nextPath);
    };

    const handleSwitchView = (nextView: "learn" | "collections" | "learning") => {
        setView(nextView);
        pushState(nextView);
    };

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
        setStep(1);
        setWord("");
        setMeanings([]);
        setLearningCard(null);
    };

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

    const handleWordSubmit = (
        searchWord: string,
        fetchedMeanings: WordMeaning[],
        selectedMeaning?: string,
        customMeaning?: string
    ) => {
        setWord(searchWord);
        setMeanings(fetchedMeanings);
        if (selectedMeaning || customMeaning) {
            handleMeaningSelect(selectedMeaning || customMeaning || "", searchWord);
        } else {
            setStep(2);
        }
    };

    const handleMeaningSelect = async (meaning: string, overrideWord?: string) => {
        const targetWord = overrideWord ?? word;
        setLoading(true);

        try {
            const data = await apiService.generateLearningCard(targetWord, meaning);
            setLearningCard(data);
            setStep(3);
            handleWordLearned(targetWord, meaning);
        } catch (error) {
            console.error("Error generating learning card:", error);
            showToast("Failed to generate learning card. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setWord("");
        setMeanings([]);
        setLearningCard(null);
    };

    const handleViewCollection = () => {
        if (!isAuthenticated) {
            showToast("Sign in to view your collection", "error");
            setShowAuth(true);
            return;
        }

        handleReset();
        handleSwitchView("collections");
    };

    const handleViewLearningCenter = () => {
        if (!isAuthenticated) {
            showToast("Sign in to access the learning center", "error");
            setShowAuth(true);
            return;
        }

        handleSwitchView("learning");
    };

    const handleBackFromCollections = () => {
        handleReset();
        handleSwitchView("learn");
    };

    const handleBackFromLearningCenter = () => {
        handleSwitchView("collections");
    };

    const handleCardSaved = async () => {
        if (!isAuthenticated) return;

        try {
            const profile = await apiService.getProfile();
            setUser(profile);
        } catch (error) {
            console.error("Failed to refresh profile after save:", error);
        }

        handleSwitchView("collections");
    };

    useEffect(() => {
        console.log("isCollectionsView", isCollectionsView);
    }, [isCollectionsView]);

    return (
        <div className="min-h-screen">
            <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                onSignIn={() => setShowAuth(true)}
                onViewCollection={handleViewCollection}
                onViewLearningCenter={handleViewLearningCenter}
            />

            {!isCollectionsView && !isLearningCenterView && <HeroSection />}

            <main className="max-w-4xl mx-auto px-4 pb-12">
                {isCollectionsView ? (
                    <CollectionsPage
                        collections={user?.collections ?? []}
                        onBack={handleBackFromCollections}
                        onCollectionsChange={() => {
                            if (isAuthenticated && user) {
                                apiService.getProfile().then(setUser).catch(console.error);
                            }
                        }}
                        onOpenLearningCenter={handleViewLearningCenter}
                    />
                ) : isLearningCenterView ? (
                    <LearningCenterPage
                        collections={user?.collections ?? []}
                        onBack={handleBackFromLearningCenter}
                        onCollectionsChange={() => {
                            if (isAuthenticated && user) {
                                apiService.getProfile().then(setUser).catch(console.error);
                            }
                        }}
                    />
                ) : (
                    <>
                        {step === 1 && (
                            <WordInput
                                onWordSubmit={handleWordSubmit}
                                isAuthenticated={isAuthenticated}
                                onLoginRequired={() => setShowAuth(true)}
                            />
                        )}

                        {step === 2 && (
                            <MeaningSelector
                                word={word}
                                meanings={meanings}
                                onMeaningSelect={handleMeaningSelect}
                                loading={loading}
                                onBack={handleReset}
                            />
                        )}

                        {step === 3 && learningCard && (
                            <LearningCard
                                card={learningCard}
                                onReset={handleReset}
                                onSaved={handleCardSaved}
                                collections={user?.collections ?? []}
                                onCollectionsChange={() => {
                                    if (isAuthenticated && user) {
                                        apiService.getProfile().then(setUser).catch(console.error);
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </main>

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
