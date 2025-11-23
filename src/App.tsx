import React, { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { IntlProvider } from "react-intl"
import { Home } from "./ui/pages/Home"
import { About } from "./ui/pages/About"
import { messages } from "./i18n/messages"

export function App() {
    const [locale, setLocale] = useState<"en" | "pt">("en")

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <HashRouter>
                <div className="app-container">
                    <div style={{ padding: "10px", textAlign: "right" }}>
                        <button onClick={() => setLocale("en")}>EN</button>
                        <button onClick={() => setLocale("pt")}>PT</button>
                    </div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </HashRouter>
        </IntlProvider>
    )
}
