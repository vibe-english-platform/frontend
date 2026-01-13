import EnhancedReviewSession from "./EnhancedReviewSession";

interface ReviewPageProps {
    collectionIds: string[];
    mode: "due" | "all";
    onClose: () => void;
    onComplete: () => void;
}

function ReviewPage({ collectionIds, mode, onClose, onComplete }: ReviewPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-8 pb-12">
            <EnhancedReviewSession
                collectionIds={collectionIds}
                mode={mode}
                isPage={true}
                onClose={onClose}
                onComplete={onComplete}
            />
        </div>
    );
}

export default ReviewPage;
