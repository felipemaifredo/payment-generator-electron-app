import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { TimeEntry } from "../../types"
import { FiTrash2, FiExternalLink } from "react-icons/fi"
import styles from "./TimeEntryList.module.css"
import { useToast } from "../../contexts/ToastContext"

import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal"

interface TimeEntryListProps {
    entries: TimeEntry[]
    onDelete: (id: string) => Promise<void>
}

export const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries, onDelete }) => {
    const intl = useIntl()
    const { showToast } = useToast()
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)

    const handleDelete = async (id: string) => {
        try {
            await onDelete(id)
            setEntryToDelete(null)
        } catch (error) {
            console.error("Error deleting entry:", error)
            showToast(intl.formatMessage({ id: "error.deleteTimeEntry" }), "error")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <FormattedMessage id="timeEntryList.title" />
                </h3>
                <div className={styles.total}>
                    <FormattedMessage id="timeEntryList.total" />: <strong>{totalHours.toFixed(1)}h</strong>
                </div>
            </div>

            {entries.length === 0 ? (
                <div className={styles.empty}>
                    <p><FormattedMessage id="timeEntryList.empty" /></p>
                </div>
            ) : (
                <div className={styles.list}>
                    {entries.map(entry => (
                        <div key={entry.id} className={styles.entry}>
                            <div className={styles.entryContent}>
                                <div className={styles.entryHeader}>
                                    <span className={styles.hours}>{entry.hours}h</span>
                                    <span className={styles.date}>
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={styles.description}>{entry.description}</p>
                                {entry.link && (
                                    <a
                                        href={entry.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        <FiExternalLink size={14} />
                                        <FormattedMessage id="timeEntryList.viewLink" />
                                    </a>
                                )}
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={() => setEntryToDelete(entry.id)}
                                aria-label={intl.formatMessage({ id: "sprint.delete" })}
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!entryToDelete}
                title={intl.formatMessage({ id: "timeEntryList.deleteConfirmTitle" })}
                message={intl.formatMessage({ id: "timeEntryList.deleteConfirm" })}
                onConfirm={() => entryToDelete && handleDelete(entryToDelete)}
                onCancel={() => setEntryToDelete(null)}
                confirmLabel={intl.formatMessage({ id: "modal.edit.delete" })}
                cancelLabel={intl.formatMessage({ id: "modal.edit.cancel" })}
                isDangerous
            />
        </div>
    )
}
