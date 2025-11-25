import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { Sprint } from "../../types"
import styles from "./EditSprintModal.module.css"
import { useToast } from "../../contexts/ToastContext"

import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal"

interface EditSprintModalProps {
    sprint: Sprint
    onSave: (updates: Partial<Sprint>) => Promise<void>
    onDelete: () => Promise<void>
    onClose: () => void
}

export const EditSprintModal: React.FC<EditSprintModalProps> = ({ sprint, onSave, onDelete, onClose }) => {
    const intl = useIntl()
    const { showToast } = useToast()
    const [name, setName] = useState(sprint.name)
    const [startDate, setStartDate] = useState(sprint.startDate)
    const [endDate, setEndDate] = useState(sprint.endDate)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSave({ name, startDate, endDate })
            onClose()
        } catch (error) {
            console.error("Error updating sprint:", error)
            showToast(intl.formatMessage({ id: "error.updateSprint" }), "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            await onDelete()
            onClose()
        } catch (error) {
            console.error("Error deleting sprint:", error)
            showToast(intl.formatMessage({ id: "error.deleteSprint" }), "error")
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>
                    <FormattedMessage id="modal.edit.title" />
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name">
                            <FormattedMessage id="sprint.name" />
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="startDate">
                            <FormattedMessage id="sprint.startDate" />
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="endDate">
                            <FormattedMessage id="sprint.endDate" />
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isSubmitting}
                        >
                            <FormattedMessage id="modal.edit.delete" />
                        </button>
                        <div className={styles.rightActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="modal.edit.cancel" />
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id={isSubmitting ? "modal.edit.saving" : "modal.edit.save"} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title={intl.formatMessage({ id: "modal.edit.delete" })}
                message={intl.formatMessage(
                    { id: "modal.edit.deleteConfirm" },
                    { name: sprint.name }
                )}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmLabel={intl.formatMessage({ id: "modal.edit.delete" })}
                cancelLabel={intl.formatMessage({ id: "modal.edit.cancel" })}
                isDangerous
            />
        </div>
    )
}
