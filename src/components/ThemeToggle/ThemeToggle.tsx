import React from "react"
import { useTheme } from "../../contexts/ThemeContext"
import { FiSun, FiMoon } from "react-icons/fi"
import styles from "./ThemeToggle.module.css"

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
    )
}
