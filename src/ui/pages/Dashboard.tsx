import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useIntl, FormattedMessage } from "react-intl"
import { Sprint, TimeEntry } from "../../types"
import { SprintList } from "../../components/SprintList/SprintList"
import { TimeEntryForm } from "../../components/TimeEntryForm/TimeEntryForm"
import { TimeEntryList } from "../../components/TimeEntryList/TimeEntryList"
import { FiPlus, FiDownload, FiEdit } from "react-icons/fi"
import { EditSprintModal } from "../../components/EditSprintModal/EditSprintModal"
import styles from "./Dashboard.module.css"

export const Dashboard: React.FC = () => {
    const [sprints, setSprints] = useState<Sprint[]>([])
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewSprintForm, setShowNewSprintForm] = useState(false)
    const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
    const navigate = useNavigate()
    const intl = useIntl()

    useEffect(() => {
        loadSprints()
    }, [])

    useEffect(() => {
        if (selectedSprint) {
            loadTimeEntries(selectedSprint.id)
        }
    }, [selectedSprint])

    const loadSprints = async () => {
        try {
            const data = await window.firebase.getSprints()
            setSprints(data)
            if (data.length > 0 && !selectedSprint) {
                const activeSprint = data.find(s => s.status === "active") || data[0]
                setSelectedSprint(activeSprint)
            }
        } catch (error) {
            console.error("Error loading sprints:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadTimeEntries = async (sprintId: string) => {
        try {
            const data = await window.firebase.getTimeEntries(sprintId)
            setTimeEntries(data)
        } catch (error) {
            console.error("Error loading time entries:", error)
        }
    }

    const handleCreateSprint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            const newSprint = await window.firebase.createSprint({
                name: formData.get("name") as string,
                startDate: formData.get("startDate") as string,
                endDate: formData.get("endDate") as string,
                status: "active"
            })
            setSprints([...sprints, newSprint])
            setSelectedSprint(newSprint)
            setShowNewSprintForm(false)
        } catch (error) {
            console.error("Error creating sprint:", error)
        }
    }

    const handleCreateTimeEntry = async (entry: Omit<TimeEntry, "id">) => {
        try {
            const newEntry = await window.firebase.createTimeEntry(entry)
            setTimeEntries([...timeEntries, newEntry])
        } catch (error) {
            console.error("Error creating time entry:", error)
        }
    }

    const handleDeleteTimeEntry = async (id: string) => {
        try {
            await window.firebase.deleteTimeEntry(id)
            setTimeEntries(timeEntries.filter(entry => entry.id !== id))
        } catch (error) {
            console.error("Error deleting time entry:", error)
        }
    }

    const handleExportCSV = () => {
        if (!selectedSprint || timeEntries.length === 0) return

        const headers = ["Data", "Horas", "Descrição", "Link"]
        const rows = timeEntries.map(entry => [
            entry.createdAt,
            entry.hours.toString(),
            `"${entry.description.replace(/"/g, '""')}"`,
            entry.link || ""
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)

        link.setAttribute("href", url)
        link.setAttribute("download", `${selectedSprint.name.replace(/\s+/g, "_")}_horas.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleEditSprint = async (updates: Partial<Sprint>) => {
        if (!editingSprint) return
        await window.firebase.updateSprint(editingSprint.id, updates)
        await loadSprints()
        if (selectedSprint?.id === editingSprint.id) {
            setSelectedSprint({ ...selectedSprint, ...updates })
        }
    }

    const handleDeleteSprint = async () => {
        if (!editingSprint) return
        await window.firebase.deleteSprint(editingSprint.id)
        if (selectedSprint?.id === editingSprint.id) {
            setSelectedSprint(null)
            setTimeEntries([])
        }
        await loadSprints()
    }

    if (isLoading) {
        return <div className={styles.loading}>Carregando...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Sprints</h2>
                    <button
                        className={styles.newSprintButton}
                        onClick={() => setShowNewSprintForm(!showNewSprintForm)}
                    >
                        <FiPlus size={20} />
                    </button>
                </div>

                {showNewSprintForm && (
                    <form className={styles.newSprintForm} onSubmit={handleCreateSprint}>
                        <input name="name" placeholder="Nome da sprint" required />
                        <input name="startDate" type="date" required />
                        <input name="endDate" type="date" required />
                        <button type="submit">Criar</button>
                    </form>
                )}

                <SprintList
                    sprints={sprints}
                    onSelectSprint={setSelectedSprint}
                    selectedSprintId={selectedSprint?.id}
                />
            </div>

            <div className={styles.main}>
                {selectedSprint ? (
                    <>
                        <div className={styles.sprintHeader}>
                            <h1>{selectedSprint.name}</h1>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => setEditingSprint(selectedSprint)}
                                >
                                    <FiEdit size={16} />
                                    Editar
                                </button>
                                <button
                                    className={styles.exportButton}
                                    onClick={handleExportCSV}
                                    disabled={timeEntries.length === 0}
                                >
                                    <FiDownload size={16} />
                                    Gerar CSV
                                </button>
                                <button
                                    className={styles.completeButton}
                                    onClick={async () => {
                                        await window.firebase.updateSprint(selectedSprint.id, { status: "completed" })
                                        loadSprints()
                                    }}
                                    disabled={selectedSprint.status === "completed"}
                                >
                                    {selectedSprint.status === "completed" ? "Concluída" : "Marcar como concluída"}
                                </button>
                            </div>
                        </div>

                        <div className={styles.content}>
                            <TimeEntryForm
                                sprintId={selectedSprint.id}
                                onSubmit={handleCreateTimeEntry}
                            />
                            <TimeEntryList
                                entries={timeEntries}
                                onDelete={handleDeleteTimeEntry}
                            />
                        </div>
                    </>
                ) : (
                    <div className={styles.empty}>
                        <p>Crie uma sprint para começar</p>
                    </div>
                )}
            </div>

            {editingSprint && (
                <EditSprintModal
                    sprint={editingSprint}
                    onSave={handleEditSprint}
                    onDelete={handleDeleteSprint}
                    onClose={() => setEditingSprint(null)}
                />
            )}
        </div>
    )
}
