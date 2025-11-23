import React from "react"
import { Link } from "react-router-dom"
import { FormattedMessage } from "react-intl"

export function Home() {
    return (
        <div className="page home">
            <h1><FormattedMessage id="app.home" /></h1>
            <p><FormattedMessage id="app.welcome" /></p>
            <Link to="/about">
                <FormattedMessage id="app.goAbout" />
            </Link>
        </div>
    )
}
