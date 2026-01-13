import { useState, useCallback } from "react";
import WordInput from "./WordInput";
import MeaningSelector from "./MeaningSelector";
import LearningCard from "./LearningCard";
import { WordMeaning, LearningCard as LearningCardType, Collection } from "../types";
import { apiService } from "../lib/api";
import { useToast } from "../lib/toast";

interface SearchPageProps {
    isAuthenticated: boolean;
    collections: Collection[];
    onLoginRequired: () => void;
    onWordLearned: (word: string, meaning: string) => void;
    onCollectionsChange: () => void;
    onViewCollections: () => void;
}

function SearchPage({
    isAuthenticated,
    collections,
    onLoginRequired,
    onWordLearned,
    onCollectionsChange,
    onViewCollections,
}: SearchPageProps) {
    const [step, setStep] = useState<number>(1);
    const [word, setWord] = useState<string>("");
    const [meanings, setMeanings] = useState<WordMeaning[]>([]);
    const [learningCard, setLearningCard] = useState<LearningCardType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = useToast();

    const handleMeaningSelect = useCallback(
        async (meaning: string, overrideWord?: string) => {
            const targetWord = overrideWord ?? word;
            setLoading(true);

            try {
                const data = await apiService.generateLearningCard(targetWord, meaning);
                setLearningCard(data);
                setStep(3);
                onWordLearned(targetWord, meaning);
            } catch (error) {
                console.error("Error generating learning card:", error);
                showToast("Failed to generate learning card. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        },
        [word, onWordLearned, showToast]
    );

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

    const handleReset = () => {
        setStep(1);
        setWord("");
        setMeanings([]);
        setLearningCard(null);
    };

    const handleCardSaved = () => {
        onCollectionsChange();
        onViewCollections();
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Fun Title Section */}
            <div className="text-center py-12 px-4 relative">
                {/* Decorative emojis */}
                <div className="absolute top-10 left-10 text-4xl opacity-20">📖</div>
                <div className="absolute top-20 right-10 text-4xl opacity-20">✨</div>

                <h1
                    className="text-5xl md:text-6xl font-black text-white mb-4"
                    style={{
                        textShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                        transform: "rotate(-1deg)",
                    }}>
                    Learn New Words! 📚
                </h1>
                <p
                    className="text-xl text-white font-bold max-w-2xl mx-auto"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    Type any word and get AI-powered learning cards! ✨
                </p>
            </div>

            <main className="max-w-4xl mx-auto px-4">
                {step === 1 && (
                    <WordInput
                        onWordSubmit={handleWordSubmit}
                        isAuthenticated={isAuthenticated}
                        onLoginRequired={onLoginRequired}
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
                        collections={collections}
                        onCollectionsChange={onCollectionsChange}
                    />
                )}
            </main>
        </div>
    );
}

export default SearchPage;
