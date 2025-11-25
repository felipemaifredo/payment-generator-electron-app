import React, { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { IntlProvider } from "react-intl"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Dashboard } from "./ui/pages/Dashboard"
import { About } from "./ui/pages/About"
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle"
import { messages } from "./i18n/messages"
import "./styles/theme.module.css"

export function App() {
    const [locale, setLocale] = useState<"en" | "pt">("pt")

    return (
        <ThemeProvider>
            <IntlProvider locale={locale} messages={messages[locale]}>
                <HashRouter>
                    <div className="app-container">
                        <div style={{
                            padding: "16px 24px",
                            borderBottom: "1px solid var(--border-color)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "var(--bg-secondary)"
                        }}>
                            <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-primary)" }}>
                                Sprint Time Tracker
                            </h1>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <button
                                    onClick={() => setLocale("en")}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        backgroundColor: locale === "en" ? "var(--accent-primary)" : "transparent",
                                        color: locale === "en" ? "white" : "var(--text-secondary)",
                                        border: "1px solid var(--border-color)"
                                    }}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLocale("pt")}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        backgroundColor: locale === "pt" ? "var(--accent-primary)" : "transparent",
                                        color: locale === "pt" ? "white" : "var(--text-secondary)",
                                        border: "1px solid var(--border-color)"
                                    }}
                                >
                                    PT
                                </button>
                                <ThemeToggle />
                            </div>
                        </div>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/about" element={<About />} />
                        </Routes>
                    </div>
                </HashRouter>
            </IntlProvider>
        </ThemeProvider>
    )
}
