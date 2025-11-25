import React, { useState } from "react"
import { Project } from "../../types"
import styles from "./EditProjectModal.module.css"
import { useToast } from "../../contexts/ToastContext"

import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal"

interface EditProjectModalProps {
    project: Project
    onSave: (updates: Partial<Project>) => Promise<void>
    onDelete: () => Promise<void>
    onClose: () => void
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onDelete, onClose }) => {
    const { showToast } = useToast()
    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSave({ name, description })
            onClose()
        } catch (error) {
            console.error("Error updating project:", error)
            showToast("Erro ao atualizar projeto", "error")
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
            console.error("Error deleting project:", error)
            showToast("Erro ao excluir projeto", "error")
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Editar Projeto</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name">Nome do Projeto</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isSubmitting}
                        >
                            Excluir Projeto
                        </button>
                        <div className={styles.rightActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Excluir Projeto"
                message={`Tem certeza que deseja excluir o projeto "${project.name}"? Todas as sprints e time entries serão excluídas também.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmLabel="Excluir"
                isDangerous
            />
        </div>
    )
}
