import React from "react"
import styles from "./ConfirmationModal.module.css"

interface ConfirmationModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmLabel?: string
    cancelLabel?: string
    isDangerous?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    isDangerous = false,
}) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton} ${isDangerous ? styles.dangerous : ""}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
