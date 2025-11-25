import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Project } from "../../types"
import { ProjectList } from "../../components/ProjectList/ProjectList"
import { EditProjectModal } from "../../components/EditProjectModal/EditProjectModal"
import { FiPlus } from "react-icons/fi"
import styles from "./Projects.module.css"

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            const data = await window.firebase.getProjects()
            setProjects(data)
        } catch (error) {
            console.error("Error loading projects:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            const newProject = await window.firebase.createProject({
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                status: "active"
            })
            setProjects([newProject, ...projects])
            setShowNewProjectForm(false)
            e.currentTarget.reset()
        } catch (error) {
            console.error("Error creating project:", error)
        }
    }

    const handleSelectProject = (project: Project) => {
        navigate(`/project/${project.id}`)
    }

    const handleCompleteProject = async (project: Project) => {
        try {
            await window.firebase.updateProject(project.id, { status: "completed" })
            await loadProjects()
        } catch (error) {
            console.error("Error completing project:", error)
        }
    }

    const handleEditProject = (project: Project) => {
        setEditingProject(project)
    }

    const handleSaveProject = async (updates: Partial<Project>) => {
        if (!editingProject) return
        try {
            await window.firebase.updateProject(editingProject.id, updates)
            await loadProjects()
        } catch (error) {
            console.error("Error updating project:", error)
            throw error
        }
    }

    const handleDeleteProject = async () => {
        if (!editingProject) return
        try {
            await window.firebase.deleteProject(editingProject.id)
            await loadProjects()
        } catch (error) {
            console.error("Error deleting project:", error)
            throw error
        }
    }

    if (isLoading) {
        return <div className={styles.loading}>Carregando projetos...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Meus Projetos</h1>
                <button
                    className={styles.newProjectButton}
                    onClick={() => setShowNewProjectForm(!showNewProjectForm)}
                >
                    <FiPlus size={20} />
                    Novo Projeto
                </button>
            </div>

            {showNewProjectForm && (
                <form className={styles.newProjectForm} onSubmit={handleCreateProject}>
                    <input
                        name="name"
                        placeholder="Nome do projeto"
                        required
                        autoFocus
                    />
                    <textarea
                        name="description"
                        placeholder="Descrição (opcional)"
                        rows={3}
                    />
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>
                            Criar Projeto
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setShowNewProjectForm(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.projectsContainer}>
                {projects.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Nenhum projeto criado ainda</p>
                        <p className={styles.emptyHint}>Clique em "Novo Projeto" para começar</p>
                    </div>
                ) : (
                    <ProjectList
                        projects={projects}
                        onSelectProject={handleSelectProject}
                        onCompleteProject={handleCompleteProject}
                        onEditProject={handleEditProject}
                        onDeleteProject={handleEditProject}
                    />
                )}
            </div>

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onSave={handleSaveProject}
                    onDelete={handleDeleteProject}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </div>
    )
}
