import React from "react"
import { Link } from "react-router-dom"
import { FormattedMessage } from "react-intl"

export function About() {
    return (
        <div className="page about">
            <h1><FormattedMessage id="app.about" /></h1>
            <p><FormattedMessage id="app.description" /></p>
            <Link to="/"><FormattedMessage id="app.goHome" /></Link>
        </div>
    )
}
