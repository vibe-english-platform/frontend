import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastVariant = "default" | "success" | "error";

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
}

type ToastContextValue = {
    showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_TIMEOUT = 4500;

const generateId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const showToast = useCallback(
        (message: string, variant: ToastVariant = "default") => {
            const id = generateId();
            setToasts((prev) => [...prev, { id, message, variant }]);
            timers.current[id] = setTimeout(() => dismissToast(id), TOAST_TIMEOUT);
        },
        [dismissToast]
    );

    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach((timeout) => clearTimeout(timeout));
        };
    }, []);

    const variantStyles: Record<ToastVariant, string> = {
        default: "bg-white border-slate-200 text-slate-900",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        error: "bg-rose-50 border-rose-200 text-rose-900",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        aria-live="assertive"
                        className={`pointer-events-auto w-80 max-w-full rounded-2xl border px-4 py-3 shadow-lg transition-transform ${variantStyles[toast.variant]}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm leading-snug">{toast.message}</p>
                            <button
                                type="button"
                                onClick={() => dismissToast(toast.id)}
                                className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}



