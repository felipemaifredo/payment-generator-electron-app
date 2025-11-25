import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styles from "./TimeEntryForm.module.css"
import { useToast } from "../../contexts/ToastContext"

interface TimeEntryFormProps {
    sprintId: string
    onSubmit: (entry: { sprintId: string; hours: number; description: string; link?: string }) => Promise<void>
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ sprintId, onSubmit }) => {
    const intl = useIntl()
    const { showToast } = useToast()
    const [hours, setHours] = useState("")
    const [description, setDescription] = useState("")
    const [link, setLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!hours || !description) return

        setIsSubmitting(true)
        try {
            await onSubmit({
                sprintId,
                hours: parseFloat(hours),
                description,
                link: link || undefined
            })

            setHours("")
            setDescription("")
            setLink("")
        } catch (error) {
            console.error("Error submitting time entry:", error)
            showToast(intl.formatMessage({ id: "error.createTimeEntry" }), "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>
                <FormattedMessage id="timeEntry.add" />
            </h3>

            <div className={styles.field}>
                <label htmlFor="hours" className={styles.label}>
                    <FormattedMessage id="timeEntry.hours" /> <FormattedMessage id="timeEntry.required" />
                </label>
                <input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    className={styles.input}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder={intl.formatMessage({ id: "timeEntry.hoursPlaceholder" })}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>
                    <FormattedMessage id="timeEntry.description" /> <FormattedMessage id="timeEntry.required" />
                </label>
                <textarea
                    id="description"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={intl.formatMessage({ id: "timeEntry.descriptionPlaceholder" })}
                    rows={3}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="link" className={styles.label}>
                    <FormattedMessage id="timeEntry.link" />
                </label>
                <input
                    id="link"
                    type="url"
                    className={styles.input}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={intl.formatMessage({ id: "timeEntry.linkPlaceholder" })}
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !hours || !description}
            >
                <FormattedMessage id={isSubmitting ? "timeEntry.submitting" : "timeEntry.submit"} />
            </button>
        </form>
    )
}
