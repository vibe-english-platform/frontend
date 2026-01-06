export interface WordMeaning {
    partOfSpeech: string;
    definition: string;
    example: string | null;
}

export interface WordResponse {
    word: string;
    phonetic: string;
    meanings: WordMeaning[];
    analysis?: {
        difficulty: "beginner" | "intermediate" | "advanced";
        difficultyScore: number;
        pronunciation: {
            phonetic: string;
            syllables: string[];
            stress: number[];
        };
        relationships: {
            synonyms: string[];
            antonyms: string[];
            related: string[];
        };
        usage: {
            contexts: string[];
            formality: "formal" | "informal" | "neutral";
            frequency: "rare" | "common" | "very common";
        };
        examples: {
            basic: string;
            intermediate: string;
            advanced: string;
        };
    };
}

export interface LearningCard {
    word: string;
    meaning: string;
    example: string;
    imageUrl: string;
}

export interface SavedCard extends LearningCard {
    savedAt: string;
}

export interface CollectionCard extends LearningCard {
    savedAt: string;
    collectionId: string;
    id: string;
    // Spaced Repetition fields
    reviewCount: number;
    easeFactor: number;
    interval: number;
    nextReviewDate: string;
    lastReviewedAt?: string;
    lapseCount: number;
    status: "new" | "learning" | "review" | "relearning";
    // Enhanced Learning fields
    learningStage: "recognition" | "recall" | "production";
    confidenceLevel: number;
    pronunciationAttempts: number;
    lastQuestionType?: string;
    correctStreak: number;
}

export interface Collection {
    id: string;
    name: string;
    description?: string;
    flags: string[]; // e.g., ["beginner", "vocabulary", "grammar", "phrasal-verbs"]
    color?: string;
    isDefault?: boolean;
    createdAt: string;
    updatedAt: string;
    cards: CollectionCard[];
}

// Spaced Repetition types
export type ReviewRating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface ReviewStats {
    totalCards: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
    dueToday: number;
    reviewedToday: number;
    successRate: number;
    averageEase: number;
    longestStreak: number;
    currentStreak: number;
}

// Enhanced Learning types
export type LearningStage = "recognition" | "recall" | "production";
export type QuestionType =
    | "multiple-choice"
    | "true-false"
    | "fill-blank"
    | "short-answer"
    | "write-sentence"
    | "speak-sentence"
    | "paraphrase";

export interface QuestionData {
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer: string;
    hints?: string[];
    audioUrl?: string;
}

// Enhanced word analysis with Gemini AI
export interface WordAnalysis {
    word: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    difficultyScore: number;
    pronunciation: {
        phonetic: string;
        syllables: string[];
        stress: number[];
    };
    relationships: {
        synonyms: string[];
        antonyms: string[];
        related: string[];
    };
    usage: {
        contexts: string[];
        formality: "formal" | "informal" | "neutral";
        frequency: "rare" | "common" | "very common";
    };
    examples: {
        basic: string;
        intermediate: string;
        advanced: string;
    };
}

export interface EnhancedWordResponse extends WordResponse {
    analysis?: WordAnalysis;
    phonetic: string;
}

export interface WordAnalysisRequest {
    word: string;
    meaning?: string;
    context?: string;
}

// User Authentication Types
export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    lastLoginAt?: string;
    learningProgress: LearningProgress;
    preferences: UserPreferences;
    collections: Collection[];
}

export interface UserPreferences {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    language: string;
    difficulty: "beginner" | "intermediate" | "advanced";
}

export interface LearningProgress {
    wordsLearned: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyTime: number;
    lastStudyDate?: string;
    learnedWords: LearnedWord[];
}

export interface LearnedWord {
    word: string;
    meaning: string;
    learnedAt: string;
    reviewCount: number;
    nextReviewDate: string;
    difficulty: number;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
    };
    token: string;
}

export interface DashboardStats {
    totalWordsLearned: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyTime: number;
    wordsDueForReview: number;
    recentLearnings: LearnedWord[];
    averageDifficulty: number;
    lastStudyDate?: string;
    studyConsistency: number;
}
