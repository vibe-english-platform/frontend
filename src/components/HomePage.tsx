import HeroSection from "./HeroSection";

interface HomePageProps {
    onGetStarted: () => void;
    onSignIn: () => void;
    isAuthenticated: boolean;
}

function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
    return (
        <HeroSection
            onGetStarted={onGetStarted}
            onSignIn={onSignIn}
            isAuthenticated={isAuthenticated}
        />
    );
}

export default HomePage;
