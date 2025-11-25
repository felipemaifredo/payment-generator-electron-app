import { contextBridge, ipcRenderer } from "electron"
import type { Sprint, TimeEntry } from "./types"

contextBridge.exposeInMainWorld("firebase", {
    testConnection: () => ipcRenderer.invoke("firebase:test-connection"),
    getSprints: (): Promise<Sprint[]> => ipcRenderer.invoke("firebase:get-sprints"),
    createSprint: (sprint: Omit<Sprint, "id" | "createdAt">): Promise<Sprint> =>
        ipcRenderer.invoke("firebase:create-sprint", sprint),
    updateSprint: (id: string, updates: Partial<Sprint>): Promise<void> =>
        ipcRenderer.invoke("firebase:update-sprint", id, updates),
    deleteSprint: (id: string): Promise<void> =>
        ipcRenderer.invoke("firebase:delete-sprint", id),
    getTimeEntries: (sprintId: string): Promise<TimeEntry[]> =>
        ipcRenderer.invoke("firebase:get-time-entries", sprintId),
    createTimeEntry: (entry: Omit<TimeEntry, "id" | "createdAt">): Promise<TimeEntry> =>
        ipcRenderer.invoke("firebase:create-time-entry", entry),
    deleteTimeEntry: (id: string): Promise<void> =>
        ipcRenderer.invoke("firebase:delete-time-entry", id),
})
