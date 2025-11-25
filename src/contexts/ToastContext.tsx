import React, { createContext, useContext, useState, useCallback } from "react"
import { Toast } from "../components/Toast/Toast"

interface ToastMessage {
    id: string
    message: string
    type: "success" | "error" | "info"
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: 1000,
                pointerEvents: "none"
            }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
