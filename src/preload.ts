import { contextBridge, ipcRenderer } from "electron"
import type { Project, Sprint, TimeEntry } from "./types"

contextBridge.exposeInMainWorld("firebase", {
    minimize: () => ipcRenderer.send("minimize-window"),
    maximize: () => ipcRenderer.send("maximize-window"),
    close: () => ipcRenderer.send("close-window"),
    testConnection: () => ipcRenderer.invoke("firebase:test-connection"),
    // Projects
    getProjects: (): Promise<Project[]> => ipcRenderer.invoke("firebase:get-projects"),
    createProject: (project: Omit<Project, "id" | "createdAt">): Promise<Project> =>
        ipcRenderer.invoke("firebase:create-project", project),
    updateProject: (id: string, updates: Partial<Project>): Promise<void> =>
        ipcRenderer.invoke("firebase:update-project", id, updates),
    deleteProject: (id: string): Promise<void> =>
        ipcRenderer.invoke("firebase:delete-project", id),
    // Sprints
    getSprints: (projectId: string): Promise<Sprint[]> => ipcRenderer.invoke("firebase:get-sprints", projectId),
    createSprint: (sprint: Omit<Sprint, "id" | "createdAt">): Promise<Sprint> =>
        ipcRenderer.invoke("firebase:create-sprint", sprint),
    updateSprint: (id: string, updates: Partial<Sprint>): Promise<void> =>
        ipcRenderer.invoke("firebase:update-sprint", id, updates),
    deleteSprint: (id: string): Promise<void> =>
        ipcRenderer.invoke("firebase:delete-sprint", id),
    // Time Entries
    getTimeEntries: (sprintId: string): Promise<TimeEntry[]> =>
        ipcRenderer.invoke("firebase:get-time-entries", sprintId),
    createTimeEntry: (entry: Omit<TimeEntry, "id" | "createdAt">): Promise<TimeEntry> =>
        ipcRenderer.invoke("firebase:create-time-entry", entry),
    deleteTimeEntry: (id: string): Promise<void> =>
        ipcRenderer.invoke("firebase:delete-time-entry", id),
})
