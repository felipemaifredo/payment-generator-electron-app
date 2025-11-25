import styles from "./WindowControls.module.css"

export const WindowControls = () => {
    const minimize = () => (window as any).firebase.minimize()
    const maximize = () => (window as any).firebase.maximize()
    const close = () => (window as any).firebase.close()

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={minimize} title="Minimizar">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4.399V5.5H0V4.399H11Z" fill="currentColor" />
                </svg>
            </button>
            <button className={styles.button} onClick={maximize} title="Maximizar">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 0V11H0V0H11ZM10.01 10.01V0.99H0.99V10.01H10.01Z" fill="currentColor" />
                </svg>
            </button>
            <button className={styles.closeButton} onClick={close} title="Fechar">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.279 5.5L11 10.221L10.221 11L5.5 6.279L0.779 11L0 10.221L4.721 5.5L0 0.779L0.779 0L5.5 4.721L10.221 0L11 0.779L6.279 5.5Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    )
}
