import React from "react"
import { FormattedMessage } from "react-intl"
import { Sprint } from "../../types"
import styles from "./SprintList.module.css"

interface SprintListProps {
    sprints: Sprint[]
    onSelectSprint: (sprint: Sprint) => void
    selectedSprintId?: string
}

export const SprintList: React.FC<SprintListProps> = ({ sprints, onSelectSprint, selectedSprintId }) => {
    const activeSprints = sprints.filter(s => s.status === "active")
    const completedSprints = sprints.filter(s => s.status === "completed")

    const renderSprint = (sprint: Sprint) => (
        <div
            key={sprint.id}
            className={`${styles.sprintCard} ${selectedSprintId === sprint.id ? styles.selected : ""}`}
            onClick={() => onSelectSprint(sprint)}
        >
            <div className={styles.sprintHeader}>
                <h3 className={styles.sprintName}>{sprint.name}</h3>
                <span className={`${styles.status} ${styles[sprint.status]}`}>
                    <FormattedMessage id={`sprint.status.${sprint.status}`} />
                </span>
            </div>
            <div className={styles.sprintDates}>
                {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </div>
        </div>
    )

    return (
        <div className={styles.container}>
            {activeSprints.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <FormattedMessage id="sprint.active" />
                    </h2>
                    {activeSprints.map(renderSprint)}
                </div>
            )}

            {completedSprints.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <FormattedMessage id="sprint.completed" />
                    </h2>
                    {completedSprints.map(renderSprint)}
                </div>
            )}

            {sprints.length === 0 && (
                <div className={styles.empty}>
                    <p><FormattedMessage id="sprint.empty" /></p>
                </div>
            )}
        </div>
    )
}
