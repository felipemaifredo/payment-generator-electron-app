import React, { useState } from "react"
import { Project } from "../../types"
import { FiMoreVertical, FiCheck, FiEdit2, FiTrash2 } from "react-icons/fi"
import styles from "./ProjectList.module.css"

interface ProjectListProps {
    projects: Project[]
    onSelectProject: (project: Project) => void
    onCompleteProject: (project: Project) => void
    onEditProject: (project: Project) => void
    onDeleteProject: (project: Project) => void
    selectedProjectId?: string
}

export const ProjectList: React.FC<ProjectListProps> = ({
    projects,
    onSelectProject,
    onCompleteProject,
    onEditProject,
    onDeleteProject,
    selectedProjectId
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    const activeProjects = projects.filter(p => p.status === "active")
    const completedProjects = projects.filter(p => p.status === "completed")
    const archivedProjects = projects.filter(p => p.status === "archived")

    const handleMenuClick = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation()
        setActiveMenu(activeMenu === projectId ? null : projectId)
    }

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation()
        action()
        setActiveMenu(null)
    }

    const renderProject = (project: Project) => (
        <div
            key={project.id}
            className={`${styles.projectCard} ${selectedProjectId === project.id ? styles.selected : ""}`}
            onClick={() => onSelectProject(project)}
        >
            <div className={styles.projectHeader}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <div className={styles.projectActions}>
                    <span className={`${styles.status} ${styles[project.status]}`}>
                        {project.status === "active" ? "Ativo" : project.status === "completed" ? "Concluído" : "Arquivado"}
                    </span>
                    <button
                        className={styles.menuButton}
                        onClick={(e) => handleMenuClick(e, project.id)}
                    >
                        <FiMoreVertical size={18} />
                    </button>
                    {activeMenu === project.id && (
                        <div className={styles.actionMenu}>
                            {project.status === "active" && (
                                <button
                                    onClick={(e) => handleActionClick(e, () => onCompleteProject(project))}
                                    className={styles.menuItem}
                                >
                                    <FiCheck size={16} />
                                    Marcar como concluído
                                </button>
                            )}
                            <button
                                onClick={(e) => handleActionClick(e, () => onEditProject(project))}
                                className={styles.menuItem}
                            >
                                <FiEdit2 size={16} />
                                Editar
                            </button>
                            <button
                                onClick={(e) => handleActionClick(e, () => onDeleteProject(project))}
                                className={`${styles.menuItem} ${styles.danger}`}
                            >
                                <FiTrash2 size={16} />
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {project.description && (
                <p className={styles.projectDescription}>{project.description}</p>
            )}
        </div>
    )

    return (
        <div className={styles.container}>
            {activeProjects.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Projetos Ativos</h2>
                    {activeProjects.map(renderProject)}
                </div>
            )}

            {completedProjects.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Projetos Concluídos</h2>
                    {completedProjects.map(renderProject)}
                </div>
            )}

            {archivedProjects.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Projetos Arquivados</h2>
                    {archivedProjects.map(renderProject)}
                </div>
            )}

            {projects.length === 0 && (
                <div className={styles.empty}>
                    <p>Nenhum projeto encontrado</p>
                </div>
            )}
        </div>
    )
}
