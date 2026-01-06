import {
    WordMeaning,
    LearningCard as LearningCardType,
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    WordAnalysis,
    EnhancedWordResponse,
    WordAnalysisRequest,
} from "../types";

// Cookie utilities
const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Simple cache for word data to reduce API calls
const wordCache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * API Service Configuration:
 *
 * Development Setup (localhost:8000):
 * 1. Backend runs on port 8000 (default)
 * 2. Frontend proxies /api/* to http://localhost:8000/api/*
 * 3. No .env file needed for basic development
 *
 * Custom Backend Port:
 * 1. Create frontend/.env file with: VITE_API_PORT=3001
 * 2. Backend should run on port 3001
 * 3. Frontend will proxy to the specified port
 *
 * Production/Domain Setup:
 * 1. Create frontend/.env file with: VITE_API_BASE_URL=https://api.yourdomain.com
 * 2. Frontend will call https://api.yourdomain.com/api/*
 *
 * Environment Variables:
 * - VITE_API_PORT: Backend port for development (default: 8000)
 * - VITE_API_BASE_URL: Full API URL for production/staging
 * - VITE_ENV: Environment name (development, staging, production)
 */

// API Configuration
const getApiBaseUrl = (): string => {
    // Check for environment variable overrides
    // We check both VITE_API_URL (used in vite.config.ts) and VITE_API_BASE_URL
    const envApiUrl = import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL;
    
    if (envApiUrl) {
        // Ensure the URL ends with /api
        return envApiUrl.endsWith("/api") ? envApiUrl : `${envApiUrl}/api`;
    }

    // Environment-based configuration
    const isProduction = import.meta.env?.PROD || false;
    const isStaging = import.meta.env?.VITE_ENV === "staging";

    if (isProduction) {
        // Fallback for production if VITE_API_URL is missing
        // IMPORTANT: Replace this with your actual Render backend URL or set the env var
        return "https://your-backend-on-render.onrender.com/api";
    } else if (isStaging) {
        // Staging API domain
        return "https://api-staging.yourdomain.com/api";
    } else {
        // Development - use proxy (port configured in vite.config.ts)
        return "/api";
    }
};

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = getApiBaseUrl();

        // Log API configuration in development
        if (import.meta.env?.DEV) {
            console.log("🔗 API Configuration:", this.getApiInfo());
        }
    }

    // Get API configuration info (useful for debugging)
    getApiInfo() {
        return {
            baseURL: this.baseURL,
            isProduction: import.meta.env?.PROD || false,
            environment: import.meta.env?.VITE_ENV || "development",
            customApiUrl: import.meta.env?.VITE_API_BASE_URL || null,
            devPort: import.meta.env?.VITE_API_PORT || "8000",
        };
    }

    // Update API base URL (useful for runtime configuration)
    setApiBaseUrl(url: string) {
        this.baseURL = url.endsWith("/api") ? url : `${url}/api`;
    }

    // Cookie management
    private setCookie(name: string, value: string, maxAge: number) {
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
    }

    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(";").shift() || null;
        }
        return null;
    }

    private deleteCookie(name: string) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    // Token management
    setToken(token: string) {
        this.setCookie(COOKIE_NAME, token, COOKIE_MAX_AGE);
    }

    getToken(): string | null {
        return this.getCookie(COOKIE_NAME);
    }

    removeToken() {
        this.deleteCookie(COOKIE_NAME);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    // HTTP request helper
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        // Get auth token
        const token = this.getToken();

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    this.removeToken();
                    throw new Error("Authentication required");
                }

                // Handle rate limiting (429 errors)
                if (response.status === 429) {
                    throw new Error("AI_SERVICE_QUOTA_EXCEEDED");
                }

                // Try to parse error response
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP ${response.status}`);
                } catch {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            // Handle empty responses
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return {} as T;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Network error");
        }
    }

    // API Methods

    // Words API
    async getWordMeanings(word: string): Promise<{ word: string; meanings: WordMeaning[] }> {
        return this.request(`/words/meanings/${encodeURIComponent(word)}`);
    }

    async getEnhancedWordInfo(word: string): Promise<EnhancedWordResponse> {
        const cacheKey = `enhanced_${word.toLowerCase()}`;
        const cached = wordCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        try {
            const data = (await this.request(`/words/enhanced/${encodeURIComponent(word)}`)) as EnhancedWordResponse;
            wordCache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            // If quota exceeded, check if we have cached data
            if (error instanceof Error && error.message === "AI_SERVICE_QUOTA_EXCEEDED" && cached) {
                console.warn("Using cached word data due to quota limits");
                return cached.data as EnhancedWordResponse;
            }
            throw error;
        }
    }

    async analyzeWord(request: WordAnalysisRequest): Promise<WordAnalysis> {
        return this.request("/words/analyze", {
            method: "POST",
            body: JSON.stringify(request),
        });
    }

    async getPronunciationGuide(word: string): Promise<{ word: string; pronunciation: string }> {
        return this.request(`/words/pronunciation/${encodeURIComponent(word)}`);
    }

    async assessWordDifficulty(
        word: string,
        context?: string
    ): Promise<{
        word: string;
        level: "beginner" | "intermediate" | "advanced";
        score: number;
        reasoning: string;
    }> {
        return this.request("/words/difficulty", {
            method: "POST",
            body: JSON.stringify({ word, context }),
        });
    }

    async generateLearningCard(word: string, meaning: string): Promise<LearningCardType> {
        return this.request("/words/generate-learning-card", {
            method: "POST",
            body: JSON.stringify({ word, meaning }),
        });
    }

    async saveLearningCard(card: LearningCardType, collectionId?: string): Promise<{ message: string }> {
        const url = collectionId ? `/users/collections?collectionId=${collectionId}` : "/users/collections";
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(card),
        });
    }

    async createCollection(name: string, description?: string, flags?: string[], color?: string): Promise<{ message: string }> {
        return this.request("/users/collections/create", {
            method: "POST",
            body: JSON.stringify({ name, description, flags, color }),
        });
    }

    async updateCollection(collectionId: string, updates: { name?: string; description?: string; flags?: string[]; color?: string }): Promise<{ message: string }> {
        return this.request(`/users/collections/${collectionId}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
    }

    async deleteCollection(collectionId: string): Promise<{ message: string }> {
        return this.request(`/users/collections/${collectionId}`, {
            method: "DELETE",
        });
    }

    async moveCard(cardId: string, fromCollectionId: string, toCollectionId: string): Promise<{ message: string }> {
        return this.request("/users/collections/move-card", {
            method: "POST",
            body: JSON.stringify({ cardId, fromCollectionId, toCollectionId }),
        });
    }

    async cloneCollection(collectionId: string, name?: string): Promise<{ message: string }> {
        return this.request(`/users/collections/${collectionId}/clone`, {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    }

    async updateCollectionCard(
        collectionId: string,
        cardId: string,
        updates: { meaning?: string; example?: string; imageUrl?: string }
    ): Promise<{ message: string }> {
        return this.request(`/users/collections/${collectionId}/cards/${cardId}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
    }

    async deleteCollectionCard(collectionId: string, cardId: string): Promise<{ message: string }> {
        return this.request(`/users/collections/${collectionId}/cards/${cardId}`, {
            method: "DELETE",
        });
    }

    // Spaced Repetition / Review APIs
    async getCardsForReview(collectionId?: string, collectionIds?: string[]): Promise<{ cards: any[] }> {
        let url = "/users/review/due";
        const params = new URLSearchParams();
        
        if (collectionIds && collectionIds.length > 0) {
            // Multiple collection IDs
            params.append("collectionIds", collectionIds.join(","));
        } else if (collectionId) {
            // Single collection ID
            params.append("collectionId", collectionId);
        }
        
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        return this.request(url);
    }

    async recordCardReview(
        collectionId: string, 
        cardId: string, 
        rating: 1 | 2 | 3 | 4,
        confidence?: number,
        questionType?: string,
        timeSpent?: number,
        pronunciationScore?: number
    ): Promise<{ message: string }> {
        return this.request("/users/review/record", {
            method: "POST",
            body: JSON.stringify({ 
                collectionId, 
                cardId, 
                rating,
                confidence,
                questionType,
                timeSpent,
                pronunciationScore
            }),
        });
    }

    async getCardQuestion(collectionId: string, cardId: string): Promise<any> {
        return this.request(`/users/review/question/${collectionId}/${cardId}`);
    }

    async getReviewStats(collectionId?: string, collectionIds?: string[]): Promise<any> {
        let url = "/users/review/stats";
        const params = new URLSearchParams();
        
        if (collectionIds && collectionIds.length > 0) {
            // Multiple collection IDs
            params.append("collectionIds", collectionIds.join(","));
        } else if (collectionId) {
            // Single collection ID
            params.append("collectionId", collectionId);
        }
        
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        return this.request(url);
    }

    async resetCardProgress(collectionId: string, cardId: string): Promise<{ message: string }> {
        return this.request("/users/review/reset", {
            method: "POST",
            body: JSON.stringify({ collectionId, cardId }),
        });
    }

    // Authentication API
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>("/users/register", {
            method: "POST",
            body: JSON.stringify(data),
        });

        // Store token on successful registration
        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>("/users/login", {
            method: "POST",
            body: JSON.stringify(data),
        });

        // Store token on successful login
        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async logout(): Promise<void> {
        this.removeToken();
    }

    async getProfile(): Promise<any> {
        return this.request("/users/profile");
    }

    async updatePreferences(preferences: any): Promise<any> {
        return this.request("/users/preferences", {
            method: "PUT",
            body: JSON.stringify(preferences),
        });
    }

    async getProgress(): Promise<any> {
        return this.request("/users/progress");
    }

    async updateProgress(progress: any): Promise<any> {
        return this.request("/users/progress", {
            method: "POST",
            body: JSON.stringify(progress),
        });
    }

    async learnWord(word: string, meaning: string, difficulty?: number): Promise<any> {
        return this.request("/users/learn-word", {
            method: "POST",
            body: JSON.stringify({ word, meaning, difficulty }),
        });
    }

    async reviewWord(word: string, difficulty: number): Promise<any> {
        return this.request("/users/review-word", {
            method: "POST",
            body: JSON.stringify({ word, difficulty }),
        });
    }

    async getReviewWords(): Promise<any> {
        return this.request("/users/review-words");
    }

    async getDashboard(): Promise<any> {
        return this.request("/users/dashboard");
    }

    // Health check
    async healthCheck(): Promise<any> {
        return this.request("/health");
    }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for convenience
export type { RegisterRequest, LoginRequest, AuthResponse };
