export interface Project {
    id: string
    name: string
    description?: string
    status: "active" | "completed" | "archived"
    createdAt: string
}

export interface Sprint {
    id: string
    projectId: string
    name: string
    startDate: string
    endDate: string
    status: "active" | "completed"
    createdAt: string
}

export interface TimeEntry {
    id: string
    sprintId: string
    hours: number
    description: string
    link?: string
    createdAt: string
}

export interface FirebaseAPI {
    testConnection: () => Promise<{ success: boolean; message: string }>
    // Projects
    getProjects: () => Promise<Project[]>
    createProject: (project: Omit<Project, "id" | "createdAt">) => Promise<Project>
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>
    deleteProject: (id: string) => Promise<void>
    // Sprints
    getSprints: (projectId: string) => Promise<Sprint[]>
    createSprint: (sprint: Omit<Sprint, "id" | "createdAt">) => Promise<Sprint>
    updateSprint: (id: string, updates: Partial<Sprint>) => Promise<void>
    deleteSprint: (id: string) => Promise<void>
    // Time Entries
    getTimeEntries: (sprintId: string) => Promise<TimeEntry[]>
    createTimeEntry: (entry: Omit<TimeEntry, "id" | "createdAt">) => Promise<TimeEntry>
    deleteTimeEntry: (id: string) => Promise<void>
}

declare global {
    interface Window {
        firebase: FirebaseAPI
    }
}
